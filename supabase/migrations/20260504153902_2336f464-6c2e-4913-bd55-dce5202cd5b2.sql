
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  old_price numeric(12,2),
  image_url text not null default '',
  category_slug text not null references public.categories(slug) on update cascade,
  featured boolean not null default false,
  stock int not null default 25,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_slug);
create index if not exists products_featured_idx on public.products(featured);

alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone" on public.categories for select using (true);

drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone" on public.products for select using (true);

-- roles
do $$ begin
  create type public.app_role as enum ('admin', 'user');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role); $$;

drop policy if exists "Users can view own roles" on public.user_roles;
create policy "Users can view own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

create policy "Admins can insert products" on public.products
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update products" on public.products
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete products" on public.products
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can manage categories" on public.categories
  for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.categories (slug, name, description) values
  ('chandeliers', 'Chandeliers', 'Statement crystal & modern chandeliers'),
  ('pendant-lights', 'Pendant Lights', 'Elegant hanging pendants'),
  ('led-lights', 'LED Lights', 'Energy efficient modern LEDs'),
  ('wall-brackets', 'Wall Brackets', 'Sconces & wall fixtures'),
  ('ceiling-lights', 'Ceiling Lights', 'Flush & semi-flush ceiling lighting'),
  ('outdoor-lighting', 'Outdoor Lighting', 'Garden, security & landscape lighting')
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product-images" on storage.objects;
create policy "Public read product-images" on storage.objects
  for select using (bucket_id = 'product-images');
drop policy if exists "Admins upload product-images" on storage.objects;
create policy "Admins upload product-images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
drop policy if exists "Admins update product-images" on storage.objects;
create policy "Admins update product-images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
drop policy if exists "Admins delete product-images" on storage.objects;
create policy "Admins delete product-images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
