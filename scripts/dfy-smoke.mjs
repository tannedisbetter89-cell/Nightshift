#!/usr/bin/env node
/**
 * Done-For-You smoke test — run with: node scripts/dfy-smoke.mjs
 *
 * Boots the app's own modules through Vite's SSR loader (so the @/ alias
 * and the migrations glob work) against the in-memory PGLite fallback, then
 * drives the real money path end to end WITHOUT PayPal:
 *
 *   seed DFY product -> create order -> record a (fake) capture -> order paid
 *   -> intake guard -> submit intake -> duplicate submit is idempotent
 *   -> desk read + deliver -> success-page view hides the download link
 *
 * Server functions (createServerFn) need a live Start request context, so
 * this script drives the plain functions the handlers themselves call —
 * including getPaidServiceProductForOrder, the one guard the intake form
 * depends on. Nothing here touches Neon or PayPal. Exit non-zero on failure.
 */
import { createServer } from "vite";
import assert from "node:assert/strict";

const vite = await createServer({ logLevel: "silent" });
try {
  const server = await vite.ssrLoadModule("/src/lib/commerce/server.ts");
  const checkout = await vite.ssrLoadModule("/src/lib/commerce/checkout.ts");

  // 1. Migration 0005 applied at startup (PGLite applies migrations/*.sql).
  const { getSql } = await vite.ssrLoadModule("/src/lib/db.ts");
  const sql = await getSql();
  const tables = await sql`select to_regclass('public.dfy_requests') as t`;
  assert.equal(tables[0]?.t, "dfy_requests", "dfy_requests table must exist");

  // 2. Seed the DFY product (same fields as catalog.ts).
  const product = await server.createProduct({
    id: "seed_dfy_filled_template",
    slug: "done-for-you-filled-template",
    title: "Done-For-You Template — Filled Out For You",
    tagline: "Pick a template, tell us your job details, and get the finished document back.",
    niche: "Client services",
    type: "service",
    price_cents: 5900,
    currency: "USD",
    audience: "Cleaning owners, contractors, and construction pros.",
    listed: true,
    source: "seed",
    sales_page: "You buy, you tell us the job, we send the finished document.",
    sections: [],
    tags: ["done-for-you"],
  });
  assert.equal(product.price_cents, 5900);

  // 3. Unpaid order must NOT pass the intake guard.
  const { order } = await server.createOrder({
    items: [{ product_id: product.id }],
    customer_email: "buyer@example.com",
    paypal_order_id: "PP-SMOKE-1",
  });
  await assert.rejects(
    () => server.getPaidServiceProductForOrder(order.id),
    /hasn't been confirmed as paid/,
    "unpaid order must fail the intake guard",
  );

  // 4. Record a capture (the same function the PayPal capture path calls) —
  //    the order flips to paid exactly once and books the ledger.
  const { order: paidOrder, captured } = await server.recordCapture({
    provider_order_id: "PP-SMOKE-1",
    provider_capture_id: "CAP-SMOKE-1",
    amount_cents: 5900,
    currency: "USD",
  });
  assert.equal(paidOrder.status, "paid");
  assert.equal(captured, true);

  // 5. Guard now passes and returns the service product.
  const serviceProduct = await server.getPaidServiceProductForOrder(order.id);
  assert.equal(serviceProduct.id, product.id);

  // 6. Intake succeeds once; a duplicate submit returns the first request.
  const details = {
    templatePack: "Construction",
    whatNeeded: "a full project estimate",
    businessName: "Smoke Builders LLC",
    clientName: "Jane Homeowner",
    jobDetails: "Two-bed remodel, starts Monday.",
    priceOrAmount: "$12,000",
    neededBy: "2026-11-14",
    deliveryEmail: "buyer@example.com",
  };
  const first = await server.createDfyRequest({
    order_id: order.id,
    product_id: serviceProduct.id,
    customer_email: "buyer@example.com",
    details,
  });
  assert.equal(first.created, true);
  assert.equal(first.request.details.businessName, "Smoke Builders LLC");
  assert.equal(first.request.status, "pending");

  const second = await server.createDfyRequest({
    order_id: order.id,
    product_id: serviceProduct.id,
    customer_email: "buyer@example.com",
    details: { ...details, templatePack: "Contractors", businessName: "Other Co" },
  });
  assert.equal(second.created, false);
  assert.equal(second.request.id, first.request.id, "duplicate keeps the first request");

  // 7. Desk read + mark delivered.
  const found = await server.getDfyRequestsByOrder(order.id);
  assert.equal(found.length, 1);
  const delivered = await server.markDfyRequestDelivered(found[0].id);
  assert.equal(delivered?.status, "delivered");

  // 8. The success-page download list hides the service product (no file).
  const downloads = await checkout.orderDownloads(order.id);
  assert.deepEqual(downloads, [], "service product has no download link");

  console.log("dfy smoke: all checks passed");
} finally {
  await vite.close();
}
