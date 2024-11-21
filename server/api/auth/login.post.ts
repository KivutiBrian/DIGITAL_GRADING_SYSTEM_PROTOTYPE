import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  try {
    const user: any = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        schoolCode: user.schoolCode,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error during login",
    });
  }
});
