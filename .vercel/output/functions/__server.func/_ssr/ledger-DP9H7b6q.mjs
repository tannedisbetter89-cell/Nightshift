import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CHANNEL_LABEL, t as CHANNELS } from "./types-C209mI6a.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as CardContent, D as Button, E as CardTitle, N as formatUsd, R as relativeTime, S as Card, T as CardHeader, a as Label, c as collected, k as copyText, m as fulfillmentNote, o as Input, u as useNightshift, w as CardDescription } from "./router-DnJ1yfr_.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BBY1Tm5e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ledger-DP9H7b6q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RevenueDesk = (0, import_react.lazy)(() => import("./revenue-desk-Bmo627UD.mjs").then((m) => ({ default: m.RevenueDesk })));
function LedgerPage() {
	const products = useNightshift((s) => s.products);
	const sales = useNightshift((s) => s.sales);
	const logSale = useNightshift((s) => s.logSale);
	const removeSale = useNightshift((s) => s.removeSale);
	const clearSampleSales = useNightshift((s) => s.clearSampleSales);
	const cash = collected(sales);
	const [productId, setProductId] = (0, import_react.useState)(products[0]?.id ?? "");
	const [amount, setAmount] = (0, import_react.useState)(products[0]?.priceUsd.toString() ?? "29");
	const [note, setNote] = (0, import_react.useState)("");
	const [customer, setCustomer] = (0, import_react.useState)("");
	const [channel, setChannel] = (0, import_react.useState)("manual");
	const selected = products.find((p) => p.id === productId);
	function submit(e) {
		e.preventDefault();
		const n = Number(amount);
		if (!productId || !Number.isFinite(n) || n <= 0) {
			toast.error("Enter a real amount.");
			return;
		}
		logSale(productId, Math.round(n * 100) / 100, note.trim(), {
			channel,
			customer: customer.trim()
		});
		setNote("");
		toast.success("Sale logged");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
					children: "Revenue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl tracking-tight",
					children: "The desk"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 rounded-xl bg-card shadow-[var(--shadow-border)]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 rounded-xl bg-card shadow-[var(--shadow-border)]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 rounded-xl bg-card shadow-[var(--shadow-border)]" })
					]
				})]
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevenueDesk, {
				sales,
				products,
				onClearSample: () => {
					clearSampleSales();
					toast.message("Sample sales removed");
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-4 lg:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Log a sale" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "When Gumroad, Stripe, or PayPal pays you, write it down here. Catalog value is not cash." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-col gap-3",
					onSubmit: submit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: productId,
								onValueChange: (id) => {
									setProductId(id);
									const p = products.find((x) => x.id === id);
									if (p) setAmount(String(p.priceUsd));
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a product" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: p.id,
									children: p.title
								}, p.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount (USD)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: amount,
									onChange: (e) => setAmount(e.target.value),
									inputMode: "decimal"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Channel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: channel,
									onValueChange: (value) => setChannel(value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CHANNELS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: item,
										children: CHANNEL_LABEL[item]
									}, item)) })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Buyer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: customer,
									onChange: (e) => setCustomer(e.target.value),
									placeholder: "Optional name",
									maxLength: 48
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: note,
									onChange: (e) => setNote(e.target.value),
									placeholder: "Gumroad · order 1842",
									maxLength: 80
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Log sale"
							}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "secondary",
								onClick: async () => {
									await copyText(fulfillmentNote(selected));
									toast.success("Fulfillment note copied");
								},
								children: "Copy fulfillment note"
							}) : null]
						})
					]
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Entries" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
					sales.length,
					" logged · ",
					formatUsd(cash),
					" all-time"
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: sales.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No cash logged yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex max-h-96 flex-col overflow-y-auto",
					children: sales.slice(0, 24).map((sale) => {
						const product = products.find((p) => p.id === sale.productId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start justify-between gap-3 border-t border-border py-3 first:border-t-0 first:pt-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm",
									children: product?.title ?? "Removed product"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: [
										sale.customer ? `${sale.customer} · ` : "",
										CHANNEL_LABEL[sale.channel ?? "manual"],
										" · ",
										sale.note || "No note",
										" ·",
										" ",
										relativeTime(sale.at)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm tabular-nums",
									children: formatUsd(sale.amount)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => removeSale(sale.id),
									children: "Remove"
								})]
							})]
						}, sale.id);
					})
				}) })]
			})]
		})]
	});
}
//#endregion
export { LedgerPage as component };
