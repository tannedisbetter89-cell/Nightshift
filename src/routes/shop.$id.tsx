import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { TYPE_LABEL } from "@/lib/types";
import { formatUsd } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaypalButtons } from "@/components/paypal-buttons";
import { getShopProduct } from "@/lib/commerce/shop";
import { getPaypalClientConfig } from "@/lib/commerce/checkout";

export const Route = createFileRoute("/shop/$id")({
  loader: async ({ params }) => {
    const [product, paypal] = await Promise.all([
      getShopProduct({ data: { id: params.id } }),
      getPaypalClientConfig(),
    ]);
    return { product, paypal };
  },
  component: ShopProduct,
});

function ShopProduct() {
  const { product, paypal } = Route.useLoaderData();

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

  const checkoutConfigured = paypal.configured;

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

      <div className="flex flex-col gap-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-display text-4xl tabular-nums">{formatUsd(product.priceUsd)}</p>
          <p className="text-xs text-muted-foreground">Secure checkout by PayPal</p>
        </div>
        {checkoutConfigured ? (
          <PaypalButtons
            productId={product.id}
            clientId={paypal.clientId}
            currency="USD"
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Checkout is being set up — check back soon to purchase this product.
          </p>
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

      {checkoutConfigured ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {product.type === "service"
            ? "After payment, tell us about your job right on the confirmation page — we'll fill out your template and send the finished document to your email."
            : "After payment, you'll get a confirmation with your download link. A receipt goes to your email."}
        </p>
      ) : null}
    </article>
  );
}
