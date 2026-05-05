import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, ZoomIn, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { cart } from "@/lib/cart";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

interface SpecItem {
  label: string;
  value: string;
}

function parseSpecs(raw: unknown): SpecItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => {
      if (s && typeof s === "object" && "label" in s && "value" in s) {
        return {
          label: String((s as Record<string, unknown>).label ?? ""),
          value: String((s as Record<string, unknown>).value ?? ""),
        };
      }
      return null;
    })
    .filter((x): x is SpecItem => !!x && (!!x.label || !!x.value));
}

function ProductPage() {
  const { id } = Route.useParams();
  const [zoom, setZoom] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  const { data: related } = useQuery({
    enabled: !!product,
    queryKey: ["related", product?.category_slug, product?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,title,price,old_price,image_url,category_slug")
        .eq("category_slug", product!.category_slug)
        .neq("id", product!.id)
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data as ProductCardData[];
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }
  if (!product) return null;
  const hasSale = product.old_price && Number(product.old_price) > Number(product.price);
  const specs = parseSpecs((product as { specifications?: unknown }).specifications);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/shop" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        <div
          className="relative aspect-square overflow-hidden rounded-3xl bg-muted shadow-soft"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
        >
          <img
            src={product.image_url}
            alt={product.title}
            className={`h-full w-full object-cover transition-transform duration-700 ${zoom ? "scale-125" : "scale-100"}`}
          />
          <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur">
            <ZoomIn className="h-4 w-4" />
          </span>
        </div>

        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">{product.category_slug.replace(/-/g, " ")}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">{product.title}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <p className="font-display text-3xl font-semibold text-gold">{formatPrice(Number(product.price))}</p>
            {hasSale && (
              <p className="text-lg text-muted-foreground line-through">{formatPrice(Number(product.old_price))}</p>
            )}
          </div>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>

          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> In stock — fast nationwide delivery</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> 2-year manufacturer warranty</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Pay on delivery available</li>
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                cart.add({
                  id: product.id,
                  title: product.title,
                  price: Number(product.price),
                  image_url: product.image_url,
                });
                toast.success("Added to cart");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
            >
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
            <WhatsAppButton productName={product.title} price={Number(product.price)} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Tap to message us — we reply within minutes.</p>
        </div>
      </div>

      {/* SPECIFICATIONS */}
      {specs.length > 0 && (
        <section className="mt-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Details</p>
          <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Technical specifications</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <dl className="divide-y divide-border">
              {specs.map((s, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 px-5 py-3.5 text-sm sm:grid-cols-4">
                  <dt className="col-span-1 font-medium text-muted-foreground">{s.label}</dt>
                  <dd className="col-span-2 sm:col-span-3 text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* RELATED PRODUCTS */}
      {related && related.length > 0 && (
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold">You may also like</p>
              <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Related products</h2>
            </div>
            <Link to="/category/$slug" params={{ slug: product.category_slug }} className="text-xs font-medium text-muted-foreground hover:text-foreground sm:text-sm">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
