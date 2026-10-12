import { defineEventHandler, deleteCookie, getHeader } from "h3";
import { destroyOperatorSession, OPERATOR_COOKIE } from "@/lib/commerce/operator-auth";

export default defineEventHandler(async (event) => {
  await destroyOperatorSession(getHeader(event, "cookie") ?? null);
  deleteCookie(event, OPERATOR_COOKIE, { path: "/" });
  return { ok: true };
});
