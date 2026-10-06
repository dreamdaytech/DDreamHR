-- Add a covering index for any single-column public foreign key that does not
-- already have an index starting with that FK column.
do $$
declare
  r record;
  idx_name text;
  col_name text;
begin
  for r in
    select
      c.oid as constraint_oid,
      c.conname,
      c.conrelid,
      c.conkey,
      cls.relname as table_name
    from pg_constraint c
    join pg_class cls on cls.oid = c.conrelid
    join pg_namespace ns on ns.oid = cls.relnamespace
    where c.contype = 'f'
      and ns.nspname = 'public'
      and array_length(c.conkey, 1) = 1
  loop
    if not exists (
      select 1
      from pg_index i
      where i.indrelid = r.conrelid
        and i.indisvalid
        and (i.indkey::smallint[])[0] = r.conkey[1]
    ) then
      select a.attname into col_name
      from pg_attribute a
      where a.attrelid = r.conrelid
        and a.attnum = r.conkey[1];

      idx_name := left('idx_fk_' || r.table_name || '_' || col_name, 63);
      execute format(
        'create index if not exists %I on public.%I (%I)',
        idx_name,
        r.table_name,
        col_name
      );
    end if;
  end loop;
end $$;

-- Convert broad FOR ALL write policies into action-specific policies so
-- SELECT queries only evaluate the dedicated read policy.
do $$
declare
  r record;
  p_using text;
  p_check text;
  insert_name text;
  update_name text;
  delete_name text;
  target_policies text[] := array[
    'employee_changes_write',
    'lifecycle_events_write',
    'onboarding_checklists_write',
    'employee_onboarding_write',
    'locations_write',
    'attendance_settings_write',
    'attendance_policies_write',
    'shifts_write',
    'employee_shifts_write',
    'projects_write',
    'leave_settings_write',
    'leave_types_write',
    'leave_balances_write',
    'salary_profiles_write',
    'salary_allowances_write',
    'salary_deductions_write',
    'payroll_schedules_write',
    'payroll_periods_write',
    'payroll_records_write',
    'payroll_record_allowances_write',
    'payroll_record_deductions_write',
    'payslips_write',
    'off_cycle_payroll_write',
    'tax_documents_write',
    'announcements_write',
    'system_integrations_write'
  ];
begin
  for r in
    select p.oid, p.polname, p.polrelid, c.relname as table_name
    from pg_policy p
    join pg_class c on c.oid = p.polrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and p.polcmd = '*'
      and p.polname = any(target_policies)
  loop
    select pg_get_expr(p.polqual, p.polrelid),
           pg_get_expr(p.polwithcheck, p.polrelid)
      into p_using, p_check
    from pg_policy p
    where p.oid = r.oid;

    insert_name := left(r.polname || '_insert', 63);
    update_name := left(r.polname || '_update', 63);
    delete_name := left(r.polname || '_delete', 63);

    execute format('drop policy %I on public.%I', r.polname, r.table_name);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (%s)',
      insert_name, r.table_name, p_check
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using (%s) with check (%s)',
      update_name, r.table_name, p_using, p_check
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (%s)',
      delete_name, r.table_name, p_using
    );
  end loop;
end $$;

drop policy if exists timesheets_employee_update on public.timesheets;
drop policy if exists timesheets_approver_update on public.timesheets;
create policy timesheets_update on public.timesheets for update to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr','manager'])
  or (private.owns_employee(employee_id) and status in ('draft','rejected'))
)
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr','manager'])
  or (private.owns_employee(employee_id) and status in ('draft','submitted'))
);

drop policy if exists leave_requests_employee_update on public.leave_requests;
drop policy if exists leave_requests_approver_update on public.leave_requests;
create policy leave_requests_update on public.leave_requests for update to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr','manager'])
  or (private.owns_employee(employee_id) and status in ('draft','pending'))
)
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr','manager'])
  or (private.owns_employee(employee_id) and status in ('draft','pending','cancelled'))
);
