drop policy if exists "admins manage profiles" on public.profiles;

create policy "users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "admins manage all profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
