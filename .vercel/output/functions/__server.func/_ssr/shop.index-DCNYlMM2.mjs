import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as Link2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, k as copyText, u as useNightshift } from "./router-DnJ1yfr_.mjs";
import { t as ProductCard } from "./product-card-DkTZiQ6s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop.index-DCNYlMM2.js
var import_jsx_runtime = require_jsx_runtime();
function ShopPage() {
	const products = useNightshift((s) => s.products).filter((p) => p.listed);
	const shopName = useNightshift((s) => s.settings.shopName);
	const payoutUrl = useNightshift((s) => s.settings.payoutUrl);
	const setDeskOpen = useNightshift((s) => s.setDeskOpen);
	async function shareShop() {
		const url = `${window.location.origin}/shop`;
		await copyText(url);
		toast.success("Shop link copied");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl tracking-tight",
						children: shopName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: "Digital products minted on the Nightshift press. Instant files — guides, kits, prompts, and desks you can use the same day."
					}),
					!payoutUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setDeskOpen(true),
						className: "mt-3 text-left text-sm text-warn underline-offset-4 hover:underline",
						children: "Payout link is not set. Buy buttons stay closed until you add one in desk settings."
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				onClick: shareShop,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" }), "Copy shop link"]
			})]
		}), products.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Nothing listed. Turn on listing in the vault."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
				product,
				to: "/shop/$id"
			}, product.id))
		})]
	});
}
//#endregion
export { ShopPage as component };
