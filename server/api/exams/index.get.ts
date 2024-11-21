import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { createdAt: "desc" },
    });
    return exams;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error fetching exams",
    });
  }
});
