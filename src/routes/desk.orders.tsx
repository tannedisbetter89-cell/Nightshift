import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { deskListOrders, deskListProducts } from "@/lib/commerce/desk";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "./desk.index";
import { formatUsd } from "@/lib/utils";

const STATUSES = ["", "pending", "paid", "canceled", "failed", "refunded", "partially_refunded"];

export const Route = createFileRoute("/desk/orders")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: typeof search.status === "string" ? search.status : "",
    q: typeof search.q === "string" ? search.q : "",
    from: typeof search.from === "string" ? search.from : "",
    to: typeof search.to === "string" ? search.to : "",
    productId: typeof search.productId === "string" ? search.productId : "",
  }),
  loaderDeps: ({ search }) => ({ ...search }),
  loader: ({ deps }) =>
    Promise.all([
      deskListOrders({ data: { ...deps, limit: 50, offset: 0 } }),
      deskListProducts(),
    ]).then(([orders, products]) => ({ orders, products })),
  component: DeskOrders,
});

function DeskOrders() {
  const { orders, products } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [q, setQ] = useState(search.q);
  const [status, setStatus] = useState(search.status);
  const [from, setFrom] = useState(search.from);
  const [to, setTo] = useState(search.to);
  const [productId, setProductId] = useState(search.productId);

  function apply() {
    navigate({
      to: "/desk/orders",
      search: { status, q, from, to, productId },
    });
  }

  function clear() {
    setQ("");
    setStatus("");
    setFrom("");
    setTo("");
    setProductId("");
    navigate({ to: "/desk/orders", search: { status: "", q: "", from: "", to: "", productId: "" } });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="grid gap-3 py-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="f-q">Search</Label>
            <Input
              id="f-q"
              placeholder="Order id or email"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="f-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="f-status">
                <SelectValue placeholder="Any status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "" ? "Any status" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="f-product">Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger id="f-product">
                <SelectValue placeholder="Any product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any product</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="f-from">From</Label>
            <Input id="f-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="f-to">To</Label>
            <Input id="f-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={apply}>Filter</Button>
            <Button variant="secondary" onClick={clear}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-0 py-0">
          {orders.orders.length === 0 ? (
            <p className="px-4 py-8 text-sm text-muted-foreground">No orders match.</p>
          ) : (
            <ul className="divide-y divide-border">
              {orders.orders.map((o) => (
                <li key={o.id}>
                  <Link
                    to="/desk/orders/$id"
                    params={{ id: o.id }}
                    search={{ status, q, from, to, productId }}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 hover:bg-secondary/40"
                  >
                    <span className="min-w-0">
                      <span className="font-mono text-xs">{o.id}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {o.customer_email ?? "—"} · {o.items} item(s)
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-sm tabular-nums">
                        {formatUsd(o.total_cents / 100)}
                      </span>
                      <StatusBadge status={o.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Showing {orders.orders.length} of {orders.total} orders.
      </p>
    </div>
  );
}
