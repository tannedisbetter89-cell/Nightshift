import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Link2 } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useNightshift } from "@/lib/store";
import { copyText } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop/")({ component: ShopPage });

function ShopPage() {
  const allProducts = useNightshift((s) => s.products);
  const products = allProducts.filter((p) => p.listed);
  const shopName = useNightshift((s) => s.settings.shopName);
  const payoutUrl = useNightshift((s) => s.settings.payoutUrl);
  const setDeskOpen = useNightshift((s) => s.setDeskOpen);

  async function shareShop() {
    const url = `${window.location.origin}/shop`;
    await copyText(url);
    toast.success("Shop link copied");
  }

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h1 className="font-display text-4xl tracking-tight">{shopName}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Digital products minted on the Nightshift press. Instant files — guides, kits, prompts,
            and desks you can use the same day.
          </p>
          {!payoutUrl ? (
            <button
              type="button"
              onClick={() => setDeskOpen(true)}
              className="mt-3 text-left text-sm text-warn underline-offset-4 hover:underline"
            >
              Payout link is not set. Buy buttons stay closed until you add one in desk settings.
            </button>
          ) : null}
        </div>
        <Button variant="secondary" onClick={shareShop}>
          <Link2 className="size-4" />
          Copy shop link
        </Button>
      </header>
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing listed. Turn on listing in the vault.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} to="/shop/$id" />
          ))}
        </div>
      )}
    </div>
  );
}
