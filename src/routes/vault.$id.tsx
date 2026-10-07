import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Copy, Download, Store, Trash2 } from "lucide-react";
import { gumroadListing, launchKit, productToMarkdown } from "@/lib/catalog";
import { CopyButton } from "@/components/copy-button";
import { useNightshift } from "@/lib/store";
import { TYPE_LABEL } from "@/lib/types";
import { copyText, downloadText, formatUsd, slugify } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/vault/$id")({ component: VaultProduct });

function VaultProduct() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const product = useNightshift((s) => s.products.find((p) => p.id === id));
  const toggleListed = useNightshift((s) => s.toggleListed);
  const removeProduct = useNightshift((s) => s.removeProduct);
  const updateProduct = useNightshift((s) => s.updateProduct);
  const [checkout, setCheckout] = useState(product?.checkoutUrl ?? "");

  useEffect(() => {
    setCheckout(product?.checkoutUrl ?? "");
  }, [product?.checkoutUrl]);

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-muted-foreground">That product is gone.</p>
        <Button className="mt-4" variant="secondary" asChild>
          <Link to="/vault">Back to vault</Link>
        </Button>
      </div>
    );
  }

  async function copy(label: string, text: string) {
    await copyText(text);
    toast.success(`${label} copied`);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/vault">
            <ArrowLeft className="size-4" />
            Vault
          </Link>
        </Button>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{TYPE_LABEL[product.type]}</Badge>
          <Badge variant={product.listed ? "live" : "idle"}>
            {product.listed ? "Listed" : "Unlisted"}
          </Badge>
          <Badge variant="default">{product.source === "grok" ? "Grok" : product.source}</Badge>
        </div>
        <h1 className="mt-4 font-display text-4xl tracking-tight">{product.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{product.tagline}</p>
        <p className="mt-4 font-display text-3xl tabular-nums">{formatUsd(product.priceUsd)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() =>
            downloadText(`${slugify(product.title) || "product"}.md`, productToMarkdown(product))
          }
        >
          <Download className="size-4" />
          Download file
        </Button>
        <Button variant="secondary" onClick={() => copy("Gumroad listing", gumroadListing(product))}>
          <Copy className="size-4" />
          Copy Gumroad
        </Button>
        <Button variant="secondary" onClick={() => copy("Launch kit", launchKit(product))}>
          <Copy className="size-4" />
          Copy launch kit
        </Button>
        <Button variant="outline" asChild>
          <Link to="/shop/$id" params={{ id: product.id }}>
            <Store className="size-4" />
            View in shop
          </Link>
        </Button>
      </div>

      <label className="flex h-12 items-center justify-between gap-3 rounded-md bg-card px-4 shadow-[var(--shadow-border)]">
        <span className="text-sm">List on shop</span>
        <Switch
          checked={product.listed}
          onCheckedChange={() => toggleListed(product.id)}
          aria-label="List on shop"
        />
      </label>

      <form
        className="flex flex-col gap-2 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]"
        onSubmit={(e) => {
          e.preventDefault();
          updateProduct(product.id, { checkoutUrl: checkout.trim() || undefined });
          toast.success(checkout.trim() ? "Checkout saved" : "Using desk payout link");
        }}
      >
        <Label htmlFor="checkout">Product checkout URL</Label>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Optional. A Gumroad or Stripe link for this product. Empty uses the desk payout link.
        </p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <Input
            id="checkout"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            placeholder="https://gumroad.com/l/…"
            inputMode="url"
          />
          <Button type="submit" variant="secondary" className="sm:w-auto">
            Save
          </Button>
        </div>
      </form>

      <article className="flex flex-col gap-6">
        <p className="text-sm leading-relaxed">{product.salesPage}</p>
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground">For </span>
          {product.audience}
        </p>
        {product.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl tracking-tight">{section.heading}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
      </article>

      <Card>
        <CardHeader>
          <CardTitle>Launch tweets</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {product.tweets.map((t, i) => (
            <div key={t} className="flex items-start gap-2 rounded-md bg-secondary/70 px-3 py-3">
              <p className="min-w-0 flex-1 text-sm leading-relaxed">{t}</p>
              <CopyButton label={`Tweet ${i + 1}`} text={t} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emails</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {product.emails.map((e) => (
            <div key={e.subject} className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm">{e.subject}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{e.body}</p>
              </div>
              <CopyButton label="Email" text={`Subject: ${e.subject}\n\n${e.body}`} />
            </div>
          ))}
        </CardContent>
      </Card>

      {product.source !== "seed" ? (
        <Button
          variant="ghost"
          className="self-start text-destructive"
          onClick={() => {
            removeProduct(product.id);
            toast.message("Archived");
            void navigate({ to: "/vault" });
          }}
        >
          <Trash2 className="size-4" />
          Archive
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          Seed inventory stays in the vault. Unlist it from the shop if you don’t want it public.
        </p>
      )}
    </div>
  );
}
