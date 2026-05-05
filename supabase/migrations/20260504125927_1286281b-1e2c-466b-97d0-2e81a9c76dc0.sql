
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric(12,2) not null check (price >= 0),
  image_url text not null,
  category_slug text not null references public.categories(slug) on update cascade,
  featured boolean not null default false,
  stock int not null default 25,
  created_at timestamptz not null default now()
);

create index on public.products(category_slug);
create index on public.products(featured);

alter table public.categories enable row level security;
alter table public.products enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

create policy "Products are viewable by everyone"
  on public.products for select using (true);

create policy "Authenticated can insert products"
  on public.products for insert to authenticated with check (true);
create policy "Authenticated can update products"
  on public.products for update to authenticated using (true);
create policy "Authenticated can delete products"
  on public.products for delete to authenticated using (true);
