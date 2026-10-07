import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { buildLaunchWeek } from "@/lib/catalog";
import { CopyButton } from "@/components/copy-button";
import { useNightshift } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/playbook")({ component: PlaybookPage });

export function PlaybookPage() {
  const products = useNightshift((s) => s.products);
  const week = buildLaunchWeek(products);

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-10">
      <header>
        <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Playbook</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">How you get paid</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Nightshift is a factory, not a bank. It cannot pull money out of the internet. It can
          mint inventory, write the listing, and host a shop with your checkout link. The cash
          still has to land in an account you own.
        </p>
      </header>

      <section className="flex flex-col gap-8">
        <Step n="01" title="Put a payout URL on the desk">
          Open desk settings. Paste a Gumroad product or profile, a Stripe Payment Link, PayPal.me,
          or any checkout page. The shop’s buy button becomes that URL. One link is enough to start
          — you can make per-product links later in the vault.
        </Step>
        <Step n="02" title="Let the mill fill the vault">
          Start autopilot on the floor. Every cycle mints a complete product: the file, the sales
          page, three tweets, two emails. Or mint a custom one with Grok when you have a specific
          buyer in mind. Cap the vault before it gets sloppy — 28 is plenty.
        </Step>
        <Step n="03" title="List where people already pay">
          Two paths. Share this shop after you publish the app. Or paste the Gumroad copy from a
          vault product into Gumroad / Etsy / your own site, attach the downloaded markdown as the
          file, and let those platforms collect. The second path usually converts better on day
          one because strangers already trust the checkout.
        </Step>
        <Step n="04" title="Fulfill, then log it">
          When someone pays, send the download from the vault (or Gumroad delivers it). Then log
          the sale on the revenue desk. Catalog value is not income. The floor stays honest if you
          only type numbers that hit your account.
        </Step>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>This week’s launch</CardTitle>
          <CardDescription>
            Written from whatever is listed right now. Copy a line, send it, then stop.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {week.map((move) => (
            <div key={move.day} className="flex gap-4 border-t border-border py-4 first:border-t-0 first:pt-0">
              <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground">{move.day}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{move.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{move.body}</p>
              </div>
              {move.copy ? <CopyButton label={move.day} text={move.copy} /> : null}
            </div>
          ))}
        </CardContent>
      </Card>

      <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-2xl">What this will not do</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
          <li>It will not trade stocks, mint coins, or run ads against a budget you don’t have.</li>
          <li>It will not email a list you haven’t built or post to social networks for you.</li>
          <li>It will not invent buyers. You still send the shop to people who know you.</li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed">
          What it will do is the part that usually stalls: making the thing, naming the price, and
          putting a page in front of someone. That’s the whole job of a night shift.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/factory">
            Open the mill
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/">Back to floor</Link>
        </Button>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: string }) {
  return (
    <div className="flex gap-4">
      <span className="font-mono text-xs text-muted-foreground">{n}</span>
      <div>
        <h2 className="font-display text-2xl tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
