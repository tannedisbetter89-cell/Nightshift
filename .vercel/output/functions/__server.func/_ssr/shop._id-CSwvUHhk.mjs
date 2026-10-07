import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as TYPE_LABEL } from "./types-C209mI6a.mjs";
import { d as ExternalLink, x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { D as Button, N as formatUsd, l as payUrl, r as Route$2, u as useNightshift } from "./router-DnJ1yfr_.mjs";
import { t as Badge } from "./badge-BpuM8F_E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop._id-CSwvUHhk.js
var import_jsx_runtime = require_jsx_runtime();
function ShopProduct() {
	const { id } = Route$2.useParams();
	const product = useNightshift((s) => s.products.find((p) => p.id === id && p.listed));
	const payoutUrl = useNightshift((s) => s.settings.payoutUrl);
	const payoutLabel = useNightshift((s) => s.settings.payoutLabel);
	const setDeskOpen = useNightshift((s) => s.setDeskOpen);
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "This listing is not on the floor."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		className: "mt-4",
		variant: "secondary",
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/shop",
			children: "Back to shop"
		})
	})] });
	const checkout = payUrl(product, payoutUrl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto flex max-w-2xl flex-col gap-8 pb-24 sm:pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Shop"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "mt-4",
					children: TYPE_LABEL[product.type]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-4xl tracking-tight",
					children: product.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base leading-relaxed text-muted-foreground",
					children: product.tagline
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-4xl tabular-nums",
					children: formatUsd(product.priceUsd)
				}), checkout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: checkout,
						target: "_blank",
						rel: "noreferrer",
						children: [
							payoutLabel,
							" · ",
							formatUsd(product.priceUsd),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setDeskOpen(true),
					className: "text-sm text-muted-foreground underline-offset-4 hover:underline",
					children: "Payout link not set"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed",
				children: product.salesPage
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: ["For ", product.audience]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "What’s inside"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 flex flex-col gap-3",
				children: product.sections.map((section, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 border-t border-border pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-muted-foreground",
						children: String(i + 1).padStart(2, "0")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: section.heading
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-sm text-muted-foreground",
						children: section.body
					})] })]
				}, section.heading))
			})] }),
			product.tags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: product.tags.join(" · ")
			}) : null,
			checkout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-muted-foreground",
				children: "After you pay, write the product name in the payment note. The operator sends the file from the vault."
			}) : null,
			checkout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: checkout,
						target: "_blank",
						rel: "noreferrer",
						children: [
							payoutLabel,
							" · ",
							formatUsd(product.priceUsd),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
						]
					})
				})
			}) : null
		]
	});
}
//#endregion
export { ShopProduct as component };
