create schema if not exists private;

alter function public.is_admin() set schema private;
alter function private.is_admin() set search_path = public;

revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "public and admins read categories" on public.categories;
create policy "anon read active categories" on public.categories for select to anon using (is_active = true);
create policy "authenticated read categories" on public.categories for select to authenticated using (is_active = true or private.is_admin());

drop policy if exists "public and admins read collections" on public.collections;
create policy "anon read active collections" on public.collections for select to anon using (is_active = true);
create policy "authenticated read collections" on public.collections for select to authenticated using (is_active = true or private.is_admin());

drop policy if exists "public and admins read products" on public.products;
create policy "anon read active products" on public.products for select to anon using (status = 'active');
create policy "authenticated read products" on public.products for select to authenticated using (status = 'active' or private.is_admin());

drop policy if exists "public and admins read product images" on public.product_images;
create policy "anon read product images" on public.product_images for select to anon using (exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));
create policy "authenticated read product images" on public.product_images for select to authenticated using (private.is_admin() or exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));

drop policy if exists "public and admins read size charts" on public.size_charts;
create policy "anon read size charts" on public.size_charts for select to anon using (exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));
create policy "authenticated read size charts" on public.size_charts for select to authenticated using (private.is_admin() or exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));

drop policy if exists "public and admins read site settings" on public.site_settings;
create policy "anon read site settings" on public.site_settings for select to anon using (id = true);
create policy "authenticated read site settings" on public.site_settings for select to authenticated using (id = true);
