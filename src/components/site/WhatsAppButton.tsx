import { whatsappUrl } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

interface Props {
  productName: string;
  price: number;
  variant?: "primary" | "compact" | "floating";
  className?: string;
}

export function WhatsAppButton({ productName, price, variant = "primary", className = "" }: Props) {
  const href = whatsappUrl(productName, price);
  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Order ${productName} on WhatsApp`}
        className={`fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-900/40 ring-4 ring-white/20 transition-transform hover:scale-110 ${className}`}
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    );
  }
  if (variant === "compact") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 ${className}`}
      >
        <MessageCircle className="h-3.5 w-3.5" /> Order
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:brightness-110 hover:scale-[1.02] ${className}`}
    >
      <MessageCircle className="h-4 w-4" /> Order on WhatsApp
    </a>
  );
}
