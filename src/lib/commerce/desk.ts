/**
 * Operator dashboard data — server functions for /desk.
 *
 * Every function below (except the session check itself) calls `guard()`
 * first, which requires a live operator session cookie. Permissions are
 * enforced here on the server — the UI hiding buttons is not the defense.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

async function operatorCookie(): Promise<string | null> {
  try {
    return getRequest().headers.get("cookie");
  } catch {
    return null;
  }
}

async function guard(): Promise<void> {
  const { requireOperator } = await import("./operator-auth");
  await requireOperator(await operatorCookie());
}

function str(data: unknown, field: string, required = false): string | undefined {
  const v = (data as Record<string, unknown> | null)?.[field];
  if (typeof v !== "string" || !v.trim()) {
    if (required) throw new Error(`${field} is required`);
    return undefined;
  }
  return v.trim();
}

/* Concrete row shapes — server-function returns must be serializable,
   so `Record<string, unknown>` is not allowed here. */

interface OrderRow {
  id: string;
  status: string;
  total_cents: number;
  currency: string;
  customer_email: string | null;
  created_at: Date;
  items: number;
}

interface StatusCount {
  status: string;
  n: number;
}

interface PaymentRow {
  id: string;
  provider: string;
  provider_order_id: string;
  provider_capture_id: string | null;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: Date;
}

interface LedgerRow {
  id: string;
  kind: string;
  amount_cents: number;
  currency: string;
  description: string;
  occurred_at: Date;
}

interface AdminProductRow {
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
  created_at: Date;
  updated_at: Date;
  has_file: boolean;
}

interface AuditRow {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity: string;
  created_at: Date;
}

/** Public session check for the desk layout — no guard (it IS the guard). */
export const getDeskSession = createServerFn({ method: "GET" }).handler(async () => {
  const mod = await import("./operator-auth");
  const cookie = await operatorCookie();
  return {
    configured: mod.operatorAuthConfigured(),
    authenticated: await mod.isOperatorRequest(cookie),
  };
});

export const deskOverview = createServerFn({ method: "GET" }).handler(async () => {
  await guard();
  const db = await import("./server");
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const totals = await db.salesTotals("USD");
  const byStatus = await sql<StatusCount>`
    select status, count(*)::int as n from orders group by status`;
  const recent = await sql<OrderRow>`
    select id, status, total_cents, currency, customer_email, created_at,
           (select count(*)::int from order_items i where i.order_id = o.id) as items
    from orders o order by created_at desc limit 8`;
  const stuck = await sql<{ n: number }>`
    select count(*)::int as n from fulfillments where status = 'failed'`;
  return { totals, byStatus, recent, failedFulfillments: stuck[0]?.n ?? 0 };
});

export interface OrderFilters {
  status?: string;
  productId?: string;
  from?: string;
  to?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

export const deskListOrders = createServerFn({ method: "GET" })
  .validator((data: unknown) => (data ?? {}) as OrderFilters)
  .handler(async ({ data }) => {
    await guard();
    return deskListOrdersQuery(data);
  });

/** Query builder kept separate so filter logic stays testable. */
async function deskListOrdersQuery(f: OrderFilters) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const limit = Math.min(Math.max(f.limit ?? 50, 1), 200);
  const offset = Math.max(f.offset ?? 0, 0);
  const conds: string[] = [];
  const params: unknown[] = [];
  if (f.status) {
    params.push(f.status);
    conds.push(`o.status = $${params.length}`);
  }
  if (f.productId) {
    params.push(f.productId);
    conds.push(`exists (select 1 from order_items i where i.order_id = o.id and i.product_id = $${params.length})`);
  }
  if (f.from) {
    params.push(f.from);
    conds.push(`o.created_at >= $${params.length}::timestamptz`);
  }
  if (f.to) {
    params.push(f.to);
    conds.push(`o.created_at < $${params.length}::timestamptz`);
  }
  if (f.q) {
    params.push(`%${f.q}%`);
    conds.push(`(o.id ilike $${params.length} or coalesce(o.customer_email,'') ilike $${params.length})`);
  }
  const where = conds.length ? `where ${conds.join(" and ")}` : "";
  params.push(limit, offset);
  const rows = await sql.query<OrderRow>(
    `select o.id, o.status, o.total_cents, o.currency, o.customer_email, o.created_at,
            (select count(*)::int from order_items i where i.order_id = o.id) as items
     from orders o ${where} order by o.created_at desc
     limit $${params.length - 1} offset $${params.length}`,
    params,
  );
  const totalRows = await sql.query(
    `select count(*)::int as n from orders o ${where}`,
    params.slice(0, -2),
  );
  return { orders: rows, total: (totalRows[0] as { n: number }).n, limit, offset };
}

export const deskGetOrder = createServerFn({ method: "GET" })
  .validator((data: unknown) => ({ id: str(data, "id", true)! }))
  .handler(async ({ data }) => {
    await guard();
    const db = await import("./server");
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const order = await db.getOrder(data.id);
    if (!order) return null;
    const [items, payments, fulfillments, ledger] = await Promise.all([
      db.getOrderItems(order.id),
      sql<PaymentRow>`select id, provider, provider_order_id, provider_capture_id, amount_cents, currency, status, created_at
          from payments where order_id = ${order.id} order by created_at`,
      db.getFulfillmentsByOrder(order.id),
      sql<LedgerRow>`select id, kind, amount_cents, currency, description, occurred_at
          from ledger_entries where order_id = ${order.id} order by occurred_at`,
    ]);
    return { order, items, payments, fulfillments, ledger };
  });

export const deskListProducts = createServerFn({ method: "GET" }).handler(async () => {
  await guard();
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  return sql<AdminProductRow>`
    select p.id, p.slug, p.title, p.tagline, p.niche, p.type, p.price_cents, p.currency,
           p.audience, p.listed, p.source, p.sales_page, p.sections, p.tags,
           p.created_at, p.updated_at,
           exists (select 1 from deliverable_files d where d.product_id = p.id) as has_file
    from products p order by p.created_at desc`;
});

export const deskCreateProduct = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = (data ?? {}) as Record<string, unknown>;
    return {
      slug: str(d, "slug", true)!,
      title: str(d, "title", true)!,
      tagline: str(d, "tagline") ?? "",
      niche: str(d, "niche") ?? "",
      type: str(d, "type") ?? "guide",
      price_cents: Math.max(0, Math.round(Number(d.price_cents ?? 0))),
      currency: str(d, "currency") ?? "USD",
      audience: str(d, "audience") ?? "",
      listed: Boolean(d.listed),
      sales_page: str(d, "sales_page") ?? "",
    };
  })
  .handler(async ({ data }) => {
    await guard();
    const db = await import("./server");
    const product = await db.createProduct(data);
    await db.logAudit({ action: "product.create", entity: `product:${product.id}`, detail: { title: product.title } });
    const { deliverable: _omit, ...safe } = product;
    return safe;
  });

export const deskUpdateProduct = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = (data ?? {}) as Record<string, unknown>;
    const patch: Record<string, unknown> = {};
    for (const k of ["slug", "title", "tagline", "niche", "type", "currency", "audience", "sales_page"]) {
      const v = str(d, k);
      if (v !== undefined) patch[k] = v;
    }
    if (d.price_cents !== undefined) patch.price_cents = Math.max(0, Math.round(Number(d.price_cents)));
    if (d.listed !== undefined) patch.listed = Boolean(d.listed);
    return { id: str(d, "id", true)!, patch };
  })
  .handler(async ({ data }) => {
    await guard();
    const db = await import("./server");
    const before = await db.getProductById(data.id);
    const product = await db.updateProduct(data.id, data.patch as Parameters<typeof db.updateProduct>[1]);
    if (product) {
      await db.logAudit({
        action: "product.update",
        entity: `product:${data.id}`,
        detail: {
          before: before ? { price_cents: before.price_cents, listed: before.listed, title: before.title } : null,
          patch: data.patch,
        },
      });
    }
    if (!product) return null;
    const { deliverable: _omit, ...safe } = product;
    return safe;
  });

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

export const deskUploadDeliverable = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = (data ?? {}) as Record<string, unknown>;
    const dataUrl = str(d, "dataUrl", true)!;
    const match = /^data:(.+?);base64,(.+)$/.exec(dataUrl);
    if (!match) throw new Error("Upload must be a base64 data URL.");
    const bytes = Buffer.from(match[2], "base64");
    if (bytes.byteLength > MAX_UPLOAD_BYTES) throw new Error("File is too large (max 12 MB).");
    return {
      productId: str(d, "productId", true)!,
      filename: str(d, "filename") ?? "download",
      mimeType: match[1],
      bytes,
    };
  })
  .handler(async ({ data }) => {
    await guard();
    const db = await import("./server");
    await db.saveDeliverableFile({
      product_id: data.productId,
      filename: data.filename,
      mime_type: data.mimeType,
      data: data.bytes,
    });
    await db.logAudit({
      action: "product.deliverable_upload",
      entity: `product:${data.productId}`,
      detail: { filename: data.filename, bytes: data.bytes.byteLength },
    });
    return { ok: true, bytes: data.bytes.byteLength };
  });

export const deskLedger = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const d = (data ?? {}) as Record<string, unknown>;
    return {
      limit: Math.min(Math.max(Number(d.limit ?? 100) || 100, 1), 500),
      offset: Math.max(Number(d.offset ?? 0) || 0, 0),
    };
  })
  .handler(async ({ data }) => {
    await guard();
    const db = await import("./server");
    return db.listLedger(data.limit, data.offset);
  });

export const deskAuditLog = createServerFn({ method: "GET" })
  .validator((data: unknown) => ({
    limit: Math.min(Math.max(Number((data as Record<string, unknown> | null)?.limit ?? 100) || 100, 1), 500),
  }))
  .handler(async ({ data }) => {
    await guard();
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    return sql<AuditRow>`
      select id, actor_user_id, action, entity, created_at
      from audit_events order by created_at desc limit ${data.limit}`;
  });

/** Re-issue a download token for a stuck fulfillment (failed or link expired). */
export const deskRetryFulfillment = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({ fulfillmentId: str(data, "fulfillmentId", true)! }))
  .handler(async ({ data }) => {
    await guard();
    const db = await import("./server");
    const ful = await db.issueDeliveryToken(data.fulfillmentId, 120);
    await db.logAudit({
      action: "fulfillment.retry",
      entity: `fulfillment:${data.fulfillmentId}`,
      detail: { order_id: ful.order_id },
    });
    return { url: `/api/download/${ful.delivery_token}`, expiresAt: ful.token_expires_at };
  });
