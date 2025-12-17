import { protectedProcedure, router } from "../api/trpc";
import { updateUserById } from "../db";

export const subscriptionsRouter = router({
  status: protectedProcedure.query(async ({ ctx }) => {
    return { hasActivePlan: Boolean(ctx.user?.hasActivePlan) };
  }),

  activate: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Banco de dados indisponível");

    await updateUserById(ctx.user.id, { hasActivePlan: true });

    return { success: true, hasActivePlan: true };
  }),
});
