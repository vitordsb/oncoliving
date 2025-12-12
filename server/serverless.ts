import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerPasswordAuthRoutes } from "./auth/passwordLogin";
import { appRouter } from "./routers";
import { createContext } from "./api/context";

/**
 * Express app tailored for Vercel serverless.
 * - JSON body parsing
 * - Auth routes (email/senha)
 * - tRPC API mounted at /api/trpc
 */
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

registerPasswordAuthRoutes(app);

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
