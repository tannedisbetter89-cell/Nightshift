import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as TYPE_LABEL } from "./types-C209mI6a.mjs";
import { b as ArrowRight, i as Store, o as Play, u as Factory } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as CardContent, D as Button, E as CardTitle, N as formatUsd, R as relativeTime, S as Card, T as CardHeader, c as collected, d as TRENDS, f as peekFromFactory, s as catalogValue, u as useNightshift, w as CardDescription } from "./router-DnJ1yfr_.mjs";
import { t as Badge } from "./badge-BpuM8F_E.mjs";
import { t as Switch } from "./switch-h90QtvDY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-95mwh_2W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Floor() {
	const products = useNightshift((s) => s.products);
	const sales = useNightshift((s) => s.sales);
	const activity = useNightshift((s) => s.activity);
	const autopilot = useNightshift((s) => s.autopilot);
	const cycleLeft = useNightshift((s) => s.cycleLeft);
	const serial = useNightshift((s) => s.serial);
	const setAutopilot = useNightshift((s) => s.setAutopilot);
	const setDeskOpen = useNightshift((s) => s.setDeskOpen);
	const mintLocal = useNightshift((s) => s.mintLocal);
	const payoutUrl = useNightshift((s) => s.settings.payoutUrl);
	const listed = products.filter((p) => p.listed).length;
	const value = catalogValue(products);
	const cash = collected(sales);
	const next = (0, import_react.useMemo)(() => peekFromFactory(serial, new Set(products.map((p) => p.title))), [serial, products]);
	function onMint() {
		const result = mintLocal();
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		toast.success(`Minted ${result.product.title}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
							children: "Floor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl",
							children: "The factory that mints while you sleep."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base leading-relaxed text-muted-foreground",
							children: "Nightshift builds digital products, listings, and a shop. You set a payout link, share the shop, and log the money when it lands. The machine does the inventory."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-12 items-center justify-between gap-3 rounded-md bg-card px-4 shadow-[var(--shadow-border)] sm:min-w-52",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "Autopilot"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: autopilot,
							onCheckedChange: (on) => {
								setAutopilot(on);
								toast.message(on ? "Factory running" : "Factory idle");
							},
							"aria-label": "Toggle autopilot"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: onMint,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factory, { className: "size-4" }), "Mint now"]
					})]
				})]
			}),
			!payoutUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setDeskOpen(true),
				className: "flex flex-col gap-1 rounded-xl bg-card px-5 py-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: "Set a payout link"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: "Gumroad, Stripe Payment Link, or PayPal.me. The shop’s buy button stays closed until this is on the desk."
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Catalog",
						value: formatUsd(value),
						hint: `${listed} live on shop`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Collected",
						value: formatUsd(cash),
						hint: `${sales.length} logged sales`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Vault",
						value: String(products.length),
						hint: "products minted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] tracking-[0.18em] text-muted-foreground uppercase",
								children: "Next cycle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MillRing, {
									seconds: cycleLeft,
									total: 48,
									running: autopilot
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-3xl leading-none tracking-tight tabular-nums sm:text-4xl",
									children: autopilot ? formatClock(cycleLeft) : "Idle"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: autopilot ? `every 48s` : "start autopilot"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "How the money actually arrives" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Autopilot cannot charge a stranger’s card. It can fill a shop with things people pay for. Three moves:" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
								n: "01",
								title: "Set a payout link",
								done: Boolean(payoutUrl),
								children: "Gumroad, Stripe Payment Link, PayPal.me — one URL. Desk settings, top right."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
								n: "02",
								title: "Let the factory mint",
								done: products.length > 6,
								children: "Autopilot lists a new product each cycle. Or mint one now. Custom work uses Grok on the factory floor."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
								n: "03",
								title: "Share the shop and log the sale",
								done: sales.length > 0,
								children: "Send people to Shop. When the payment lands, record it on the revenue desk so the floor stays honest."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/shop",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-4" }), "Open shop"]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/playbook",
										children: ["Playbook", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
									})
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-center justify-between space-y-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Activity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "What the desk just did." })] }), autopilot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "live",
							children: "Live"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "idle",
							children: "Idle"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "flex flex-col gap-3",
						children: activity.slice(0, 7).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-t border-border pt-3 first:border-t-0 first:pt-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-snug",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted-foreground",
									children: item.detail
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-[11px] text-muted-foreground/80",
									children: relativeTime(item.at)
								})
							]
						}, item.id))
					}) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "On the press" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Next mint from the mill. Autopilot will list this when the cycle closes." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: TYPE_LABEL[next.type]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-2xl leading-snug tracking-tight",
						children: next.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: next.tagline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 font-mono text-sm tabular-nums text-muted-foreground",
						children: [
							next.niche,
							" · ",
							formatUsd(next.priceUsd)
						]
					})
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Machines" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Four desks. One shift." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Machine, {
							title: "Product mill",
							status: autopilot ? "Minting" : "Standby",
							to: "/factory"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Machine, {
							title: "Launch desk",
							status: "Copy ready",
							to: "/vault"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Machine, {
							title: "Shop",
							status: payoutUrl ? "Payout set" : "Needs payout link",
							to: "/shop"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Machine, {
							title: "Revenue",
							status: cash ? `${formatUsd(cash)} in` : "No sales yet",
							to: "/ledger"
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-4 md:grid-cols-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Radar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Niches the mill prefers next." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "grid gap-3 sm:grid-cols-2",
						children: [TRENDS.slice(0, 6).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm",
									children: t.niche
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: t.note
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Demand, { value: t.demand })]
						}, t.niche)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "mt-2 sm:col-span-2",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/factory",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Run the mill"]
							})
						})]
					})]
				})
			})
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.18em] text-muted-foreground uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-3xl leading-none tracking-tight tabular-nums sm:text-4xl",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function Step({ n, title, children, done }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-xs text-muted-foreground",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm",
			children: [title, done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-2 text-[11px] tracking-wide text-success uppercase",
				children: "Done"
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm leading-relaxed text-muted-foreground",
			children
		})] })]
	});
}
function Machine({ title, status, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "flex min-w-0 items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-3 transition-colors duration-150 hover:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shrink-0 text-xs text-muted-foreground",
			children: status
		})]
	});
}
function Demand({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex w-20 shrink-0 items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1 flex-1 overflow-hidden rounded-full bg-secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-accent",
				style: { width: `${value}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-6 text-right font-mono text-[11px] tabular-nums text-muted-foreground",
			children: value
		})]
	});
}
function MillRing({ seconds, total, running }) {
	const r = 16;
	const c = 2 * Math.PI * r;
	const progress = running ? (total - seconds) / total : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 40 40",
		className: "size-9 shrink-0 -rotate-90",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "20",
			cy: "20",
			r,
			fill: "none",
			stroke: "currentColor",
			className: "text-secondary",
			strokeWidth: "3"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "20",
			cy: "20",
			r,
			fill: "none",
			stroke: "currentColor",
			className: "text-accent",
			strokeWidth: "3",
			strokeDasharray: c,
			strokeDashoffset: c * (1 - progress),
			strokeLinecap: "round"
		})]
	});
}
function formatClock(seconds) {
	return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
}
//#endregion
export { Floor as component };
