import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema for exam creation
const examSchema = z.object({
  examCode: z.string().min(1, "Exam code is required"),
  description: z.string().min(1, "Description is required"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate request body
    const validatedData = examSchema.parse(body);

    // Check if exam code already exists
    const existingExam = await prisma.exam.findUnique({
      where: { examCode: validatedData.examCode },
    });

    if (existingExam) {
      throw createError({
        statusCode: 400,
        message: "An exam with this code already exists",
      });
    }

    // Create new exam
    const exam = await prisma.exam.create({
      data: {
        examCode: validatedData.examCode,
        description: validatedData.description,
      },
    });

    return exam;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: "Invalid input data",
        data: error.errors,
      });
    }

    // Log the error for debugging (in production, use proper logging)
    console.error("Exam creation error:", error);

    throw createError({
      statusCode: 500,
      message: error.message || "Error creating exam",
    });
  } finally {
    await prisma.$disconnect();
  }
});
