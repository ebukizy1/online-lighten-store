import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold">Edit Product</h1>
      {isLoading ? (
        <div className="mt-6 h-96 animate-pulse rounded-xl bg-muted" />
      ) : data ? (
        <div className="mt-6">
          <ProductForm initial={data} onSaved={() => navigate({ to: "/admin/products" })} />
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">Product not found.</p>
      )}
    </div>
  );
}
