import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as TYPE_LABEL } from "./types-C209mI6a.mjs";
import { f as Download } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as downloadText, D as Button, _ as listingsPack, u as useNightshift } from "./router-DnJ1yfr_.mjs";
import { t as ProductCard } from "./product-card-DkTZiQ6s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault.index-DNuK36RY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	"all",
	"guide",
	"template-kit",
	"prompt-pack",
	"checklist",
	"sop",
	"script-pack"
];
function VaultPage() {
	const products = useNightshift((s) => s.products);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const list = (0, import_react.useMemo)(() => filter === "all" ? products : products.filter((p) => p.type === filter), [products, filter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
						children: "Vault"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl tracking-tight",
						children: "Inventory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
						children: "Full files, launch tweets, emails, Gumroad copy. Download from a product. The shop only shows the storefront."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: () => {
						downloadText("nightshift-listings.md", listingsPack(list));
						toast.success("Listings downloaded");
					},
					disabled: list.length === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download listings"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1",
				children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: filter === f ? "default" : "secondary",
					onClick: () => setFilter(f),
					children: f === "all" ? "All" : TYPE_LABEL[f]
				}, f))
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Nothing in this drawer. Mint from the factory."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
				children: list.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
					product,
					to: "/vault/$id"
				}, product.id))
			})
		]
	});
}
//#endregion
export { VaultPage as component };
