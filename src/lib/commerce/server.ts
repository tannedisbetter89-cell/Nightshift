/**
 * Nightshift commerce data access — server only.
 *
 * Every function here runs against Neon (when DATABASE_URL is set) or the
 * local PGLite fallback, via `@/lib/db`'s `getSql()`. Schema lives in
 * `migrations/0002_commerce.sql` — never inline DDL here.
 *
 * Concurrency model (serverless-safe): multi-step flows are built from
 * individually idempotent statements guarded by UNIQUE constraints
 * (see the migration header), NOT from explicit transactions — the shared
 * `Sql` client is pool-backed on Neon, so BEGIN/COMMIT across calls would
 * not hold. Each step is safe to retry; a crash mid-flow is completed by
 * the next retry instead of leaving duplicates.
 *
 * Money is always integer cents + explicit currency. JSONB columns are
 * written with JSON.stringify and read defensively (pg and PGLite both
 * return parsed objects, but a raw string is tolerated).
 */

if (typeof window !== "undefined") {
  throw new Error(
    "@/lib/commerce/server is server-only. Call it from a createServerFn handler, never from client code.",
  );
}

import { getSql, type Sql } from "@/lib/db";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type OrderStatus =
  | "pending"
  | "paid"
  | "canceled"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type PaymentStatus =
  | "created"
  | "approved"
  | "captured"
  | "failed"
  | "canceled"
  | "refunded"
  | "partially_refunded";

export type FulfillmentStatus = "pending" | "delivered" | "failed";

export type LedgerKind = "sale" | "refund" | "partial_refund" | "fee" | "adjustment";

export interface DbProduct {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  niche: string;
  type: string;
  price_cents: number;
  currency: string;
  audience: string;
  listed: boolean;
  source: string;
  sales_page: string;
  sections: Array<{ heading: string; body: string }>;
  tags: string[];
  deliverable: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface DbOrder {
  id: string;
  status: OrderStatus;
  currency: string;
  subtotal_cents: number;
  total_cents: number;
  customer_email: string | null;
  customer_name: string | null;
  paypal_order_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_version_id: string | null;
  title: string;
  unit_price_cents: number;
  quantity: number;
}

export interface DbPayment {
  id: string;
  order_id: string;
  provider: string;
  provider_order_id: string;
  provider_capture_id: string | null;
  amount_cents: number;
  currency: string;
  status: PaymentStatus;
  raw: Record<string, unknown>;
  idempotency_key: string;
  created_at: Date;
  updated_at: Date;
}

export interface DbFulfillment {
  id: string;
  order_id: string;
  product_id: string;
  status: FulfillmentStatus;
  attempts: number;
  delivered_at: Date | null;
  delivery_token: string | null;
  token_expires_at: Date | null;
  error: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DbLedgerEntry {
  id: string;
  order_id: string;
  payment_id: string | null;
  kind: LedgerKind;
  amount_cents: number;
  currency: string;
  description: string;
  occurred_at: Date;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Parse a JSONB column defensively: object from the driver, or a raw string. */
function asJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

const json = (value: unknown): string => JSON.stringify(value ?? null);

function toProduct(row: Record<string, unknown>): DbProduct {
  return {
    ...(row as unknown as DbProduct),
    sections: asJson(row.sections, []),
    tags: asJson(row.tags, []),
    deliverable: asJson(row.deliverable, {}),
  };
}

function toPayment(row: Record<string, unknown>): DbPayment {
  return { ...(row as unknown as DbPayment), raw: asJson(row.raw, {}) };
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

/** Public storefront catalog: listed products, cheapest render path. */
export async function listPublicProducts(sql?: Sql): Promise<DbProduct[]> {
  const db = sql ?? (await getSql());
  const rows = await db<Record<string, unknown>>`
    select * from products where listed = true order by created_at desc`;
  return rows.map(toProduct);
}

export async function getProductById(id: string, sql?: Sql): Promise<DbProduct | null> {
  const db = sql ?? (await getSql());
  const rows = await db<Record<string, unknown>>`select * from products where id = ${id} limit 1`;
  return rows.length ? toProduct(rows[0]) : null;
}

export async function getProductBySlug(slug: string, sql?: Sql): Promise<DbProduct | null> {
  const db = sql ?? (await getSql());
  const rows = await db<Record<string, unknown>>`select * from products where slug = ${slug} limit 1`;
  return rows.length ? toProduct(rows[0]) : null;
}

export interface NewProduct {
  id?: string;
  slug: string;
  title: string;
  tagline?: string;
  niche?: string;
  type: string;
  price_cents: number;
  currency?: string;
  audience?: string;
  listed?: boolean;
  source?: string;
  sales_page?: string;
  sections?: Array<{ heading: string; body: string }>;
  tags?: string[];
  deliverable?: Record<string, unknown>;
}

export async function createProduct(input: NewProduct): Promise<DbProduct> {
  const db = await getSql();
  const id = input.id ?? uid("prod");
  const rows = await db<Record<string, unknown>>`
    insert into products (id, slug, title, tagline, niche, type, price_cents, currency,
      audience, listed, source, sales_page, sections, tags, deliverable)
    values (${id}, ${input.slug}, ${input.title}, ${input.tagline ?? ""}, ${input.niche ?? ""},
      ${input.type}, ${input.price_cents}, ${input.currency ?? "USD"}, ${input.audience ?? ""},
      ${input.listed ?? false}, ${input.source ?? "operator"}, ${input.sales_page ?? ""},
      ${json(input.sections ?? [])}, ${json(input.tags ?? [])}, ${json(input.deliverable ?? {})})
    returning *`;
  return toProduct(rows[0]);
}

export async function updateProduct(
  id: string,
  patch: Partial<Omit<NewProduct, "id">>,
): Promise<DbProduct | null> {
  const db = await getSql();
  const current = await getProductById(id, db);
  if (!current) return null;
  const next = { ...current, ...patch, id: current.id, updated_at: undefined as never };
  const rows = await db<Record<string, unknown>>`
    update products set
      slug = ${next.slug}, title = ${next.title}, tagline = ${next.tagline},
      niche = ${next.niche}, type = ${next.type}, price_cents = ${next.price_cents},
      currency = ${next.currency}, audience = ${next.audience}, listed = ${next.listed},
      source = ${next.source}, sales_page = ${next.sales_page},
      sections = ${json(next.sections)}, tags = ${json(next.tags)},
      deliverable = ${json(next.deliverable)}, updated_at = now()
    where id = ${id}
    returning *`;
  return rows.length ? toProduct(rows[0]) : null;
}

/* ------------------------------------------------------------------ */
/* Orders (idempotent creation)                                        */
/* ------------------------------------------------------------------ */

export interface NewOrderItem {
  product_id: string;
  quantity?: number;
}

/**
 * Create an order for the given products, pinning a product version per item
 * so the receipt never changes when the catalog is edited later.
 *
 * Idempotent on `paypal_order_id`: calling twice with the same PayPal order id
 * returns the existing order instead of creating a duplicate.
 */
export async function createOrder(input: {
  items: NewOrderItem[];
  currency?: string;
  customer_email?: string;
  customer_name?: string;
  paypal_order_id?: string;
}): Promise<{ order: DbOrder; items: DbOrderItem[]; created: boolean }> {
  const db = await getSql();
  const currency = input.currency ?? "USD";

  if (input.paypal_order_id) {
    const existing = await getOrderByPaypalOrderId(input.paypal_order_id, db);
    if (existing) {
      const items = await db<DbOrderItem>`select * from order_items where order_id = ${existing.id}`;
      return { order: existing, items, created: false };
    }
  }

  // Resolve products from the trusted database — never trust browser prices.
  const productIds = [...new Set(input.items.map((i) => i.product_id))];
  const products = new Map<string, DbProduct>();
  for (const pid of productIds) {
    const p = await getProductById(pid, db);
    if (!p || !p.listed) throw new Error(`Product not available: ${pid}`);
    products.set(pid, p);
  }

  const orderId = uid("ord");
  let subtotal = 0;
  const versionRows: Array<{ product: DbProduct; versionId: string }> = [];

  for (const pid of productIds) {
    const p = products.get(pid)!;
    const qty = input.items.find((i) => i.product_id === pid)?.quantity ?? 1;
    subtotal += p.price_cents * qty;
    // Pin a new immutable version for this order.
    const versionId = uid("ver");
    const existingVersions = await db<{ max_v: number }>`
      select coalesce(max(version), 0) as max_v from product_versions where product_id = ${pid}`;
    const version = (existingVersions[0]?.max_v ?? 0) + 1;
    await db`
      insert into product_versions (id, product_id, version, title, price_cents, currency, snapshot)
      values (${versionId}, ${pid}, ${version}, ${p.title}, ${p.price_cents}, ${p.currency},
        ${json({ ...p, sections: p.sections, tags: p.tags, deliverable: p.deliverable })})
      on conflict (product_id, version) do nothing`;
    versionRows.push({ product: p, versionId });
  }

  const orderRows = await db<DbOrder>`
    insert into orders (id, status, currency, subtotal_cents, total_cents,
      customer_email, customer_name, paypal_order_id)
    values (${orderId}, 'pending', ${currency}, ${subtotal}, ${subtotal},
      ${input.customer_email ?? null}, ${input.customer_name ?? null},
      ${input.paypal_order_id ?? null})
    on conflict do nothing
    returning *`;
  // If a concurrent request won the race on paypal_order_id, return its order.
  const order =
    orderRows[0] ?? (await getOrderByPaypalOrderId(input.paypal_order_id ?? "__none__", db))!;

  const items: DbOrderItem[] = [];
  for (const { product: p, versionId } of versionRows) {
    const qty = input.items.find((i) => i.product_id === p.id)?.quantity ?? 1;
    const itemRows = await db<DbOrderItem>`
      insert into order_items (id, order_id, product_id, product_version_id, title,
        unit_price_cents, quantity)
      values (${uid("oit")}, ${order.id}, ${p.id}, ${versionId}, ${p.title},
        ${p.price_cents}, ${qty})
      on conflict (order_id, product_id) do nothing
      returning *`;
    if (itemRows[0]) items.push(itemRows[0]);
  }
  if (!items.length) {
    const existing = await db<DbOrderItem>`select * from order_items where order_id = ${order.id}`;
    return { order, items: existing, created: false };
  }
  return { order, items, created: true };
}

export async function getOrder(id: string, sql?: Sql): Promise<DbOrder | null> {
  const db = sql ?? (await getSql());
  const rows = await db<DbOrder>`select * from orders where id = ${id} limit 1`;
  return rows[0] ?? null;
}

export async function getOrderByPaypalOrderId(
  paypalOrderId: string,
  sql?: Sql,
): Promise<DbOrder | null> {
  const db = sql ?? (await getSql());
  const rows = await db<DbOrder>`select * from orders where paypal_order_id = ${paypalOrderId} limit 1`;
  return rows[0] ?? null;
}

export async function getOrderItems(orderId: string, sql?: Sql): Promise<DbOrderItem[]> {
  const db = sql ?? (await getSql());
  return db<DbOrderItem>`select * from order_items where order_id = ${orderId}`;
}

/** Conditional status transition — only moves forward, never rewrites a paid order. */
export async function setOrderStatus(
  orderId: string,
  status: OrderStatus,
  from: OrderStatus[] = ["pending"],
): Promise<boolean> {
  const db = await getSql();
  const rows = await db<DbOrder>`
    update orders set status = ${status}, updated_at = now()
    where id = ${orderId} and status = any(${from})
    returning id`;
  return rows.length > 0;
}

/* ------------------------------------------------------------------ */
/* Payments (idempotent capture)                                       */
/* ------------------------------------------------------------------ */

export async function recordPaymentAttempt(input: {
  order_id: string;
  provider_order_id: string;
  amount_cents: number;
  currency?: string;
  idempotency_key?: string;
}): Promise<DbPayment> {
  const db = await getSql();
  const key = input.idempotency_key ?? `attempt_${input.provider_order_id}`;
  const rows = await db<Record<string, unknown>>`
    insert into payments (id, order_id, provider, provider_order_id, amount_cents,
      currency, status, idempotency_key)
    values (${uid("pay")}, ${input.order_id}, 'paypal', ${input.provider_order_id},
      ${input.amount_cents}, ${input.currency ?? "USD"}, 'created', ${key})
    on conflict (idempotency_key) do nothing
    returning *`;
  if (rows[0]) return toPayment(rows[0]);
  const existing = await db<Record<string, unknown>>`
    select * from payments where idempotency_key = ${key} limit 1`;
  return toPayment(existing[0]);
}

/**
 * Record a VERIFIED PayPal capture. Call only after the capture status has
 * been confirmed with PayPal's API — never from a success-URL visit.
 * Fully idempotent: repeated calls with the same capture id change nothing.
 */
export async function recordCapture(input: {
  provider_order_id: string;
  provider_capture_id: string;
  amount_cents: number;
  currency?: string;
  raw?: Record<string, unknown>;
}): Promise<{ payment: DbPayment; order: DbOrder; captured: boolean }> {
  const db = await getSql();

  // Fast path: this capture was already recorded.
  const seen = await db<Record<string, unknown>>`
    select * from payments where provider_capture_id = ${input.provider_capture_id} limit 1`;
  if (seen[0]) {
    const payment = toPayment(seen[0]);
    const order = (await getOrder(payment.order_id, db))!;
    return { payment, order, captured: false };
  }

  const order = await getOrderByPaypalOrderId(input.provider_order_id, db);
  if (!order) throw new Error(`No order for PayPal order ${input.provider_order_id}`);

  // Amount must match the trusted order total — never the browser's number.
  if (order.total_cents !== input.amount_cents || order.currency !== (input.currency ?? "USD")) {
    throw new Error(
      `Capture amount mismatch for order ${order.id}: expected ${order.total_cents} ${order.currency}`,
    );
  }

  const key = `capture_${input.provider_capture_id}`;
  const rows = await db<Record<string, unknown>>`
    insert into payments (id, order_id, provider, provider_order_id, provider_capture_id,
      amount_cents, currency, status, raw, idempotency_key)
    values (${uid("pay")}, ${order.id}, 'paypal', ${input.provider_order_id},
      ${input.provider_capture_id}, ${input.amount_cents}, ${input.currency ?? "USD"},
      'captured', ${json(input.raw ?? {})}, ${key})
    on conflict (idempotency_key) do nothing
    returning *`;
  let paymentRow: Record<string, unknown>;
  if (rows[0]) {
    paymentRow = rows[0];
  } else {
    const found = await db<Record<string, unknown>>`
      select * from payments where idempotency_key = ${key} limit 1`;
    paymentRow = found[0];
  }
  const payment = toPayment(paymentRow);

  // Flip the order to paid exactly once, then book the ledger + fulfillment.
  const becamePaid = await setOrderStatus(order.id, "paid", ["pending"]);
  if (becamePaid) {
    await appendLedgerEntry({
      order_id: order.id,
      payment_id: payment.id,
      kind: "sale",
      amount_cents: payment.amount_cents,
      currency: payment.currency,
      description: `Sale — order ${order.id}`,
    });
    await ensureFulfillments(order.id, db);
  }

  const fresh = (await getOrder(order.id, db))!;
  return { payment, order: fresh, captured: becamePaid };
}

/* ------------------------------------------------------------------ */
/* Fulfillment (exactly-once per item)                                 */
/* ------------------------------------------------------------------ */

export async function ensureFulfillments(orderId: string, sql?: Sql): Promise<DbFulfillment[]> {
  const db = sql ?? (await getSql());
  const items = await getOrderItems(orderId, db);
  const out: DbFulfillment[] = [];
  for (const item of items) {
    const rows = await db<DbFulfillment>`
      insert into fulfillments (id, order_id, product_id, status)
      values (${uid("ful")}, ${orderId}, ${item.product_id}, 'pending')
      on conflict (order_id, product_id) do nothing
      returning *`;
    if (rows[0]) {
      out.push(rows[0]);
    } else {
      const existing = await db<DbFulfillment>`
        select * from fulfillments where order_id = ${orderId} and product_id = ${item.product_id} limit 1`;
      out.push(existing[0]);
    }
  }
  return out;
}

export async function getFulfillmentsByOrder(orderId: string): Promise<DbFulfillment[]> {
  const db = await getSql();
  return db<DbFulfillment>`select * from fulfillments where order_id = ${orderId}`;
}

/** Mint an expiring delivery token for one fulfillment (single-purpose download link). */
export async function issueDeliveryToken(
  fulfillmentId: string,
  ttlMinutes = 60,
): Promise<DbFulfillment> {
  const db = await getSql();
  const token = uid("dl");
  const rows = await db<DbFulfillment>`
    update fulfillments
    set delivery_token = ${token},
        token_expires_at = now() + (${ttlMinutes} || ' minutes')::interval,
        updated_at = now()
    where id = ${fulfillmentId}
    returning *`;
  if (!rows[0]) throw new Error(`Fulfillment not found: ${fulfillmentId}`);
  return rows[0];
}

export async function getFulfillmentByToken(token: string): Promise<DbFulfillment | null> {
  const db = await getSql();
  const rows = await db<DbFulfillment>`
    select * from fulfillments
    where delivery_token = ${token} and token_expires_at > now()
    limit 1`;
  return rows[0] ?? null;
}

export async function markFulfilledDelivered(fulfillmentId: string): Promise<void> {
  const db = await getSql();
  await db`
    update fulfillments
    set status = 'delivered', delivered_at = now(), attempts = attempts + 1, updated_at = now()
    where id = ${fulfillmentId}`;
}

export async function markFulfillmentFailed(fulfillmentId: string, error: string): Promise<void> {
  const db = await getSql();
  await db`
    update fulfillments
    set status = 'failed', error = ${error}, attempts = attempts + 1, updated_at = now()
    where id = ${fulfillmentId}`;
}

/* ------------------------------------------------------------------ */
/* Ledger (append-only, idempotent)                                    */
/* ------------------------------------------------------------------ */

export async function appendLedgerEntry(input: {
  order_id: string;
  payment_id?: string | null;
  kind: LedgerKind;
  amount_cents: number;
  currency?: string;
  description?: string;
}): Promise<DbLedgerEntry> {
  const db = await getSql();
  const rows = await db<DbLedgerEntry>`
    insert into ledger_entries (id, order_id, payment_id, kind, amount_cents, currency, description)
    values (${uid("le")}, ${input.order_id}, ${input.payment_id ?? null}, ${input.kind},
      ${input.amount_cents}, ${input.currency ?? "USD"}, ${input.description ?? ""})
    on conflict (payment_id, kind) do nothing
    returning *`;
  if (rows[0]) return rows[0];
  // A NULL payment_id can't hit the unique index — fall back to a lookup only
  // when a payment id was given; otherwise return the just-written row search.
  if (input.payment_id) {
    const existing = await db<DbLedgerEntry>`
      select * from ledger_entries
      where payment_id = ${input.payment_id} and kind = ${input.kind} limit 1`;
    if (existing[0]) return existing[0];
  }
  const latest = await db<DbLedgerEntry>`
    select * from ledger_entries where order_id = ${input.order_id} and kind = ${input.kind}
    order by occurred_at desc limit 1`;
  return latest[0];
}

export async function salesTotals(currency = "USD"): Promise<{
  gross_cents: number;
  refund_cents: number;
  net_cents: number;
  order_count: number;
}> {
  const db = await getSql();
  const rows = await db<{
    gross_cents: number;
    refund_cents: number;
    order_count: number;
  }>`
    select
      coalesce(sum(case when kind = 'sale' then amount_cents else 0 end), 0)::int as gross_cents,
      coalesce(sum(case when kind in ('refund', 'partial_refund') then amount_cents else 0 end), 0)::int as refund_cents,
      count(distinct order_id)::int as order_count
    from ledger_entries where currency = ${currency}`;
  const r = rows[0] ?? { gross_cents: 0, refund_cents: 0, order_count: 0 };
  return { ...r, net_cents: r.gross_cents + r.refund_cents };
}

export async function listLedger(limit = 100, offset = 0): Promise<DbLedgerEntry[]> {
  const db = await getSql();
  return db<DbLedgerEntry>`
    select * from ledger_entries order by occurred_at desc limit ${limit} offset ${offset}`;
}

/* ------------------------------------------------------------------ */
/* Audit                                                               */
/* ------------------------------------------------------------------ */

export async function logAudit(input: {
  actor_user_id?: string | null;
  action: string;
  entity: string;
  detail?: Record<string, unknown>;
}): Promise<void> {
  const db = await getSql();
  await db`
    insert into audit_events (id, actor_user_id, action, entity, detail)
    values (${uid("aud")}, ${input.actor_user_id ?? null}, ${input.action},
      ${input.entity}, ${json(input.detail ?? {})})`;
}

/* ------------------------------------------------------------------ */
/* Deliverable files (served only through the authorized download route) */
/* ------------------------------------------------------------------ */

export interface DbDeliverableFile {
  product_id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  data: Uint8Array;
  uploaded_at: Date;
}

/** Attach (or replace) the downloadable file for a product. Operator-only. */
export async function saveDeliverableFile(input: {
  product_id: string;
  filename: string;
  mime_type?: string;
  data: Uint8Array;
}): Promise<void> {
  const db = await getSql();
  const product = await getProductById(input.product_id, db);
  if (!product) throw new Error(`Product not found: ${input.product_id}`);
  await db`
    insert into deliverable_files (product_id, filename, mime_type, size_bytes, data)
    values (${input.product_id}, ${input.filename}, ${input.mime_type ?? "application/octet-stream"},
      ${input.data.byteLength}, ${input.data})
    on conflict (product_id) do update set
      filename = excluded.filename,
      mime_type = excluded.mime_type,
      size_bytes = excluded.size_bytes,
      data = excluded.data,
      uploaded_at = now()`;
}

export async function getDeliverableFile(productId: string): Promise<DbDeliverableFile | null> {
  const db = await getSql();
  const rows = await db<DbDeliverableFile>`
    select product_id, filename, mime_type, size_bytes, data, uploaded_at
    from deliverable_files where product_id = ${productId} limit 1`;
  return rows[0] ?? null;
}

export async function hasDeliverableFile(productId: string): Promise<boolean> {
  const db = await getSql();
  const rows = await db<{ n: number }>`
    select 1 as n from deliverable_files where product_id = ${productId} limit 1`;
  return rows.length > 0;
}
