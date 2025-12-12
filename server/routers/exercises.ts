import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../api/trpc";
import {
  getAllExercises,
  getExercisesByIntensity,
  getDb,
} from "../db";
import { exerciseTutorials } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const exercisesRouter = router({
  /**
   * Get all exercises (public)
   */
  list: publicProcedure.query(async () => {
    return await getAllExercises();
  }),

  /**
   * Get exercises by intensity level (public)
   */
  getByIntensity: publicProcedure
    .input(
      z.object({
        intensity: z.enum(["LIGHT", "MODERATE", "STRONG"]),
      })
    )
    .query(async ({ input }) => {
      return await getExercisesByIntensity(input.intensity);
    }),

  /**
   * Create exercise (admin only)
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        intensityLevel: z.enum(["LIGHT", "MODERATE", "STRONG"]),
        safetyGuidelines: z.string().optional(),
        videoLink: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(exerciseTutorials).values({
        name: input.name,
        description: input.description,
        intensityLevel: input.intensityLevel,
        safetyGuidelines: input.safetyGuidelines,
        videoLink: input.videoLink,
      });

      const exerciseId = result[0].insertId as number;
      const exercise = await db
        .select()
        .from(exerciseTutorials)
        .where(eq(exerciseTutorials.id, exerciseId))
        .limit(1);

      return exercise[0];
    }),

  /**
   * Update exercise (admin only)
   */
  update: adminProcedure
    .input(
      z.object({
        exerciseId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        intensityLevel: z.enum(["LIGHT", "MODERATE", "STRONG"]).optional(),
        safetyGuidelines: z.string().optional(),
        videoLink: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.intensityLevel !== undefined)
        updateData.intensityLevel = input.intensityLevel;
      if (input.safetyGuidelines !== undefined)
        updateData.safetyGuidelines = input.safetyGuidelines;
      if (input.videoLink !== undefined) updateData.videoLink = input.videoLink;

      await db
        .update(exerciseTutorials)
        .set(updateData)
        .where(eq(exerciseTutorials.id, input.exerciseId));

      const exercise = await db
        .select()
        .from(exerciseTutorials)
        .where(eq(exerciseTutorials.id, input.exerciseId))
        .limit(1);

      return exercise[0];
    }),

  /**
   * Delete exercise (admin only)
   */
  delete: adminProcedure
    .input(z.object({ exerciseId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(exerciseTutorials)
        .where(eq(exerciseTutorials.id, input.exerciseId));

      return { success: true };
    }),
});
