import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../api/trpc";
import {
  getActiveQuiz,
  getQuizById,
  getAllQuizzes,
  getQuizWithQuestions,
  getScoringConfigForQuiz,
  getDb,
  ensureBaselineQuizQuestions,
} from "../db";
import {
  quizzes,
  quizQuestions,
  quizQuestionOptions,
  quizScoringConfig,
} from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const quizzesRouter = router({
  /**
   * Get active quiz for patient (public, returns current quiz)
   */
  getActive: publicProcedure.query(async () => {
    const quiz = await getActiveQuiz();
    if (!quiz) {
      return null;
    }
    await ensureBaselineQuizQuestions(quiz.id);

    return await getQuizWithQuestions(quiz.id);
  }),

  /**
   * Get specific quiz by ID with all questions and options
   */
  getById: publicProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ input }) => {
      const quiz = await getQuizWithQuestions(input.quizId);
      if (!quiz) {
        throw new Error("Quiz not found");
      }
      return quiz;
    }),

  /**
   * List all quizzes (admin only)
   */
  list: adminProcedure.query(async () => {
    return await getAllQuizzes();
  }),

  /**
   * Create new quiz (admin only)
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        isActive: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(quizzes).values({
        name: input.name,
        description: input.description,
        isActive: input.isActive,
        createdBy: ctx.user!.id,
      });

      const quizId = result[0].insertId as number;
      return await getQuizById(quizId);
    }),

  /**
   * Update quiz (admin only)
   */
  update: adminProcedure
    .input(
      z.object({
        quizId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;

      await db
        .update(quizzes)
        .set(updateData)
        .where(eq(quizzes.id, input.quizId));

      return await getQuizById(input.quizId);
    }),

  /**
   * Create quiz question (admin only)
   */
  questions: router({
    create: adminProcedure
      .input(
        z.object({
          quizId: z.number(),
          text: z.string().min(1),
          questionType: z.enum(["YES_NO", "SCALE_0_10", "MULTIPLE_CHOICE"]),
          weight: z.number().min(0).default(1),
          order: z.number().min(0),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(quizQuestions).values({
          quizId: input.quizId,
          text: input.text,
          questionType: input.questionType,
          weight: input.weight.toString(),
          order: input.order,
        });

        const questionId = result[0].insertId as number;
        const question = await db
          .select()
          .from(quizQuestions)
          .where(eq(quizQuestions.id, questionId))
          .limit(1);

        return question[0];
      }),

    /**
     * Update quiz question (admin only)
     */
    update: adminProcedure
      .input(
        z.object({
          questionId: z.number(),
          text: z.string().optional(),
          weight: z.number().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const updateData: any = {};
        if (input.text !== undefined) updateData.text = input.text;
        if (input.weight !== undefined)
          updateData.weight = input.weight.toString();
        if (input.order !== undefined) updateData.order = input.order;

        await db
          .update(quizQuestions)
          .set(updateData)
          .where(eq(quizQuestions.id, input.questionId));

        const question = await db
          .select()
          .from(quizQuestions)
          .where(eq(quizQuestions.id, input.questionId))
          .limit(1);

        return question[0];
      }),

    /**
     * Delete quiz question (admin only)
     */
    delete: adminProcedure
      .input(z.object({ questionId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Delete related options first
        await db
          .delete(quizQuestionOptions)
          .where(eq(quizQuestionOptions.questionId, input.questionId));

        // Delete the question
        await db
          .delete(quizQuestions)
          .where(eq(quizQuestions.id, input.questionId));

        return { success: true };
      }),
  }),
});
