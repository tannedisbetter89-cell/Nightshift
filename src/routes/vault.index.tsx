import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { listingsPack } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { useNightshift } from "@/lib/store";
import { TYPE_LABEL, type ProductType } from "@/lib/types";
import { downloadText } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/vault/")({ component: VaultPage });

const FILTERS: Array<"all" | ProductType> = [
  "all",
  "guide",
  "template-kit",
  "prompt-pack",
  "checklist",
  "sop",
  "script-pack",
];

function VaultPage() {
  const products = useNightshift((s) => s.products);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const list = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.type === filter)),
    [products, filter],
  );

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Vault</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">Inventory</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Full files, launch tweets, emails, Gumroad copy. Download from a product. The shop only
            shows the storefront.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            downloadText("nightshift-listings.md", listingsPack(list));
            toast.success("Listings downloaded");
          }}
          disabled={list.length === 0}
        >
          <Download className="size-4" />
          Download listings
        </Button>
      </header>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "secondary"}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : TYPE_LABEL[f]}
          </Button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing in this drawer. Mint from the factory.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} to="/vault/$id" />
          ))}
        </div>
      )}
    </div>
  );
}
