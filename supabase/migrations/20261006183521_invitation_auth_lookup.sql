create or replace function public.lookup_auth_user_for_invitation(target_email text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select u.id
  from auth.users u
  where lower(u.email) = lower(target_email)
  limit 1;
$$;

revoke all on function public.lookup_auth_user_for_invitation(text) from public, anon, authenticated;
grant execute on function public.lookup_auth_user_for_invitation(text) to service_role;
