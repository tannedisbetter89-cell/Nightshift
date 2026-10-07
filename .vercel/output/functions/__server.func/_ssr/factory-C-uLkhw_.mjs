import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as TYPE_LABEL, r as PRODUCT_TYPES } from "./types-C209mI6a.mjs";
import { p as Cpu, u as Factory } from "../_libs/lucide-react.mjs";
import { a as object, o as string, t as _enum } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as CardContent, D as Button, E as CardTitle, N as formatUsd, O as cn, S as Card, T as CardHeader, a as Label, d as TRENDS, f as peekFromFactory, p as productFromGenerated, u as useNightshift, w as CardDescription } from "./router-DnJ1yfr_.mjs";
import { t as Badge } from "./badge-BpuM8F_E.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BBY1Tm5e.mjs";
import { t as Switch } from "./switch-h90QtvDY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/factory-C-uLkhw_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MintInput = object({
	brief: string().min(12).max(480),
	type: _enum(PRODUCT_TYPES)
});
var mintWithGrok = createServerFn({ method: "POST" }).validator((input) => MintInput.parse(input)).handler(createSsrRpc("460e3b767bef517ddce3134ffd3255b1ee36d1d8869e716a7334cb239cea598e"));
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-md bg-secondary px-3 py-2.5 text-sm text-foreground shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
var AI_DAILY_CAP = 6;
var AI_COOLDOWN_MS = 25e3;
function FactoryPage() {
	const autopilot = useNightshift((s) => s.autopilot);
	const cycleLeft = useNightshift((s) => s.cycleLeft);
	const setAutopilot = useNightshift((s) => s.setAutopilot);
	const mintLocal = useNightshift((s) => s.mintLocal);
	const addProduct = useNightshift((s) => s.addProduct);
	const noteAiMint = useNightshift((s) => s.noteAiMint);
	const lastAiMintAt = useNightshift((s) => s.lastAiMintAt);
	const aiMintsToday = useNightshift((s) => s.aiMintsToday);
	const aiMintsDay = useNightshift((s) => s.aiMintsDay);
	const products = useNightshift((s) => s.products);
	const serial = useNightshift((s) => s.serial);
	const count = products.length;
	const [brief, setBrief] = (0, import_react.useState)("A kit for independents who want to stop billing hourly and sell a named artifact instead.");
	const [type, setType] = (0, import_react.useState)("template-kit");
	const [pending, setPending] = (0, import_react.useState)(false);
	const next = (0, import_react.useMemo)(() => peekFromFactory(serial, new Set(products.map((p) => p.title))), [serial, products]);
	const usedToday = aiMintsDay === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) ? aiMintsToday : 0;
	const cooldown = Math.max(0, AI_COOLDOWN_MS - (Date.now() - lastAiMintAt));
	function onMint() {
		const result = mintLocal();
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		toast.success(`Minted ${result.product.title}`);
	}
	async function onGrok() {
		if (usedToday >= AI_DAILY_CAP) {
			toast.error("Daily Grok mints are used. The local mill still runs.");
			return;
		}
		if (cooldown > 0) {
			toast.error("Give the mill a few seconds.");
			return;
		}
		setPending(true);
		try {
			const result = await mintWithGrok({ data: {
				brief: brief.trim(),
				type
			} });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			const product = productFromGenerated(result.product);
			const added = addProduct(product, "mint");
			if (!added.ok) {
				toast.error(added.error);
				return;
			}
			noteAiMint();
			toast.success(`Grok minted ${product.title}`);
		} catch {
			toast.error("Mint failed. Try again.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
					children: "Factory"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl tracking-tight",
					children: "The mill"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
					children: "Autopilot mints from the local press — no quota, one product per cycle. Custom mint spends a Grok call and writes a one-off product from your brief."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Autopilot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
					count,
					"/",
					28,
					" in the vault. Each cycle lists a new product in the shop."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg bg-secondary/70 px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "Factory"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: autopilot ? `Next mint in ${cycleLeft}s` : "Idle"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: autopilot,
								onCheckedChange: setAutopilot,
								"aria-label": "Toggle autopilot"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1 overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-accent transition-[width] duration-1000 ease-linear",
								style: { width: autopilot ? `${(48 - cycleLeft) / 48 * 100}%` : "0%" }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-secondary/50 px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
									children: "Up next"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm leading-snug",
										children: next.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: TYPE_LABEL[next.type]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										next.niche,
										" · ",
										formatUsd(next.priceUsd)
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: onMint,
							variant: "secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factory, { className: "size-4" }), "Mint from the press"]
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Custom mint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
					usedToday,
					"/",
					AI_DAILY_CAP,
					" Grok mints today. Keep the brief specific — who it’s for and what they walk away holding."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: type,
								onValueChange: (v) => setType(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRODUCT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: t,
									children: TYPE_LABEL[t]
								}, t)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Brief" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: brief,
								onChange: (e) => setBrief(e.target.value),
								maxLength: 480,
								rows: 5
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: onGrok,
							disabled: pending || brief.trim().length < 12,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-4" }), pending ? "Minting…" : "Mint with Grok"]
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Radar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "The press weights these desks when it picks a niche. Tap to fill the brief." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "grid gap-3 sm:grid-cols-2",
				children: TRENDS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "rounded-lg bg-secondary/60 px-4 py-3 text-left transition-colors duration-150 hover:bg-secondary",
					onClick: () => {
						setBrief(`A ${TYPE_LABEL[type].toLowerCase()} for ${t.note} Make it specific, usable in one sitting, and priced like a tool not a course.`);
						toast.message(`Brief pointed at ${t.niche}`);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: t.niche
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] text-muted-foreground",
							children: t.demand
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted-foreground",
						children: t.note
					})]
				}, t.niche))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Finished products land in the",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vault",
						className: "text-foreground underline-offset-4 hover:underline",
						children: "vault"
					}),
					" ",
					"and, if listed, on the shop."
				]
			})
		]
	});
}
//#endregion
export { FactoryPage as component };
