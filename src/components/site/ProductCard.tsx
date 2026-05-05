import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { WhatsAppButton } from "./WhatsAppButton";
import { cart } from "@/lib/cart";
import { toast } from "sonner";

export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  old_price?: number | null;
  image_url: string;
  category_slug: string;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const hasSale = product.old_price && product.old_price > product.price;
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    cart.add({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
    });
    toast.success(`${product.title} added to cart`);
  };
  return (
    <div className="product-card group block overflow-hidden rounded-2xl border border-border/70 bg-card transition hover:shadow-soft">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {hasSale && (
            <span className="absolute left-3 top-3 rounded-full bg-[var(--gold)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">
              Sale
            </span>
          )}
        </div>
      </Link>
      <div className="p-2.5 sm:p-4">
        <h3 className="truncate font-display text-[13px] font-semibold leading-tight sm:text-base">{product.title}</h3>
        <p className="mt-0.5 text-[9px] uppercase tracking-widest text-muted-foreground sm:text-[10px]">
          {product.category_slug.replace(/-/g, " ")}
        </p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-display text-sm font-semibold text-gold sm:text-base">{formatPrice(product.price)}</span>
          {hasSale && (
            <span className="text-[10px] text-muted-foreground line-through sm:text-xs">{formatPrice(product.old_price!)}</span>
          )}
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:gap-2">
          <button
            onClick={addToCart}
            className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-foreground px-2 text-[11px] font-semibold text-background hover:opacity-90 sm:h-9 sm:rounded-full sm:text-xs"
          >
            <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Add
          </button>
          <WhatsAppButton variant="compact" productName={product.title} price={product.price} className="h-8 rounded-lg px-2 text-[11px] sm:h-9 sm:rounded-full sm:text-xs" />
        </div>
      </div>
    </div>
  );
}
