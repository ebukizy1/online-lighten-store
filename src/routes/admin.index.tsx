import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Tag, Star, Banknote, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [{ data: products }, { data: cats }] = await Promise.all([
        supabase.from("products").select("id,price,featured,category_slug"),
        supabase.from("categories").select("id"),
      ]);
      const total = products?.length ?? 0;
      const featured = products?.filter((p) => p.featured).length ?? 0;
      const value = products?.reduce((s, p) => s + Number(p.price), 0) ?? 0;
      return { total, featured, value, categories: cats?.length ?? 0 };
    },
  });

  const cards = [
    { label: "Total Products", value: stats?.total ?? "—", icon: Package },
    { label: "Categories", value: stats?.categories ?? "—", icon: Tag },
    { label: "Featured", value: stats?.featured ?? "—", icon: Star },
    { label: "Catalog Value", value: stats ? formatPrice(stats.value) : "—", icon: Banknote },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of your lighting catalog.</p>
        </div>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90">
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-foreground">
                <c.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-background p-6">
        <h2 className="font-display text-xl font-semibold">Quick start</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>1. Add products with images, price and category.</li>
          <li>2. Toggle <span className="font-semibold text-foreground">Featured</span> to surface them on the homepage.</li>
          <li>3. Customers tap WhatsApp on each product to order instantly.</li>
        </ol>
      </div>
    </div>
  );
}
