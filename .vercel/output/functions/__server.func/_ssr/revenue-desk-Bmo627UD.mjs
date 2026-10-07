import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CHANNEL_LABEL, t as CHANNELS } from "./types-C209mI6a.mjs";
import { S as ArrowDownRight, l as Info, y as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { B as summarizeRevenue, C as CardContent, D as Button, E as CardTitle, F as isoDate, I as rangeFromCustom, L as rangeFromPreset, M as formatRangeLabel, N as formatUsd, O as cn, P as hasSampleSales, S as Card, T as CardHeader, b as TooltipContent, j as formatPct, w as CardDescription, x as TooltipTrigger, y as Tooltip } from "./router-DnJ1yfr_.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip$1, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/revenue-desk-Bmo627UD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRESETS = [
	{
		id: "7d",
		label: "7d"
	},
	{
		id: "30d",
		label: "30d"
	},
	{
		id: "90d",
		label: "90d"
	},
	{
		id: "ytd",
		label: "YTD"
	}
];
function RevenueDesk({ sales, products, onClearSample }) {
	const [preset, setPreset] = (0, import_react.useState)("30d");
	const [fromIso, setFromIso] = (0, import_react.useState)(() => isoDate(Date.now() - 25056e5));
	const [toIso, setToIso] = (0, import_react.useState)(() => isoDate(Date.now()));
	const [tab, setTab] = (0, import_react.useState)("product");
	const range = (0, import_react.useMemo)(() => {
		if (preset === "custom") return rangeFromCustom(fromIso, toIso);
		return rangeFromPreset(preset);
	}, [
		preset,
		fromIso,
		toIso
	]);
	const summary = (0, import_react.useMemo)(() => summarizeRevenue(sales, products, range), [
		sales,
		products,
		range
	]);
	const rows = tab === "product" ? summary.byProduct : tab === "niche" ? summary.byNiche : summary.byChannel;
	const sample = hasSampleSales(sales);
	function pickPreset(next) {
		const nextRange = rangeFromPreset(next);
		setPreset(next);
		setFromIso(isoDate(nextRange.from));
		setToIso(isoDate(nextRange.to - 1));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
							children: "Revenue"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-4xl tracking-tight sm:text-5xl",
							children: "The desk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
							children: "Cash that actually landed, sliced by window. Growth is versus the same-length stretch before this one. Churn is buyers from that prior window who did not come back."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeControls, {
					preset,
					fromIso,
					toIso,
					onPreset: pickPreset,
					onCustom: (from, to) => {
						setPreset("custom");
						setFromIso(from);
						setToIso(to);
					}
				})]
			}),
			sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-xl bg-card px-5 py-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: "Sample sales are loaded so the charts have a pulse. Log a real one below, or strip the demo numbers."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: onClearSample,
					className: "shrink-0",
					children: "Remove sample sales"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					formatRangeLabel(summary.range),
					" · vs ",
					formatRangeLabel(summary.prior)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Revenue",
						value: formatUsd(summary.revenue),
						hint: `${summary.orders} orders · AOV ${formatUsd(summary.aov || 0)}`,
						delta: summary.growth,
						spark: summary.trend.map((p) => p.revenue),
						tooltip: "Sum of logged sales inside the selected dates. Catalog value on the floor is inventory, not this number."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Growth",
						value: formatPct(summary.growth, true),
						hint: summary.growth === null ? "No prior-window revenue to compare" : `${formatUsd(summary.priorRevenue)} in the prior window`,
						delta: summary.growth,
						tooltip: "Percent change versus the previous window of equal length. New means the prior window was empty."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Churn",
						value: formatPct(summary.churn),
						hint: summary.churn === null ? "No prior buyers in the last window" : `${summary.churnedCustomers} of ${summary.priorCustomers} buyers quiet · ${formatUsd(summary.churnedRevenue)}`,
						delta: summary.churn === null ? 0 : -summary.churn,
						invert: true,
						tooltip: "Share of prior-window buyers who did not purchase again in this window. Lower is healthier."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-start justify-between gap-3 space-y-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Trend" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "This window against the prior stretch, bucketed to stay readable." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
								className: "bg-accent",
								label: "Revenue"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
								className: "bg-muted-foreground/50",
								label: "Prior"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, { points: summary.trend }) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Mix" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
						summary.newCustomers,
						" new buyers · ",
						summary.returningCustomers,
						" returning"
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelMix, { rows: summary.byChannel }) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Breakdown" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Share of this window, with growth versus the last one." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						["product", "Product"],
						["niche", "Niche"],
						["channel", "Channel"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: tab === id ? "default" : "secondary",
						onClick: () => setTab(id),
						children: label
					}, id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreakdownTable, { rows }) })] })
		]
	});
}
function RangeControls({ preset, fromIso, toIso, onPreset, onCustom }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "-mx-1 flex gap-2 overflow-x-auto px-1 pb-1",
			children: [PRESETS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				variant: preset === item.id ? "default" : "secondary",
				className: "shrink-0",
				onClick: () => onPreset(item.id),
				children: item.label
			}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				variant: preset === "custom" ? "default" : "secondary",
				className: "shrink-0",
				onClick: () => onCustom(fromIso, toIso),
				children: "Custom"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-w-0 flex-col gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
					children: "From"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: fromIso,
					onChange: (e) => onCustom(e.target.value, toIso),
					className: "h-11 rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)] focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:outline-none"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-w-0 flex-col gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
					children: "To"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: toIso,
					onChange: (e) => onCustom(fromIso, e.target.value),
					className: "h-11 rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)] focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:outline-none"
				})]
			})]
		})]
	});
}
function KpiCard({ label, value, hint, delta, spark, tooltip, invert = false }) {
	const up = (delta ?? 0) > 5e-4;
	const down = (delta ?? 0) < -5e-4;
	const good = invert ? down : up;
	const bad = invert ? up : down;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.18em] text-muted-foreground uppercase",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground",
						"aria-label": `${label} definition`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3.5" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: tooltip })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl leading-none tracking-tight tabular-nums sm:text-4xl",
					children: value
				}), spark && spark.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, { values: spark }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 flex items-center gap-1.5 text-xs text-muted-foreground",
				children: [delta === null ? null : good ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5 text-success" }) : bad ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "size-3.5 text-destructive" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn(good && "text-success", bad && "text-destructive"),
					children: hint
				})]
			})
		]
	});
}
function Sparkline({ values }) {
	const max = Math.max(1, ...values);
	const w = 88;
	const h = 32;
	const step = values.length > 1 ? w / (values.length - 1) : w;
	const d = values.map((v, i) => {
		const x = i * step;
		const y = h - v / max * 28 - 2;
		return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: "mb-1 h-8 w-20 shrink-0 text-accent",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round"
		})
	});
}
function LegendDot({ className, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", className) }), label]
	});
}
function TrendChart({ points }) {
	if (points.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "No sales in this window."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-64 w-full min-w-0 sm:h-72",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data: points,
				margin: {
					top: 8,
					right: 8,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "revFill",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "var(--color-accent)",
							stopOpacity: .28
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "var(--color-accent)",
							stopOpacity: 0
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						vertical: false,
						stroke: "color-mix(in oklab, var(--color-foreground) 8%, transparent)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						tickLine: false,
						axisLine: false,
						interval: "preserveStartEnd",
						minTickGap: 28,
						tick: {
							fill: "var(--color-muted-foreground)",
							fontSize: 11
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tickLine: false,
						axisLine: false,
						width: 44,
						tickFormatter: (v) => v >= 1e3 ? `${Math.round(v / 100) / 10}k` : `${v}`,
						tick: {
							fill: "var(--color-muted-foreground)",
							fontSize: 11
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip$1, {
						content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {}),
						cursor: { stroke: "var(--color-border)" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "priorRevenue",
						name: "Prior",
						stroke: "color-mix(in oklab, var(--color-muted-foreground) 70%, transparent)",
						strokeDasharray: "4 4",
						fill: "transparent",
						strokeWidth: 1.5,
						dot: false,
						activeDot: { r: 3 }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "revenue",
						name: "Revenue",
						stroke: "var(--color-accent)",
						fill: "url(#revFill)",
						strokeWidth: 2,
						dot: false,
						activeDot: { r: 4 }
					})
				]
			})
		})
	});
}
function ChartTooltip({ active, payload, label }) {
	if (!active || !payload?.length) return null;
	const orders = payload[0]?.payload?.orders ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-popover px-3 py-2 text-xs shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: label
			}),
			payload.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 tabular-nums text-popover-foreground",
				children: [
					item.name,
					": ",
					formatUsd(Number(item.value ?? 0))
				]
			}, String(item.dataKey))),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-muted-foreground",
				children: [
					orders,
					" order",
					orders === 1 ? "" : "s"
				]
			})
		]
	});
}
function ChannelMix({ rows }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "No checkout mix in this window."
	});
	const data = CHANNELS.map((channel) => {
		const row = rows.find((r) => r.key === channel);
		return {
			key: channel,
			label: CHANNEL_LABEL[channel],
			revenue: row?.revenue ?? 0,
			orders: row?.orders ?? 0,
			share: row?.share ?? 0
		};
	}).filter((row) => row.revenue > 0 || row.orders > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-40 w-full min-w-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					margin: {
						top: 4,
						right: 4,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							vertical: false,
							stroke: "color-mix(in oklab, var(--color-foreground) 8%, transparent)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "label",
							tickLine: false,
							axisLine: false,
							tick: {
								fill: "var(--color-muted-foreground)",
								fontSize: 11
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip$1, {
							content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixTooltip, {}),
							cursor: { fill: "color-mix(in oklab, var(--color-foreground) 6%, transparent)" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "revenue",
							name: "Revenue",
							fill: "var(--color-accent)",
							radius: [
								6,
								6,
								0,
								0
							],
							maxBarSize: 36
						})
					]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-2",
			children: data.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-xs tabular-nums text-muted-foreground",
					children: [
						formatUsd(row.revenue),
						" · ",
						Math.round(row.share * 100),
						"%"
					]
				})]
			}, row.key))
		})]
	});
}
function MixTooltip({ active, payload }) {
	if (!active || !payload?.length) return null;
	const row = payload[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-popover px-3 py-2 text-xs shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: row.payload?.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 tabular-nums",
				children: formatUsd(Number(row.value ?? 0))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-muted-foreground",
				children: [row.payload?.orders ?? 0, " orders"]
			})
		]
	});
}
function BreakdownTable({ rows }) {
	const [sort, setSort] = (0, import_react.useState)("revenue");
	const ordered = [...rows].sort((a, b) => {
		if (sort === "growth") {
			const ag = a.growth ?? -Infinity;
			return (b.growth ?? -Infinity) - ag;
		}
		return b[sort] - a[sort];
	});
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Nothing sold in this window."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden grid-cols-12 gap-3 px-1 pb-2 text-[11px] tracking-[0.14em] text-muted-foreground uppercase md:grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "col-span-5 text-left",
					onClick: () => setSort("revenue"),
					children: "Name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "col-span-2 text-right",
					onClick: () => setSort("revenue"),
					children: "Revenue"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "col-span-2 text-right",
					onClick: () => setSort("orders"),
					children: "Orders"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "col-span-1 text-right",
					onClick: () => setSort("share"),
					children: "Share"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "col-span-2 text-right",
					onClick: () => setSort("growth"),
					children: "Growth"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col",
			children: ordered.map((row) => {
				const up = (row.growth ?? 0) > 5e-4;
				const down = (row.growth ?? 0) < -5e-4;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid grid-cols-1 gap-1 border-t border-border py-3 md:grid-cols-12 md:items-center md:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 md:col-span-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm",
								children: row.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: row.hint
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm tabular-nums md:col-span-2 md:text-right",
							children: formatUsd(row.revenue)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground md:col-span-2 md:text-right md:font-mono md:text-foreground",
							children: row.orders
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground md:col-span-1 md:text-right md:font-mono",
							children: [Math.round(row.share * 100), "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("text-sm tabular-nums md:col-span-2 md:text-right", up && "text-success", down && "text-destructive"),
							children: formatPct(row.growth, true)
						})
					]
				}, row.key);
			})
		})]
	});
}
//#endregion
export { RevenueDesk };
