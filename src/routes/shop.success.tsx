import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCheckoutOrder } from "@/lib/commerce/checkout";
import { submitDfyRequest } from "@/lib/commerce/dfy";
import { formatUsd } from "@/lib/utils";

const DFY_PACKS = ["Commercial Cleaning", "Construction", "Contractors"] as const;

/**
 * Intake form for the Done-For-You service: the buyer just paid $59 for a
 * template filled out for their job. They tell us which template and the job
 * facts; the operator fills it in and emails the finished document.
 */
function DfyIntakeForm({ orderId, email }: { orderId: string; email: string | null }) {
  const [pack, setPack] = useState<string>("");
  const [whatNeeded, setWhatNeeded] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [clientName, setClientName] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [priceOrAmount, setPriceOrAmount] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [deliveryEmail, setDeliveryEmail] = useState(email ?? "");
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (sentTo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Got it — we're on it</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Thanks! We'll fill out your template and send the finished document to{" "}
            <span className="font-medium text-foreground">{sentTo}</span>. Keep an eye on
            your inbox.
          </p>
        </CardContent>
      </Card>
    );
  }

  async function submit() {
    if (!pack || !whatNeeded.trim() || !businessName.trim() || !deliveryEmail.includes("@")) {
      toast.error("Please fill in the template, what you need, your business name, and a valid email.");
      return;
    }
    setSending(true);
    try {
      const res = await submitDfyRequest({
        data: {
          orderId,
          templatePack: pack,
          whatNeeded,
          businessName,
          clientName,
          jobDetails,
          priceOrAmount,
          neededBy,
          deliveryEmail,
        },
      });
      setSentTo(res.request.details.deliveryEmail);
      if (res.alreadySubmitted) {
        toast.message("Your details were already received — nothing to do.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send your details. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tell us about your job</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          You bought the Done-For-You template. Tell us what you need and we'll fill it out
          for your job and email the finished document to you.
        </p>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dfy-pack">Which template pack is it from? *</Label>
          <Select value={pack} onValueChange={setPack}>
            <SelectTrigger id="dfy-pack">
              <SelectValue placeholder="Pick a pack" />
            </SelectTrigger>
            <SelectContent>
              {DFY_PACKS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dfy-what">What do you need written? *</Label>
          <Input
            id="dfy-what"
            placeholder="e.g. a quote for an office clean"
            value={whatNeeded}
            onChange={(e) => setWhatNeeded(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dfy-business">Your business name *</Label>
          <Input
            id="dfy-business"
            placeholder="e.g. Clean Slate Cleaning Services"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dfy-client">Client name</Label>
          <Input
            id="dfy-client"
            placeholder="Who is this for?"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dfy-details">Job details</Label>
          <Textarea
            id="dfy-details"
            placeholder="The facts: what's the job, where, when, anything the document needs to say."
            value={jobDetails}
            onChange={(e) => setJobDetails(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="dfy-price">Price or amount</Label>
            <Input
              id="dfy-price"
              placeholder="e.g. $250"
              value={priceOrAmount}
              onChange={(e) => setPriceOrAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="dfy-needed">Needed by</Label>
            <Input
              id="dfy-needed"
              type="date"
              value={neededBy}
              onChange={(e) => setNeededBy(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dfy-email">Email for the finished document *</Label>
          <Input
            id="dfy-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={deliveryEmail}
            onChange={(e) => setDeliveryEmail(e.target.value)}
          />
        </div>
        <Button onClick={submit} disabled={sending} className="w-fit">
          {sending ? "Sending…" : "Send my details"}
        </Button>
      </CardContent>
    </Card>
  );
}

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

      {paid && order.items.some((i) => i.type === "service") ? (
        order.dfySubmitted ? (
          <Card>
            <CardHeader>
              <CardTitle>We've got your details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your job details are already in. We'll fill out your template and email the
                finished document to you when it's ready.
              </p>
            </CardContent>
          </Card>
        ) : (
          <DfyIntakeForm orderId={order.id} email={order.email} />
        )
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
