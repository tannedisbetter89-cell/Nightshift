import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useNightshift } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const settings = useNightshift((s) => s.settings);
  const updateSettings = useNightshift((s) => s.updateSettings);
  const [form, setForm] = useState(settings);

  useEffect(() => {
    if (open) setForm(settings);
  }, [open, settings]);

  function save() {
    updateSettings({
      operatorName: form.operatorName.trim() || "Operator",
      shopName: form.shopName.trim() || "Nightshift Shop",
      payoutUrl: form.payoutUrl.trim(),
      payoutLabel: form.payoutLabel.trim() || "Pay",
    });
    toast.success("Desk saved");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desk</DialogTitle>
          <DialogDescription>
            The shop uses your name and payout link. Gumroad, Stripe Payment Link, PayPal.me, or
            any checkout URL works.
          </DialogDescription>
        </DialogHeader>
        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <Field label="Operator name">
            <Input
              value={form.operatorName}
              onChange={(e) => setForm({ ...form, operatorName: e.target.value })}
              maxLength={48}
            />
          </Field>
          <Field label="Shop name">
            <Input
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              maxLength={48}
            />
          </Field>
          <Field label="Payout link">
            <Input
              value={form.payoutUrl}
              onChange={(e) => setForm({ ...form, payoutUrl: e.target.value })}
              placeholder="https://gumroad.com/l/…"
              inputMode="url"
            />
          </Field>
          <Field label="Buy button label">
            <Input
              value={form.payoutLabel}
              onChange={(e) => setForm({ ...form, payoutLabel: e.target.value })}
              maxLength={24}
            />
          </Field>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save desk</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
