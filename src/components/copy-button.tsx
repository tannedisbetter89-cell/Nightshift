import { Copy } from "lucide-react";
import { toast } from "sonner";
import { copyText } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CopyButton({
  label,
  text,
  variant = "ghost",
}: {
  label: string;
  text: string;
  variant?: "ghost" | "secondary" | "outline";
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size="icon-sm"
      aria-label={`Copy ${label}`}
      onClick={async () => {
        await copyText(text);
        toast.success(`${label} copied`);
      }}
    >
      <Copy className="size-4" />
    </Button>
  );
}
