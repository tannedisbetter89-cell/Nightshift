import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Factory, Play, Store } from "lucide-react";
import { toast } from "sonner";
import { peekFromFactory, TRENDS } from "@/lib/factory";
import { catalogValue, collected, useNightshift } from "@/lib/store";
import { CYCLE_SECONDS, TYPE_LABEL } from "@/lib/types";
import { formatUsd, relativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/")({ component: Floor });

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
  const next = useMemo(
    () => peekFromFactory(serial, new Set(products.map((p) => p.title))),
    [serial, products],
  );

  function onMint() {
    const result = mintLocal();
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Minted ${result.product.title}`);
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Floor</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl">
            The factory that mints while you sleep.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Nightshift builds digital products, listings, and a shop. You set a payout link, share
            the shop, and log the money when it lands. The machine does the inventory.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex h-12 items-center justify-between gap-3 rounded-md bg-card px-4 shadow-[var(--shadow-border)] sm:min-w-52">
            <span className="text-sm">Autopilot</span>
            <Switch
              checked={autopilot}
              onCheckedChange={(on) => {
                setAutopilot(on);
                toast.message(on ? "Factory running" : "Factory idle");
              }}
              aria-label="Toggle autopilot"
            />
          </label>
          <Button onClick={onMint}>
            <Factory className="size-4" />
            Mint now
          </Button>
        </div>
      </header>

      {!payoutUrl ? (
        <button
          type="button"
          onClick={() => setDeskOpen(true)}
          className="flex flex-col gap-1 rounded-xl bg-card px-5 py-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
        >
          <p className="text-sm">Set a payout link</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Gumroad, Stripe Payment Link, or PayPal.me. The shop’s buy button stays closed until
            this is on the desk.
          </p>
        </button>
      ) : null}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Catalog" value={formatUsd(value)} hint={`${listed} live on shop`} />
        <Stat label="Collected" value={formatUsd(cash)} hint={`${sales.length} logged sales`} />
        <Stat label="Vault" value={String(products.length)} hint="products minted" />
        <div className="rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
          <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">Next cycle</p>
          <div className="mt-2 flex items-center gap-3">
            <MillRing seconds={cycleLeft} total={CYCLE_SECONDS} running={autopilot} />
            <p className="font-display text-3xl leading-none tracking-tight tabular-nums sm:text-4xl">
              {autopilot ? formatClock(cycleLeft) : "Idle"}
            </p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {autopilot ? `every ${CYCLE_SECONDS}s` : "start autopilot"}
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>How the money actually arrives</CardTitle>
            <CardDescription>
              Autopilot cannot charge a stranger’s card. It can fill a shop with things people pay
              for. Three moves:
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Step n="01" title="Set a payout link" done={Boolean(payoutUrl)}>
              Gumroad, Stripe Payment Link, PayPal.me — one URL. Desk settings, top right.
            </Step>
            <Step n="02" title="Let the factory mint" done={products.length > 6}>
              Autopilot lists a new product each cycle. Or mint one now. Custom work uses Grok on
              the factory floor.
            </Step>
            <Step n="03" title="Share the shop and log the sale" done={sales.length > 0}>
              Send people to Shop. When the payment lands, record it on the revenue desk so the
              floor stays honest.
            </Step>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/shop">
                  <Store className="size-4" />
                  Open shop
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/playbook">
                  Playbook
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Activity</CardTitle>
              <CardDescription>What the desk just did.</CardDescription>
            </div>
            {autopilot ? <Badge variant="live">Live</Badge> : <Badge variant="idle">Idle</Badge>}
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-3">
              {activity.slice(0, 7).map((item) => (
                <li key={item.id} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
                  <p className="text-sm leading-snug">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground/80">
                    {relativeTime(item.at)}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>On the press</CardTitle>
            <CardDescription>
              Next mint from the mill. Autopilot will list this when the cycle closes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">{TYPE_LABEL[next.type]}</Badge>
            <p className="mt-3 font-display text-2xl leading-snug tracking-tight">{next.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{next.tagline}</p>
            <p className="mt-4 font-mono text-sm tabular-nums text-muted-foreground">
              {next.niche} · {formatUsd(next.priceUsd)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Machines</CardTitle>
            <CardDescription>Four desks. One shift.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Machine title="Product mill" status={autopilot ? "Minting" : "Standby"} to="/factory" />
            <Machine title="Launch desk" status="Copy ready" to="/vault" />
            <Machine
              title="Shop"
              status={payoutUrl ? "Payout set" : "Needs payout link"}
              to="/shop"
            />
            <Machine
              title="Revenue"
              status={cash ? `${formatUsd(cash)} in` : "No sales yet"}
              to="/ledger"
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Radar</CardTitle>
            <CardDescription>Niches the mill prefers next.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {TRENDS.slice(0, 6).map((t) => (
              <div key={t.niche} className="flex min-w-0 items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{t.niche}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.note}</p>
                </div>
                <Demand value={t.demand} />
              </div>
            ))}
            <Button variant="secondary" className="mt-2 sm:col-span-2" asChild>
              <Link to="/factory">
                <Play className="size-4" />
                Run the mill
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
      <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl leading-none tracking-tight tabular-nums sm:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Step({
  n,
  title,
  children,
  done,
}: {
  n: string;
  title: string;
  children: string;
  done: boolean;
}) {
  return (
    <div className="flex gap-4">
      <span className="font-mono text-xs text-muted-foreground">{n}</span>
      <div>
        <p className="text-sm">
          {title}
          {done ? (
            <span className="ml-2 text-[11px] tracking-wide text-success uppercase">Done</span>
          ) : null}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}

function Machine({
  title,
  status,
  to,
}: {
  title: string;
  status: string;
  to: "/factory" | "/vault" | "/shop" | "/ledger";
}) {
  return (
    <Link
      to={to}
      className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-3 transition-colors duration-150 hover:bg-secondary"
    >
      <span className="text-sm">{title}</span>
      <span className="shrink-0 text-xs text-muted-foreground">{status}</span>
    </Link>
  );
}

function Demand({ value }: { value: number }) {
  return (
    <div className="flex w-20 shrink-0 items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
      </div>
      <span className="w-6 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
        {value}
      </span>
    </div>
  );
}

function MillRing({
  seconds,
  total,
  running,
}: {
  seconds: number;
  total: number;
  running: boolean;
}) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const progress = running ? (total - seconds) / total : 0;
  return (
    <svg viewBox="0 0 40 40" className="size-9 shrink-0 -rotate-90" aria-hidden>
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke="currentColor"
        className="text-secondary"
        strokeWidth="3"
      />
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke="currentColor"
        className="text-accent"
        strokeWidth="3"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatClock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
