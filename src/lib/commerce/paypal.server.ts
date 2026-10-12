/**
 * PayPal Orders v2 API client — server only.
 *
 * Uses the raw REST API (no SDK) so the integration stays small and every
 * request is explicit. Secrets (`PAYPAL_CLIENT_SECRET`) never leave the
 * server: the browser only ever sees the public client id (via
 * `getPaypalClientConfig`) and opaque order ids.
 *
 * Environment:
 *   PAYPAL_CLIENT_ID     — public, safe for the browser bundle
 *   PAYPAL_CLIENT_SECRET — server only, never logged or returned
 *   PAYPAL_ENV           — "live" for production, anything else = sandbox
 */
import { env } from "@/lib/env.server";

if (typeof window !== "undefined") {
  throw new Error("@/lib/commerce/paypal.server is server-only.");
}

const SANDBOX_BASE = "https://api-m.sandbox.paypal.com";
const LIVE_BASE = "https://api-m.paypal.com";

export function paypalEnv(): "live" | "sandbox" {
  return env("PAYPAL_ENV") === "live" ? "live" : "sandbox";
}

export function paypalBase(): string {
  return paypalEnv() === "live" ? LIVE_BASE : SANDBOX_BASE;
}

export function paypalConfigured(): boolean {
  return Boolean(env("PAYPAL_CLIENT_ID") && env("PAYPAL_CLIENT_SECRET"));
}

export function paypalClientId(): string | undefined {
  return env("PAYPAL_CLIENT_ID");
}

export class PaypalError extends Error {
  status: number;
  paypalName?: string;
  constructor(status: number, message: string, paypalName?: string) {
    super(message);
    this.name = "PaypalError";
    this.status = status;
    this.paypalName = paypalName;
  }
}

/* ------------------------------------------------------------------ */
/* OAuth token (cached in memory)                                       */
/* ------------------------------------------------------------------ */

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const clientId = env("PAYPAL_CLIENT_ID");
  const secret = env("PAYPAL_CLIENT_SECRET");
  if (!clientId || !secret) {
    throw new PaypalError(500, "PayPal is not configured (missing PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET).");
  }
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token;

  const basic = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    throw new PaypalError(res.status, `PayPal token request failed (${res.status}).`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  // Never log the token itself — only that a refresh happened.
  tokenCache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return tokenCache.token;
}

/* ------------------------------------------------------------------ */
/* API calls                                                            */
/* ------------------------------------------------------------------ */

interface PaypalAmount {
  currency_code: string;
  value: string;
}

export interface PaypalOrderResponse {
  id: string;
  status: string;
}

export interface PaypalCapture {
  id: string;
  status: string;
  amount: PaypalAmount;
}

async function paypalFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${paypalBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = (await res.json().catch(() => ({}))) as {
    name?: string;
    message?: string;
    details?: unknown;
  };
  if (!res.ok) {
    throw new PaypalError(
      res.status,
      body.message || `PayPal request failed (${res.status}).`,
      body.name,
    );
  }
  return body as T;
}

/** Create a PayPal order for a verified amount. Amount comes from OUR database. */
export async function createPaypalOrder(input: {
  amountCents: number;
  currency: string;
  referenceId: string;
}): Promise<PaypalOrderResponse> {
  const value = (input.amountCents / 100).toFixed(2);
  const order = await paypalFetch<{ id: string; status: string }>("/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.referenceId,
          amount: { currency_code: input.currency, value },
        },
      ],
    }),
  });
  return { id: order.id, status: order.status };
}

export interface PaypalOrderDetails {
  id: string;
  status: string;
  purchase_units: Array<{
    reference_id?: string;
    amount: PaypalAmount;
    payments?: { captures?: PaypalCapture[] };
  }>;
}

export async function getPaypalOrder(paypalOrderId: string): Promise<PaypalOrderDetails> {
  return paypalFetch<PaypalOrderDetails>(
    `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`,
  );
}

/**
 * Capture a PayPal order and return the verified capture.
 * Throws unless PayPal reports a COMPLETED capture — the caller must treat
 * anything else as unpaid.
 */
export async function capturePaypalOrder(paypalOrderId: string): Promise<{
  orderId: string;
  capture: PaypalCapture;
}> {
  const result = await paypalFetch<PaypalOrderDetails>(
    `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
    { method: "POST", body: "{}" },
  );
  const capture = result.purchase_units?.[0]?.payments?.captures?.[0];
  if (!capture) {
    throw new PaypalError(422, "PayPal returned no capture for this order.");
  }
  if (capture.status !== "COMPLETED") {
    throw new PaypalError(422, `PayPal capture is ${capture.status}, not completed.`);
  }
  return { orderId: result.id, capture };
}

/** Cents from a PayPal "27.00" amount string — avoids float math. */
export function paypalAmountToCents(value: string): number {
  const [dollars, cents = "0"] = value.split(".");
  return Number(dollars) * 100 + Number(cents.padEnd(2, "0").slice(0, 2));
}
