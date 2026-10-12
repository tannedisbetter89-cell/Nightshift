import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { deskOverview } from "@/lib/commerce/desk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/desk/")({
  loader: () => deskOverview(),
  component: DeskOverview,
});

function money(cents: number) {
  return formatUsd(cents / 100);
}

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "paid"
      ? "live"
      : status === "pending"
        ? "outline"
        : status === "failed" || status === "canceled"
          ? "idle"
          : "outline";
  return <Badge variant={variant as "live" | "outline" | "idle"}>{status}</Badge>;
}

function DeskOverview() {
  const { totals, byStatus, recent, failedFulfillments } = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-6">
      {failedFulfillments > 0 ? (
        <Card className="border-warn">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="size-5 shrink-0 text-warn" />
            <p className="text-sm">
              {failedFulfillments} fulfillment{failedFulfillments === 1 ? "" : "s"} failed.{" "}
              <Link
                to="/desk/orders"
                search={{ status: "", q: "", from: "", to: "", productId: "" }}
                className="underline underline-offset-4"
              >
                Review orders
              </Link>{" "}
              to retry them.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Gross sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl tabular-nums">{money(totals.gross_cents)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Refunds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl tabular-nums">{money(totals.refund_cents)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl tabular-nums">{money(totals.net_cents)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl tabular-nums">{totals.order_count}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders by status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {byStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              byStatus.map((row: { status: string; n: number }) => (
                <div key={row.status} className="flex items-center justify-between text-sm">
                  <StatusBadge status={row.status} />
                  <span className="font-mono tabular-nums">{row.n}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              recent.map((o) => (
                <Link
                  key={o.id}
                  to="/desk/orders/$id"
                  params={{ id: o.id }}
                  search={{ status: "", q: "", from: "", to: "", productId: "" }}
                  className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-secondary/60"
                >
                  <span className="min-w-0">
                    <span className="font-mono text-xs">{o.id}</span>
                    <span className="ml-2 text-muted-foreground">
                      {o.customer_email ?? "—"}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={o.status} />
                    <span className="font-mono tabular-nums">
                      {money(o.total_cents)}
                    </span>
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
