import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: any) => {
  const id = parseInt(event.context.params.id);

  try {
    const results: any = await prisma.result.findMany({
      where: { examId: id },
      orderBy: { meanScore: "desc" },
    });

    // Group results by school and calculate school mean scores
    const schoolResults: any = results.reduce((acc: any, result: any) => {
      if (!acc[result.schoolCode]) {
        acc[result.schoolCode] = {
          schoolCode: result.schoolCode,
          schoolName: result.schoolName,
          totalScore: 0,
          studentCount: 0,
          meanScore: 0,
        };
      }

      acc[result.schoolCode].totalScore += result.meanScore;
      acc[result.schoolCode].studentCount++;
      return acc;
    }, {});

    // Calculate final school mean scores
    Object.values(schoolResults).forEach((school: any) => {
      school.meanScore = school.totalScore / school.studentCount;
    });

    return {
      individualResults: results,
      schoolRankings: Object.values(schoolResults).sort(
        (a: any, b: any) => b.meanScore - a.meanScore
      ),
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error fetching exam results",
    });
  }
});
