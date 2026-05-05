import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — OnlineLightenStore" },
      { name: "description", content: "OnlineLightenStore is a curated lighting brand bringing premium chandeliers, pendants and LED fixtures to discerning homes." },
    ],
  }),
});

function AboutPage() {
  return (
    <div>
      <section className="bg-ink text-glow">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Our Story</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-6xl">
            Lighting designed to <span className="gradient-gold-text">live with you</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-glow/80">
            OnlineLightenStore is a curated lighting house. We believe great light is what turns a building into a home — and a home into a memory.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="font-display text-3xl font-semibold">Crafted, not catalogued</h2>
          <p className="mt-4 text-muted-foreground">
            Every chandelier, pendant and sconce in our collection is hand-selected. We work with workshops in Murano, Bohemia and West Africa to bring you fixtures that combine traditional craftsmanship with modern engineering.
          </p>
        </div>
        <div>
          <h2 className="font-display text-3xl font-semibold">A warmer kind of light</h2>
          <p className="mt-4 text-muted-foreground">
            From warm-glow LEDs to dramatic crystal cascades, we curate pieces that flatter people and architecture alike. Beautiful light is the most generous design choice you can make.
          </p>
        </div>
      </section>

      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h3 className="font-display text-3xl font-semibold">Ready to glow?</h3>
          <p className="mt-3 text-muted-foreground">Browse the full collection and find your next centerpiece.</p>
          <Link to="/shop" className="mt-8 inline-flex rounded-full bg-[var(--gold)] px-7 py-3.5 text-sm font-semibold text-[var(--ink)] shadow-glow hover:scale-[1.02]">
            Shop all lighting
          </Link>
        </div>
      </section>
    </div>
  );
}
