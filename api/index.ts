import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../server/serverless";

// Vercel serverless entrypoint; delegate to Express app.
export default function handler(req: VercelRequest, res: VercelResponse) {
  return (app as any)(req, res);
}
