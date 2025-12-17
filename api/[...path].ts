import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../server/serverless";

/**
 * Vercel serverless entrypoint for all `/api/*` routes.
 *
 * Using a catch-all file ensures Vercel routes `/api/trpc/*` and `/api/auth/*`
 * correctly without relying on rewrites to preserve the path.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  return (app as any)(req, res);
}

