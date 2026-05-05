import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products/")({
  component: ProductsList,
});

function ProductsList() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase.from("products").update({ featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["featured"] });
      toast.success("Updated");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product deleted");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your full catalog.</p>
        </div>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90">
          <Plus className="h-4 w-4" /> Add
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : !data?.length ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No products yet.{" "}
            <Link to="/admin/products/new" className="font-medium text-foreground underline">
              Add your first product
            </Link>
            .
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-center">Featured</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-b-0">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.category_slug}</td>
                  <td className="p-3 font-medium">{formatPrice(Number(p.price))}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleFeatured.mutate({ id: p.id, featured: !p.featured })}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${p.featured ? "bg-[var(--gold)] text-[var(--ink)]" : "border border-border text-muted-foreground hover:border-foreground"}`}
                    >
                      <Star className={`h-3 w-3 ${p.featured ? "fill-current" : ""}`} />
                      {p.featured ? "Featured" : "Off"}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to="/admin/products/$id" params={{ id: p.id }} className="rounded-md p-2 hover:bg-muted">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => { if (confirm(`Delete "${p.title}"?`)) del.mutate(p.id); }}
                        className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
