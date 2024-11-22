import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const examSchema = z.object({
  examCode: z.string().min(1, "Exam code is required"),
  description: z.string().min(1, "Description is required"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = examSchema.parse(body);

    // Check if exam exists, if so return it instead of creating new
    const existingExam = await prisma.exam.findUnique({
      where: { examCode: validatedData.examCode },
    });

    if (existingExam) {
      return existingExam;
    }

    // Create new exam if it doesn't exist
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
    console.error("Exam creation error:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Error creating exam",
    });
  }
});
