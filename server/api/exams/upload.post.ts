import { parse } from "csv-parse";
import { PrismaClient } from "@prisma/client";
import { getQuery } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    const query = getQuery(event);
    const examId = parseInt(query.examId as string);

    if (!formData || !examId) {
      throw createError({
        statusCode: 400,
        message: "Missing required data",
      });
    }

    const file = formData.find((item) => item.name === "file");
    if (!file || !file.data) {
      throw createError({
        statusCode: 400,
        message: "No file uploaded",
      });
    }

    // Convert Buffer to string
    const csvContent = file.data.toString("utf-8");

    const records = await new Promise((resolve, reject) => {
      parse(
        csvContent,
        {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        },
        (err, records) => {
          if (err) reject(err);
          else resolve(records);
        }
      );
    });

    // Validate exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw createError({
        statusCode: 404,
        message: "Exam not found",
      });
    }

    const results = await Promise.all(
      (records as any[]).map(async (record) => {
        // Validate required fields
        const requiredFields = [
          "SCHOOL_CODE",
          "SCHOOL_NAME",
          "STUDENT_INDEX",
          "STUDENT_NAME",
          "ENGLISH",
          "MATHEMATICS",
          "SCIENCE",
          "CRE",
          "SOCIAL_STUDY",
        ];

        for (const field of requiredFields) {
          if (!record[field]) {
            throw createError({
              statusCode: 400,
              message: `Missing required field: ${field}`,
            });
          }
        }

        const scores = {
          english: parseInt(record.ENGLISH),
          mathematics: parseInt(record.MATHEMATICS),
          science: parseInt(record.SCIENCE),
          cre: parseInt(record.CRE),
          socialStudy: parseInt(record.SOCIAL_STUDY),
        };

        // Validate scores are numbers
        Object.entries(scores).forEach(([subject, score]) => {
          if (isNaN(score)) {
            throw createError({
              statusCode: 400,
              message: `Invalid score for ${subject}`,
            });
          }
        });

        const totalScore = Object.values(scores).reduce(
          (sum, score) => sum + score,
          0
        );
        const meanScore = totalScore / 5;

        return prisma.result.create({
          data: {
            examId,
            schoolCode: record.SCHOOL_CODE,
            schoolName: record.SCHOOL_NAME,
            studentIndex: record.STUDENT_INDEX,
            studentName: record.STUDENT_NAME,
            ...scores,
            totalScore,
            meanScore,
          },
        });
      })
    );

    return {
      message: "Results uploaded successfully",
      count: results.length,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error uploading results",
    });
  }
});
