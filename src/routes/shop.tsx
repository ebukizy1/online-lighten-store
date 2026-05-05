import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop Lighting — OnlineLightenStore" },
      { name: "description", content: "Browse our full collection of chandeliers, pendants, LED, wall and outdoor lighting." },
    ],
  }),
});

const cats = [
  { slug: "all", name: "All" },
  { slug: "chandeliers", name: "Chandeliers" },
  { slug: "pendant-lights", name: "Pendants" },
  { slug: "led-lights", name: "LED" },
  { slug: "wall-brackets", name: "Wall" },
  { slug: "ceiling-lights", name: "Ceiling" },
  { slug: "outdoor-lighting", name: "Outdoor" },
];

const PAGE_SIZE = 8;

function ShopPage() {
  const [page, setPage] = useState(1);
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,title,price,old_price,image_url,category_slug")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProductCardData[];
    },
  });

  const totalPages = Math.max(1, Math.ceil((products?.length ?? 0) / PAGE_SIZE));
  const paged = useMemo(
    () => (products ?? []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [products, page],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-6 sm:mb-10">
        <p className="text-[10px] uppercase tracking-[0.25em] text-gold sm:text-xs">Catalog</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-5xl">All Lighting</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Discover our complete collection — from grand crystal chandeliers to energy-efficient LEDs.
        </p>
      </div>

      <div className="mb-6 -mx-4 overflow-x-auto px-4 sm:mb-8 sm:mx-0 sm:px-0">
        <div className="flex gap-2 whitespace-nowrap">
          {cats.map((c) =>
            c.slug === "all" ? (
              <Link key={c.slug} to="/shop" className="rounded-full border border-foreground bg-foreground px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-background sm:text-xs">
                {c.name}
              </Link>
            ) : (
              <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="rounded-full border border-border px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:border-foreground hover:text-foreground sm:text-xs">
                {c.name}
              </Link>
            ),
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <>
          <div key={page} className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 animate-fade-in-page">
            {paged.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="grid h-9 w-9 place-items-center rounded-full border border-border disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 min-w-9 rounded-full border px-3 text-xs font-semibold ${
                    page === i + 1 ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="grid h-9 w-9 place-items-center rounded-full border border-border disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
