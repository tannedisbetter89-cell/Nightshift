/**
 * Checkout orchestration — server functions for the Buy flow.
 *
 * The money rules, enforced here and in `@/lib/commerce/server`:
 *  - Prices come from the database, never the browser.
 *  - An order is marked paid ONLY after PayPal's capture API reports
 *    a COMPLETED capture for the matching amount — never from a
 *    success-URL visit, never from client-supplied status.
 *  - Every step is idempotent: double-clicks, refreshes, and duplicate
 *    PayPal callbacks converge on one order, one payment, one ledger row.
 */
import { createServerFn } from "@tanstack/react-start";

function requireString(data: unknown, field: string): string {
  const value = (data as Record<string, unknown> | null)?.[field];
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value;
}

const optionalEmail = (data: unknown): string | undefined => {
  const value = (data as Record<string, unknown> | null)?.email;
  return typeof value === "string" && value.includes("@") ? value.trim() : undefined;
};

/** Public client id for the PayPal JS SDK. The secret is never exposed. */
export const getPaypalClientConfig = createServerFn({ method: "GET" }).handler(async () => {
  const mod = await import("./paypal.server");
  if (!mod.paypalConfigured()) return { configured: false as const };
  return { configured: true as const, clientId: mod.paypalClientId()!, env: mod.paypalEnv() };
});

/**
 * Start checkout: verify the product in OUR database, create the PayPal
 * order for the database price, then create the Nightshift order bound to
 * that PayPal order id (idempotent — safe to retry).
 */
export const createCheckout = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({
    productId: requireString(data, "productId"),
    email: optionalEmail(data),
  }))
  .handler(async ({ data }) => {
    const db = await import("./server");
    const pp = await import("./paypal.server");

    const product = await db.getProductById(data.productId);
    if (!product || !product.listed) throw new Error("This product is not available.");

    // PayPal order first, priced from the database.
    const ppOrder = await pp.createPaypalOrder({
      amountCents: product.price_cents,
      currency: product.currency,
      referenceId: `pending-${Date.now().toString(36)}`,
    });

    const { order, created } = await db.createOrder({
      items: [{ product_id: product.id, quantity: 1 }],
      currency: product.currency,
      customer_email: data.email,
      paypal_order_id: ppOrder.id,
    });

    await db.recordPaymentAttempt({
      order_id: order.id,
      provider_order_id: ppOrder.id,
      amount_cents: product.price_cents,
      currency: product.currency,
    });

    return {
      nightshiftOrderId: order.id,
      paypalOrderId: ppOrder.id,
      amountCents: product.price_cents,
      currency: product.currency,
      created,
    };
  });

/**
 * Capture checkout: capture with PayPal's API, verify the capture, then
 * record it. Only a COMPLETED capture for the exact order amount marks
 * the order paid, books the ledger row, and creates fulfillments.
 */
export const captureCheckout = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({
    nightshiftOrderId: requireString(data, "nightshiftOrderId"),
    paypalOrderId: requireString(data, "paypalOrderId"),
  }))
  .handler(async ({ data }) => {
    const db = await import("./server");
    const pp = await import("./paypal.server");

    const { capture } = await pp.capturePaypalOrder(data.paypalOrderId);
    const amountCents = pp.paypalAmountToCents(capture.amount.value);

    const { order, captured } = await db.recordCapture({
      provider_order_id: data.paypalOrderId,
      provider_capture_id: capture.id,
      amount_cents: amountCents,
      currency: capture.amount.currency_code,
      raw: { capture_id: capture.id, capture_status: capture.status },
    });

    if (order.id !== data.nightshiftOrderId) {
      // The PayPal order belongs to a different Nightshift order than the
      // browser claimed — the capture is still recorded against the true
      // order; the browser's id is not trusted for anything financial.
    }

    return {
      orderId: order.id,
      status: order.status,
      totalCents: order.total_cents,
      currency: order.currency,
      captured,
      downloads: await orderDownloads(order.id),
    };
  });

/** Read-only order view for the success page. Never proof of payment — just the record. */
export const getCheckoutOrder = createServerFn({ method: "GET" })
  .validator((data: unknown) => ({ orderId: requireString(data, "orderId") }))
  .handler(async ({ data }) => {
    const db = await import("./server");
    const order = await db.getOrder(data.orderId);
    if (!order) return null;
    const items = await db.getOrderItems(order.id);
    const dfyRequest = await db.getDfyRequestByOrder(order.id);
    return {
      id: order.id,
      status: order.status,
      totalCents: order.total_cents,
      currency: order.currency,
      email: order.customer_email,
      createdAt: order.created_at,
      items: await Promise.all(
        items.map(async (i) => {
          const product = await db.getProductById(i.product_id);
          return {
            title: i.title,
            unitPriceCents: i.unit_price_cents,
            quantity: i.quantity,
            // The success page shows the intake form instead of a download
            // for service products (the Done-For-You template).
            type: product?.type ?? "guide",
          };
        }),
      ),
      downloads: await orderDownloads(order.id),
      dfySubmitted: dfyRequest !== null,
    };
  });

export interface OrderDownload {
  title: string;
  url: string;
  expiresAt: Date | null;
  ready: boolean;
}

/**
 * Download links for a paid order. Tokens are refreshed when missing or
 * close to expiry, so the success page always shows a working link.
 * Returns [] unless the order is paid. Service products (Done-For-You)
 * are skipped — they have no file; the buyer fills the intake form instead.
 * Exported for the dfy smoke test.
 */
export async function orderDownloads(orderId: string): Promise<OrderDownload[]> {
  const db = await import("./server");
  const order = await db.getOrder(orderId);
  if (!order || order.status !== "paid") return [];
  const fulfillments = await db.getFulfillmentsByOrder(orderId);
  const out: OrderDownload[] = [];
  for (const f of fulfillments) {
    const expiresAt = f.token_expires_at ? new Date(f.token_expires_at).getTime() : 0;
    const needsToken =
      !f.delivery_token || expiresAt < Date.now() + 5 * 60_000;
    const ful = needsToken ? await db.issueDeliveryToken(f.id) : f;
    const product = await db.getProductById(f.product_id);
    // Service products (Done-For-You) have no file to download — the buyer
    // fills the intake form on the success page instead.
    if (product?.type === "service") continue;
    out.push({
      title: product?.title ?? "Product",
      url: `/api/download/${ful.delivery_token}`,
      expiresAt: ful.token_expires_at,
      ready: await db.hasDeliverableFile(f.product_id),
    });
  }
  return out;
}
