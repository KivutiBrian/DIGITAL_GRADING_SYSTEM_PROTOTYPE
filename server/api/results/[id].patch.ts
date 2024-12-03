import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id);
  const scores = await readBody(event);

  // Validate scores
  const subjects = ["english", "mathematics", "science", "cre", "socialStudy"];
  for (const subject of subjects) {
    const score = parseInt(scores[subject]);
    if (isNaN(score) || score < 0 || score > 100) {
      throw createError({
        statusCode: 400,
        message: `Invalid score for ${subject}`,
      });
    }
  }

  try {
    // Calculate new mean score
    const totalScore = subjects.reduce(
      (sum, subject) => sum + parseInt(scores[subject]),
      0
    );
    const meanScore = totalScore / subjects.length;

    const updatedResult = await prisma.result.update({
      where: { id },
      data: {
        ...scores,
        totalScore,
        meanScore,
      },
    });

    return updatedResult;
  } catch (error) {
    console.error("Error updating scores:", error);
    throw createError({
      statusCode: 500,
      message: "Error updating scores",
    });
  }
});
