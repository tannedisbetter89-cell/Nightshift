import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as TYPE_LABEL } from "./types-C209mI6a.mjs";
import { N as formatUsd } from "./router-DnJ1yfr_.mjs";
import { t as Badge } from "./badge-BpuM8F_E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-DkTZiQ6s.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		params: { id: product.id },
		className: "group flex flex-col rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:shadow-[var(--shadow-border-hover)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: TYPE_LABEL[product.type]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-sm tabular-nums text-muted-foreground",
					children: formatUsd(product.priceUsd)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 font-display text-2xl leading-snug tracking-tight group-hover:text-accent",
				children: product.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground",
				children: product.tagline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
				children: product.niche
			})
		]
	});
}
//#endregion
export { ProductCard as t };
