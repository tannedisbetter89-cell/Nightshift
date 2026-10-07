import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CHANNEL_LABEL } from "./types-C209mI6a.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { C as Activity, _ as ChartLine, a as Settings, b as ArrowRight, c as Library, i as Store, m as Copy, n as TriangleAlert, t as X, u as Factory, v as BookOpen } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import { a as object, i as number, o as string, r as literal, s as union } from "../_libs/zod.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-D4M2JoIo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DAY_MS = 864e5;
function startOfLocalDay(ts) {
	const d = new Date(ts);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}
function endOfLocalDay(ts) {
	return startOfLocalDay(ts) + DAY_MS;
}
function previousRange(range) {
	const span = range.to - range.from;
	return {
		from: range.from - span,
		to: range.from
	};
}
function inRange(at, range) {
	return at >= range.from && at < range.to;
}
function isoDate(ts) {
	const d = new Date(ts);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseIsoDate(value, end = false) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) return null;
	const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
	if (Number.isNaN(date.getTime())) return null;
	return end ? endOfLocalDay(date.getTime()) : startOfLocalDay(date.getTime());
}
function rangeFromPreset(preset, now = Date.now()) {
	const to = endOfLocalDay(now);
	if (preset === "ytd") return {
		from: new Date(new Date(now).getFullYear(), 0, 1).getTime(),
		to
	};
	return {
		from: to - (preset === "7d" ? 7 : preset === "30d" ? 30 : 90) * DAY_MS,
		to
	};
}
function rangeFromCustom(fromIso, toIso, now = Date.now()) {
	const from = parseIsoDate(fromIso) ?? startOfLocalDay(now - 25056e5);
	let to = parseIsoDate(toIso, true) ?? endOfLocalDay(now);
	if (to <= from) to = from + DAY_MS;
	return {
		from,
		to
	};
}
function formatRangeLabel(range) {
	const from = new Date(range.from);
	const to = /* @__PURE__ */ new Date(range.to - 1);
	const sameYear = from.getFullYear() === to.getFullYear();
	return `${from.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: sameYear ? void 0 : "numeric"
	})} – ${to.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	})}`;
}
function growthRate(current, previous) {
	if (previous === 0) return current === 0 ? 0 : null;
	return (current - previous) / previous;
}
function formatPct(value, signed = false) {
	if (value === null || !Number.isFinite(value)) return "New";
	const pct = value * 100;
	const abs = Math.abs(pct);
	const digits = abs >= 10 || abs === 0 ? 0 : 1;
	const body = `${pct.toFixed(digits)}%`;
	if (!signed) return body;
	if (pct > 0) return `+${body}`;
	return body;
}
function customerKey(sale) {
	const name = sale.customer?.trim();
	return name ? name.toLowerCase() : `anon:${sale.id}`;
}
function saleChannel(sale) {
	return sale.channel ?? "manual";
}
function sumAmounts(sales) {
	return sales.reduce((total, sale) => total + sale.amount, 0);
}
function bucketSpec(range) {
	const days = (range.to - range.from) / DAY_MS;
	if (days <= 32) return {
		size: DAY_MS,
		kind: "day"
	};
	if (days <= 140) return {
		size: 7 * DAY_MS,
		kind: "week"
	};
	return {
		size: 30 * DAY_MS,
		kind: "month"
	};
}
function bucketLabel(t, kind) {
	const d = new Date(t);
	if (kind === "month") return d.toLocaleDateString("en-US", { month: "short" });
	if (kind === "week") return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	});
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	});
}
function trendSeries(current, prior, range, priorWindow) {
	const { size, kind } = bucketSpec(range);
	const points = [];
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
			priorRevenue
		});
		i += 1;
	}
	return points;
}
function rollup(rows, priorRows, total, keyOf, labelOf) {
	const keys = /* @__PURE__ */ new Set();
	for (const sale of rows) keys.add(keyOf(sale));
	for (const sale of priorRows) keys.add(keyOf(sale));
	const out = [];
	for (const key of keys) {
		const group = rows.filter((s) => keyOf(s) === key);
		const priorGroup = priorRows.filter((s) => keyOf(s) === key);
		const revenue = sumAmounts(group);
		const priorRevenue = sumAmounts(priorGroup);
		const named = labelOf(key, group[0] ?? priorGroup[0]);
		out.push({
			key,
			label: named.label,
			hint: named.hint,
			revenue,
			priorRevenue,
			orders: group.length,
			share: total > 0 ? revenue / total : 0,
			growth: growthRate(revenue, priorRevenue)
		});
	}
	return out.sort((a, b) => b.revenue - a.revenue || b.priorRevenue - a.priorRevenue);
}
function summarizeRevenue(sales, products, range) {
	const prior = previousRange(range);
	const current = sales.filter((s) => inRange(s.at, range));
	const previous = sales.filter((s) => inRange(s.at, prior));
	const revenue = sumAmounts(current);
	const priorRevenue = sumAmounts(previous);
	const productById = new Map(products.map((p) => [p.id, p]));
	const prevCustomers = /* @__PURE__ */ new Map();
	for (const sale of previous) {
		const key = customerKey(sale);
		prevCustomers.set(key, (prevCustomers.get(key) ?? 0) + sale.amount);
	}
	const currentCustomers = new Set(current.map(customerKey));
	let returningCustomers = 0;
	let churnedCustomers = 0;
	let churnedRevenue = 0;
	for (const [key, amount] of prevCustomers) if (currentCustomers.has(key)) returningCustomers += 1;
	else {
		churnedCustomers += 1;
		churnedRevenue += amount;
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
				hint: product?.niche ?? "Unlinked"
			};
		}),
		byNiche: rollup(current, previous, revenue, (s) => productById.get(s.productId)?.niche ?? "Unknown", (key) => ({
			label: key,
			hint: "Niche"
		})),
		byChannel: rollup(current, previous, revenue, (s) => saleChannel(s), (key) => ({
			label: CHANNEL_LABEL[key] ?? key,
			hint: "Checkout"
		}))
	};
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a += 1831565813;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
var SAMPLE_CATALOG = [
	{
		id: "seed_rate_card",
		price: 27
	},
	{
		id: "seed_onboarding",
		price: 19
	},
	{
		id: "seed_offer_page",
		price: 29
	},
	{
		id: "seed_weekly_review",
		price: 15
	},
	{
		id: "seed_proposal",
		price: 39
	},
	{
		id: "seed_prompt_desk",
		price: 24
	}
];
var SAMPLE_BUYERS = [
	{
		name: "Mira Chen",
		fromDay: -118,
		toDay: 0,
		every: 9,
		favorite: 0
	},
	{
		name: "Jules Okonkwo",
		fromDay: -110,
		toDay: 0,
		every: 7,
		favorite: 5
	},
	{
		name: "Ari Patel",
		fromDay: -102,
		toDay: 0,
		every: 11,
		favorite: 2
	},
	{
		name: "Sam Rivera",
		fromDay: -96,
		toDay: 0,
		every: 13,
		favorite: 1
	},
	{
		name: "Elena Voss",
		fromDay: -88,
		toDay: 0,
		every: 10,
		favorite: 4
	},
	{
		name: "Theo Park",
		fromDay: -84,
		toDay: 0,
		every: 14,
		favorite: 3
	},
	{
		name: "Nia Brooks",
		fromDay: -76,
		toDay: 0,
		every: 12,
		favorite: 2
	},
	{
		name: "Chris Lang",
		fromDay: -70,
		toDay: 0,
		every: 15,
		favorite: 0
	},
	{
		name: "Dana Wu",
		fromDay: -112,
		toDay: -38,
		every: 12,
		favorite: 1
	},
	{
		name: "Omar Idris",
		fromDay: -108,
		toDay: -44,
		every: 11,
		favorite: 4
	},
	{
		name: "Priya Shah",
		fromDay: -100,
		toDay: -36,
		every: 14,
		favorite: 5
	},
	{
		name: "Ben Cole",
		fromDay: -94,
		toDay: -40,
		every: 16,
		favorite: 3
	},
	{
		name: "Kit Alvarez",
		fromDay: -28,
		toDay: 0,
		every: 8,
		favorite: 2
	},
	{
		name: "Rowan Lee",
		fromDay: -22,
		toDay: 0,
		every: 9,
		favorite: 5
	},
	{
		name: "Mei Huang",
		fromDay: -18,
		toDay: 0,
		every: 7,
		favorite: 0
	},
	{
		name: "Alex Frost",
		fromDay: -14,
		toDay: 0,
		every: 6,
		favorite: 4
	}
];
var CHANNEL_WEIGHTS = [
	"gumroad",
	"gumroad",
	"gumroad",
	"stripe",
	"stripe",
	"paypal",
	"manual"
];
function channelNote(channel, n) {
	if (channel === "gumroad") return `Gumroad · order ${1800 + n}`;
	if (channel === "stripe") return `Stripe · pi_${4200 + n}`;
	if (channel === "paypal") return `PayPal · txn ${3300 + n}`;
	return "Logged from desk";
}
function buildSampleSales(now = Date.now()) {
	const rand = mulberry32(5119861);
	const today = startOfLocalDay(now);
	const sales = [];
	let n = 0;
	const pushSale = (dayOffset, productIndex, customer) => {
		const jitterHours = 9 + Math.floor(rand() * 12);
		const jitterMin = Math.floor(rand() * 50);
		const at = today + dayOffset * DAY_MS + jitterHours * 36e5 + jitterMin * 6e4;
		if (at >= now) return;
		const catalog = SAMPLE_CATALOG[productIndex] ?? SAMPLE_CATALOG[0];
		const bump = rand() < .08 ? rand() < .5 ? -4 : 6 : 0;
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
			sample: true
		});
	};
	for (const buyer of SAMPLE_BUYERS) {
		let day = buyer.fromDay + Math.floor(rand() * 3);
		while (day <= buyer.toDay) {
			const weekday = new Date(today + day * DAY_MS).getDay();
			if (weekday !== 0 && (weekday !== 6 || rand() > .55)) {
				const product = rand() < .62 ? buyer.favorite : Math.floor(rand() * SAMPLE_CATALOG.length);
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
		"Max Reed"
	];
	for (let i = 0; i < 28; i += 1) {
		const day = -112 + Math.floor(rand() * 112);
		if (new Date(today + day * 864e5).getDay() === 0) continue;
		pushSale(day, Math.floor(rand() * SAMPLE_CATALOG.length), extras[i % extras.length] ?? "Walk-in");
	}
	return sales.sort((a, b) => b.at - a.at);
}
function hasSampleSales(sales) {
	return sales.some((sale) => sale.sample);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatUsd(centsOrDollars, asDollars = true) {
	const value = asDollars ? centsOrDollars : centsOrDollars / 100;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: value % 1 === 0 ? 0 : 2
	}).format(value);
}
function relativeTime(ts) {
	const delta = Date.now() - ts;
	const sec = Math.round(delta / 1e3);
	if (sec < 8) return "just now";
	if (sec < 60) return `${sec}s ago`;
	const min = Math.round(sec / 60);
	if (min < 60) return `${min}m ago`;
	const hr = Math.round(min / 60);
	if (hr < 24) return `${hr}h ago`;
	return `${Math.round(hr / 24)}d ago`;
}
function uid(prefix = "id") {
	return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
function slugify(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 64);
}
function downloadText(filename, contents) {
	const blob = new Blob([contents], { type: "text/markdown;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
async function copyText(text) {
	await navigator.clipboard.writeText(text);
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			outline: "bg-transparent text-foreground shadow-[var(--shadow-border)] hover:bg-secondary",
			ghost: "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			link: "text-foreground underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-sm px-3 text-xs",
			lg: "h-12 rounded-md px-5",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-DnJ1yfr_.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("min-w-0 rounded-xl bg-card text-card-foreground shadow-[var(--shadow-border)]", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 p-5", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: cn("font-display text-xl leading-snug tracking-tight", className),
		...props
	});
}
function CardDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-sm leading-relaxed text-muted-foreground", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("p-5 pt-0", className),
		...props
	});
}
function TooltipProvider({ delayDuration = 120, skipDelayDuration = 200, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration,
		skipDelayDuration,
		...props
	});
}
function Tooltip({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root3, { ...props });
}
function TooltipTrigger({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, { ...props });
}
function TooltipContent({ className, sideOffset = 8, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset,
		className: cn("z-50 max-w-64 rounded-md bg-card px-3 py-2.5 text-xs leading-relaxed text-card-foreground shadow-[var(--shadow-border)]", className),
		...props,
		children
	}) });
}
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var SEED_PRODUCTS = [
	{
		id: "seed_rate_card",
		slug: "fixed-fee-rate-card",
		title: "The Fixed-Fee Rate Card",
		tagline: "Price the work once. Stop leaking hours into ‘quick calls’.",
		niche: "Freelance operators",
		type: "template-kit",
		priceUsd: 27,
		audience: "Independent designers, writers, and developers who sell time and want to sell outcomes instead.",
		listed: true,
		source: "seed",
		createdAt: 17254e8,
		tags: [
			"freelance",
			"pricing",
			"templates",
			"clients"
		],
		gumroadDescription: "A complete rate card and conversation kit for independents moving off hourly billing. Includes three pricing ladders, scope language, and the exact replies for ‘can you just…’.",
		salesPage: "Hourly billing trains clients to haggle your minutes. This kit replaces that with a one-page rate card, three offer ladders, and the language to hold the line when someone asks for a discount. Use it on the next inbound. Print it. Send it. Stop explaining your worth in 15-minute increments.",
		tweets: [
			"Stop selling hours. A one-page rate card makes the price a fact, not a negotiation.",
			"The discount request is a scope request in costume. Answer it with a smaller package, not a smaller number.",
			"If your calendar is full and your account is not, the leak is pricing — not pipeline."
		],
		emails: [{
			subject: "Your rate is a document, not a feeling",
			body: "Most independents undercharge because the number lives in their head. Put it on one page. Three packages. One line about what is not included. Send the page instead of improvising on the call."
		}, {
			subject: "A smaller package beats a smaller price",
			body: "When they ask you to come down, offer the middle ladder with the same delivery date. You keep the rate. They keep a decision. Nobody ‘meets in the middle’ on your rent."
		}],
		sections: [
			{
				heading: "How to use this kit",
				body: "Fill the rate card before you talk to anyone. Pick a flagship offer, a smaller sibling, and a retainer. The numbers should feel slightly high in your mouth — that is the point. Then send the card as a PDF or a single page in your proposal. Do not read it aloud. Let the page do the talking so you are not bargaining with your own voice."
			},
			{
				heading: "Three-ladder pricing",
				body: "Lite: a defined artifact, one round of revisions, a hard delivery date. Standard: the artifact plus a working session and a 14-day polish window. Retainer: a monthly block with a published response time and a rollover cap of 20%. Name the packages after the outcome (Launch, Maintain, Expand) not after sizes (Bronze, Gold). Sizes invite comparison shopping. Outcomes invite a decision."
			},
			{
				heading: "What is not included",
				body: "Write this as a short list, not a legal wall. Typical exclusions: extra stakeholder interviews, net-new pages after freeze, rush fees under 5 business days, tool licenses, and stock. When a request hits an exclusion, reply with the exclusion line plus a priced add-on. ‘That’s outside this package — I can add it for $X and shift delivery by Y days.’"
			},
			{
				heading: "Replies that hold the line",
				body: "‘Can you do it cheaper?’ → ‘I can do a smaller scope at the Lite price. Here’s what comes out.’\n‘We only have half the budget.’ → ‘Then we ship half the outcome. I’ll mark the cut in the card.’\n‘Just a quick call?’ → ‘Calls are billed as working sessions on Standard and Retainer. Happy to book one there.’\n‘Can you start this week?’ → ‘Rush is +35% and I confirm by 4pm today.’"
			},
			{
				heading: "The one-page card layout",
				body: "Header: your name, the offer family, the date. Row 1: three packages as columns. Row 2: what’s in, what’s out. Row 3: timeline and payment (50% to start, remainder on delivery). Footer: one sentence on who this is for, and a single next step (‘Reply with Lite, Standard, or Retainer’). Keep it to one screen. If it scrolls, you are still explaining."
			}
		]
	},
	{
		id: "seed_onboarding",
		slug: "client-onboarding-seven-messages",
		title: "Client Onboarding in 7 Messages",
		tagline: "From ‘you’re hired’ to first draft without a 90-minute kickoff.",
		niche: "Client services",
		type: "sop",
		priceUsd: 19,
		audience: "Solo operators who lose the first week of every job to scheduling, files, and unclear owners.",
		listed: true,
		source: "seed",
		createdAt: 1725400000001,
		tags: [
			"onboarding",
			"ops",
			"email",
			"clients"
		],
		gumroadDescription: "Seven copy-paste messages that take a new client from signed to briefing without a kickoff meeting. Includes intake, access, freeze date, and the first working update.",
		salesPage: "Kickoff meetings exist because the onboarding is sloppy. This SOP replaces the meeting with seven messages you send in order. The client answers in writing. You start with a brief you can quote later. The first week stops disappearing into calendar tennis.",
		tweets: [
			"If the brief isn’t written down, you don’t have a brief. You have a vibe.",
			"Kickoff calls are where scope goes to die. Put the questions in email. Freeze the answers.",
			"Onboarding is a product. Ship it the same way every time."
		],
		emails: [{
			subject: "You don’t need a kickoff. You need a freeze date.",
			body: "The first seven messages in this pack collect access, owners, constraints, and the freeze date. Once the freeze date is in writing, ‘one more thought’ becomes a change request."
		}, {
			subject: "The first working update",
			body: "Message 7 is a 6-line update: what moved, what’s blocked, what you need, when the next artifact lands. Send it even if nothing is blocked. Silence is how clients invent a story."
		}],
		sections: [
			{
				heading: "The sequence",
				body: "1. Welcome + invoice. 2. Access checklist. 3. Intake (10 questions, not 40). 4. Confirm owners and channels. 5. Freeze date + revision policy. 6. Working file location. 7. First update. Send one a day if they are slow. Send two a day if they are fast. Never batch all seven — they will skim and miss the freeze."
			},
			{
				heading: "Message 3 — the only intake you need",
				body: "Ask: What does done look like in one sentence? Who says yes? Who can kill it? What must not change? What has already been tried? Where does this live when it’s finished? What would make this a failure? Deadline that is real vs. deadline that is a wish? Constraints on tools, brand, legal. Anything I will be surprised by in week two? If they write paragraphs, thank them and extract the one-sentence done."
			},
			{
				heading: "Freeze language",
				body: "‘Inputs freeze on [date]. After that, new direction is a change request with a new date and a new number. I protect the freeze so your original deadline stays honest.’ Send this twice: in message 5 and in the footer of the first draft. People remember the second time."
			},
			{
				heading: "When they want a call anyway",
				body: "Offer a 20-minute working session after messages 1–6 are complete. The call is then a review, not a scavenger hunt. If they insist on calling first, send the intake anyway and say you’ll use the call to confirm the written answers. You are training them to leave a paper trail you can both use."
			}
		]
	},
	{
		id: "seed_offer_page",
		slug: "the-quiet-offer-page",
		title: "The Quiet Offer Page",
		tagline: "A sales page that reads like a letter, not a carnival.",
		niche: "Digital products",
		type: "guide",
		priceUsd: 29,
		audience: "People selling a digital product, workshop, or service who hate loud landing pages and still need the page to close.",
		listed: true,
		source: "seed",
		createdAt: 1725400000002,
		tags: [
			"copy",
			"sales",
			"landing page",
			"offers"
		],
		gumroadDescription: "A structure for a one-screen offer page: promise, who it’s for, what’s inside, price, and the one objection. Written for people who will not use a countdown timer.",
		salesPage: "Most offer pages shout because the offer is vague. This guide gives you a quiet page: a specific buyer, a specific artifact, a specific price, and one honest objection handled in a sentence. You can ship it as a Gumroad description, a Notion page, or a single route on your site.",
		tweets: [
			"If the page needs a countdown, the offer isn’t clear enough to stand still.",
			"Name the buyer in the first line. Everyone else should feel politely excluded.",
			"Price is a sentence. Hide it and you teach people to hunt for the catch."
		],
		emails: [{
			subject: "One screen. One decision.",
			body: "Promise. Who. What’s inside. Price. Objection. Button. If a section doesn’t change the decision, cut it. Testimonials belong under the objection, not above the promise."
		}, {
			subject: "The buyer should feel excluded if they aren’t the buyer",
			body: "‘For independent operators who already have inbound’ is a better first line than ‘For anyone who wants more freedom.’ Specificity is a filter. Filters raise close rate."
		}],
		sections: [
			{
				heading: "The six blocks",
				body: "1. Promise in the buyer’s words. 2. Who this is for — and who it is not. 3. What’s inside, as artifacts not adjectives. 4. How they use it in the first 30 minutes. 5. Price, what’s included, what’s not. 6. The objection you actually hear, answered once. Stop after that. A longer page is usually a less decided offer."
			},
			{
				heading: "Write the promise last",
				body: "Draft the contents list first. Then the 30-minute use. Then the buyer. The promise is a compression of those three. If you write the promise first you will invent contents to justify it. Buyers can feel the invention."
			},
			{
				heading: "Price on the page",
				body: "Put the number next to the artifact, not in a toggle. If you have three packages, show three numbers in a row with one recommended. Do not ‘book a call to hear the price’ unless the work is truly custom — in which case this page should sell the call, and the call should still end on a card."
			},
			{
				heading: "The one objection",
				body: "Pick the real one. For digital products it is usually ‘I won’t use it.’ Answer with the first 30 minutes: open the file, fill the highlighted fields, send it to one person. For services it is ‘I’ve been burned.’ Answer with freeze dates, revision caps, and a kill fee. One objection, handled. A FAQ of twelve is a nervous author."
			}
		]
	},
	{
		id: "seed_weekly_review",
		slug: "operator-weekly-review",
		title: "Operator Weekly Review",
		tagline: "A 25-minute close that tells you what to mint, ship, or kill.",
		niche: "Solo operators",
		type: "checklist",
		priceUsd: 15,
		audience: "People running a one-person operation who end the week busy and start the next one lost.",
		listed: true,
		source: "seed",
		createdAt: 1725400000003,
		tags: [
			"productivity",
			"review",
			"checklist",
			"operators"
		],
		gumroadDescription: "A Friday checklist: cash, pipeline, product, energy. Twenty-five minutes. No journaling. Includes the three questions that decide next week’s work.",
		salesPage: "A weekly review that isn’t a diary. You close the books on cash, name one leak, pick one ship, and park everything else. The output is a six-line note you can read on Monday without thinking.",
		tweets: [
			"If you don’t close the week, Monday inherits the mess and calls it a plan.",
			"Busy is not a metric. Cash, pipeline, and one shipped artifact are.",
			"Kill lists are more valuable than idea lists. Put them in the same note."
		],
		emails: [{
			subject: "Close the week like a shop",
			body: "Count the money. Count the unfinished. Name one thing that ships next week. Name one thing that dies. That’s the review. The rest is decoration."
		}, {
			subject: "Monday should start with a note, not a feeling",
			body: "The last box in this checklist is a six-line Monday note. Write it while the week is still in your body. Future-you is a stranger with less context."
		}],
		sections: [
			{
				heading: "The 25-minute close",
				body: "Minutes 0–5: cash in, cash promised, cash owed. Minutes 5–12: pipeline — what’s alive, what’s pretend. Minutes 12–18: product — what shipped, what’s rotting. Minutes 18–22: energy — what drained you that wasn’t worth it. Minutes 22–25: Monday note. Timer on. If you run over, you are journaling."
			},
			{
				heading: "Three deciding questions",
				body: "What made money or will within 14 days? What was theater? If I could only do three things next week, which three still matter if nobody thanks me? The answers become the Monday note. Everything else goes to a parking list you are allowed to ignore."
			},
			{
				heading: "The Monday note template",
				body: "1. Cash position in one line. 2. The ship. 3. The two supporting moves. 4. The kill. 5. One person to contact. 6. Off-limits (the drain you will not repeat). Stick this to the top of your task app. Do not rewrite it on Monday unless the facts changed."
			},
			{
				heading: "What not to track",
				body: "Steps, inbox zero, hours in chair, ‘content ideas.’ Those metrics congratulate motion. This review only keeps numbers that survive contact with a bank account or a shipped file."
			}
		]
	},
	{
		id: "seed_proposal",
		slug: "proposal-kit-scope-creep",
		title: "Proposal Kit: Scope Without Scope Creep",
		tagline: "A proposal that already contains the change order.",
		niche: "Client services",
		type: "template-kit",
		priceUsd: 39,
		audience: "Independents whose projects swell because the proposal was a mood board.",
		listed: true,
		source: "seed",
		createdAt: 1725400000004,
		tags: [
			"proposals",
			"scope",
			"clients",
			"templates"
		],
		gumroadDescription: "Proposal sections, a scope freeze, revision math, and a change-order paragraph you can paste. Built to stop the project from doubling while the fee stays still.",
		salesPage: "Scope creep is a proposal problem. This kit gives you a document that names the artifact, the rounds, the freeze, and the price of leaving the rails. You send it once. When the extra request arrives, you already wrote the answer.",
		tweets: [
			"If it isn’t in the proposal, it’s a new job. Say that before you say yes.",
			"Revision rounds are a number. ‘Until it feels right’ is how you work weekends.",
			"A change order is a kindness. It keeps the original promise intact."
		],
		emails: [{
			subject: "Put the change order in the original PDF",
			body: "People behave better when the extra work has a price before they ask. This kit includes a one-paragraph change order. Leave it in. It signals you have done this before."
		}, {
			subject: "Two rounds. Then a number.",
			body: "Write ‘two rounds of consolidated feedback from one owner.’ Not ‘we’ll tweak until you’re happy.’ Happiness is not a scope."
		}],
		sections: [
			{
				heading: "The only sections that matter",
				body: "Context (5 lines). Artifact (what they can hold). Out of scope. Timeline with freeze. Rounds and owners. Price and payment. Change order. Next step. If you add a company history, you are soothing yourself. They skip it."
			},
			{
				heading: "Artifact, not activity",
				body: "‘Six landing sections in Figma, desktop and one mobile frame, exported as a clickable prototype’ is an artifact. ‘Brand exploration and collaboration’ is a weather report. Write the thing they can screenshot when they forward your proposal upstairs."
			},
			{
				heading: "Revision math",
				body: "Round 1: direction. Round 2: production polish. Feedback must arrive as one list from one owner within 3 business days or the date moves. Additional rounds: a published fee (e.g. $400) and +3 days. Put the fee in the proposal so it is not a surprise tax."
			},
			{
				heading: "Change-order paragraph",
				body: "‘Work outside this artifact — extra pages, new stakeholders, new directions after freeze — is quoted before it starts. Typical adds are a fixed fee and a moved date. I will not begin extra work on a verbal yes.’ Paste it. Do not apologize for it."
			},
			{
				heading: "The send",
				body: "PDF, not a Google Doc they can comment into mush. Subject: ‘Proposal — [artifact] — [price]’. Body: three sentences and a ask to reply with yes / questions / not now. Follow up once at 4 business days. Then park it. Chasing is a second job."
			}
		]
	},
	{
		id: "seed_prompt_desk",
		slug: "prompt-desk-client-deliverables",
		title: "Prompt Desk for Client Deliverables",
		tagline: "A desk of prompts that draft the work — not more chat.",
		niche: "AI-assisted client work",
		type: "prompt-pack",
		priceUsd: 24,
		audience: "Operators using a language model to draft client work who are tired of one-off prompts that wander.",
		listed: true,
		source: "seed",
		createdAt: 1725400000005,
		tags: [
			"ai",
			"prompts",
			"deliverables",
			"ops"
		],
		gumroadDescription: "Reusable prompt desks for briefs, outlines, first drafts, revision passes, and client updates. Each prompt asks for inputs and returns an artifact, not a conversation.",
		salesPage: "Chat is a trap. This pack is a desk: one prompt per artifact. You paste the inputs, you get a draft you can stand behind or cut. Built for client work where ‘sounds about right’ is not a delivery standard.",
		tweets: [
			"A good prompt names the artifact, the audience, and what to refuse.",
			"If you have to keep chatting, you didn’t specify the output.",
			"Use the model for the first 70%. Your name goes on the last 30%."
		],
		emails: [{
			subject: "Stop chatting. Start a desk.",
			body: "Each prompt in this pack has required inputs and a refuse list. The refuse list is how you keep the draft from inventing facts, testimonials, or timelines you didn’t give it."
		}, {
			subject: "Revision is a separate prompt",
			body: "Don’t continue the thread into mush. Open the revision prompt, paste the draft, paste the owner’s list, set the round number. You will get a cleaner pass."
		}],
		sections: [
			{
				heading: "How the desk works",
				body: "Every prompt has four parts you fill: context, artifact, constraints, refuse. Run it once. If the output is wrong, the inputs were thin — fix those, don’t argue with the model. Save a winning run as a named desk card so next week’s job starts from a known-good prompt."
			},
			{
				heading: "Brief compressor",
				body: "Paste the messy email. Ask for: one-sentence done, owners, constraints, open questions, and a risk. Refuse: invented stakeholders, fake deadlines. Use the output as Message 3 in your onboarding, not as the final truth. Highlight anything the model inferred and confirm it."
			},
			{
				heading: "First-draft prompt",
				body: "Inputs: audience, artifact, outline, examples of the client’s voice (paste 3 real sentences), facts that must appear, facts that must not be invented. Output: a complete draft with bracketed [NEEDS FACT] markers. Never let it smooth over a missing fact. The brackets are the point."
			},
			{
				heading: "Revision pass",
				body: "Inputs: draft, owner feedback as a numbered list, round (1 or 2), what must stay. Instructions: address each numbered item or mark it as a conflict. Do not restyle the whole piece. A revision that rewrites everything is a new draft in costume."
			},
			{
				heading: "Client update",
				body: "Inputs: what moved, what’s blocked, decision needed, next artifact and date. Output: 6 lines, no adjectives, no ‘hope you’re well.’ This is the same shape as a good status email. Send it even on quiet days so the client does not write the story for you."
			}
		]
	}
];
function productToMarkdown(product) {
	const sections = product.sections.map((s) => `## ${s.heading}\n\n${s.body}`).join("\n\n");
	const tweets = product.tweets.map((t) => `- ${t}`).join("\n");
	const emails = product.emails.map((e) => `### ${e.subject}\n\n${e.body}`).join("\n\n");
	return `# ${product.title}

${product.tagline}

**Type:** ${product.type}
**Niche:** ${product.niche}
**Price:** $${product.priceUsd}
**For:** ${product.audience}

## Sales page

${product.salesPage}

${sections}

## Launch tweets

${tweets}

## Emails

${emails}

## Gumroad description

${product.gumroadDescription}

Tags: ${product.tags.join(", ")}
`;
}
function gumroadListing(product) {
	return `${product.title}

${product.tagline}

${product.salesPage}

What's inside
${product.sections.map((s) => `• ${s.heading}`).join("\n")}

Who it's for
${product.audience}

Price: $${product.priceUsd}

${product.gumroadDescription}
`;
}
function launchKit(product) {
	return `LAUNCH KIT — ${product.title}

TWEETS
${product.tweets.map((t, i) => `${i + 1}. ${t}`).join("\n\n")}

EMAILS
${product.emails.map((e) => `Subject: ${e.subject}\n${e.body}`).join("\n\n---\n\n")}

GUMROAD
${gumroadListing(product)}
`;
}
function listingsPack(products) {
	return products.map((p) => gumroadListing(p)).join("\n\n---\n\n");
}
function fulfillmentNote(product) {
	return `Thanks for buying ${product.title}.

Here’s the file. Open it, run the first section today, and reply if a field is unclear.

— Nightshift`;
}
function buildLaunchWeek(products) {
	const listed = products.filter((p) => p.listed);
	const newest = listed[0];
	const second = listed[1] ?? listed[0];
	if (!newest) return [{
		day: "Week",
		title: "Mint first",
		body: "Nothing is listed. Run the mill, list a product, then this week writes itself."
	}];
	const emailOne = newest.emails[0];
	const emailTwo = newest.emails[1] ?? newest.emails[0];
	const tweetOne = newest.tweets[0] ?? newest.tagline;
	const tweetTwo = (second ?? newest).tweets[1] ?? (second ?? newest).tagline;
	return [
		{
			day: "Mon",
			title: `Tweet ${newest.title}`,
			body: tweetOne,
			copy: tweetOne
		},
		{
			day: "Tue",
			title: "Send email one",
			body: emailOne ? `${emailOne.subject} — ${emailOne.body}` : newest.salesPage,
			copy: emailOne ? `Subject: ${emailOne.subject}\n\n${emailOne.body}` : void 0
		},
		{
			day: "Wed",
			title: "Share the shop",
			body: `Send the shop to five people who already trust you. Caption: ${newest.tagline}`,
			copy: newest.tagline
		},
		{
			day: "Thu",
			title: `Tweet ${second.title}`,
			body: tweetTwo,
			copy: tweetTwo
		},
		{
			day: "Fri",
			title: "Send email two",
			body: emailTwo ? `${emailTwo.subject} — ${emailTwo.body}` : "Follow up once. Then stop.",
			copy: emailTwo ? `Subject: ${emailTwo.subject}\n\n${emailTwo.body}` : void 0
		},
		{
			day: "Sat",
			title: "Quiet replies",
			body: "Answer every reply and DM about the product. Do not post a third pitch. Fulfill anything that paid."
		},
		{
			day: "Sun",
			title: "Close the week",
			body: "Log cash in the ledger. Kill the listing that got no questions. Keep the one that did."
		}
	];
}
var NICHES = [
	{
		name: "Freelance operators",
		audience: "Independents selling design, writing, or development to small teams.",
		tags: [
			"freelance",
			"pricing",
			"clients"
		],
		objection: "I’ve always billed hourly and clients expect it.",
		tweets: [
			"Hourly billing is a story you tell when you haven’t named the artifact.",
			"A full calendar and an empty account is a pricing problem.",
			"Send the card. Don’t perform the price on the call."
		],
		sections: [
			{
				heading: "Name the artifact",
				body: "Write down what the client can hold when you’re done: a page, a deck, a working file, a decision. If you cannot screenshot it, you are still selling time. Pricing gets easy after the artifact has a name, a freeze date, and a revision cap."
			},
			{
				heading: "Publish a ladder",
				body: "Three offers. Same family. Different surface area. The middle one should be the one you want. The small one exists so the discount request has somewhere to go besides your rate."
			},
			{
				heading: "Payment that starts the work",
				body: "Fifty percent to calendar the work. Remainder on delivery. Do not start on a verbal yes. A kickoff without a deposit is a hobby with a client-shaped hole."
			}
		]
	},
	{
		name: "Newsletter writers",
		audience: "Writers who want the letter to pay, not just grow.",
		tags: [
			"newsletter",
			"audience",
			"monetization"
		],
		objection: "I need more subscribers before I charge.",
		tweets: [
			"A thousand readers who reply will beat ten thousand who scroll.",
			"Sell the artifact the letter is already training people to want.",
			"If the letter is free forever, you trained them that your thinking is free."
		],
		sections: [
			{
				heading: "Pick a paid sibling",
				body: "The letter stays free. The sibling is a kit, a critique, a small workshop, or a monthly desk. It should be the thing your best replies already ask for. Don’t invent a membership to look serious. Invent a file they can use on Tuesday."
			},
			{
				heading: "Offer in the letter, not beside it",
				body: "One paragraph, once a week, below the actual point. Promise, artifact, price, link. No thread of eight pitches. Readers forgive a clear ask. They punish a funnel."
			},
			{
				heading: "Price for a reply, not a list",
				body: "If 40 people would pay $29, that is a real product. Wait for 10,000 subscribers and you will wait through another year of ‘almost.’ Launch to the people who already write back."
			}
		]
	},
	{
		name: "Small studio owners",
		audience: "Two-to-six person studios drowning in Slack and undocumented work.",
		tags: [
			"studio",
			"ops",
			"sops"
		],
		objection: "We’re too busy to write this down.",
		tweets: [
			"If it lives in someone’s head, you don’t have a studio. You have a dependency.",
			"Write the path for the third time you do a thing. The first two can be messy.",
			"SOPs are how you stop hiring to cover confusion."
		],
		sections: [
			{
				heading: "Document the repeat, not the craft",
				body: "Onboarding, invoices, feedback collection, file naming, handoff. Leave the taste in people’s hands. Write down the path that keeps the taste from getting lost in a bad week."
			},
			{
				heading: "One owner per path",
				body: "A process with two owners has none. Put a name on the SOP. The owner can be junior. The point is that Saturday-you is not the fallback."
			},
			{
				heading: "Review quarterly, not constantly",
				body: "A living document that changes daily is a chat log. Freeze a version. Date it. Change it when a job actually breaks, not when someone has a new app."
			}
		]
	},
	{
		name: "Course-adjacent teachers",
		audience: "People who already teach and want a product that doesn’t need another live cohort.",
		tags: [
			"teaching",
			"digital products",
			"courses"
		],
		objection: "My students only show up live.",
		tweets: [
			"The cohort is expensive theater. The file is the business.",
			"Teach it live once. Sell the desk forever.",
			"If they only come live, you haven’t given them a tool they can open alone."
		],
		sections: [
			{
				heading: "Extract the desk",
				body: "List every file you already send a student: checklists, prompts, worksheets, example critiques. That’s the product. The videos are optional seasoning. Ship the desk first and you have something that sells at 11pm without you."
			},
			{
				heading: "Name a 30-minute win",
				body: "The product should produce a visible result before the buyer finishes their coffee. A filled template, a scored audit, a drafted email. Courses fail when the win is ‘you’ll understand.’ Understanding is not an artifact."
			},
			{
				heading: "Keep the live thing scarce",
				body: "If you still like teaching live, sell it as a rare add-on to the desk, not the other way around. The desk is the engine. The room is the event."
			}
		]
	},
	{
		name: "B2B operators",
		audience: "In-house operators who sell ideas upstairs and never get a decision.",
		tags: [
			"b2b",
			"internal",
			"decision memos"
		],
		objection: "My company doesn’t buy like that.",
		tweets: [
			"A memo that asks for a decision beats a deck that asks for a meeting.",
			"Upstairs wants the option, the cost, and the kill criteria. In that order.",
			"If there is no freeze date, there is no project. There is a vibe with a Slack channel."
		],
		sections: [
			{
				heading: "Write the decision, not the journey",
				body: "One page: context, options (max three), recommend one, cost, kill criteria, ask. Send it before the meeting. The meeting is then a yes, a no, or a better option — not a tour of your thinking."
			},
			{
				heading: "Kill criteria",
				body: "Name what would make you stop. Budget, date, missing owner, a dependency that didn’t land. Executives relax when they see you already know how this dies. It signals you won’t nurse a zombie."
			},
			{
				heading: "The follow-up that closes",
				body: "Same day, six lines: what was decided, who owns it, date, what’s out. If nothing was decided, write that down too. Silence lets the loudest person rewrite the meeting on Wednesday."
			}
		]
	},
	{
		name: "Shopkeepers going digital",
		audience: "Makers and shop owners adding a digital product beside the physical one.",
		tags: [
			"makers",
			"digital",
			"shops"
		],
		objection: "People come to me for the physical thing.",
		tweets: [
			"The physical thing gets them in. The file gets you paid at midnight.",
			"A care guide, a pattern, a setup kit — that’s inventory that doesn’t ship.",
			"Don’t build an app. Sell the thing you already explain in DMs."
		],
		sections: [
			{
				heading: "Mine the DMs",
				body: "The digital product is the question you already answer twice a week. Care, sizing, setup, ‘how did you do that,’ a pattern, a recipe. Write it once. Price it. Link it from the packing slip and the bio."
			},
			{
				heading: "Bundle, don’t silo",
				body: "Offer the file as an add-on at checkout and as a standalone. The add-on captures people who already trust you. The standalone captures people who will never buy the object."
			},
			{
				heading: "Fulfillment is a link",
				body: "Instant download. No custom wrapping. The quality bar is the same as your physical work — clean, named, usable — but the logistics bar is a URL. That is the point of this inventory."
			}
		]
	},
	{
		name: "Job-side hustlers",
		audience: "People with a day job who can give this 4 focused hours a week, not a fantasy of quitting Friday.",
		tags: [
			"side hustle",
			"time",
			"systems"
		],
		objection: "I don’t have time to build a business.",
		tweets: [
			"Four hours, same slot, every week. That’s a studio. The rest is a mood.",
			"Quit-your-job content is entertainment. A product that sells while you work is a plan.",
			"If it needs you live, it isn’t a hustle. It’s a second shift."
		],
		sections: [
			{
				heading: "Protect the slot",
				body: "Same four hours, same days, named on the calendar like a shift. During the slot you only mint, list, or close. No brand moodboards. No new stack. The constraint is the product."
			},
			{
				heading: "One channel until it pays",
				body: "Pick Gumroad or the in-app shop or a single social account. Splitting attention across five platforms is how the slot evaporates. When one channel produces a sale, then duplicate the listing."
			},
			{
				heading: "A 12-week finish line",
				body: "Week 1–2: pick the artifact. Week 3–4: mint it. Week 5: list it. Week 6–12: send it to people who already know you, once a week, without apology. Then review cash, not vibes."
			}
		]
	},
	{
		name: "Consultants productizing",
		audience: "Consultants who want a product in front of the call so the call is qualified.",
		tags: [
			"consulting",
			"productize",
			"offers"
		],
		objection: "My work is too custom to productize.",
		tweets: [
			"If you’ve done it three times, it isn’t custom. It’s unpublished.",
			"Sell the diagnostic. Keep the custom work for people who passed it.",
			"A $49 audit that stings is a better lead than a ‘let’s hop on a call.’"
		],
		sections: [
			{
				heading: "Productize the front door",
				body: "The whole engagement can stay custom. The front door should not. A scored audit, a teardown, a 10-page diagnostic — priced, productized, instant. People who buy it are warmer than people who booked a coffee."
			},
			{
				heading: "Score something",
				body: "Give the diagnostic a number. Buyers trust a score more than a narrative. Even a 12-point checklist with a 1–5 on each line is enough. Then sell the deeper work against the low scores."
			},
			{
				heading: "Keep custom behind a gate",
				body: "The call is available after the diagnostic, or at a published day-rate. This stops tourists from renting your Tuesday. It also makes the product feel like the serious path, not a consolation prize."
			}
		]
	}
];
var FORMATS = [
	{
		type: "guide",
		title: (n, h) => `${h} for ${n}`,
		tagline: (h) => `A short guide that makes ${h.toLowerCase()} a default, not a mood.`,
		price: 29,
		extraHeading: "How to run it this week",
		extraBody: (niche) => `Block one session. Read the sections in order. Produce the artifact named in the first heading before you tinker with tools. ${niche.audience} already know the work — this is the sequence that stops the stall.`
	},
	{
		type: "template-kit",
		title: (n, h) => `${h} Kit — ${n}`,
		tagline: (h) => `Fill-in fields. Send. ${h} without a blank page.`,
		price: 27,
		extraHeading: "What’s in the fields",
		extraBody: () => "Highlighted brackets mark every place you type. Don’t restyle the kit on day one. Use it as-is on the next live job, then change one line that felt false. Kits die from premature taste."
	},
	{
		type: "checklist",
		title: (_n, h) => `The ${h} Checklist`,
		tagline: (h) => `A close-out list so ${h.toLowerCase()} doesn’t leak into next week.`,
		price: 15,
		extraHeading: "How to run the list",
		extraBody: () => "Print it or keep it at the top of a note. Check items in order. If you skip one, write why — that’s the leak. A checklist you rearrange every Friday is a journal."
	},
	{
		type: "sop",
		title: (n, h) => `SOP: ${h} (${n})`,
		tagline: (h) => `The path you follow when you’re tired and ${h.toLowerCase()} still has to happen.`,
		price: 19,
		extraHeading: "Owners and freeze",
		extraBody: (niche) => `Put a single owner on this path. Date the version. ${niche.audience} should be able to hand this to a future hire without a tour. If it needs a tour, it isn’t an SOP yet.`
	},
	{
		type: "prompt-pack",
		title: (_n, h) => `Prompt Desk: ${h}`,
		tagline: (h) => `Prompts that return a ${h.toLowerCase()} artifact — not a chat.`,
		price: 24,
		extraHeading: "Refuse list",
		extraBody: () => "Each prompt must refuse invented facts, fake quotes, and dates you didn’t supply. If the model fills a hole, that’s a bug in the prompt, not a feature. Keep [NEEDS FACT] markers in the output."
	},
	{
		type: "script-pack",
		title: (_n, h) => `Scripts for ${h}`,
		tagline: (h) => `Copy-paste language for the moments ${h.toLowerCase()} usually goes sideways.`,
		price: 21,
		extraHeading: "How to send them",
		extraBody: () => "Don’t memorize. Paste, then change one concrete detail so it sounds like you. Scripts fail when they’re performed. They work when they’re a document the other person can quote."
	}
];
var HOOKS = [
	"The Quiet Close",
	"Fixed-Fee Monday",
	"After-Hours Inventory",
	"One-Page Offer",
	"Freeze Date",
	"The Kill List",
	"Inbox to Artifact",
	"Retainer Without Resentment",
	"First 30 Minutes",
	"No-Call Kickoff",
	"Scope That Holds",
	"The Paid Sibling"
];
function pick(arr, n) {
	return arr[Math.abs(n) % arr.length];
}
var TRENDS = NICHES.map((n, i) => ({
	niche: n.name,
	demand: 72 + i * 13 % 23,
	note: n.audience
}));
function mintFromFactory(serial, existingTitles) {
	let attempt = 0;
	let product;
	do {
		const seed = serial + attempt * 17;
		const niche = pick(NICHES, seed);
		const format = pick(FORMATS, seed * 3);
		const hook = pick(HOOKS, seed * 5 + attempt);
		const title = format.title(niche.name, hook);
		const sections = [
			...niche.sections,
			{
				heading: format.extraHeading,
				body: format.extraBody(niche, hook)
			},
			{
				heading: "The objection",
				body: `They will say: “${niche.objection}” Answer with the artifact, the freeze, and the price — not a story about your process. If they still want the old way, sell them the small ladder or walk.`
			}
		];
		product = {
			id: uid("mint"),
			slug: slugify(`${title}-${serial}-${attempt}`),
			title,
			tagline: format.tagline(hook),
			niche: niche.name,
			type: format.type,
			priceUsd: format.price,
			audience: niche.audience,
			listed: true,
			source: "factory",
			createdAt: Date.now(),
			sections,
			salesPage: `${title} is for ${niche.audience} You get a ${format.type.replace("-", " ")} built around ${hook.toLowerCase()} — the sequence, the language, and the freeze. Price is $${format.price}. Use it on the next live piece of work, not as a rainy-day read.`,
			tweets: niche.tweets,
			emails: [{
				subject: `${hook} is a document`,
				body: `Most people in ${niche.name.toLowerCase()} try to hold this in their head. This kit puts it on a page you can send. ${niche.audience}`
			}, {
				subject: `The ${format.type.replace("-", " ")} is live`,
				body: `It’s listed. It’s $${format.price}. The first 30 minutes are the point — open it, fill it, send it. If it sits in a folder, that’s on the week, not the file.`
			}],
			gumroadDescription: `${title}. ${format.tagline(hook)} Built for ${niche.audience} Includes the sequence, the language, and a written answer to “${niche.objection}”`,
			tags: [
				...niche.tags,
				format.type,
				hook.toLowerCase().replace(/\s+/g, "-")
			]
		};
		attempt += 1;
	} while (existingTitles.has(product.title) && attempt < 20);
	return product;
}
function peekFromFactory(serial, existingTitles) {
	const product = mintFromFactory(serial, existingTitles);
	return {
		title: product.title,
		niche: product.niche,
		type: product.type,
		priceUsd: product.priceUsd,
		tagline: product.tagline
	};
}
function productFromGenerated(raw) {
	return {
		id: uid("grok"),
		slug: slugify(raw.title),
		title: raw.title,
		tagline: raw.tagline,
		niche: raw.niche,
		type: raw.type,
		priceUsd: raw.priceUsd,
		audience: raw.audience,
		listed: true,
		source: "grok",
		createdAt: Date.now(),
		sections: raw.sections,
		salesPage: raw.salesPage,
		tweets: raw.tweets.slice(0, 4),
		emails: raw.emails.slice(0, 3),
		gumroadDescription: raw.gumroadDescription,
		tags: raw.tags.slice(0, 8)
	};
}
var defaultSettings = {
	operatorName: "Operator",
	shopName: "Nightshift Shop",
	payoutUrl: "",
	payoutLabel: "Pay"
};
function pushActivity(list, entry) {
	return [{
		id: uid("act"),
		at: Date.now(),
		...entry
	}, ...list].slice(0, 48);
}
function todayKey() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
var useNightshift = create()(persist((set, get) => ({
	hydrated: false,
	setHydrated: () => {
		const s = get();
		if (!s.sampleSeeded && s.sales.length === 0) {
			set({
				hydrated: true,
				sampleSeeded: true,
				sales: buildSampleSales(Date.now()),
				activity: pushActivity(s.activity, {
					kind: "system",
					title: "Sample ledger loaded",
					detail: "Ninety days of demo sales so the revenue desk has numbers. Remove any entry that isn’t yours."
				})
			});
			return;
		}
		set({
			hydrated: true,
			sampleSeeded: true
		});
	},
	products: SEED_PRODUCTS,
	sales: [],
	activity: [{
		id: "act_boot",
		at: Date.now(),
		kind: "system",
		title: "Floor is live",
		detail: "Six products already on the shelf. Set a payout link, then start the factory."
	}],
	settings: defaultSettings,
	autopilot: false,
	cycleLeft: 48,
	serial: 14,
	lastAiMintAt: 0,
	aiMintsToday: 0,
	aiMintsDay: todayKey(),
	deskOpen: false,
	sampleSeeded: false,
	setDeskOpen: (open) => set({ deskOpen: open }),
	toggleListed: (id) => set((s) => ({ products: s.products.map((p) => p.id === id ? {
		...p,
		listed: !p.listed
	} : p) })),
	updateProduct: (id, patch) => set((s) => ({ products: s.products.map((p) => p.id === id ? {
		...p,
		...patch
	} : p) })),
	removeProduct: (id) => set((s) => ({
		products: s.products.filter((p) => p.id !== id),
		activity: pushActivity(s.activity, {
			kind: "system",
			title: "Pulled from vault",
			detail: s.products.find((p) => p.id === id)?.title ?? id
		})
	})),
	addProduct: (product, kind) => {
		const s = get();
		if (s.products.length >= 28) return {
			ok: false,
			error: `Vault is at 28. Archive one before minting.`
		};
		set({
			products: [product, ...s.products],
			serial: s.serial + 1,
			activity: pushActivity(s.activity, {
				kind,
				title: `Minted · ${product.title}`,
				detail: `${product.niche} · $${product.priceUsd} · listed on the shop`
			})
		});
		return { ok: true };
	},
	mintLocal: () => {
		const s = get();
		if (s.products.length >= 28) {
			if (s.autopilot) set({
				autopilot: false,
				activity: pushActivity(s.activity, {
					kind: "system",
					title: "Autopilot paused",
					detail: "Vault is full. Archive a product to start the factory again."
				})
			});
			return {
				ok: false,
				error: `Vault is at 28. Archive one before minting.`
			};
		}
		const titles = new Set(s.products.map((p) => p.title));
		const product = mintFromFactory(s.serial, titles);
		set({
			products: [product, ...s.products],
			serial: s.serial + 1,
			cycleLeft: 48,
			activity: pushActivity(s.activity, {
				kind: "mint",
				title: `Factory minted · ${product.title}`,
				detail: `${product.niche} · $${product.priceUsd}`
			})
		});
		return {
			ok: true,
			product
		};
	},
	logSale: (productId, amount, note, extra) => set((s) => {
		const product = s.products.find((p) => p.id === productId);
		return {
			sales: [{
				id: uid("sale"),
				productId,
				amount,
				note,
				at: Date.now(),
				channel: extra?.channel ?? "manual",
				customer: extra?.customer?.trim() || void 0
			}, ...s.sales],
			activity: pushActivity(s.activity, {
				kind: "sale",
				title: `Collected $${amount}`,
				detail: product?.title ?? "Manual entry"
			})
		};
	}),
	removeSale: (id) => set((s) => ({ sales: s.sales.filter((x) => x.id !== id) })),
	clearSampleSales: () => set((s) => ({
		sales: s.sales.filter((sale) => !sale.sample),
		activity: pushActivity(s.activity, {
			kind: "system",
			title: "Sample sales removed",
			detail: "The desk now shows only money you logged."
		})
	})),
	setAutopilot: (on) => set((s) => ({
		autopilot: on,
		cycleLeft: on ? s.cycleLeft || 48 : s.cycleLeft,
		activity: pushActivity(s.activity, {
			kind: "cycle",
			title: on ? "Autopilot on" : "Autopilot off",
			detail: on ? "The factory will mint a new product each cycle and list it in the shop." : "Factory idle. Inventory stays as-is."
		})
	})),
	tick: () => {
		const s = get();
		if (!s.autopilot) return;
		if (s.cycleLeft <= 1) {
			get().mintLocal();
			return;
		}
		set({ cycleLeft: s.cycleLeft - 1 });
	},
	updateSettings: (patch) => set((s) => ({ settings: {
		...s.settings,
		...patch
	} })),
	noteAiMint: () => {
		const day = todayKey();
		const s = get();
		set({
			lastAiMintAt: Date.now(),
			aiMintsDay: day,
			aiMintsToday: s.aiMintsDay === day ? s.aiMintsToday + 1 : 1
		});
	}
}), {
	name: "nightshift.v1",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
	partialize: (s) => ({
		products: s.products,
		sales: s.sales,
		activity: s.activity,
		settings: s.settings,
		autopilot: s.autopilot,
		cycleLeft: s.cycleLeft,
		serial: s.serial,
		lastAiMintAt: s.lastAiMintAt,
		aiMintsToday: s.aiMintsToday,
		aiMintsDay: s.aiMintsDay,
		sampleSeeded: s.sampleSeeded
	})
}));
function catalogValue(products) {
	return products.filter((p) => p.listed).reduce((sum, p) => sum + p.priceUsd, 0);
}
function collected(sales) {
	return sales.reduce((sum, s) => sum + s.amount, 0);
}
function payUrl(product, fallback) {
	return product.checkoutUrl?.trim() || fallback;
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-6 text-card-foreground shadow-[var(--shadow-border)] focus:outline-none", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-4 right-4 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/70",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-6", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-2xl leading-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm leading-relaxed text-muted-foreground", className),
		...props
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-xs font-medium tracking-wide text-muted-foreground", className),
		...props
	});
}
function SettingsDialog({ open, onOpenChange }) {
	const settings = useNightshift((s) => s.settings);
	const updateSettings = useNightshift((s) => s.updateSettings);
	const [form, setForm] = (0, import_react.useState)(settings);
	(0, import_react.useEffect)(() => {
		if (open) setForm(settings);
	}, [open, settings]);
	function save() {
		updateSettings({
			operatorName: form.operatorName.trim() || "Operator",
			shopName: form.shopName.trim() || "Nightshift Shop",
			payoutUrl: form.payoutUrl.trim(),
			payoutLabel: form.payoutLabel.trim() || "Pay"
		});
		toast.success("Desk saved");
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Desk" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "The shop uses your name and payout link. Gumroad, Stripe Payment Link, PayPal.me, or any checkout URL works." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 flex flex-col gap-4",
			onSubmit: (e) => {
				e.preventDefault();
				save();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Operator name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.operatorName,
						onChange: (e) => setForm({
							...form,
							operatorName: e.target.value
						}),
						maxLength: 48
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Shop name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.shopName,
						onChange: (e) => setForm({
							...form,
							shopName: e.target.value
						}),
						maxLength: 48
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Payout link",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.payoutUrl,
						onChange: (e) => setForm({
							...form,
							payoutUrl: e.target.value
						}),
						placeholder: "https://gumroad.com/l/…",
						inputMode: "url"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Buy button label",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.payoutLabel,
						onChange: (e) => setForm({
							...form,
							payoutLabel: e.target.value
						}),
						maxLength: 24
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => onOpenChange(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Save desk"
					})]
				})
			]
		})] })
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
var NAV = [
	{
		href: "/",
		label: "Floor",
		icon: Activity
	},
	{
		href: "/factory",
		label: "Factory",
		icon: Factory
	},
	{
		href: "/vault",
		label: "Vault",
		icon: Library
	},
	{
		href: "/shop",
		label: "Shop",
		icon: Store
	},
	{
		href: "/ledger",
		label: "Revenue",
		icon: ChartLine
	}
];
function pathActive(path, href) {
	if (href === "/") return path === "/";
	return path === href || path.startsWith(`${href}/`);
}
function AutopilotRuntime() {
	const autopilot = useNightshift((s) => s.autopilot);
	const tick = useNightshift((s) => s.tick);
	const hydrated = useNightshift((s) => s.hydrated);
	(0, import_react.useEffect)(() => {
		if (!hydrated || !autopilot) return;
		const id = window.setInterval(() => tick(), 1e3);
		return () => window.clearInterval(id);
	}, [
		autopilot,
		tick,
		hydrated
	]);
	return null;
}
function AppShell({ children }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const shopMode = path === "/shop" || path.startsWith("/shop/");
	const deskOpen = useNightshift((s) => s.deskOpen);
	const setDeskOpen = useNightshift((s) => s.setDeskOpen);
	(0, import_react.useEffect)(() => {
		Promise.resolve(useNightshift.persist.rehydrate()).then(() => {
			useNightshift.getState().setHydrated();
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutopilotRuntime, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDialog, {
			open: deskOpen,
			onOpenChange: setDeskOpen
		}),
		shopMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorefrontFrame, {
			onSettings: () => setDeskOpen(true),
			children
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperatorFrame, {
			path,
			onSettings: () => setDeskOpen(true),
			children
		})
	] });
}
function BrandMark({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-baseline gap-2 no-underline",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-2xl leading-none tracking-tight text-foreground",
			children: "Nightshift"
		}), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden text-[11px] tracking-[0.18em] text-muted-foreground uppercase sm:inline",
			children: "After hours"
		}) : null]
	});
}
function OperatorFrame({ path, onSettings, children }) {
	const autopilot = useNightshift((s) => s.autopilot);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh min-w-0 flex-col overflow-x-clip lg:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-56 shrink-0 flex-col border-r border-border px-4 py-6 lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", autopilot ? "live-dot bg-success" : "bg-muted-foreground/50") }), autopilot ? "Factory running" : "Factory idle"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mt-8 flex flex-1 flex-col gap-1",
					children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
						...item,
						active: pathActive(path, item.href)
					}, item.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/playbook",
						className: cn("mt-4 flex h-11 items-center gap-2.5 rounded-md px-3 text-sm transition-colors duration-150", pathActive(path, "/playbook") ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), "Playbook"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "mt-4 w-full justify-start px-3",
					onClick: onSettings,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" }), "Desk settings"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mr-2 hidden items-center gap-2 text-[11px] text-muted-foreground sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", autopilot ? "live-dot bg-success" : "bg-muted-foreground/50") }), autopilot ? "Running" : "Idle"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: onSettings,
							"aria-label": "Desk settings",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-10 lg:py-8 lg:pb-8",
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] lg:hidden",
					children: NAV.map((item) => {
						const Icon = item.icon;
						const active = pathActive(path, item.href);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.href,
							className: cn("flex h-14 min-h-11 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] transition-colors duration-150", active ? "text-foreground" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
						}, item.href);
					})
				})
			]
		})]
	});
}
function NavLink({ href, label, icon: Icon, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: href,
		className: cn("flex h-11 items-center gap-2.5 rounded-md px-3 text-sm transition-colors duration-150", active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), label]
	});
}
function StorefrontFrame({ children, onSettings }) {
	const shopName = useNightshift((s) => s.settings.shopName);
	const operatorName = useNightshift((s) => s.settings.operatorName);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh min-w-0 overflow-x-clip",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.2em] text-muted-foreground uppercase",
						children: "Nightshift shop"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl leading-tight",
						children: shopName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["By ", operatorName]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "Floor"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon-sm",
						onClick: onSettings,
						"aria-label": "Desk settings",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" })
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-5xl px-4 py-8 sm:px-6",
			children
		})]
	});
}
var styles_default = "/assets/styles-I71UH0jc.css";
var APP_NAME = "Nightshift";
var Route$10 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Nightshift mints digital products, listings, and a shop while you sleep. You collect."
			},
			{
				name: "theme-color",
				content: "#09090b"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-right",
				richColors: false
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$8 = () => import("./routes-95mwh_2W.mjs");
var Route$9 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./factory-C-uLkhw_.mjs");
var Route$8 = createFileRoute("/factory")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./ledger-DP9H7b6q.mjs");
var Route$7 = createFileRoute("/ledger")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
function CopyButton({ label, text, variant = "ghost" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant,
		size: "icon-sm",
		"aria-label": `Copy ${label}`,
		onClick: async () => {
			await copyText(text);
			toast.success(`${label} copied`);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
	});
}
var Route$6 = createFileRoute("/playbook")({ component: PlaybookPage });
function PlaybookPage() {
	const week = buildLaunchWeek(useNightshift((s) => s.products));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
					children: "Playbook"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl tracking-tight",
					children: "How you get paid"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-base leading-relaxed text-muted-foreground",
					children: "Nightshift is a factory, not a bank. It cannot pull money out of the internet. It can mint inventory, write the listing, and host a shop with your checkout link. The cash still has to land in an account you own."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "01",
						title: "Put a payout URL on the desk",
						children: "Open desk settings. Paste a Gumroad product or profile, a Stripe Payment Link, PayPal.me, or any checkout page. The shop’s buy button becomes that URL. One link is enough to start — you can make per-product links later in the vault."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "02",
						title: "Let the mill fill the vault",
						children: "Start autopilot on the floor. Every cycle mints a complete product: the file, the sales page, three tweets, two emails. Or mint a custom one with Grok when you have a specific buyer in mind. Cap the vault before it gets sloppy — 28 is plenty."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "03",
						title: "List where people already pay",
						children: "Two paths. Share this shop after you publish the app. Or paste the Gumroad copy from a vault product into Gumroad / Etsy / your own site, attach the downloaded markdown as the file, and let those platforms collect. The second path usually converts better on day one because strangers already trust the checkout."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "04",
						title: "Fulfill, then log it",
						children: "When someone pays, send the download from the vault (or Gumroad delivers it). Then log the sale on the revenue desk. Catalog value is not income. The floor stays honest if you only type numbers that hit your account."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "This week’s launch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Written from whatever is listed right now. Copy a line, send it, then stop." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "flex flex-col",
				children: week.map((move) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4 border-t border-border py-4 first:border-t-0 first:pt-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-8 shrink-0 font-mono text-xs text-muted-foreground",
							children: move.day
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: move.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted-foreground",
								children: move.body
							})]
						}),
						move.copy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
							label: move.day,
							text: move.copy
						}) : null
					]
				}, move.day))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "What this will not do"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "It will not trade stocks, mint coins, or run ads against a budget you don’t have." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "It will not email a list you haven’t built or post to social networks for you." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "It will not invent buyers. You still send the shop to people who know you." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed",
						children: "What it will do is the part that usually stalls: making the thing, naming the price, and putting a page in front of someone. That’s the whole job of a night shift."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/factory",
						children: ["Open the mill", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: "Back to floor"
					})
				})]
			})
		]
	});
}
function Step({ n, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-xs text-muted-foreground",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl tracking-tight",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-muted-foreground",
			children
		})] })]
	});
}
var $$splitComponentImporter$5 = () => import("./shop-C1QSjShi.mjs");
var Route$5 = createFileRoute("/shop")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./vault-BeqmIyez.mjs");
var Route$4 = createFileRoute("/vault")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./shop.index-DCNYlMM2.mjs");
var Route$3 = createFileRoute("/shop/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./shop._id-CSwvUHhk.mjs");
var Route$2 = createFileRoute("/shop/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./vault.index-DNuK36RY.mjs");
var Route$1 = createFileRoute("/vault/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./vault._id-CsySL34B.mjs");
var Route = createFileRoute("/vault/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var FactoryRoute = Route$8.update({
	id: "/factory",
	path: "/factory",
	getParentRoute: () => Route$10
});
var LedgerRoute = Route$7.update({
	id: "/ledger",
	path: "/ledger",
	getParentRoute: () => Route$10
});
var PlaybookRoute = Route$6.update({
	id: "/playbook",
	path: "/playbook",
	getParentRoute: () => Route$10
});
var ShopRoute = Route$5.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$10
});
var VaultRoute = Route$4.update({
	id: "/vault",
	path: "/vault",
	getParentRoute: () => Route$10
});
var ShopIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => ShopRoute
});
var ShopIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ShopRoute
});
var VaultIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => VaultRoute
});
var VaultIdRoute = Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => VaultRoute
});
var ShopRouteChildren = {
	ShopIdRoute,
	ShopIndexRoute
};
var ShopRouteWithChildren = ShopRoute._addFileChildren(ShopRouteChildren);
var VaultRouteChildren = {
	VaultIdRoute,
	VaultIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	FactoryRoute,
	LedgerRoute,
	PlaybookRoute,
	ShopRoute: ShopRouteWithChildren,
	VaultRoute: VaultRoute._addFileChildren(VaultRouteChildren)
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		scrollRestoration: true
	});
}
//#endregion
export { downloadText as A, summarizeRevenue as B, CardContent as C, Button as D, CardTitle as E, isoDate as F, rangeFromCustom as I, rangeFromPreset as L, formatRangeLabel as M, formatUsd as N, cn as O, hasSampleSales as P, relativeTime as R, Card as S, CardHeader as T, listingsPack as _, Label as a, TooltipContent as b, collected as c, TRENDS as d, peekFromFactory as f, launchKit as g, gumroadListing as h, CopyButton as i, formatPct as j, copyText as k, payUrl as l, fulfillmentNote as m, Route as n, Input as o, productFromGenerated as p, Route$2 as r, catalogValue as s, router_exports as t, useNightshift as u, productToMarkdown as v, CardDescription as w, TooltipTrigger as x, Tooltip as y, slugify as z };
