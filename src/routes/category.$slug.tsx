import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  head: ({ params }) => ({
    meta: [
      { title: `${humanize(params.slug)} — OnlineLightenStore` },
      { name: "description", content: `Shop ${humanize(params.slug).toLowerCase()} at OnlineLightenStore.` },
    ],
  }),
});

function humanize(s: string) {
  return s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function CategoryPage() {
  const { slug } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const [cat, prods] = await Promise.all([
        supabase.from("categories").select("*").eq("slug", slug).maybeSingle(),
        supabase.from("products").select("id,title,price,old_price,image_url,category_slug").eq("category_slug", slug),
      ]);
      if (cat.error) throw cat.error;
      if (prods.error) throw prods.error;
      if (!cat.data) throw notFound();
      return { category: cat.data, products: prods.data as ProductCardData[] };
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Link to="/shop" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
        ← Back to shop
      </Link>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{humanize(slug)}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{data?.category?.description}</p>

      {isLoading ? (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {(data?.products ?? []).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
