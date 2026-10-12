import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCheckoutOrder } from "@/lib/commerce/checkout";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/shop/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search.order === "string" ? search.order : "",
  }),
  loaderDeps: ({ search }) => ({ order: search.order }),
  loader: ({ deps }) =>
    deps.order ? getCheckoutOrder({ data: { orderId: deps.order } }) : null,
  component: SuccessPage,
});

function SuccessPage() {
  const order = Route.useLoaderData();

  if (!order) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 pb-24">
        <h1 className="font-display text-3xl tracking-tight">Order not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn't find that order. If you just paid, give it a moment and check your email
          for the receipt.
        </p>
        <Button variant="secondary" asChild className="w-fit">
          <Link to="/shop">
            <ArrowLeft className="size-4" />
            Back to shop
          </Link>
        </Button>
      </div>
    );
  }

  const paid = order.status === "paid";

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 pb-24">
      <div className="flex items-start gap-3">
        {paid ? (
          <CheckCircle2 className="mt-1 size-6 shrink-0 text-success" />
        ) : (
          <AlertCircle className="mt-1 size-6 shrink-0 text-warn" />
        )}
        <div>
          <h1 className="font-display text-3xl tracking-tight">
            {paid ? "Payment confirmed" : "Payment not confirmed"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {paid
              ? "Thanks! Your order is confirmed below. Your download link is on its way."
              : "This order hasn't been confirmed as paid. If you completed checkout, check your email for the receipt — or try again."}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order {order.id}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.title} className="flex items-center justify-between gap-3 text-sm">
              <span>
                {item.title}
                {item.quantity > 1 ? ` × ${item.quantity}` : ""}
              </span>
              <span className="font-mono tabular-nums">
                {formatUsd((item.unitPriceCents * item.quantity) / 100)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-medium">
            <span>Total</span>
            <span className="font-mono tabular-nums">{formatUsd(order.totalCents / 100)}</span>
          </div>
          {order.email ? (
            <p className="text-xs text-muted-foreground">Receipt sent to {order.email}</p>
          ) : null}
        </CardContent>
      </Card>

      {paid && order.downloads.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your downloads</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {order.downloads.map((d) => (
              <div key={d.url} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm">{d.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.ready ? "Link expires in about an hour." : "File is being prepared."}
                  </p>
                </div>
                {d.ready ? (
                  <Button asChild size="sm">
                    <a href={d.url} download>
                      <Download className="size-4" />
                      Download
                    </a>
                  </Button>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Button variant="secondary" asChild className="w-fit">
        <Link to="/shop">
          <ArrowLeft className="size-4" />
          Back to shop
        </Link>
      </Button>
    </div>
  );
}
