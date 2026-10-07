import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Cpu, Factory } from "lucide-react";
import { TRENDS, peekFromFactory, productFromGenerated } from "@/lib/factory";
import { mintWithGrok } from "@/lib/mint";
import { useNightshift } from "@/lib/store";
import { CYCLE_SECONDS, PRODUCT_TYPES, TYPE_LABEL, VAULT_CAP, type ProductType } from "@/lib/types";
import { formatUsd } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/factory")({ component: FactoryPage });

const AI_DAILY_CAP = 6;
const AI_COOLDOWN_MS = 25_000;

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
  const [brief, setBrief] = useState(
    "A kit for independents who want to stop billing hourly and sell a named artifact instead.",
  );
  const [type, setType] = useState<ProductType>("template-kit");
  const [pending, setPending] = useState(false);
  const next = useMemo(
    () => peekFromFactory(serial, new Set(products.map((p) => p.title))),
    [serial, products],
  );

  const today = new Date().toISOString().slice(0, 10);
  const usedToday = aiMintsDay === today ? aiMintsToday : 0;
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
      const result = await mintWithGrok({ data: { brief: brief.trim(), type } });
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

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-8">
      <header>
        <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Factory</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">The mill</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Autopilot mints from the local press — no quota, one product per cycle. Custom mint
          spends a Grok call and writes a one-off product from your brief.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Autopilot</CardTitle>
            <CardDescription>
              {count}/{VAULT_CAP} in the vault. Each cycle lists a new product in the shop.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-center justify-between rounded-lg bg-secondary/70 px-4 py-3">
              <div>
                <p className="text-sm">Factory</p>
                <p className="text-xs text-muted-foreground">
                  {autopilot ? `Next mint in ${cycleLeft}s` : "Idle"}
                </p>
              </div>
              <Switch
                checked={autopilot}
                onCheckedChange={setAutopilot}
                aria-label="Toggle autopilot"
              />
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-accent transition-[width] duration-1000 ease-linear"
                style={{
                  width: autopilot ? `${((CYCLE_SECONDS - cycleLeft) / CYCLE_SECONDS) * 100}%` : "0%",
                }}
              />
            </div>
            <div className="rounded-lg bg-secondary/50 px-4 py-3">
              <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Up next</p>
              <div className="mt-2 flex items-start justify-between gap-3">
                <p className="text-sm leading-snug">{next.title}</p>
                <Badge variant="outline">{TYPE_LABEL[next.type]}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {next.niche} · {formatUsd(next.priceUsd)}
              </p>
            </div>
            <Button onClick={onMint} variant="secondary">
              <Factory className="size-4" />
              Mint from the press
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom mint</CardTitle>
            <CardDescription>
              {usedToday}/{AI_DAILY_CAP} Grok mints today. Keep the brief specific — who it’s for
              and what they walk away holding.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as ProductType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABEL[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="flex flex-col gap-1.5">
              <Label>Brief</Label>
              <Textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                maxLength={480}
                rows={5}
              />
            </label>
            <Button onClick={onGrok} disabled={pending || brief.trim().length < 12}>
              <Cpu className="size-4" />
              {pending ? "Minting…" : "Mint with Grok"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Radar</CardTitle>
          <CardDescription>The press weights these desks when it picks a niche. Tap to fill the brief.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {TRENDS.map((t) => (
            <button
              key={t.niche}
              type="button"
              className="rounded-lg bg-secondary/60 px-4 py-3 text-left transition-colors duration-150 hover:bg-secondary"
              onClick={() => {
                setBrief(
                  `A ${TYPE_LABEL[type].toLowerCase()} for ${t.note} Make it specific, usable in one sitting, and priced like a tool not a course.`,
                );
                toast.message(`Brief pointed at ${t.niche}`);
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm">{t.niche}</p>
                <span className="font-mono text-[11px] text-muted-foreground">{t.demand}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.note}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Finished products land in the{" "}
        <Link to="/vault" className="text-foreground underline-offset-4 hover:underline">
          vault
        </Link>{" "}
        and, if listed, on the shop.
      </p>
    </div>
  );
}
