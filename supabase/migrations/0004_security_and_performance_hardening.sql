alter function public.make_order_number() set search_path = public;
alter function public.set_updated_at() set search_path = public;

create index if not exists order_items_product_idx on public.order_items(product_id);
create index if not exists orders_customer_idx on public.orders(customer_id);
create index if not exists storage_usage_snapshots_measured_by_idx on public.storage_usage_snapshots(measured_by);

drop policy if exists "admins manage categories" on public.categories;
drop policy if exists "public can read active categories" on public.categories;
create policy "public and admins read categories"
on public.categories for select to anon, authenticated
using (is_active = true or public.is_admin());
create policy "admins insert categories" on public.categories for insert to authenticated with check (public.is_admin());
create policy "admins update categories" on public.categories for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete categories" on public.categories for delete to authenticated using (public.is_admin());

drop policy if exists "admins manage collections" on public.collections;
drop policy if exists "public can read active collections" on public.collections;
create policy "public and admins read collections"
on public.collections for select to anon, authenticated
using (is_active = true or public.is_admin());
create policy "admins insert collections" on public.collections for insert to authenticated with check (public.is_admin());
create policy "admins update collections" on public.collections for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete collections" on public.collections for delete to authenticated using (public.is_admin());

drop policy if exists "admins manage products" on public.products;
drop policy if exists "public can read active products" on public.products;
create policy "public and admins read products"
on public.products for select to anon, authenticated
using (status = 'active' or public.is_admin());
create policy "admins insert products" on public.products for insert to authenticated with check (public.is_admin());
create policy "admins update products" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete products" on public.products for delete to authenticated using (public.is_admin());

drop policy if exists "admins manage product images" on public.product_images;
drop policy if exists "public can read product images" on public.product_images;
create policy "public and admins read product images"
on public.product_images for select to anon, authenticated
using (public.is_admin() or exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));
create policy "admins insert product images" on public.product_images for insert to authenticated with check (public.is_admin());
create policy "admins update product images" on public.product_images for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete product images" on public.product_images for delete to authenticated using (public.is_admin());

drop policy if exists "admins manage size charts" on public.size_charts;
drop policy if exists "public can read size charts" on public.size_charts;
create policy "public and admins read size charts"
on public.size_charts for select to anon, authenticated
using (public.is_admin() or exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));
create policy "admins insert size charts" on public.size_charts for insert to authenticated with check (public.is_admin());
create policy "admins update size charts" on public.size_charts for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete size charts" on public.size_charts for delete to authenticated using (public.is_admin());

drop policy if exists "admins manage settings" on public.site_settings;
drop policy if exists "public can read site settings" on public.site_settings;
create policy "public and admins read site settings" on public.site_settings for select to anon, authenticated using (id = true);
create policy "admins insert settings" on public.site_settings for insert to authenticated with check (public.is_admin());
create policy "admins update settings" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete settings" on public.site_settings for delete to authenticated using (public.is_admin());

drop policy if exists "admins manage all profiles" on public.profiles;
drop policy if exists "users can read own profile" on public.profiles;
create policy "users and admins read profiles" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "admins insert profiles" on public.profiles for insert to authenticated with check (public.is_admin());
create policy "admins update profiles" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete profiles" on public.profiles for delete to authenticated using (public.is_admin());
