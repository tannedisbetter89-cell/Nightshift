import { defineEventHandler, readBody, setCookie, createError } from "h3";
import {
  verifyOperatorPassword,
  createOperatorSession,
  operatorAuthConfigured,
  OPERATOR_COOKIE,
} from "@/lib/commerce/operator-auth";

export default defineEventHandler(async (event) => {
  if (!operatorAuthConfigured()) {
    throw createError({
      statusCode: 503,
      message: "Operator sign-in isn't configured yet (OPERATOR_PASSWORD).",
    });
  }
  const body = (await readBody(event).catch(() => ({}))) as { password?: string };
  const ok = await verifyOperatorPassword(body.password ?? "");
  if (!ok) {
    // Slow brute force a little; same generic message for wrong password.
    await new Promise((r) => setTimeout(r, 600));
    throw createError({ statusCode: 401, message: "Wrong password." });
  }
  const { token, maxAge } = await createOperatorSession();
  setCookie(event, OPERATOR_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return { ok: true };
});
