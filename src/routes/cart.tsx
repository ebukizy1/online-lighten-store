import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart, cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, total, count } = useCart();

  const checkout = () => {
    if (!items.length) return;
    const lines = items.map(
      (i) => `• ${i.title} × ${i.qty} — ${formatPrice(i.price * i.qty)}`
    );
    const text = `Hello, I'd like to order:\n\n${lines.join("\n")}\n\nTotal: ${formatPrice(total)}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">
        Your Cart{" "}
        <span className="text-base text-muted-foreground">
          ({count} {count === 1 ? "item" : "items"})
        </span>
      </h1>

      {!items.length ? (
        <div className="mt-12 grid place-items-center rounded-2xl border border-dashed border-border p-16 text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Your cart is empty.</p>
          <Link
            to="/shop"
            className="mt-4 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:opacity-90"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,360px]">
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-4 p-4">
                <img
                  src={i.image_url}
                  alt={i.title}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{i.title}</p>
                  <p className="mt-1 text-sm text-gold">{formatPrice(i.price)}</p>
                  <div className="mt-2 inline-flex items-center rounded-full border border-border">
                    <button
                      onClick={() => cart.setQty(i.id, i.qty - 1)}
                      className="grid h-8 w-8 place-items-center hover:bg-muted"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{i.qty}</span>
                    <button
                      onClick={() => cart.setQty(i.id, i.qty + 1)}
                      className="grid h-8 w-8 place-items-center hover:bg-muted"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(i.price * i.qty)}</p>
                  <button
                    onClick={() => cart.remove(i.id)}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-border bg-background p-6">
            <h2 className="font-display text-lg font-semibold">Summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-muted-foreground">Calculated on WhatsApp</span>
            </div>
            <div className="mt-4 border-t border-border pt-4 flex justify-between">
              <span className="font-display font-semibold">Total</span>
              <span className="font-display text-lg font-semibold text-gold">
                {formatPrice(total)}
              </span>
            </div>
            <button
              onClick={checkout}
              className="mt-6 w-full rounded-full bg-[#25D366] py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Checkout on WhatsApp
            </button>
            <button
              onClick={() => cart.clear()}
              className="mt-2 w-full rounded-full border border-border py-2.5 text-xs text-muted-foreground hover:bg-muted"
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
