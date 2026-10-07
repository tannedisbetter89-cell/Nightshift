import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { RevenueDesk } from "@/components/revenue-desk";
import { fulfillmentNote } from "@/lib/catalog";
import { collected, useNightshift } from "@/lib/store";
import { CHANNELS, CHANNEL_LABEL, type Channel } from "@/lib/types";
import { copyText, formatUsd, relativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/ledger")({ component: LedgerPage });

function LedgerPage() {
  const products = useNightshift((s) => s.products);
  const sales = useNightshift((s) => s.sales);
  const logSale = useNightshift((s) => s.logSale);
  const removeSale = useNightshift((s) => s.removeSale);
  const clearSampleSales = useNightshift((s) => s.clearSampleSales);
  const cash = collected(sales);
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [amount, setAmount] = useState(products[0]?.priceUsd.toString() ?? "29");
  const [note, setNote] = useState("");
  const [customer, setCustomer] = useState("");
  const [channel, setChannel] = useState<Channel>("manual");
  const selected = products.find((p) => p.id === productId);

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!productId || !Number.isFinite(n) || n <= 0) {
      toast.error("Enter a real amount.");
      return;
    }
    logSale(productId, Math.round(n * 100) / 100, note.trim(), {
      channel,
      customer: customer.trim(),
    });
    setNote("");
    toast.success("Sale logged");
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-10">
      <RevenueDesk
        sales={sales}
        products={products}
        onClearSample={() => {
          clearSampleSales();
          toast.message("Sample sales removed");
        }}
      />

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Log a sale</CardTitle>
            <CardDescription>
              When Gumroad, Stripe, or PayPal pays you, write it down here. Catalog value is not cash.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-3" onSubmit={submit}>
              <label className="flex flex-col gap-1.5">
                <Label>Product</Label>
                <Select
                  value={productId}
                  onValueChange={(id) => {
                    setProductId(id);
                    const p = products.find((x) => x.id === id);
                    if (p) setAmount(String(p.priceUsd));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <Label>Amount (USD)</Label>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="decimal"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <Label>Channel</Label>
                  <Select value={channel} onValueChange={(value) => setChannel(value as Channel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANNELS.map((item) => (
                        <SelectItem key={item} value={item}>
                          {CHANNEL_LABEL[item]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <Label>Buyer</Label>
                  <Input
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Optional name"
                    maxLength={48}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <Label>Note</Label>
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Gumroad · order 1842"
                    maxLength={80}
                  />
                </label>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                <Button type="submit">Log sale</Button>
                {selected ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={async () => {
                      await copyText(fulfillmentNote(selected));
                      toast.success("Fulfillment note copied");
                    }}
                  >
                    Copy fulfillment note
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Entries</CardTitle>
            <CardDescription>
              {sales.length} logged · {formatUsd(cash)} all-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <p className="text-sm text-muted-foreground">No cash logged yet.</p>
            ) : (
              <ul className="flex max-h-96 flex-col overflow-y-auto">
                {sales.slice(0, 24).map((sale) => {
                  const product = products.find((p) => p.id === sale.productId);
                  return (
                    <li
                      key={sale.id}
                      className="flex items-start justify-between gap-3 border-t border-border py-3 first:border-t-0 first:pt-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm">{product?.title ?? "Removed product"}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {sale.customer ? `${sale.customer} · ` : ""}
                          {CHANNEL_LABEL[sale.channel ?? "manual"]} · {sale.note || "No note"} ·{" "}
                          {relativeTime(sale.at)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="font-mono text-sm tabular-nums">{formatUsd(sale.amount)}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeSale(sale.id)}>
                          Remove
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
