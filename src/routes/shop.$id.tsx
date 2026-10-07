import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { payUrl, useNightshift } from "@/lib/store";
import { TYPE_LABEL } from "@/lib/types";
import { formatUsd } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop/$id")({ component: ShopProduct });

function ShopProduct() {
  const { id } = Route.useParams();
  const product = useNightshift((s) => s.products.find((p) => p.id === id && p.listed));
  const payoutUrl = useNightshift((s) => s.settings.payoutUrl);
  const payoutLabel = useNightshift((s) => s.settings.payoutLabel);
  const setDeskOpen = useNightshift((s) => s.setDeskOpen);

  if (!product) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">This listing is not on the floor.</p>
        <Button className="mt-4" variant="secondary" asChild>
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  const checkout = payUrl(product, payoutUrl);

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-8 pb-24 sm:pb-8">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/shop">
            <ArrowLeft className="size-4" />
            Shop
          </Link>
        </Button>
        <Badge variant="outline" className="mt-4">
          {TYPE_LABEL[product.type]}
        </Badge>
        <h1 className="mt-4 font-display text-4xl tracking-tight">{product.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{product.tagline}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <p className="font-display text-4xl tabular-nums">{formatUsd(product.priceUsd)}</p>
        {checkout ? (
          <Button asChild>
            <a href={checkout} target="_blank" rel="noreferrer">
              {payoutLabel} · {formatUsd(product.priceUsd)}
              <ExternalLink className="size-4" />
            </a>
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => setDeskOpen(true)}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Payout link not set
          </button>
        )}
      </div>

      <p className="text-sm leading-relaxed">{product.salesPage}</p>
      <p className="text-sm text-muted-foreground">For {product.audience}</p>

      <section>
        <h2 className="font-display text-2xl tracking-tight">What’s inside</h2>
        <ol className="mt-4 flex flex-col gap-3">
          {product.sections.map((section, i) => (
            <li key={section.heading} className="flex gap-3 border-t border-border pt-3">
              <span className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm">{section.heading}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{section.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {product.tags.length ? (
        <p className="text-xs tracking-wide text-muted-foreground uppercase">{product.tags.join(" · ")}</p>
      ) : null}

      {checkout ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          After you pay, write the product name in the payment note. The operator sends the file
          from the vault.
        </p>
      ) : null}

      {checkout ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:hidden">
          <Button className="w-full" asChild>
            <a href={checkout} target="_blank" rel="noreferrer">
              {payoutLabel} · {formatUsd(product.priceUsd)}
              <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>
      ) : null}
    </article>
  );
}
