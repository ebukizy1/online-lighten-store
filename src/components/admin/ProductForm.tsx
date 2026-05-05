import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UploadCloud, Loader2 } from "lucide-react";

interface ProductRecord {
  id: string;
  title: string;
  description: string;
  price: number;
  old_price: number | null;
  category_slug: string;
  image_url: string;
  featured: boolean;
}

interface Props {
  initial?: ProductRecord;
  onSaved: () => void;
}

export function ProductForm({ initial, onSaved }: Props) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [oldPrice, setOldPrice] = useState(initial?.old_price?.toString() ?? "");
  const [categorySlug, setCategorySlug] = useState(initial?.category_slug ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("slug,name").order("name");
      return data ?? [];
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600", upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return toast.error("Please upload an image");
    if (!categorySlug) return toast.error("Please select a category");
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        old_price: oldPrice ? Number(oldPrice) : null,
        category_slug: categorySlug,
        image_url: imageUrl,
        featured,
      };
      if (initial) {
        const { error } = await supabase.from("products").update(payload).eq("id", initial.id);
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Product created");
      }
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["featured"] });
      onSaved();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-background p-6 shadow-sm">
      <Field label="Name">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Description">
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Price (₦)">
          <input required type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Old price (optional)">
          <input type="number" min={0} step="0.01" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className={inputCls} />
        </Field>
      </div>

      <Field label="Category">
        <select required value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className={inputCls}>
          <option value="">Select a category…</option>
          {categories?.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </Field>

      <Field label="Product image">
        <div className="flex items-center gap-4">
          {imageUrl && <img src={imageUrl} alt="" className="h-20 w-20 rounded-lg border border-border object-cover" />}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm hover:bg-muted">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {uploading ? "Uploading…" : imageUrl ? "Replace image" : "Upload image"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </Field>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-secondary/40 p-4">
        <div>
          <div className="text-sm font-semibold">Featured on homepage</div>
          <div className="text-xs text-muted-foreground">Featured products appear in the homepage spotlight.</div>
        </div>
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-muted transition checked:bg-[var(--gold)] relative before:absolute before:left-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition checked:before:translate-x-4" />
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving || uploading} className="flex-1 rounded-full bg-foreground py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50">
          {saving ? "Saving…" : initial ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
