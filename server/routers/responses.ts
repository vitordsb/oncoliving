import { z } from "zod";
import { publicProcedure, router } from "../api/trpc";
import {
  getTodayResponse,
  getPatientResponses,
  getScoringConfigForQuiz,
  getQuizById,
  getQuizWithQuestions,
  getDb,
} from "../db";
import {
  quizResponses,
  quizResponseAnswers,
  InsertQuizResponse,
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Calculate score from quiz answers based on question weights and response values
 */
function calculateScore(
  answers: Array<{
    questionId: number;
    weight: number;
    questionType: string;
    answerValue: string;
  }>
): number {
  let totalScore = 0;

  for (const answer of answers) {
    let questionScore = 0;

    if (answer.questionType === "YES_NO") {
      questionScore = answer.answerValue === "YES" ? 10 : 0;
    } else if (answer.questionType === "SCALE_0_10") {
      questionScore = parseInt(answer.answerValue) || 0;
    } else if (answer.questionType === "MULTIPLE_CHOICE") {
      // This will be handled by scoreValue from options
      questionScore = parseInt(answer.answerValue) || 0;
    }

    totalScore += questionScore * answer.weight;
  }

  return totalScore;
}

/**
 * Determine if it's a good day and recommend exercise based on score
 */
function getRecommendation(
  score: number,
  scoringConfigs: Array<{
    minScore: string;
    maxScore: string;
    isGoodDay: boolean;
    recommendedExerciseType: string;
  }>
) {
  const configs = scoringConfigs.sort(
    (a, b) => parseFloat(a.minScore) - parseFloat(b.minScore)
  );

  for (const config of configs) {
    const min = parseFloat(config.minScore);
    const max = parseFloat(config.maxScore);

    if (score >= min && score <= max) {
      return {
        isGoodDay: config.isGoodDay,
        recommendedExerciseType: config.recommendedExerciseType,
      };
    }
  }

  // Default: if score is high, it's a good day for light exercise
  return {
    isGoodDay: score >= 50,
    recommendedExerciseType: score >= 50 ? "Light Walk" : "Rest Day",
  };
}

export const responsesRouter = router({
  /**
   * Submit daily quiz response
   */
  submitDaily: publicProcedure
    .input(
      z.object({
        quizId: z.number(),
        answers: z.array(
          z.object({
            questionId: z.number(),
            answerValue: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user || ctx.user.role !== "PATIENT") {
        throw new Error("Only patients can submit quiz responses");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if patient already responded today
      const existingResponse = await getTodayResponse(ctx.user.id, input.quizId);
      if (existingResponse) {
        throw new Error(
          "You have already completed the quiz today. Please come back tomorrow!"
        );
      }

      // Get quiz with questions
      const quiz = await getQuizWithQuestions(input.quizId);
      if (!quiz) {
        throw new Error("Quiz not found");
      }

      // Build answer data with weights
      const answersWithWeights = input.answers.map((answer) => {
        const question = quiz.questions.find((q) => q.id === answer.questionId);
        if (!question) {
          throw new Error(`Question ${answer.questionId} not found`);
        }

        return {
          questionId: answer.questionId,
          weight: parseFloat(question.weight),
          questionType: question.questionType,
          answerValue: answer.answerValue,
        };
      });

      // Calculate score
      const totalScore = calculateScore(answersWithWeights);

      // Get scoring configuration
      const scoringConfigs = await getScoringConfigForQuiz(input.quizId);
      const recommendation = getRecommendation(totalScore, scoringConfigs);

      // Create response
      const responseData: InsertQuizResponse = {
        userId: ctx.user.id,
        quizId: input.quizId,
        responseDate: new Date(),
        totalScore: totalScore.toString(),
        isGoodDayForExercise: recommendation.isGoodDay,
        recommendedExerciseType: recommendation.recommendedExerciseType,
      };

      const result = await db.insert(quizResponses).values(responseData);
      const responseId = result[0].insertId as number;

      // Store individual answers
      for (const answer of input.answers) {
        await db.insert(quizResponseAnswers).values({
          responseId,
          questionId: answer.questionId,
          answerValue: answer.answerValue,
        });
      }

      // Return the created response
      const createdResponse = await db
        .select()
        .from(quizResponses)
        .where(eq(quizResponses.id, responseId))
        .limit(1);

      return createdResponse[0];
    }),

  /**
   * Get patient's quiz response history
   */
  getMyHistory: publicProcedure
    .input(z.object({ limit: z.number().default(30) }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new Error("Not authenticated");
      }

      return await getPatientResponses(ctx.user.id, input.limit);
    }),

  /**
   * Get specific patient's history (admin only)
   */
  getPatientHistory: publicProcedure
    .input(
      z.object({
        patientId: z.number(),
        limit: z.number().default(30),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "ONCOLOGIST") {
        throw new Error("Only oncologists can view patient history");
      }

      return await getPatientResponses(input.patientId, input.limit);
    }),

  /**
   * Get today's response for current patient
   */
  getToday: publicProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user || ctx.user.role !== "PATIENT") {
        throw new Error("Only patients can view their responses");
      }

      const response = await getTodayResponse(ctx.user.id, input.quizId);
      return response ?? null;
    }),
});
