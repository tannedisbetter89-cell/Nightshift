/**
 * Operator authentication — server only.
 *
 * Single-operator model for the private /desk dashboard:
 *   - Login verifies `password` against the OPERATOR_PASSWORD env var
 *     (timing-safe compare; the var lives in server-side env only).
 *   - A random session token is stored in `operator_sessions` and handed
 *     to the browser in an httpOnly cookie (`ns_operator`).
 *   - Every desk server function calls `requireOperator()`, which checks
 *     the cookie's token against a live, unexpired session row.
 *
 * This is legitimate administrator authentication for private actions.
 * It never touches the public storefront routes.
 */
import { timingSafeEqual, randomBytes } from "node:crypto";
import { env } from "@/lib/env.server";
import { getSql } from "@/lib/db";

if (typeof window !== "undefined") {
  throw new Error("@/lib/commerce/operator-auth is server-only.");
}

export const OPERATOR_COOKIE = "ns_operator";
const SESSION_DAYS = 30;

function configuredPassword(): string | undefined {
  return env("OPERATOR_PASSWORD")?.trim() || undefined;
}

export function operatorAuthConfigured(): boolean {
  return Boolean(configuredPassword());
}

/** Timing-safe password check. False when no password is configured. */
export async function verifyOperatorPassword(password: string): Promise<boolean> {
  const expected = configuredPassword();
  if (!expected || !password) return false;
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) {
    // Compare against a dummy of the same length to avoid leaking length
    // through timing, then report false.
    timingSafeEqual(a, Buffer.alloc(a.length));
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function createOperatorSession(): Promise<{ token: string; maxAge: number }> {
  const db = await getSql();
  const token = randomBytes(32).toString("hex");
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  // Prune expired sessions opportunistically.
  await db`delete from operator_sessions where expires_at < now()`;
  await db`
    insert into operator_sessions (token, expires_at)
    values (${token}, now() + (${maxAge} || ' seconds')::interval)`;
  return { token, maxAge };
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=").trim() || null;
  }
  return null;
}

/** True when the request carries a live operator session. */
export async function isOperatorRequest(cookieHeader: string | null): Promise<boolean> {
  const token = readCookie(cookieHeader, OPERATOR_COOKIE);
  if (!token) return false;
  const db = await getSql();
  const rows = await db<{ n: number }>`
    select 1 as n from operator_sessions where token = ${token} and expires_at > now() limit 1`;
  return rows.length > 0;
}

export async function destroyOperatorSession(cookieHeader: string | null): Promise<void> {
  const token = readCookie(cookieHeader, OPERATOR_COOKIE);
  if (!token) return;
  const db = await getSql();
  await db`delete from operator_sessions where token = ${token}`;
}

/** Guard for every desk server function. Throws when not the operator. */
export async function requireOperator(cookieHeader: string | null): Promise<void> {
  if (!(await isOperatorRequest(cookieHeader))) {
    throw new Error("Operator sign-in required.");
  }
}
