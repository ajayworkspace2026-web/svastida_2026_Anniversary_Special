create table if not exists public.about_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  title text,
  alt_text text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists about_images_active_sort_idx
  on public.about_images (is_active, sort_order, created_at desc);

alter table public.about_images enable row level security;

drop policy if exists "anon read active about images" on public.about_images;
create policy "anon read active about images"
on public.about_images for select
to anon
using (is_active = true);

drop policy if exists "authenticated read about images" on public.about_images;
create policy "authenticated read about images"
on public.about_images for select
to authenticated
using (is_active = true or private.is_admin());

drop policy if exists "admins insert about images" on public.about_images;
create policy "admins insert about images"
on public.about_images for insert
to authenticated
with check (private.is_admin());

drop policy if exists "admins update about images" on public.about_images;
create policy "admins update about images"
on public.about_images for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "admins delete about images" on public.about_images;
create policy "admins delete about images"
on public.about_images for delete
to authenticated
using (private.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'about-images',
  'about-images',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update
set public = true,
    file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif'];

drop policy if exists "public read about images" on storage.objects;
create policy "public read about images"
on storage.objects for select
to anon
using (bucket_id = 'about-images');

drop policy if exists "admins manage about images storage" on storage.objects;
create policy "admins manage about images storage"
on storage.objects for all
to authenticated
using (private.is_admin() and bucket_id = 'about-images')
with check (private.is_admin() and bucket_id = 'about-images');