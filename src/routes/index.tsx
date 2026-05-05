import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Eye,
  ChevronLeft,
  ChevronRight,
  Crown,
  Lightbulb,
  Lamp,
  PanelTop,
  Sun,
  TreePine,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import heroImg from "@/assets/hero-chandelier.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "OnlineLighten — Modern Lighting, Delivered" },
      { name: "description", content: "Chandeliers, LEDs and outdoor lighting for modern homes. Order on WhatsApp." },
    ],
  }),
});

const categories = [
  { slug: "chandeliers", name: "Chandeliers", Icon: Crown },
  { slug: "pendant-lights", name: "Pendant", Icon: Lamp },
  { slug: "led-lights", name: "LED", Icon: Lightbulb },
  { slug: "wall-brackets", name: "Wall", Icon: PanelTop },
  { slug: "ceiling-lights", name: "Ceiling", Icon: Sun },
  { slug: "outdoor-lighting", name: "Outdoor", Icon: TreePine },
];

function Home() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,title,price,old_price,image_url,category_slug")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data as ProductCardData[];
    },
  });

  const { data: allProducts, isLoading: loadingAll } = useQuery({
    queryKey: ["products", "home-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,title,price,old_price,image_url,category_slug")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProductCardData[];
    },
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-glow">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink/90" />

        <div className="pointer-events-none absolute -top-32 -left-24 h-[380px] w-[380px] rounded-full bg-amber-200/20 opacity-40 blur-3xl animate-glow" />
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-[440px] w-[440px] rounded-full bg-orange-200/10 opacity-30 blur-3xl animate-glow" style={{ animationDelay: "2s" }} />

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-4 py-20 sm:min-h-[88vh] sm:px-6 lg:px-8">
          <div className="max-w-xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-glow/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold">
              <Sparkles className="h-3 w-3" /> OnlineLighten
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              Light that <span className="gradient-gold-text">moves you.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-glow/75 sm:text-base">
              Modern fixtures for every room. Delivered nationwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-glow transition-all hover:scale-[1.02]"
              >
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-glow/30 px-6 py-3 text-sm font-semibold text-glow hover:bg-glow/10"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* USP */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 grid-cols-3 sm:px-6 sm:py-10 lg:px-8">
          {[
            { icon: Zap, title: "Power" },
            { icon: Eye, title: "Visibility" },
            { icon: ShieldCheck, title: "Security" },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-gold">
                <f.icon className="h-4 w-4" />
              </span>
              <p className="font-display text-sm font-semibold sm:text-base">{f.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-6 flex items-end justify-between sm:mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Collections</p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-4xl">Shop by category</h2>
          </div>
          <Link to="/shop" className="text-xs font-medium text-muted-foreground hover:text-foreground sm:text-sm">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {categories.map(({ slug, name, Icon }) => (
            <Link
              key={slug}
              to="/category/$slug"
              params={{ slug }}
              className="group category-tile relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-ink via-ink to-zinc-900 p-3 text-center text-glow transition-all duration-500 hover:border-gold hover:shadow-glow"
            >
              {/* shimmer sweep */}
              <span className="shimmer pointer-events-none absolute inset-0" aria-hidden />
              <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold/20 blur-2xl transition-opacity group-hover:opacity-100 sm:opacity-60" />
              <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gold/10 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-ink group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <p className="relative mt-2 font-display text-sm font-semibold sm:text-base">{name}</p>
              <p className="relative mt-0.5 text-[10px] uppercase tracking-widest text-gold/80">
                Shop →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED CAROUSEL */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-6 flex items-end justify-between sm:mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Curated</p>
              <h2 className="mt-1 font-display text-2xl font-semibold sm:text-4xl">Featured</h2>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <FeaturedCarousel products={featured} />
          ) : (
            <p className="text-sm text-muted-foreground">No featured products yet.</p>
          )}
        </div>
      </section>

      {/* ALL PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-6 flex items-end justify-between sm:mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Catalog</p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-4xl">All products</h2>
          </div>
          <Link to="/shop" className="text-xs font-medium text-muted-foreground hover:text-foreground sm:text-sm">
            View all →
          </Link>
        </div>
        {loadingAll ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : allProducts && allProducts.length > 0 ? (
          <AllProductsPaginated products={allProducts} />
        ) : (
          <p className="text-sm text-muted-foreground">No products yet.</p>
        )}
      </section>
    </div>
  );
}

const PAGE_SIZE = 8;

function AllProductsPaginated({ products }: { products: ProductCardData[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paged = useMemo(
    () => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [products, page],
  );
  const go = (p: number) => {
    setPage(p);
    const el = document.getElementById("home-all-products-top");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div id="home-all-products-top">
      <div key={page} className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 animate-fade-in-page">
        {paged.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => go(Math.max(1, page - 1))}
            disabled={page === 1}
            className="grid h-9 w-9 place-items-center rounded-full border border-border disabled:opacity-40 transition hover:bg-muted"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i + 1)}
              className={`h-9 min-w-9 rounded-full border px-3 text-xs font-semibold ${
                page === i + 1
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:bg-muted"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => go(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="grid h-9 w-9 place-items-center rounded-full border border-border disabled:opacity-40 transition hover:bg-muted"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function FeaturedCarousel({ products }: { products: ProductCardData[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })],
  );
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    onSelect();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-3 sm:-ml-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="min-w-0 shrink-0 grow-0 basis-1/2 pl-3 sm:basis-1/3 sm:pl-4 lg:basis-1/4"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      <button
        aria-label="Previous"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute -left-2 top-1/3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-soft hover:bg-muted sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        aria-label="Next"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute -right-2 top-1/3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-soft hover:bg-muted sm:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="mt-6 flex justify-center gap-1.5">
        {snaps.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === selected ? "w-6 bg-gold" : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
