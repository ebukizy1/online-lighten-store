import { useEffect, useState } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url: string;
  qty: number;
}

const KEY = "ol_cart_v1";
const EVT = "ol-cart-change";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVT));
}

export const cart = {
  get: read,
  add(item: Omit<CartItem, "qty">, qty = 1) {
    const items = read();
    const existing = items.find((i) => i.id === item.id);
    if (existing) existing.qty += qty;
    else items.push({ ...item, qty });
    write(items);
  },
  setQty(id: string, qty: number) {
    const items = read()
      .map((i) => (i.id === id ? { ...i, qty } : i))
      .filter((i) => i.qty > 0);
    write(items);
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => read());
  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  return { items, count, total };
}
