/**
 * Public shop data — server functions for the storefront.
 *
 * The shop reads the real product catalog from Neon/PGLite (never the
 * browser's localStorage demo data), so prices and listings are the same
 * ones checkout will charge against.
 *
 * First-visit seeding: when the products table is empty, the existing
 * catalog (ids, slugs, titles, prices preserved) is inserted once, so the
 * shop keeps working exactly as before — now backed by the database.
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

async function seedCatalogIfEmpty(): Promise<void> {
  const mod = await import("./server");
  const db = await (await import("@/lib/db")).getSql();
  const count = await db<{ n: number }>`select count(*)::int as n from products`;
  if ((count[0]?.n ?? 0) > 0) return;
  for (const p of SEED_PRODUCTS) {
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
    } catch {
      // Race between two first visits, or a partially seeded catalog —
      // the unique constraints keep this safe; move on to the next product.
    }
  }
}

export const listShopProducts = createServerFn({ method: "GET" }).handler(async () => {
  await seedCatalogIfEmpty();
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
    await seedCatalogIfEmpty();
    const mod = await import("./server");
    const row = await mod.getProductById(data.id);
    if (!row || !row.listed) return null;
    return toUiProduct(row);
  });
