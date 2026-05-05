-- Trigger: first user becomes admin
create or replace function public.assign_first_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_assign_admin on auth.users;
create trigger on_auth_user_created_assign_admin
after insert on auth.users
for each row execute function public.assign_first_admin();

-- Allow admins to manage user roles via the app
create policy "Admins can manage user roles"
on public.user_roles
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));