create schema if not exists private;

alter function public.is_admin() set schema private;
alter function private.is_admin() set search_path = public;

revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "public and admins read categories" on public.categories;
create policy "anon read active categories"
on public.categories for select
to anon
using (is_active = true);
create policy "authenticated read categories"
on public.categories for select
to authenticated
using (is_active = true or private.is_admin());

drop policy if exists "public and admins read collections" on public.collections;
create policy "anon read active collections"
on public.collections for select
to anon
using (is_active = true);
create policy "authenticated read collections"
on public.collections for select
to authenticated
using (is_active = true or private.is_admin());

drop policy if exists "public and admins read products" on public.products;
create policy "anon read active products"
on public.products for select
to anon
using (status = 'active');
create policy "authenticated read products"
on public.products for select
to authenticated
using (status = 'active' or private.is_admin());

drop policy if exists "public and admins read product images" on public.product_images;
create policy "anon read product images"
on public.product_images for select
to anon
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);
create policy "authenticated read product images"
on public.product_images for select
to authenticated
using (
  private.is_admin() or exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);

drop policy if exists "public and admins read size charts" on public.size_charts;
create policy "anon read size charts"
on public.size_charts for select
to anon
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);
create policy "authenticated read size charts"
on public.size_charts for select
to authenticated
using (
  private.is_admin() or exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);

drop policy if exists "public and admins read site settings" on public.site_settings;
create policy "anon read site settings"
on public.site_settings for select
to anon
using (id = true);
create policy "authenticated read site settings"
on public.site_settings for select
to authenticated
using (id = true);

drop policy if exists "admins insert categories" on public.categories;
create policy "admins insert categories"
on public.categories for insert
to authenticated
with check (private.is_admin());
drop policy if exists "admins update categories" on public.categories;
create policy "admins update categories"
on public.categories for update
to authenticated
using (private.is_admin())
with check (private.is_admin());
drop policy if exists "admins delete categories" on public.categories;
create policy "admins delete categories"
on public.categories for delete
to authenticated
using (private.is_admin());

drop policy if exists "admins insert collections" on public.collections;
create policy "admins insert collections"
on public.collections for insert
to authenticated
with check (private.is_admin());
drop policy if exists "admins update collections" on public.collections;
create policy "admins update collections"
on public.collections for update
to authenticated
using (private.is_admin())
with check (private.is_admin());
drop policy if exists "admins delete collections" on public.collections;
create policy "admins delete collections"
on public.collections for delete
to authenticated
using (private.is_admin());

drop policy if exists "admins insert products" on public.products;
create policy "admins insert products"
on public.products for insert
to authenticated
with check (private.is_admin());
drop policy if exists "admins update products" on public.products;
create policy "admins update products"
on public.products for update
to authenticated
using (private.is_admin())
with check (private.is_admin());
drop policy if exists "admins delete products" on public.products;
create policy "admins delete products"
on public.products for delete
to authenticated
using (private.is_admin());

drop policy if exists "admins insert product images" on public.product_images;
create policy "admins insert product images"
on public.product_images for insert
to authenticated
with check (private.is_admin());
drop policy if exists "admins update product images" on public.product_images;
create policy "admins update product images"
on public.product_images for update
to authenticated
using (private.is_admin())
with check (private.is_admin());
drop policy if exists "admins delete product images" on public.product_images;
create policy "admins delete product images"
on public.product_images for delete
to authenticated
using (private.is_admin());

drop policy if exists "admins insert size charts" on public.size_charts;
create policy "admins insert size charts"
on public.size_charts for insert
to authenticated
with check (private.is_admin());
drop policy if exists "admins update size charts" on public.size_charts;
create policy "admins update size charts"
on public.size_charts for update
to authenticated
using (private.is_admin())
with check (private.is_admin());
drop policy if exists "admins delete size charts" on public.size_charts;
create policy "admins delete size charts"
on public.size_charts for delete
to authenticated
using (private.is_admin());

drop policy if exists "admins read customers" on public.customers;
create policy "admins read customers"
on public.customers for select
to authenticated
using (private.is_admin());

drop policy if exists "admins manage orders" on public.orders;
create policy "admins manage orders"
on public.orders for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "admins manage order items" on public.order_items;
create policy "admins manage order items"
on public.order_items for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "admins manage ai generations" on public.ai_generations;
create policy "admins manage ai generations"
on public.ai_generations for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "admins read storage snapshots" on public.storage_usage_snapshots;
create policy "admins read storage snapshots"
on public.storage_usage_snapshots for select
to authenticated
using (private.is_admin());

drop policy if exists "admins create storage snapshots" on public.storage_usage_snapshots;
create policy "admins create storage snapshots"
on public.storage_usage_snapshots for insert
to authenticated
with check (private.is_admin());

drop policy if exists "admins insert settings" on public.site_settings;
create policy "admins insert settings"
on public.site_settings for insert
to authenticated
with check (private.is_admin());
drop policy if exists "admins update settings" on public.site_settings;
create policy "admins update settings"
on public.site_settings for update
to authenticated
using (private.is_admin())
with check (private.is_admin());
drop policy if exists "admins delete settings" on public.site_settings;
create policy "admins delete settings"
on public.site_settings for delete
to authenticated
using (private.is_admin());

drop policy if exists "users and admins read profiles" on public.profiles;
create policy "users and admins read profiles"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id or private.is_admin());

drop policy if exists "admins insert profiles" on public.profiles;
create policy "admins insert profiles"
on public.profiles for insert
to authenticated
with check (private.is_admin());
drop policy if exists "admins update profiles" on public.profiles;
create policy "admins update profiles"
on public.profiles for update
to authenticated
using (private.is_admin())
with check (private.is_admin());
drop policy if exists "admins delete profiles" on public.profiles;
create policy "admins delete profiles"
on public.profiles for delete
to authenticated
using (private.is_admin());

drop policy if exists "public read catalog images" on storage.objects;
create policy "public read catalog images"
on storage.objects for select
to anon
using (bucket_id in ('product-images', 'collection-images'));

drop policy if exists "public read generated AI designs" on storage.objects;
create policy "public read generated AI designs"
on storage.objects for select
to anon
using (bucket_id = 'ai-designs');

drop policy if exists "admins manage catalog images" on storage.objects;
create policy "admins manage catalog images"
on storage.objects for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "admins manage AI assets" on storage.objects;
create policy "admins manage AI assets"
on storage.objects for all
to authenticated
using (private.is_admin())
with check (private.is_admin());
