-- Add structured technical specifications to products
alter table public.products
  add column if not exists specifications jsonb not null default '[]'::jsonb;

comment on column public.products.specifications is
  'Array of {label, value} objects for product technical specifications.';
