import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.user) {
          toast.success("Account created. If you're the first user, run the admin grant SQL — see below.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { data: roles } = await supabase
          .from("user_roles").select("role").eq("user_id", data.user.id);
        if (!roles?.some((r) => r.role === "admin")) {
          await supabase.auth.signOut();
          throw new Error("This account is not an admin.");
        }
        toast.success("Welcome back");
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2 text-glow">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-glow/10 shadow-glow">
            <span className="font-display text-lg text-gold">O</span>
          </span>
          <span className="font-display text-lg font-semibold">OnlineLighten Admin</span>
        </div>
        <form onSubmit={handle} className="space-y-3 rounded-2xl border border-glow/10 bg-background p-6 shadow-2xl">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
            <Sparkles className="h-3 w-3" /> {mode === "signin" ? "Sign in" : "Create account"}
          </div>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
          />
          <input
            type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
          />
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-foreground py-2.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50">
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="block w-full text-center text-xs text-muted-foreground hover:text-foreground">
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </form>
        <a href="/" className="mt-6 block text-center text-xs text-glow/60 hover:text-glow">← Back to store</a>
      </div>
    </div>
  );
}
