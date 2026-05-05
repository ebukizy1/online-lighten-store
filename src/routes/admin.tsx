import { createFileRoute, Outlet, Link, useNavigate, useRouterState, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, LogOut, Plus, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    if (location.pathname === "/admin/login") return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw redirect({ to: "/admin/login" });
    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", session.user.id);
    if (!roles?.some((r) => r.role === "admin")) {
      await supabase.auth.signOut();
      throw redirect({ to: "/admin/login" });
    }
  },
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  if (pathname === "/admin/login") return <Outlet />;

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", icon: Package, exact: false },
    { to: "/admin/products/new", label: "Add Product", icon: Plus, exact: true },
  ] as const;

  return (
    <div className="min-h-screen bg-secondary/40">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink shadow-glow">
            <span className="font-display text-lg text-gold">O</span>
          </span>
          <span className="font-display text-base font-semibold">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {links.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? "bg-ink text-glow" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <a href="/" className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted">
            <Home className="h-3.5 w-3.5" /> View site
          </a>
          <div className="px-3 py-1 text-xs text-muted-foreground">{email}</div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              toast.success("Signed out");
              navigate({ to: "/admin/login" });
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <div className="lg:pl-60">
        <div className="border-b border-border bg-background px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-base font-semibold">OnlineLighten Admin</span>
            <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }} className="text-xs text-muted-foreground">
              Sign out
            </button>
          </div>
          <nav className="mt-3 flex flex-wrap gap-2">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-full border border-border px-3 py-1 text-xs">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
