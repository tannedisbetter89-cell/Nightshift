import { Link } from "@tanstack/react-router";
import { TYPE_LABEL, type Product } from "@/lib/types";
import { formatUsd } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ProductCard({
  product,
  to,
}: {
  product: Product;
  to: "/vault/$id" | "/shop/$id";
}) {
  return (
    <Link
      to={to}
      params={{ id: product.id }}
      className="group flex flex-col rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:shadow-[var(--shadow-border-hover)]"
    >
      <div className="flex items-start justify-between gap-3">
        <Badge variant="outline">{TYPE_LABEL[product.type]}</Badge>
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {formatUsd(product.priceUsd)}
        </span>
      </div>
      <h3 className="mt-4 font-display text-2xl leading-snug tracking-tight group-hover:text-accent">
        {product.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {product.tagline}
      </p>
      <p className="mt-5 text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
        {product.niche}
      </p>
    </Link>
  );
}
