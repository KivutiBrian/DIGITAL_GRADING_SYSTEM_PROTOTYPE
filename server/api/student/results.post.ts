import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { schoolCode, studentIndex } = await readBody(event);

  if (!schoolCode || !studentIndex) {
    throw createError({
      statusCode: 400,
      message: "School code and student index are required",
    });
  }

  try {
    const results = await prisma.result.findMany({
      where: {
        schoolCode,
        studentIndex,
      },
      include: {
        exam: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { results };
  } catch (error) {
    console.error("Error fetching student results:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching results",
    });
  }
});
