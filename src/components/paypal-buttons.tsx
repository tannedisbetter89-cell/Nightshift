import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { loadScript } from "@paypal/paypal-js";
import { toast } from "sonner";
import { captureCheckout, createCheckout } from "@/lib/commerce/checkout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * PayPal checkout for a single product.
 *
 * Flow: createCheckout (server: verify price in DB → PayPal order) →
 * customer approves in the PayPal popup → captureCheckout (server:
 * capture + verify COMPLETED with PayPal's API → record once).
 * The order is marked paid only by the verified capture — never by
 * reaching the success page.
 */
export function PaypalButtons({
  productId,
  clientId,
  currency,
}: {
  productId: string;
  clientId: string;
  currency: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nightshiftOrderRef = useRef<string | null>(null);
  const emailRef = useRef("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    emailRef.current = email;
  }, [email]);

  useEffect(() => {
    let cancelled = false;
    let buttons: { render: (el: HTMLElement) => Promise<void>; close?: () => void } | undefined;

    (async () => {
      try {
        const paypal = await loadScript({ clientId, components: "buttons", currency });
        if (cancelled || !paypal?.Buttons || !containerRef.current) return;
        buttons = paypal.Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "buynow" },
          createOrder: async () => {
            const res = await createCheckout({
              data: { productId, email: emailRef.current || undefined },
            });
            nightshiftOrderRef.current = res.nightshiftOrderId;
            return res.paypalOrderId;
          },
          onApprove: async (data) => {
            setProcessing(true);
            try {
              const res = await captureCheckout({
                data: {
                  nightshiftOrderId: nightshiftOrderRef.current ?? "",
                  paypalOrderId: data.orderID,
                },
              });
              if (res.status !== "paid") {
                toast.error("Payment wasn't confirmed. You have not been charged.");
                return;
              }
              navigate({ to: "/shop/success", search: { order: res.orderId } });
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Payment capture failed. Please try again.",
              );
            } finally {
              setProcessing(false);
            }
          },
          onCancel: () => toast.message("Checkout canceled — no charge was made."),
          onError: () => toast.error("Something went wrong with PayPal. Please try again."),
        });
        await buttons.render(containerRef.current);
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) {
          setFailed(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      try {
        buttons?.close?.();
      } catch {
        // closing an already-closed button set is harmless
      }
    };
  }, [clientId, currency, productId, navigate]);

  if (failed) {
    return (
      <p className="text-sm text-muted-foreground">
        PayPal couldn't load right now. Please check your connection and refresh the page.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checkout-email">Email for delivery</Label>
        <Input
          id="checkout-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Your download link and receipt go here.
        </p>
      </div>
      {loading ? (
        <div className="flex h-12 items-center justify-center rounded-md bg-secondary/60 text-sm text-muted-foreground">
          Loading secure checkout…
        </div>
      ) : null}
      {processing ? (
        <div className="flex h-12 items-center justify-center rounded-md bg-secondary/60 text-sm text-muted-foreground">
          Confirming your payment…
        </div>
      ) : null}
      <div ref={containerRef} aria-busy={loading} />
    </div>
  );
}
