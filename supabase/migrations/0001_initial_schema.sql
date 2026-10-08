create extension if not exists pgcrypto;

create type public.product_status as enum ('draft', 'active', 'archived');
create type public.order_status as enum (
  'new', 'contacted', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
);
create type public.storage_asset_type as enum (
  'product_image', 'collection_image', 'ai_upload', 'ai_output', 'other'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  sale_price numeric(12,2) check (sale_price is null or (sale_price >= 0 and sale_price <= price)),
  category_id uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  status public.product_status not null default 'draft',
  featured boolean not null default false,
  new_arrival boolean not null default false,
  bestseller boolean not null default false,
  custom_fit boolean not null default false,
  sizes text[] not null default '{}',
  custom_measurements_enabled boolean not null default false,
  tags text[] not null default '{}',
  stock_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null unique,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  asset_size_bytes bigint not null default 0 check (asset_size_bytes >= 0),
  created_at timestamptz not null default now()
);

create table public.size_charts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size_label text not null,
  bust_min_cm numeric(6,2),
  bust_max_cm numeric(6,2),
  waist_min_cm numeric(6,2),
  waist_max_cm numeric(6,2),
  hips_min_cm numeric(6,2),
  hips_max_cm numeric(6,2),
  created_at timestamptz not null default now(),
  unique(product_id, size_label)
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  whatsapp_phone text,
  email text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  pincode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  phone text not null,
  whatsapp_phone text,
  email text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  pincode text,
  customer_notes text,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  total numeric(12,2) not null check (total >= 0),
  status public.order_status not null default 'new',
  whatsapp_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  size_label text,
  measurements jsonb not null default '{}'::jsonb,
  ai_design_url text,
  created_at timestamptz not null default now()
);

create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  customer_session_id text,
  source_storage_path text,
  prompt_options jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued','processing','completed','failed')),
  output_urls jsonb not null default '[]'::jsonb,
  selected_output_index integer,
  provider text,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.site_settings (
  id boolean primary key default true,
  brand_name text not null default 'Svastida',
  whatsapp_admin_number text,
  business_email text,
  business_phone text,
  instagram_url text,
  facebook_url text,
  address text,
  currency_code text not null default 'INR',
  storage_limit_bytes bigint not null default 17179869184 check (storage_limit_bytes > 0),
  about_title text,
  about_content text,
  updated_at timestamptz not null default now()
);

create table public.storage_usage_snapshots (
  id uuid primary key default gen_random_uuid(),
  total_bytes bigint not null default 0 check (total_bytes >= 0),
  product_image_bytes bigint not null default 0 check (product_image_bytes >= 0),
  collection_image_bytes bigint not null default 0 check (collection_image_bytes >= 0),
  ai_upload_bytes bigint not null default 0 check (ai_upload_bytes >= 0),
  ai_output_bytes bigint not null default 0 check (ai_output_bytes >= 0),
  other_bytes bigint not null default 0 check (other_bytes >= 0),
  file_count integer not null default 0 check (file_count >= 0),
  measured_at timestamptz not null default now(),
  measured_by uuid references auth.users(id) on delete set null
);

create or replace function public.make_order_number()
returns trigger
language plpgsql
as $$
begin
  new.order_number := 'SV-' || to_char(now(), 'YYYYMMDD') || '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  return new;
end;
$$;

create trigger set_order_number
before insert on public.orders
for each row
when (new.order_number is null or new.order_number = '')
execute function public.make_order_number();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger collections_updated_at before update on public.collections
for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger customers_updated_at before update on public.customers
for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders
for each row execute function public.set_updated_at();
create trigger site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

create index products_status_idx on public.products(status);
create index products_category_idx on public.products(category_id);
create index products_collection_idx on public.products(collection_id);
create index products_featured_idx on public.products(featured) where featured = true;
create index product_images_product_idx on public.product_images(product_id, sort_order);
create index orders_status_idx on public.orders(status);
create index orders_created_at_idx on public.orders(created_at desc);
create index order_items_order_idx on public.order_items(order_id);
create index ai_generations_status_idx on public.ai_generations(status);

insert into public.site_settings (id, brand_name)
values (true, 'Svastida')
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.size_charts enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.ai_generations enable row level security;
alter table public.site_settings enable row level security;
alter table public.storage_usage_snapshots enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "public can read active categories"
on public.categories for select
to anon, authenticated
using (is_active = true);

create policy "public can read active collections"
on public.collections for select
to anon, authenticated
using (is_active = true);

create policy "public can read active products"
on public.products for select
to anon, authenticated
using (status = 'active');

create policy "public can read product images"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);

create policy "public can read size charts"
on public.size_charts for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);

create policy "public can read site settings"
on public.site_settings for select
to anon, authenticated
using (id = true);

create policy "admins manage categories"
on public.categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage collections"
on public.collections for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage product images"
on public.product_images for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage size charts"
on public.size_charts for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can create customer records"
on public.customers for insert
to anon, authenticated
with check (true);

create policy "admins read customers"
on public.customers for select
to authenticated
using (public.is_admin());

create policy "public can create orders"
on public.orders for insert
to anon, authenticated
with check (true);

create policy "admins manage orders"
on public.orders for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can create order items"
on public.order_items for insert
to anon, authenticated
with check (true);

create policy "admins manage order items"
on public.order_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can create ai generations"
on public.ai_generations for insert
to anon, authenticated
with check (true);

create policy "public can read own-session ai generations"
on public.ai_generations for select
to anon, authenticated
using (true);

create policy "admins manage ai generations"
on public.ai_generations for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage settings"
on public.site_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins read storage snapshots"
on public.storage_usage_snapshots for select
to authenticated
using (public.is_admin());

create policy "admins create storage snapshots"
on public.storage_usage_snapshots for insert
to authenticated
with check (public.is_admin());

create policy "admins manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin() or id = auth.uid())
with check (public.is_admin() or id = auth.uid());

