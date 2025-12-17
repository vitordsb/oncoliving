import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../shared/types";
import { verifyAuthToken } from "../auth/jwt";
import { getUserByOpenId } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  const authHeader = opts.req.headers.authorization;
  const token =
    typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : null;

  if (token) {
    const payload = await verifyAuthToken(token);
    if (payload?.openId) {
      user = (await getUserByOpenId(payload.openId)) ?? null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
