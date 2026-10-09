create or replace function private.guard_last_active_tenant_admin()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
declare
  remaining_admins integer;
begin
  if tg_op = 'UPDATE'
     and not (
       old.role = 'admin'
       and old.status = 'active'
       and (
         new.role is distinct from 'admin'
         or new.status is distinct from 'active'
         or new.business_id is distinct from old.business_id
       )
     ) then
    return new;
  end if;

  if tg_op = 'DELETE' and not (old.role = 'admin' and old.status = 'active') then
    return old;
  end if;

  -- SECURITY DEFINER is limited to this trigger and ensures RLS cannot hide
  -- other active administrators from the invariant check.
  perform b.id
  from public.businesses b
  where b.id = old.business_id
  for update;

  -- A cascading business deletion has already removed the parent row; don't block it.
  if not found then
    if tg_op = 'DELETE' then return old; else return new; end if;
  end if;

  select count(*)::integer
  into remaining_admins
  from public.business_users bu
  where bu.business_id = old.business_id
    and bu.role = 'admin'
    and bu.status = 'active'
    and bu.id <> old.id;

  if remaining_admins = 0 then
    raise exception using
      errcode = '23514',
      message = 'Cannot deactivate, demote, move, or remove the last active tenant administrator';
  end if;

  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$function$;

revoke all on function private.guard_last_active_tenant_admin() from public, anon, authenticated;
