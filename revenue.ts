import { CHANNEL_LABEL, type Channel, type Product, type Sale } from "./types";

export const DAY_MS = 86_400_000;

export type DatePreset = "7d" | "30d" | "90d" | "ytd" | "custom";

export type DateRange = {
  from: number;
  to: number;
};

export type TrendPoint = {
  key: string;
  label: string;
  t: number;
  revenue: number;
  orders: number;
  priorRevenue: number;
};

export type BreakdownRow = {
  key: string;
  label: string;
  hint: string;
  revenue: number;
  priorRevenue: number;
  orders: number;
  share: number;
  growth: number | null;
};

export type RevenueSummary = {
  range: DateRange;
  prior: DateRange;
  revenue: number;
  priorRevenue: number;
  growth: number | null;
  orders: number;
  priorOrders: number;
  aov: number;
  churn: number | null;
  churnedCustomers: number;
  priorCustomers: number;
  returningCustomers: number;
  newCustomers: number;
  churnedRevenue: number;
  trend: TrendPoint[];
  byProduct: BreakdownRow[];
  byNiche: BreakdownRow[];
  byChannel: BreakdownRow[];
};

export function startOfLocalDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function endOfLocalDay(ts: number) {
  return startOfLocalDay(ts) + DAY_MS;
}

export function previousRange(range: DateRange): DateRange {
  const span = range.to - range.from;
  return { from: range.from - span, to: range.from };
}

export function inRange(at: number, range: DateRange) {
  return at >= range.from && at < range.to;
}

export function isoDate(ts: number) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIsoDate(value: string, end = false) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return null;
  return end ? endOfLocalDay(date.getTime()) : startOfLocalDay(date.getTime());
}

export function rangeFromPreset(
  preset: Exclude<DatePreset, "custom">,
  now = Date.now(),
): DateRange {
  const to = endOfLocalDay(now);
  if (preset === "ytd") {
    const jan1 = new Date(new Date(now).getFullYear(), 0, 1).getTime();
    return { from: jan1, to };
  }
  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  return { from: to - days * DAY_MS, to };
}

export function rangeFromCustom(fromIso: string, toIso: string, now = Date.now()): DateRange {
  const from = parseIsoDate(fromIso) ?? startOfLocalDay(now - 29 * DAY_MS);
  let to = parseIsoDate(toIso, true) ?? endOfLocalDay(now);
  if (to <= from) to = from + DAY_MS;
  return { from, to };
}

export function formatRangeLabel(range: DateRange) {
  const from = new Date(range.from);
  const to = new Date(range.to - 1);
  const sameYear = from.getFullYear() === to.getFullYear();
  const fromLabel = from.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
  const toLabel = to.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${fromLabel} – ${toLabel}`;
}

export function growthRate(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return (current - previous) / previous;
}

export function formatPct(value: number | null, signed = false) {
  if (value === null || !Number.isFinite(value)) return "New";
  const pct = value * 100;
  const abs = Math.abs(pct);
  const digits = abs >= 10 || abs === 0 ? 0 : 1;
  const body = `${pct.toFixed(digits)}%`;
  if (!signed) return body;
  if (pct > 0) return `+${body}`;
  return body;
}

export function customerKey(sale: Sale) {
  const name = sale.customer?.trim();
  return name ? name.toLowerCase() : `anon:${sale.id}`;
}

export function saleChannel(sale: Sale): Channel {
  return sale.channel ?? "manual";
}

function sumAmounts(sales: Sale[]) {
  return sales.reduce((total, sale) => total + sale.amount, 0);
}

function bucketSpec(range: DateRange): { size: number; kind: "day" | "week" | "month" } {
  const days = (range.to - range.from) / DAY_MS;
  if (days <= 32) return { size: DAY_MS, kind: "day" };
  if (days <= 140) return { size: 7 * DAY_MS, kind: "week" };
  const monthApprox = 30 * DAY_MS;
  return { size: monthApprox, kind: "month" };
}

function bucketLabel(t: number, kind: "day" | "week" | "month") {
  const d = new Date(t);
  if (kind === "month") return d.toLocaleDateString("en-US", { month: "short" });
  if (kind === "week") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function trendSeries(current: Sale[], prior: Sale[], range: DateRange, priorWindow: DateRange): TrendPoint[] {
  const { size, kind } = bucketSpec(range);
  const points: TrendPoint[] = [];
  let i = 0;
  for (let t = range.from; t < range.to; t += size) {
    const end = Math.min(t + size, range.to);
    const revenue = sumAmounts(current.filter((s) => s.at >= t && s.at < end));
    const orders = current.filter((s) => s.at >= t && s.at < end).length;
    const priorStart = priorWindow.from + i * size;
    const priorEnd = Math.min(priorStart + size, priorWindow.to);
    const priorRevenue = sumAmounts(prior.filter((s) => s.at >= priorStart && s.at < priorEnd));
    points.push({
      key: `${t}`,
      label: bucketLabel(t, kind),
      t,
      revenue,
      orders,
      priorRevenue,
    });
    i += 1;
  }
  return points;
}

function rollup(
  rows: Sale[],
  priorRows: Sale[],
  total: number,
  keyOf: (sale: Sale) => string,
  labelOf: (key: string, sale: Sale | undefined) => { label: string; hint: string },
): BreakdownRow[] {
  const keys = new Set<string>();
  for (const sale of rows) keys.add(keyOf(sale));
  for (const sale of priorRows) keys.add(keyOf(sale));
  const out: BreakdownRow[] = [];
  for (const key of keys) {
    const group = rows.filter((s) => keyOf(s) === key);
    const priorGroup = priorRows.filter((s) => keyOf(s) === key);
    const revenue = sumAmounts(group);
    const priorRevenue = sumAmounts(priorGroup);
    const sample = group[0] ?? priorGroup[0];
    const named = labelOf(key, sample);
    out.push({
      key,
      label: named.label,
      hint: named.hint,
      revenue,
      priorRevenue,
      orders: group.length,
      share: total > 0 ? revenue / total : 0,
      growth: growthRate(revenue, priorRevenue),
    });
  }
  return out.sort((a, b) => b.revenue - a.revenue || b.priorRevenue - a.priorRevenue);
}

export function summarizeRevenue(
  sales: Sale[],
  products: Product[],
  range: DateRange,
): RevenueSummary {
  const prior = previousRange(range);
  const current = sales.filter((s) => inRange(s.at, range));
  const previous = sales.filter((s) => inRange(s.at, prior));
  const revenue = sumAmounts(current);
  const priorRevenue = sumAmounts(previous);
  const productById = new Map(products.map((p) => [p.id, p]));

  const prevCustomers = new Map<string, number>();
  for (const sale of previous) {
    const key = customerKey(sale);
    prevCustomers.set(key, (prevCustomers.get(key) ?? 0) + sale.amount);
  }
  const currentCustomers = new Set(current.map(customerKey));
  let returningCustomers = 0;
  let churnedCustomers = 0;
  let churnedRevenue = 0;
  for (const [key, amount] of prevCustomers) {
    if (currentCustomers.has(key)) returningCustomers += 1;
    else {
      churnedCustomers += 1;
      churnedRevenue += amount;
    }
  }
  const newCustomers = [...currentCustomers].filter((key) => !prevCustomers.has(key)).length;
  const priorCustomerCount = prevCustomers.size;

  return {
    range,
    prior,
    revenue,
    priorRevenue,
    growth: growthRate(revenue, priorRevenue),
    orders: current.length,
    priorOrders: previous.length,
    aov: current.length ? revenue / current.length : 0,
    churn: priorCustomerCount === 0 ? null : churnedCustomers / priorCustomerCount,
    churnedCustomers,
    priorCustomers: priorCustomerCount,
    returningCustomers,
    newCustomers,
    churnedRevenue,
    trend: trendSeries(current, previous, range, prior),
    byProduct: rollup(current, previous, revenue, (s) => s.productId, (key) => {
      const product = productById.get(key);
      return {
        label: product?.title ?? "Removed product",
        hint: product?.niche ?? "Unlinked",
      };
    }),
    byNiche: rollup(
      current,
      previous,
      revenue,
      (s) => productById.get(s.productId)?.niche ?? "Unknown",
      (key) => ({ label: key, hint: "Niche" }),
    ),
    byChannel: rollup(
      current,
      previous,
      revenue,
      (s) => saleChannel(s),
      (key) => ({ label: CHANNEL_LABEL[key as Channel] ?? key, hint: "Checkout" }),
    ),
  };
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SAMPLE_CATALOG: Array<{ id: string; price: number }> = [
  { id: "seed_rate_card", price: 27 },
  { id: "seed_onboarding", price: 19 },
  { id: "seed_offer_page", price: 29 },
  { id: "seed_weekly_review", price: 15 },
  { id: "seed_proposal", price: 39 },
  { id: "seed_prompt_desk", price: 24 },
];

const SAMPLE_BUYERS: Array<{
  name: string;
  fromDay: number;
  toDay: number;
  every: number;
  favorite: number;
}> = [
  { name: "Mira Chen", fromDay: -118, toDay: 0, every: 9, favorite: 0 },
  { name: "Jules Okonkwo", fromDay: -110, toDay: 0, every: 7, favorite: 5 },
  { name: "Ari Patel", fromDay: -102, toDay: 0, every: 11, favorite: 2 },
  { name: "Sam Rivera", fromDay: -96, toDay: 0, every: 13, favorite: 1 },
  { name: "Elena Voss", fromDay: -88, toDay: 0, every: 10, favorite: 4 },
  { name: "Theo Park", fromDay: -84, toDay: 0, every: 14, favorite: 3 },
  { name: "Nia Brooks", fromDay: -76, toDay: 0, every: 12, favorite: 2 },
  { name: "Chris Lang", fromDay: -70, toDay: 0, every: 15, favorite: 0 },
  { name: "Dana Wu", fromDay: -112, toDay: -38, every: 12, favorite: 1 },
  { name: "Omar Idris", fromDay: -108, toDay: -44, every: 11, favorite: 4 },
  { name: "Priya Shah", fromDay: -100, toDay: -36, every: 14, favorite: 5 },
  { name: "Ben Cole", fromDay: -94, toDay: -40, every: 16, favorite: 3 },
  { name: "Kit Alvarez", fromDay: -28, toDay: 0, every: 8, favorite: 2 },
  { name: "Rowan Lee", fromDay: -22, toDay: 0, every: 9, favorite: 5 },
  { name: "Mei Huang", fromDay: -18, toDay: 0, every: 7, favorite: 0 },
  { name: "Alex Frost", fromDay: -14, toDay: 0, every: 6, favorite: 4 },
];

const CHANNEL_WEIGHTS: Channel[] = [
  "gumroad",
  "gumroad",
  "gumroad",
  "stripe",
  "stripe",
  "paypal",
  "manual",
];

function channelNote(channel: Channel, n: number) {
  if (channel === "gumroad") return `Gumroad · order ${1800 + n}`;
  if (channel === "stripe") return `Stripe · pi_${4200 + n}`;
  if (channel === "paypal") return `PayPal · txn ${3300 + n}`;
  return "Logged from desk";
}

export function buildSampleSales(now = Date.now()): Sale[] {
  const rand = mulberry32(0x4e1f75);
  const today = startOfLocalDay(now);
  const sales: Sale[] = [];
  let n = 0;

  const pushSale = (dayOffset: number, productIndex: number, customer: string) => {
    const jitterHours = 9 + Math.floor(rand() * 12);
    const jitterMin = Math.floor(rand() * 50);
    const at = today + dayOffset * DAY_MS + jitterHours * 3_600_000 + jitterMin * 60_000;
    if (at >= today + DAY_MS) return;
    const catalog = SAMPLE_CATALOG[productIndex] ?? SAMPLE_CATALOG[0];
    const bump = rand() < 0.08 ? (rand() < 0.5 ? -4 : 6) : 0;
    const amount = Math.max(9, catalog.price + bump);
    const channel = CHANNEL_WEIGHTS[Math.floor(rand() * CHANNEL_WEIGHTS.length)] ?? "gumroad";
    n += 1;
    sales.push({
      id: `sale_sample_${String(n).padStart(3, "0")}`,
      productId: catalog.id,
      amount,
      note: channelNote(channel, n),
      at,
      channel,
      customer,
      sample: true,
    });
  };

  for (const buyer of SAMPLE_BUYERS) {
    let day = buyer.fromDay + Math.floor(rand() * 3);
    while (day <= buyer.toDay) {
      const weekday = new Date(today + day * DAY_MS).getDay();
      if (weekday !== 0 && (weekday !== 6 || rand() > 0.55)) {
        const product =
          rand() < 0.62
            ? buyer.favorite
            : Math.floor(rand() * SAMPLE_CATALOG.length);
        pushSale(day, product, buyer.name);
      }
      day += Math.max(4, buyer.every + Math.floor(rand() * 5) - 2);
    }
  }

  const extras = [
    "Ivy Stone",
    "Noah Pell",
    "Grace Kim",
    "Leo Hart",
    "Sasha Quinn",
    "Owen Blake",
    "Hana Ito",
    "Max Reed",
  ];
  for (let i = 0; i < 28; i += 1) {
    const day = -112 + Math.floor(rand() * 112);
    const weekday = new Date(today + day * DAY_MS).getDay();
    if (weekday === 0) continue;
    pushSale(day, Math.floor(rand() * SAMPLE_CATALOG.length), extras[i % extras.length] ?? "Walk-in");
  }

  return sales.sort((a, b) => b.at - a.at);
}

export function hasSampleSales(sales: Sale[]) {
  return sales.some((sale) => sale.sample);
}
