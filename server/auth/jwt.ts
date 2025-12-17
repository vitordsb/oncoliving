import { SignJWT, jwtVerify } from "jose";
import { ONE_YEAR_MS } from "../../shared/const";
import { ENV } from "../config/env";

export type AuthTokenPayload = {
  openId: string;
};

function getSecretKey() {
  return new TextEncoder().encode(ENV.jwtSecret);
}

export async function signAuthToken(
  payload: AuthTokenPayload,
  options: { expiresInMs?: number } = {}
): Promise<string> {
  if (!ENV.jwtSecret) {
    throw new Error("JWT_SECRET is missing");
  }

  const issuedAtSeconds = Math.floor(Date.now() / 1000);
  const expiresInSeconds = Math.floor((options.expiresInMs ?? ONE_YEAR_MS) / 1000);

  return new SignJWT({ openId: payload.openId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.openId)
    .setIssuedAt(issuedAtSeconds)
    .setExpirationTime(issuedAtSeconds + expiresInSeconds)
    .sign(getSecretKey());
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  if (!ENV.jwtSecret) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    const openId = typeof payload.openId === "string" && payload.openId.length > 0
      ? payload.openId
      : typeof payload.sub === "string" && payload.sub.length > 0
        ? payload.sub
        : null;

    if (!openId) return null;
    return { openId };
  } catch {
    return null;
  }
}

