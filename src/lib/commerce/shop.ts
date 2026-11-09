/**
 * Public shop data — server functions for the storefront.
 *
 * The shop reads the real product catalog from Neon/PGLite (never the
 * browser's localStorage demo data), so prices and listings are the same
 * ones checkout will charge against.
 *
 * First-visit seeding: any seed-catalog product missing from the products
 * table is inserted (ids, slugs, titles, prices preserved), and the Grok
 * template packs get their deliverable files attached, so the shop keeps
 * working exactly as before — now backed by the database. Safe to run on
 * every shop visit: existing rows are never overwritten.
 */
import { createServerFn } from "@tanstack/react-start";
import { SEED_PRODUCTS } from "@/lib/catalog";
import { PRODUCT_TYPES, type Product, type ProductType } from "@/lib/types";
import type { DbProduct } from "./server";

function toUiProduct(row: DbProduct): Product {
  const type = (PRODUCT_TYPES as readonly string[]).includes(row.type)
    ? (row.type as ProductType)
    : "guide";
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    niche: row.niche,
    type,
    priceUsd: row.price_cents / 100,
    audience: row.audience,
    listed: row.listed,
    source: row.source as Product["source"],
    createdAt:
      row.created_at instanceof Date ? row.created_at.getTime() : Date.parse(String(row.created_at)),
    sections: row.sections,
    salesPage: row.sales_page,
    tweets: [],
    emails: [],
    gumroadDescription: "",
    tags: row.tags,
  };
}

async function seedMissingCatalogEntries(): Promise<void> {
  const mod = await import("./server");
  const db = await (await import("@/lib/db")).getSql();
  const existing = await db<{ id: string }>`select id from products`;
  const have = new Set(existing.map((r) => r.id));
  for (const p of SEED_PRODUCTS) {
    if (have.has(p.id)) continue;
    try {
      await mod.createProduct({
      id: p.id,
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      niche: p.niche,
      type: p.type,
      price_cents: Math.round(p.priceUsd * 100),
      currency: "USD",
      audience: p.audience,
      listed: p.listed,
      source: p.source,
      sales_page: p.salesPage,
      sections: p.sections,
      tags: p.tags,
      deliverable: {},
      });
      have.add(p.id);
    } catch {
      // Race between two first visits, or a partially seeded catalog —
      // the unique constraints keep this safe; move on to the next product.
    }
  }
  // Attach the Grok template deliverable files (the bytes the authorized
  // /api/download route streams after a verified payment). Idempotent:
  // existing file rows are never overwritten, and a missing product row
  // (race) is covered by the operator's desk upload instead.
  try {
    const { GROK_TEMPLATE_DELIVERABLES } = await import("./grok-template-deliverables");
    for (const d of GROK_TEMPLATE_DELIVERABLES) {
      if (!have.has(d.productId)) continue;
      try {
        if (await mod.hasDeliverableFile(d.productId)) continue;
        await mod.saveDeliverableFile({
          product_id: d.productId,
          filename: d.filename,
          mime_type: d.mimeType,
          data: new TextEncoder().encode(d.content),
        });
      } catch {
        // Race or transient failure — the next shop visit retries.
      }
    }
  } catch {
    // Deliverables module missing — products still seed; files attach later.
  }
}

export const listShopProducts = createServerFn({ method: "GET" }).handler(async () => {
  await seedMissingCatalogEntries();
  const mod = await import("./server");
  const rows = await mod.listPublicProducts();
  return rows.map(toUiProduct);
});

export const getShopProduct = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    if (typeof data !== "object" || data === null || typeof (data as { id?: unknown }).id !== "string") {
      throw new Error("Product id is required");
    }
    return { id: (data as { id: string }).id };
  })
  .handler(async ({ data }) => {
    await seedMissingCatalogEntries();
    const mod = await import("./server");
    const row = await mod.getProductById(data.id);
    if (!row || !row.listed) return null;
    return toUiProduct(row);
  });
