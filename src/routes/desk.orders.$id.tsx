import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { deskGetOrder, deskMarkDfyDelivered, deskRetryFulfillment } from "@/lib/commerce/desk";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./desk.index";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/desk/orders/$id")({
  loader: ({ params }) => deskGetOrder({ data: { id: params.id } }),
  component: DeskOrderDetail,
});

function money(cents: number) {
  return formatUsd(cents / 100);
}

function DeskOrderDetail() {
  const data = Route.useLoaderData();
  const [retrying, setRetrying] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Order not found.</p>
        <Button variant="secondary" asChild className="w-fit">
          <Link to="/desk/orders" search={{ status: "", q: "", from: "", to: "", productId: "" }}>
            <ArrowLeft className="size-4" />
            Orders
          </Link>
        </Button>
      </div>
    );
  }

  const { order, items, payments, fulfillments, ledger, dfy } = data;
  const [deliveredIds, setDeliveredIds] = useState<Set<string>>(new Set());

  async function retry(fulfillmentId: string) {
    setRetrying(fulfillmentId);
    try {
      const res = await deskRetryFulfillment({ data: { fulfillmentId } });
      toast.success("New download link issued (valid 2 hours).");
      window.open(res.url, "_blank", "noopener");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Retry failed.");
    } finally {
      setRetrying(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" asChild className="w-fit">
        <Link to="/desk/orders" search={{ status: "", q: "", from: "", to: "", productId: "" }}>
          <ArrowLeft className="size-4" />
          Orders
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-mono text-lg">{order.id}</h2>
        <StatusBadge status={order.status} />
        <span className="font-display text-2xl tabular-nums">{money(order.total_cents)}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {order.customer_email ?? "No email"} ·{" "}
        {new Date(order.created_at).toLocaleString()}
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between gap-3 text-sm">
                <span>{i.title} × {i.quantity}</span>
                <span className="font-mono tabular-nums">
                  {money(i.unit_price_cents * i.quantity)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments recorded.</p>
            ) : (
              payments.map((p) => (
                <div key={p.id} className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={p.status} />
                    <span className="font-mono tabular-nums">
                      {money(p.amount_cents)}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    paypal order {p.provider_order_id}
                  </p>
                  {p.provider_capture_id ? (
                    <p className="font-mono text-xs text-muted-foreground">
                      capture {p.provider_capture_id}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fulfillment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {fulfillments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing to fulfill yet.</p>
            ) : (
              fulfillments.map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-mono text-xs">{f.product_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.status}
                      {f.delivered_at ? ` · ${new Date(f.delivered_at).toLocaleString()}` : ""}
                      {f.error ? ` · ${f.error}` : ""}
                    </p>
                  </div>
                  {f.status === "failed" || f.status === "pending" ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={retrying === f.id}
                      onClick={() => retry(f.id)}
                    >
                      <RefreshCw className="size-3.5" />
                      {retrying === f.id ? "…" : "New link"}
                    </Button>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ledger entries</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {ledger.length === 0 ? (
              <p className="text-sm text-muted-foreground">No ledger entries.</p>
            ) : (
              ledger.map((e) => (
                <div key={e.id} className="flex justify-between gap-3 text-sm">
                  <span>
                    {e.kind}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {e.description}
                    </span>
                  </span>
                  <span className="font-mono tabular-nums">{money(e.amount_cents)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {dfy.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Done-for-you request</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {dfy.map((r) => {
                const delivered = r.status === "delivered" || deliveredIds.has(r.id);
                const fields: Array<[string, string]> = [
                  ["Template pack", r.details.templatePack ?? ""],
                  ["What they need", r.details.whatNeeded ?? ""],
                  ["Business", r.details.businessName ?? ""],
                  ["Client", r.details.clientName ?? ""],
                  ["Job details", r.details.jobDetails ?? ""],
                  ["Price / amount", r.details.priceOrAmount ?? ""],
                  ["Needed by", r.details.neededBy ?? ""],
                  ["Send finished file to", r.details.deliveryEmail ?? r.customer_email ?? ""],
                ];
                return (
                  <div key={r.id} className="flex flex-col gap-2 border-t border-border pt-3 first:border-t-0 first:pt-0">
                    <div className="flex items-center justify-between gap-3">
                      <StatusBadge status={delivered ? "delivered" : "pending"} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </span>
                    </div>
                    {fields
                      .filter(([, v]) => v)
                      .map(([label, value]) => (
                        <p key={label} className="text-sm">
                          <span className="text-muted-foreground">{label}: </span>
                          {value}
                        </p>
                      ))}
                    {!delivered ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-fit"
                        onClick={async () => {
                          try {
                            await deskMarkDfyDelivered({ data: { id: r.id } });
                            setDeliveredIds(new Set(deliveredIds).add(r.id));
                            toast.success("Marked delivered.");
                          } catch (err) {
                            toast.error(err instanceof Error ? err.message : "Couldn't mark delivered.");
                          }
                        }}
                      >
                        Mark delivered (finished file emailed)
                      </Button>
                    ) : null}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
