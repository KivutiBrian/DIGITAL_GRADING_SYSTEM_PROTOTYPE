import { hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(["CHIEF_EXAMINER", "SCHOOL_HEAD", "STUDENT"]),
  schoolCode: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Validate input
    const data = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "User already exists",
      });
    }

    // For school heads, verify school exists
    if (data.role === "SCHOOL_HEAD") {
      if (!data.schoolCode) {
        throw createError({
          statusCode: 400,
          message: "School code is required for school heads",
        });
      }

      const school = await prisma.school.findUnique({
        where: { code: data.schoolCode },
      });

      if (!school) {
        throw createError({
          statusCode: 400,
          message: "Invalid school code",
        });
      }
    }

    // Hash password
    const hashedPassword = await hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
        schoolCode: data.schoolCode,
      },
    });

    return {
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        schoolCode: user.schoolCode,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: "Invalid input data",
        data: error.errors,
      });
    }

    throw createError({
      statusCode: 500,
      message: "Error creating user",
    });
  }
});
