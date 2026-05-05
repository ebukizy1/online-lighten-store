import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-ink text-glow">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-glow/10 shadow-glow">
              <span className="font-display text-lg text-gold">O</span>
            </span>
            <span className="font-display text-lg font-semibold">
              OnlineLighten<span className="text-gold">Store</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-glow/70">
            Hand-picked chandeliers, pendants, LED, wall and outdoor lighting —
            crafted to elevate every interior.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-gold">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-glow/70">
            <li><Link to="/shop" className="hover:text-glow">All products</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "chandeliers" }} className="hover:text-glow">Chandeliers</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "pendant-lights" }} className="hover:text-glow">Pendants</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "led-lights" }} className="hover:text-glow">LED Lights</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-gold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-glow/70">
            <li><Link to="/about" className="hover:text-glow">About</Link></li>
            <li><a href="mailto:hello@onlinelightenstore.com" className="hover:text-glow">Contact</a></li>
            <li><a href="/admin/login" className="text-glow/40 hover:text-gold">Admin</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-glow/10 py-6 text-center text-xs text-glow/50">
        © {new Date().getFullYear()} OnlineLightenStore. All rights reserved.
      </div>
    </footer>
  );
}
