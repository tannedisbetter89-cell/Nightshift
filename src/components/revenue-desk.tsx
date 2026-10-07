import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Info } from "lucide-react";
import {
  formatPct,
  formatRangeLabel,
  hasSampleSales,
  isoDate,
  rangeFromCustom,
  rangeFromPreset,
  summarizeRevenue,
  type BreakdownRow,
  type DatePreset,
  type DateRange,
  type TrendPoint,
} from "@/lib/revenue";
import { CHANNELS, CHANNEL_LABEL, type Product, type Sale } from "@/lib/types";
import { cn, formatUsd } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const PRESETS: Array<{ id: Exclude<DatePreset, "custom">; label: string }> = [
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "90d", label: "90d" },
  { id: "ytd", label: "YTD" },
];

type BreakdownTab = "product" | "niche" | "channel";

export function RevenueDesk({
  sales,
  products,
  onClearSample,
}: {
  sales: Sale[];
  products: Product[];
  onClearSample: () => void;
}) {
  const [preset, setPreset] = useState<DatePreset>("30d");
  const [fromIso, setFromIso] = useState(() => isoDate(Date.now() - 29 * 86_400_000));
  const [toIso, setToIso] = useState(() => isoDate(Date.now()));
  const [tab, setTab] = useState<BreakdownTab>("product");

  const range = useMemo<DateRange>(() => {
    if (preset === "custom") return rangeFromCustom(fromIso, toIso);
    return rangeFromPreset(preset);
  }, [preset, fromIso, toIso]);

  const summary = useMemo(() => summarizeRevenue(sales, products, range), [sales, products, range]);
  const rows = tab === "product" ? summary.byProduct : tab === "niche" ? summary.byNiche : summary.byChannel;
  const sample = hasSampleSales(sales);

  function pickPreset(next: Exclude<DatePreset, "custom">) {
    const nextRange = rangeFromPreset(next);
    setPreset(next);
    setFromIso(isoDate(nextRange.from));
    setToIso(isoDate(nextRange.to - 1));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Revenue</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">The desk</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Cash that actually landed, sliced by window. Growth is versus the same-length stretch
            before this one. Churn is buyers from that prior window who did not come back.
          </p>
        </div>
        <RangeControls
          preset={preset}
          fromIso={fromIso}
          toIso={toIso}
          onPreset={pickPreset}
          onCustom={(from, to) => {
            setPreset("custom");
            setFromIso(from);
            setToIso(to);
          }}
        />
      </div>

      {sample ? (
        <div className="flex flex-col gap-3 rounded-xl bg-card px-5 py-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sample sales are loaded so the charts have a pulse. Log a real one below, or strip the
            demo numbers.
          </p>
          <Button variant="secondary" onClick={onClearSample} className="shrink-0">
            Remove sample sales
          </Button>
        </div>
      ) : null}

      <p className="text-xs text-muted-foreground">
        {formatRangeLabel(summary.range)} · vs {formatRangeLabel(summary.prior)}
      </p>

      <section className="grid gap-3 sm:grid-cols-3">
        <KpiCard
          label="Revenue"
          value={formatUsd(summary.revenue)}
          hint={`${summary.orders} orders · AOV ${formatUsd(summary.aov || 0)}`}
          delta={summary.growth}
          spark={summary.trend.map((p) => p.revenue)}
          tooltip="Sum of logged sales inside the selected dates. Catalog value on the floor is inventory, not this number."
        />
        <KpiCard
          label="Growth"
          value={formatPct(summary.growth, true)}
          hint={
            summary.growth === null
              ? "No prior-window revenue to compare"
              : `${formatUsd(summary.priorRevenue)} in the prior window`
          }
          delta={summary.growth}
          tooltip="Percent change versus the previous window of equal length. New means the prior window was empty."
        />
        <KpiCard
          label="Churn"
          value={formatPct(summary.churn)}
          hint={
            summary.churn === null
              ? "No prior buyers in the last window"
              : `${summary.churnedCustomers} of ${summary.priorCustomers} buyers quiet · ${formatUsd(summary.churnedRevenue)}`
          }
          delta={summary.churn === null ? 0 : -summary.churn}
          invert
          tooltip="Share of prior-window buyers who did not purchase again in this window. Lower is healthier."
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>Trend</CardTitle>
              <CardDescription>This window against the prior stretch, bucketed to stay readable.</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <LegendDot className="bg-accent" label="Revenue" />
              <LegendDot className="bg-muted-foreground/50" label="Prior" />
            </div>
          </CardHeader>
          <CardContent>
            <TrendChart points={summary.trend} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mix</CardTitle>
            <CardDescription>
              {summary.newCustomers} new buyers · {summary.returningCustomers} returning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChannelMix rows={summary.byChannel} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Breakdown</CardTitle>
            <CardDescription>Share of this window, with growth versus the last one.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["product", "Product"],
                ["niche", "Niche"],
                ["channel", "Channel"],
              ] as const
            ).map(([id, label]) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={tab === id ? "default" : "secondary"}
                onClick={() => setTab(id)}
              >
                {label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <BreakdownTable rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

function RangeControls({
  preset,
  fromIso,
  toIso,
  onPreset,
  onCustom,
}: {
  preset: DatePreset;
  fromIso: string;
  toIso: string;
  onPreset: (preset: Exclude<DatePreset, "custom">) => void;
  onCustom: (from: string, to: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {PRESETS.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={preset === item.id ? "default" : "secondary"}
            className="shrink-0"
            onClick={() => onPreset(item.id)}
          >
            {item.label}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          variant={preset === "custom" ? "default" : "secondary"}
          className="shrink-0"
          onClick={() => onCustom(fromIso, toIso)}
        >
          Custom
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex min-w-0 flex-col gap-1">
          <span className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">From</span>
          <input
            type="date"
            value={fromIso}
            onChange={(e) => onCustom(e.target.value, toIso)}
            className="h-11 rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)] focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:outline-none"
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1">
          <span className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">To</span>
          <input
            type="date"
            value={toIso}
            onChange={(e) => onCustom(fromIso, e.target.value)}
            className="h-11 rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)] focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:outline-none"
          />
        </label>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  delta,
  spark,
  tooltip,
  invert = false,
}: {
  label: string;
  value: string;
  hint: string;
  delta: number | null;
  spark?: number[];
  tooltip: string;
  invert?: boolean;
}) {
  const up = (delta ?? 0) > 0.0005;
  const down = (delta ?? 0) < -0.0005;
  const good = invert ? down : up;
  const bad = invert ? up : down;
  return (
    <div className="rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">{label}</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label={`${label} definition`}
            >
              <Info className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="font-display text-3xl leading-none tracking-tight tabular-nums sm:text-4xl">{value}</p>
        {spark && spark.length > 1 ? <Sparkline values={spark} /> : null}
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        {delta === null ? null : good ? (
          <ArrowUpRight className="size-3.5 text-success" />
        ) : bad ? (
          <ArrowDownRight className="size-3.5 text-destructive" />
        ) : null}
        <span className={cn(good && "text-success", bad && "text-destructive")}>{hint}</span>
      </p>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  const w = 88;
  const h = 32;
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const d = values
    .map((v, i) => {
      const x = i * step;
      const y = h - (v / max) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mb-1 h-8 w-20 shrink-0 text-accent" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-1.5 rounded-full", className)} />
      {label}
    </span>
  );
}

function TrendChart({ points }: { points: TrendPoint[] }) {
  if (points.length === 0) {
    return <p className="text-sm text-muted-foreground">No sales in this window.</p>;
  }
  return (
    <div className="h-64 w-full min-w-0 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="color-mix(in oklab, var(--color-foreground) 8%, transparent)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={28}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : `${v}`)}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          />
          <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-border)" }} />
          <Area
            type="monotone"
            dataKey="priorRevenue"
            name="Prior"
            stroke="color-mix(in oklab, var(--color-muted-foreground) 70%, transparent)"
            strokeDasharray="4 4"
            fill="transparent"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="var(--color-accent)"
            fill="url(#revFill)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string; dataKey?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0] as { payload?: TrendPoint } | undefined;
  const orders = point?.payload?.orders ?? 0;
  return (
    <div className="rounded-md bg-popover px-3 py-2 text-xs shadow-[var(--shadow-border)]">
      <p className="text-muted-foreground">{label}</p>
      {payload.map((item) => (
        <p key={String(item.dataKey)} className="mt-1 tabular-nums text-popover-foreground">
          {item.name}: {formatUsd(Number(item.value ?? 0))}
        </p>
      ))}
      <p className="mt-1 text-muted-foreground">{orders} order{orders === 1 ? "" : "s"}</p>
    </div>
  );
}

function ChannelMix({ rows }: { rows: BreakdownRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No checkout mix in this window.</p>;
  }
  const data = CHANNELS.map((channel) => {
    const row = rows.find((r) => r.key === channel);
    return {
      key: channel,
      label: CHANNEL_LABEL[channel],
      revenue: row?.revenue ?? 0,
      orders: row?.orders ?? 0,
      share: row?.share ?? 0,
    };
  }).filter((row) => row.revenue > 0 || row.orders > 0);
  return (
    <div className="flex flex-col gap-4">
      <div className="h-40 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="color-mix(in oklab, var(--color-foreground) 8%, transparent)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            />
            <YAxis hide />
            <RechartsTooltip content={<MixTooltip />} cursor={{ fill: "color-mix(in oklab, var(--color-foreground) 6%, transparent)" }} />
            <Bar dataKey="revenue" name="Revenue" fill="var(--color-accent)" radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-col gap-2">
        {data.map((row) => (
          <li key={row.key} className="flex items-center justify-between gap-3 text-sm">
            <span>{row.label}</span>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {formatUsd(row.revenue)} · {Math.round(row.share * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MixTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: { label?: string; orders?: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  return (
    <div className="rounded-md bg-popover px-3 py-2 text-xs shadow-[var(--shadow-border)]">
      <p className="text-muted-foreground">{row.payload?.label}</p>
      <p className="mt-1 tabular-nums">{formatUsd(Number(row.value ?? 0))}</p>
      <p className="mt-1 text-muted-foreground">{row.payload?.orders ?? 0} orders</p>
    </div>
  );
}

function BreakdownTable({ rows }: { rows: BreakdownRow[] }) {
  const [sort, setSort] = useState<"revenue" | "orders" | "share" | "growth">("revenue");
  const ordered = [...rows].sort((a, b) => {
    if (sort === "growth") {
      const ag = a.growth ?? -Infinity;
      const bg = b.growth ?? -Infinity;
      return bg - ag;
    }
    return b[sort] - a[sort];
  });

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing sold in this window.</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="hidden grid-cols-12 gap-3 px-1 pb-2 text-[11px] tracking-[0.14em] text-muted-foreground uppercase md:grid">
        <button type="button" className="col-span-5 text-left" onClick={() => setSort("revenue")}>
          Name
        </button>
        <button type="button" className="col-span-2 text-right" onClick={() => setSort("revenue")}>
          Revenue
        </button>
        <button type="button" className="col-span-2 text-right" onClick={() => setSort("orders")}>
          Orders
        </button>
        <button type="button" className="col-span-1 text-right" onClick={() => setSort("share")}>
          Share
        </button>
        <button type="button" className="col-span-2 text-right" onClick={() => setSort("growth")}>
          Growth
        </button>
      </div>
      <ul className="flex flex-col">
        {ordered.map((row) => {
          const up = (row.growth ?? 0) > 0.0005;
          const down = (row.growth ?? 0) < -0.0005;
          return (
            <li
              key={row.key}
              className="grid grid-cols-1 gap-1 border-t border-border py-3 md:grid-cols-12 md:items-center md:gap-3"
            >
              <div className="min-w-0 md:col-span-5">
                <p className="truncate text-sm">{row.label}</p>
                <p className="truncate text-xs text-muted-foreground">{row.hint}</p>
              </div>
              <p className="font-mono text-sm tabular-nums md:col-span-2 md:text-right">{formatUsd(row.revenue)}</p>
              <p className="text-sm text-muted-foreground md:col-span-2 md:text-right md:font-mono md:text-foreground">
                {row.orders}
              </p>
              <p className="text-sm text-muted-foreground md:col-span-1 md:text-right md:font-mono">
                {Math.round(row.share * 100)}%
              </p>
              <p
                className={cn(
                  "text-sm tabular-nums md:col-span-2 md:text-right",
                  up && "text-success",
                  down && "text-destructive",
                )}
              >
                {formatPct(row.growth, true)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

