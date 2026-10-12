import { useRef, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Upload, Plus } from "lucide-react";
import {
  deskListProducts,
  deskUpdateProduct,
  deskCreateProduct,
  deskUploadDeliverable,
} from "@/lib/commerce/desk";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/desk/products")({
  loader: () => deskListProducts(),
  component: DeskProducts,
});

type AdminProduct = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  niche: string;
  type: string;
  price_cents: number;
  currency: string;
  listed: boolean;
  has_file: boolean;
};

function DeskProducts() {
  const products = Route.useLoaderData() as AdminProduct[];
  const router = useRouter();
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  async function refresh() {
    await router.invalidate();
  }

  async function saveEdit(patch: Partial<AdminProduct> & { priceUsd?: number }) {
    if (!editing) return;
    try {
      const data: Record<string, unknown> = {};
      if (patch.title !== undefined) data.title = patch.title;
      if (patch.tagline !== undefined) data.tagline = patch.tagline;
      if (patch.listed !== undefined) data.listed = patch.listed;
      if (patch.priceUsd !== undefined) data.price_cents = Math.round(patch.priceUsd * 100);
      await deskUpdateProduct({ data: { id: editing.id, ...data } });
      toast.success("Product updated.");
      setEditing(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
  }

  async function create(form: FormData) {
    try {
      await deskCreateProduct({
        data: {
          slug: String(form.get("slug")),
          title: String(form.get("title")),
          price_cents: Math.round(Number(form.get("price")) * 100),
          type: "guide",
          listed: false,
        },
      });
      toast.success("Product created (unlisted).");
      setCreating(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Create failed.");
    }
  }

  function pickFile(productId: string) {
    setUploadTarget(productId);
    fileRef.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !uploadTarget) return;
    setUploading(uploadTarget);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error("Couldn't read file."));
        r.readAsDataURL(file);
      });
      await deskUploadDeliverable({
        data: { productId: uploadTarget, filename: file.name, dataUrl },
      });
      toast.success(`Deliverable attached to product.`);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(null);
      setUploadTarget(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreating((v) => !v)}>
          <Plus className="size-4" />
          New product
        </Button>
      </div>

      {creating ? (
        <Card>
          <CardHeader>
            <CardTitle>New product</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-3 sm:grid-cols-3"
              onSubmit={(e) => {
                e.preventDefault();
                create(new FormData(e.currentTarget));
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="np-slug">Slug</Label>
                <Input id="np-slug" name="slug" required placeholder="my-guide" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="np-title">Title</Label>
                <Input id="np-title" name="title" required placeholder="My Guide" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="np-price">Price (USD)</Label>
                <Input id="np-price" name="price" type="number" min="0" step="0.01" required placeholder="27" />
              </div>
              <div className="sm:col-span-3">
                <Button type="submit">Create unlisted</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <input ref={fileRef} type="file" className="hidden" onChange={onFile} />

      <div className="grid gap-3">
        {products.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="font-medium">{p.title}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{p.id}</span>
                  <span>{formatUsd(p.price_cents / 100)}</span>
                  <Badge variant={p.listed ? "live" : "outline"}>
                    {p.listed ? "listed" : "hidden"}
                  </Badge>
                  <Badge variant={p.has_file ? "live" : "idle"}>
                    {p.has_file ? "file attached" : "no file"}
                  </Badge>
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => pickFile(p.id)} disabled={uploading === p.id}>
                  <Upload className="size-3.5" />
                  {uploading === p.id ? "Uploading…" : "Upload file"}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setEditing(p)}>
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit — {editing.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                saveEdit({
                  title: String(f.get("title")),
                  tagline: String(f.get("tagline")),
                  priceUsd: Number(f.get("price")),
                  listed: f.get("listed") === "on",
                });
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ep-title">Title</Label>
                <Input id="ep-title" name="title" defaultValue={editing.title} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ep-price">Price (USD)</Label>
                <Input
                  id="ep-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={(editing.price_cents / 100).toFixed(2)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="ep-tagline">Tagline</Label>
                <Input id="ep-tagline" name="tagline" defaultValue={editing.tagline} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="listed" defaultChecked={editing.listed} />
                Listed in the shop
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit">Save</Button>
                <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
