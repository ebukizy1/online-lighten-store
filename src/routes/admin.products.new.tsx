import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProduct,
});

function NewProduct() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold">Add Product</h1>
      <p className="mt-1 text-sm text-muted-foreground">Create a new lighting product for your catalog.</p>
      <div className="mt-6">
        <ProductForm onSaved={() => navigate({ to: "/admin/products" })} />
      </div>
    </div>
  );
}
