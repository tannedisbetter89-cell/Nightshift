import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as TYPE_LABEL } from "./types-C209mI6a.mjs";
import { f as Download, i as Store, m as Copy, r as Trash2, x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as downloadText, C as CardContent, D as Button, E as CardTitle, N as formatUsd, S as Card, T as CardHeader, a as Label, g as launchKit, h as gumroadListing, i as CopyButton, k as copyText, n as Route, o as Input, u as useNightshift, v as productToMarkdown, z as slugify } from "./router-DnJ1yfr_.mjs";
import { t as Badge } from "./badge-BpuM8F_E.mjs";
import { t as Switch } from "./switch-h90QtvDY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault._id-CsySL34B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VaultProduct() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const product = useNightshift((s) => s.products.find((p) => p.id === id));
	const toggleListed = useNightshift((s) => s.toggleListed);
	const removeProduct = useNightshift((s) => s.removeProduct);
	const updateProduct = useNightshift((s) => s.updateProduct);
	const [checkout, setCheckout] = (0, import_react.useState)(product?.checkoutUrl ?? "");
	(0, import_react.useEffect)(() => {
		setCheckout(product?.checkoutUrl ?? "");
	}, [product?.checkoutUrl]);
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "That product is gone."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4",
			variant: "secondary",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/vault",
				children: "Back to vault"
			})
		})]
	});
	async function copy(label, text) {
		await copyText(text);
		toast.success(`${label} copied`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/vault",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Vault"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: TYPE_LABEL[product.type]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: product.listed ? "live" : "idle",
							children: product.listed ? "Listed" : "Unlisted"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "default",
							children: product.source === "grok" ? "Grok" : product.source
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-4xl tracking-tight",
					children: product.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base leading-relaxed text-muted-foreground",
					children: product.tagline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 font-display text-3xl tabular-nums",
					children: formatUsd(product.priceUsd)
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => downloadText(`${slugify(product.title) || "product"}.md`, productToMarkdown(product)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download file"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => copy("Gumroad listing", gumroadListing(product)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy Gumroad"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => copy("Launch kit", launchKit(product)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy launch kit"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/shop/$id",
							params: { id: product.id },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-4" }), "View in shop"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex h-12 items-center justify-between gap-3 rounded-md bg-card px-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm",
					children: "List on shop"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: product.listed,
					onCheckedChange: () => toggleListed(product.id),
					"aria-label": "List on shop"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-2 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				onSubmit: (e) => {
					e.preventDefault();
					updateProduct(product.id, { checkoutUrl: checkout.trim() || void 0 });
					toast.success(checkout.trim() ? "Checkout saved" : "Using desk payout link");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "checkout",
						children: "Product checkout URL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-muted-foreground",
						children: "Optional. A Gumroad or Stripe link for this product. Empty uses the desk payout link."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "checkout",
							value: checkout,
							onChange: (e) => setCheckout(e.target.value),
							placeholder: "https://gumroad.com/l/…",
							inputMode: "url"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							className: "sm:w-auto",
							children: "Save"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex flex-col gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed",
						children: product.salesPage
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: "For "
						}), product.audience]
					}),
					product.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: section.heading
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground",
						children: section.body
					})] }, section.heading))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Launch tweets" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "flex flex-col gap-3",
				children: product.tweets.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2 rounded-md bg-secondary/70 px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "min-w-0 flex-1 text-sm leading-relaxed",
						children: t
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
						label: `Tweet ${i + 1}`,
						text: t
					})]
				}, t))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Emails" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "flex flex-col gap-4",
				children: product.emails.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: e.subject
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted-foreground",
							children: e.body
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
						label: "Email",
						text: `Subject: ${e.subject}\n\n${e.body}`
					})]
				}, e.subject))
			})] }),
			product.source !== "seed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				className: "self-start text-destructive",
				onClick: () => {
					removeProduct(product.id);
					toast.message("Archived");
					navigate({ to: "/vault" });
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Archive"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Seed inventory stays in the vault. Unlist it from the shop if you don’t want it public."
			})
		]
	});
}
//#endregion
export { VaultProduct as component };
