import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, ZoomIn, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { cart } from "@/lib/cart";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

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
    </div>
  );
}
