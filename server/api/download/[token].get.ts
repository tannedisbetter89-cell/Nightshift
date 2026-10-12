/**
 * GET /api/download/:token — secure digital delivery.
 *
 * The token is a single-purpose, expiring secret minted per fulfillment
 * AFTER a verified payment. This route:
 *   1. Rejects unknown or expired tokens (404 — same response for both,
 *      so tokens can't be probed).
 *   2. Requires the parent order to be `paid` — a token alone is never
 *      enough if the payment didn't complete.
 *   3. Streams the product's deliverable file with download headers.
 *   4. Marks the fulfillment delivered (idempotent — retries are safe
 *      while the token is still valid).
 *
 * Files are stored in the database and never exposed via static URLs.
 */
import {
  defineEventHandler,
  getRouterParam,
  createError,
  setResponseHeaders,
} from "h3";
import {
  getFulfillmentByToken,
  getOrder,
  getDeliverableFile,
  markFulfilledDelivered,
  markFulfillmentFailed,
} from "@/lib/commerce/server";

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, "token");
  if (!token) {
    throw createError({ statusCode: 404, message: "Not found." });
  }

  const fulfillment = await getFulfillmentByToken(token);
  if (!fulfillment) {
    throw createError({ statusCode: 404, message: "This download link is invalid or has expired." });
  }

  const order = await getOrder(fulfillment.order_id);
  if (!order || order.status !== "paid") {
    throw createError({ statusCode: 403, message: "This order has not been paid." });
  }

  const file = await getDeliverableFile(fulfillment.product_id);
  if (!file) {
    await markFulfillmentFailed(fulfillment.id, "No deliverable file attached to product.");
    throw createError({
      statusCode: 404,
      message: "This file isn't available yet — the operator has been notified.",
    });
  }

  try {
    setResponseHeaders(event, {
      "Content-Type": file.mime_type,
      "Content-Length": String(file.size_bytes),
      "Content-Disposition": `attachment; filename="${file.filename.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    });
    await markFulfilledDelivered(fulfillment.id);
    return Buffer.from(file.data);
  } catch (err) {
    await markFulfillmentFailed(
      fulfillment.id,
      err instanceof Error ? err.message : "Delivery streaming failed.",
    );
    throw createError({ statusCode: 500, message: "Delivery failed — please try the link again." });
  }
});
