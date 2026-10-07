import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildSampleSales,
  customerKey,
  formatPct,
  growthRate,
  previousRange,
  rangeFromCustom,
  rangeFromPreset,
  startOfLocalDay,
  summarizeRevenue,
  type DateRange,
} from "./revenue.ts";
import type { Product, Sale } from "./types.ts";

const NOW = Date.UTC(2026, 9, 3, 16, 0, 0);

function sale(partial: Partial<Sale> & Pick<Sale, "id" | "amount" | "at">): Sale {
  return {
    productId: "seed_rate_card",
    note: "",
    channel: "gumroad",
    customer: "Ada",
    ...partial,
  };
}

const products = [
  { id: "seed_rate_card", title: "Rate Card", niche: "Freelance operators" },
  { id: "seed_onboarding", title: "Onboarding", niche: "Client services" },
] as Product[];

describe("range helpers", () => {
  it("builds inclusive local 30-day windows", () => {
    const range = rangeFromPreset("30d", NOW);
    assert.equal(range.to - range.from, 30 * 86_400_000);
    assert.equal(range.to, startOfLocalDay(NOW) + 86_400_000);
  });

  it("starts YTD on January 1 of the same year", () => {
    const range = rangeFromPreset("ytd", NOW);
    const from = new Date(range.from);
    assert.equal(from.getFullYear(), 2026);
    assert.equal(from.getMonth(), 0);
    assert.equal(from.getDate(), 1);
  });

  it("keeps previousRange the same length", () => {
    const range = rangeFromPreset("7d", NOW);
    const prior = previousRange(range);
    assert.equal(prior.to - prior.from, range.to - range.from);
    assert.equal(prior.to, range.from);
  });

  it("parses custom dates inclusively", () => {
    const range = rangeFromCustom("2026-09-01", "2026-09-02", NOW);
    assert.equal(range.to - range.from, 2 * 86_400_000);
  });
});

describe("growth and copy", () => {
  it("returns null growth when prior is zero and current is not", () => {
    assert.equal(growthRate(40, 0), null);
    assert.equal(formatPct(null, true), "New");
  });

  it("formats signed percentages", () => {
    assert.equal(formatPct(0.12, true), "+12%");
    assert.equal(formatPct(-0.084, true), "-8.4%");
    assert.equal(formatPct(0.18), "18%");
  });
});

describe("summarizeRevenue", () => {
  const range: DateRange = { from: NOW - 7 * 86_400_000, to: NOW };

  it("sums revenue, growth, and product breakdown", () => {
    const sales = [
      sale({ id: "a", amount: 40, at: NOW - 2 * 86_400_000, productId: "seed_rate_card", customer: "Ada" }),
      sale({ id: "b", amount: 20, at: NOW - 1 * 86_400_000, productId: "seed_onboarding", customer: "Bea" }),
      sale({ id: "c", amount: 30, at: NOW - 9 * 86_400_000, productId: "seed_rate_card", customer: "Ada" }),
    ];
    const summary = summarizeRevenue(sales, products, range);
    assert.equal(summary.revenue, 60);
    assert.equal(summary.priorRevenue, 30);
    assert.equal(summary.growth, 1);
    assert.equal(summary.orders, 2);
    assert.equal(summary.byProduct[0]?.revenue, 40);
    const productTotal = summary.byProduct.reduce((n, row) => n + row.revenue, 0);
    assert.equal(productTotal, summary.revenue);
  });

  it("treats missing customers as unique and computes churn", () => {
    const sales = [
      sale({ id: "old-ada", amount: 27, at: NOW - 10 * 86_400_000, customer: "Ada" }),
      sale({ id: "old-bea", amount: 19, at: NOW - 9 * 86_400_000, customer: "Bea" }),
      sale({ id: "new-ada", amount: 27, at: NOW - 2 * 86_400_000, customer: "Ada" }),
      sale({ id: "anon", amount: 15, at: NOW - 1 * 86_400_000, customer: undefined }),
    ];
    const summary = summarizeRevenue(sales, products, range);
    assert.equal(summary.priorCustomers, 2);
    assert.equal(summary.returningCustomers, 1);
    assert.equal(summary.churnedCustomers, 1);
    assert.equal(summary.churn, 0.5);
    assert.equal(summary.newCustomers, 1);
    assert.equal(customerKey(sales[3]!), "anon:anon");
  });

  it("ignores sales outside the selected window", () => {
    const sales = [
      sale({ id: "in", amount: 10, at: NOW - 1 * 86_400_000 }),
      sale({ id: "out", amount: 999, at: NOW + 86_400_000 }),
    ];
    const summary = summarizeRevenue(sales, products, range);
    assert.equal(summary.revenue, 10);
  });
});

describe("sample sales", () => {
  it("covers ninety days, every seed product, and returning buyers", () => {
    const sales = buildSampleSales(NOW);
    assert.ok(sales.length >= 80);
    const oldest = Math.min(...sales.map((s) => s.at));
    const newest = Math.max(...sales.map((s) => s.at));
    assert.ok(NOW - oldest >= 90 * 86_400_000);
    assert.ok(newest < NOW);
    const ids = new Set(sales.map((s) => s.productId));
    for (const id of [
      "seed_rate_card",
      "seed_onboarding",
      "seed_offer_page",
      "seed_weekly_review",
      "seed_proposal",
      "seed_prompt_desk",
    ]) {
      assert.ok(ids.has(id), `missing ${id}`);
    }
    const range = rangeFromPreset("30d", NOW);
    const summary = summarizeRevenue(sales, products, range);
    assert.ok(summary.revenue > 0);
    assert.ok(summary.priorRevenue > 0);
    assert.ok(summary.churn !== null && summary.churn > 0 && summary.churn < 1);
    assert.ok(summary.trend.length >= 7);
    assert.ok(summary.byChannel.length >= 2);
  });
});
