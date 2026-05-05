import { formatPrice } from "./format";

export const WHATSAPP_NUMBER = "2348037477275";

export function whatsappUrl(productName: string, price: number) {
  const text = `Hello, I'm interested in ${productName} for ${formatPrice(price)}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
