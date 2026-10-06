drop policy if exists employees_select on public.employees;

create policy employees_select on public.employees
for select to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr','manager'])
  or private.owns_employee(id)
);

create or replace function public.get_my_tenant_context()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'user_id', p.user_id,
    'role', case when p.is_super_admin then 'super_admin' else coalesce(bu.role, p.role) end,
    'is_super_admin', p.is_super_admin,
    'business_id', bu.business_id,
    'business_name', b.name,
    'employee_id', e.id,
    'employee_number', e.employee_id_number
  )
  from public.user_profiles p
  left join public.business_users bu
    on bu.user_id = p.user_id
   and bu.status = 'active'
  left join public.businesses b on b.id = bu.business_id
  left join public.employees e
    on e.user_id = p.user_id
   and (bu.business_id is null or e.business_id = bu.business_id)
  where p.user_id = (select auth.uid())
  order by bu.is_primary_admin desc nulls last, bu.created_at asc nulls last
  limit 1;
$$;

revoke all on function public.get_my_tenant_context() from public, anon;
grant execute on function public.get_my_tenant_context() to authenticated, service_role;
