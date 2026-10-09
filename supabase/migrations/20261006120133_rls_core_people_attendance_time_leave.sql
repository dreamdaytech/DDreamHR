grant usage on schema public to authenticated, service_role;
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

-- Profiles are created by the auth trigger. Signed-in users may update only non-authorization fields.
revoke insert, delete, update on public.user_profiles from authenticated;
grant select on public.user_profiles to authenticated;
grant update (first_name, last_name, phone, avatar_url, updated_at) on public.user_profiles to authenticated;

grant usage on schema private to authenticated;

create or replace function private.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_profiles p
    where p.user_id = (select auth.uid())
      and p.is_super_admin = true
  );
$$;

create or replace function private.is_business_member(target_business uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.business_users bu
    where bu.business_id = target_business
      and bu.user_id = (select auth.uid())
      and bu.status = 'active'
  );
$$;

create or replace function private.has_business_role(target_business uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.business_users bu
    where bu.business_id = target_business
      and bu.user_id = (select auth.uid())
      and bu.status = 'active'
      and bu.role = any(allowed_roles)
  );
$$;

create or replace function private.share_business_with_user(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.business_users me
    join public.business_users them on them.business_id = me.business_id
    where me.user_id = (select auth.uid())
      and me.status = 'active'
      and them.user_id = target_user
      and them.status = 'active'
  );
$$;

create or replace function private.current_employee_id(target_business uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select e.id
  from public.employees e
  where e.business_id = target_business
    and e.user_id = (select auth.uid())
  limit 1;
$$;

create or replace function private.owns_employee(target_employee uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.employees e
    where e.id = target_employee
      and e.user_id = (select auth.uid())
  );
$$;

create or replace function private.employee_business_id(target_employee uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select e.business_id from public.employees e where e.id = target_employee;
$$;

create or replace function private.can_view_team_record(target_business uuid, target_employee uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_super_admin()
    or private.has_business_role(target_business, array['admin','hr','manager'])
    or private.owns_employee(target_employee);
$$;

create or replace function private.can_view_sensitive_employee_record(target_business uuid, target_employee uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_super_admin()
    or private.has_business_role(target_business, array['admin','hr'])
    or private.owns_employee(target_employee);
$$;

create or replace function private.workflow_request_business_id(target_request uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select wr.business_id from public.workflow_requests wr where wr.id = target_request;
$$;

create or replace function private.attendance_business_id(target_attendance uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select ar.business_id from public.attendance_records ar where ar.id = target_attendance;
$$;

create or replace function private.attendance_employee_id(target_attendance uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select ar.employee_id from public.attendance_records ar where ar.id = target_attendance;
$$;

create or replace function private.attendance_report_business_id(target_report uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select ar.business_id from public.attendance_reports ar where ar.id = target_report;
$$;

create or replace function private.leave_request_business_id(target_request uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select lr.business_id from public.leave_requests lr where lr.id = target_request;
$$;

create or replace function private.user_in_business_text(target_business_text text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.business_users bu
    where bu.user_id = (select auth.uid())
      and bu.status = 'active'
      and bu.business_id::text = target_business_text
  );
$$;

revoke all on function private.is_super_admin() from public, anon, authenticated;
revoke all on function private.is_business_member(uuid) from public, anon, authenticated;
revoke all on function private.has_business_role(uuid,text[]) from public, anon, authenticated;
revoke all on function private.share_business_with_user(uuid) from public, anon, authenticated;
revoke all on function private.current_employee_id(uuid) from public, anon, authenticated;
revoke all on function private.owns_employee(uuid) from public, anon, authenticated;
revoke all on function private.employee_business_id(uuid) from public, anon, authenticated;
revoke all on function private.can_view_team_record(uuid,uuid) from public, anon, authenticated;
revoke all on function private.can_view_sensitive_employee_record(uuid,uuid) from public, anon, authenticated;
revoke all on function private.workflow_request_business_id(uuid) from public, anon, authenticated;
revoke all on function private.attendance_business_id(uuid) from public, anon, authenticated;
revoke all on function private.attendance_employee_id(uuid) from public, anon, authenticated;
revoke all on function private.attendance_report_business_id(uuid) from public, anon, authenticated;
revoke all on function private.leave_request_business_id(uuid) from public, anon, authenticated;
revoke all on function private.user_in_business_text(text) from public, anon, authenticated;

grant execute on function private.is_super_admin() to authenticated;
grant execute on function private.is_business_member(uuid) to authenticated;
grant execute on function private.has_business_role(uuid,text[]) to authenticated;
grant execute on function private.share_business_with_user(uuid) to authenticated;
grant execute on function private.current_employee_id(uuid) to authenticated;
grant execute on function private.owns_employee(uuid) to authenticated;
grant execute on function private.employee_business_id(uuid) to authenticated;
grant execute on function private.can_view_team_record(uuid,uuid) to authenticated;
grant execute on function private.can_view_sensitive_employee_record(uuid,uuid) to authenticated;
grant execute on function private.workflow_request_business_id(uuid) to authenticated;
grant execute on function private.attendance_business_id(uuid) to authenticated;
grant execute on function private.attendance_employee_id(uuid) to authenticated;
grant execute on function private.attendance_report_business_id(uuid) to authenticated;
grant execute on function private.leave_request_business_id(uuid) to authenticated;
grant execute on function private.user_in_business_text(text) to authenticated;

do $$
declare t text;
begin
  foreach t in array array[
    'businesses','user_profiles','business_users','employees','employee_changes',
    'employee_lifecycle_events','onboarding_checklists','employee_onboarding',
    'workflow_requests','workflow_steps','work_items','locations','attendance_settings',
    'attendance_policies','shifts','employee_shifts','attendance_records','attendance_breaks',
    'regularization_requests','attendance_reports','attendance_report_feedback','projects',
    'tasks','timesheets','time_logs','leave_settings','leave_types','leave_balances',
    'leave_requests','leave_request_events','employee_salary_profiles','salary_allowances',
    'salary_deductions','payroll_schedules','payroll_periods','payroll_records',
    'payroll_record_allowances','payroll_record_deductions','payslips','off_cycle_payroll',
    'direct_deposit_accounts','tax_documents','engagement_surveys',
    'engagement_survey_responses','engagement_events','engagement_event_participants',
    'employee_recognitions','documents','announcements','user_settings','system_settings',
    'system_integrations','settings_audit_log','feature_flags','platform_announcements',
    'support_tickets','business_management_log','super_admin_activities',
    'super_admin_dashboard_metrics'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Businesses
create policy businesses_select on public.businesses for select to authenticated
using (private.is_super_admin() or private.is_business_member(id));
create policy businesses_insert on public.businesses for insert to authenticated
with check (private.is_super_admin());
create policy businesses_update on public.businesses for update to authenticated
using (private.is_super_admin() or private.has_business_role(id, array['admin']))
with check (private.is_super_admin() or private.has_business_role(id, array['admin']));
create policy businesses_delete on public.businesses for delete to authenticated
using (private.is_super_admin());

-- User profiles
create policy user_profiles_select on public.user_profiles for select to authenticated
using (
  private.is_super_admin()
  or user_id = (select auth.uid())
  or private.share_business_with_user(user_id)
);
create policy user_profiles_update_own on public.user_profiles for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

-- Business membership
create policy business_users_select on public.business_users for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy business_users_insert on public.business_users for insert to authenticated
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));
create policy business_users_update on public.business_users for update to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));
create policy business_users_delete on public.business_users for delete to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin']));

-- Employees
create policy employees_select on public.employees for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy employees_insert on public.employees for insert to authenticated
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));
create policy employees_update on public.employees for update to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));
create policy employees_delete on public.employees for delete to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin']));

-- People operations
create policy employee_changes_select on public.employee_changes for select to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr','manager'])
  or private.owns_employee(employee_id)
);
create policy employee_changes_write on public.employee_changes for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy lifecycle_events_select on public.employee_lifecycle_events for select to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr','manager'])
  or private.owns_employee(employee_id)
);
create policy lifecycle_events_write on public.employee_lifecycle_events for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy onboarding_checklists_select on public.onboarding_checklists for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy onboarding_checklists_write on public.onboarding_checklists for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy employee_onboarding_select on public.employee_onboarding for select to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr','manager'])
  or private.owns_employee(employee_id)
);
create policy employee_onboarding_write on public.employee_onboarding for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

-- Workflow / inbox
create policy workflow_requests_select on public.workflow_requests for select to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr','manager'])
  or submitted_by = (select auth.uid())
  or (employee_id is not null and private.owns_employee(employee_id))
);
create policy workflow_requests_insert on public.workflow_requests for insert to authenticated
with check (
  private.is_super_admin()
  or (
    private.is_business_member(business_id)
    and (submitted_by = (select auth.uid()) or private.has_business_role(business_id, array['admin','hr','manager']))
  )
);
create policy workflow_requests_update on public.workflow_requests for update to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr','manager']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr','manager']));

create policy workflow_steps_select on public.workflow_steps for select to authenticated
using (
  private.is_super_admin()
  or approver_user_id = (select auth.uid())
  or private.has_business_role(private.workflow_request_business_id(request_id), array['admin','hr','manager'])
  or exists (
    select 1 from public.workflow_requests wr
    where wr.id = request_id and wr.submitted_by = (select auth.uid())
  )
);
create policy workflow_steps_insert on public.workflow_steps for insert to authenticated
with check (
  private.is_super_admin()
  or private.has_business_role(private.workflow_request_business_id(request_id), array['admin','hr','manager'])
);
create policy workflow_steps_update on public.workflow_steps for update to authenticated
using (
  private.is_super_admin()
  or approver_user_id = (select auth.uid())
  or private.has_business_role(private.workflow_request_business_id(request_id), array['admin','hr','manager'])
)
with check (
  private.is_super_admin()
  or approver_user_id = (select auth.uid())
  or private.has_business_role(private.workflow_request_business_id(request_id), array['admin','hr','manager'])
);

create policy work_items_select on public.work_items for select to authenticated
using (
  private.is_super_admin()
  or assignee_user_id = (select auth.uid())
  or (assignee_role is not null and private.has_business_role(business_id, array[assignee_role]))
  or private.has_business_role(business_id, array['admin','hr'])
);
create policy work_items_insert on public.work_items for insert to authenticated
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr','manager']));
create policy work_items_update on public.work_items for update to authenticated
using (
  private.is_super_admin()
  or assignee_user_id = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr','manager'])
)
with check (
  private.is_super_admin()
  or assignee_user_id = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr','manager'])
);
create policy work_items_delete on public.work_items for delete to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

-- Attendance configuration
create policy locations_select on public.locations for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy locations_write on public.locations for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy attendance_settings_select on public.attendance_settings for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy attendance_settings_write on public.attendance_settings for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy attendance_policies_select on public.attendance_policies for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy attendance_policies_write on public.attendance_policies for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy shifts_select on public.shifts for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy shifts_write on public.shifts for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy employee_shifts_select on public.employee_shifts for select to authenticated
using (
  private.is_super_admin()
  or private.is_business_member(private.employee_business_id(employee_id))
);
create policy employee_shifts_write on public.employee_shifts for all to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(private.employee_business_id(employee_id), array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.has_business_role(private.employee_business_id(employee_id), array['admin','hr'])
);

-- Attendance records
create policy attendance_records_select on public.attendance_records for select to authenticated
using (private.can_view_team_record(business_id, employee_id));
create policy attendance_records_insert on public.attendance_records for insert to authenticated
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or (private.is_business_member(business_id) and private.owns_employee(employee_id))
);
create policy attendance_records_update on public.attendance_records for update to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or private.owns_employee(employee_id)
)
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or private.owns_employee(employee_id)
);
create policy attendance_records_delete on public.attendance_records for delete to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy attendance_breaks_select on public.attendance_breaks for select to authenticated
using (
  private.can_view_team_record(
    private.attendance_business_id(attendance_id),
    private.attendance_employee_id(attendance_id)
  )
);
create policy attendance_breaks_insert on public.attendance_breaks for insert to authenticated
with check (
  private.is_super_admin()
  or private.has_business_role(private.attendance_business_id(attendance_id), array['admin','hr'])
  or private.owns_employee(private.attendance_employee_id(attendance_id))
);
create policy attendance_breaks_update on public.attendance_breaks for update to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(private.attendance_business_id(attendance_id), array['admin','hr'])
  or private.owns_employee(private.attendance_employee_id(attendance_id))
)
with check (
  private.is_super_admin()
  or private.has_business_role(private.attendance_business_id(attendance_id), array['admin','hr'])
  or private.owns_employee(private.attendance_employee_id(attendance_id))
);
create policy attendance_breaks_delete on public.attendance_breaks for delete to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(private.attendance_business_id(attendance_id), array['admin','hr'])
);

create policy regularization_select on public.regularization_requests for select to authenticated
using (private.can_view_team_record(business_id, employee_id));
create policy regularization_insert on public.regularization_requests for insert to authenticated
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or (private.is_business_member(business_id) and private.owns_employee(employee_id))
);
create policy regularization_update on public.regularization_requests for update to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
);

create policy attendance_reports_select on public.attendance_reports for select to authenticated
using (private.can_view_team_record(business_id, employee_id));
create policy attendance_reports_insert on public.attendance_reports for insert to authenticated
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or (private.is_business_member(business_id) and private.owns_employee(employee_id))
);
create policy attendance_reports_update on public.attendance_reports for update to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr','manager'])
)
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr','manager'])
);

create policy attendance_feedback_select on public.attendance_report_feedback for select to authenticated
using (
  private.is_super_admin()
  or private.is_business_member(private.attendance_report_business_id(report_id))
);
create policy attendance_feedback_insert on public.attendance_report_feedback for insert to authenticated
with check (
  user_id = (select auth.uid())
  and private.is_business_member(private.attendance_report_business_id(report_id))
);
create policy attendance_feedback_update on public.attendance_report_feedback for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy attendance_feedback_delete on public.attendance_report_feedback for delete to authenticated
using (
  user_id = (select auth.uid())
  or private.has_business_role(private.attendance_report_business_id(report_id), array['admin','hr'])
);

-- Projects/tasks/time
create policy projects_select on public.projects for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy projects_write on public.projects for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr','manager']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr','manager']));

create policy tasks_select on public.tasks for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy tasks_insert on public.tasks for insert to authenticated
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr','manager']));
create policy tasks_update on public.tasks for update to authenticated
using (
  private.is_super_admin()
  or assigned_to = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr','manager'])
)
with check (
  private.is_super_admin()
  or assigned_to = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr','manager'])
);
create policy tasks_delete on public.tasks for delete to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr','manager']));

create policy time_logs_select on public.time_logs for select to authenticated
using (
  private.is_super_admin()
  or user_id = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr','manager'])
);
create policy time_logs_insert on public.time_logs for insert to authenticated
with check (
  private.is_super_admin()
  or (user_id = (select auth.uid()) and private.is_business_member(business_id))
  or private.has_business_role(business_id, array['admin','hr'])
);
create policy time_logs_update on public.time_logs for update to authenticated
using (
  private.is_super_admin()
  or user_id = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
)
with check (
  private.is_super_admin()
  or user_id = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
);
create policy time_logs_delete on public.time_logs for delete to authenticated
using (
  private.is_super_admin()
  or user_id = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
);

create policy timesheets_select on public.timesheets for select to authenticated
using (private.can_view_team_record(business_id, employee_id));
create policy timesheets_insert on public.timesheets for insert to authenticated
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or (private.is_business_member(business_id) and private.owns_employee(employee_id))
);
create policy timesheets_employee_update on public.timesheets for update to authenticated
using (private.owns_employee(employee_id) and status in ('draft','rejected'))
with check (private.owns_employee(employee_id) and status in ('draft','submitted'));
create policy timesheets_approver_update on public.timesheets for update to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr','manager']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr','manager']));
create policy timesheets_delete on public.timesheets for delete to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or (private.owns_employee(employee_id) and status = 'draft')
);

-- Leave
create policy leave_settings_select on public.leave_settings for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy leave_settings_write on public.leave_settings for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy leave_types_select on public.leave_types for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy leave_types_write on public.leave_types for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy leave_balances_select on public.leave_balances for select to authenticated
using (private.can_view_team_record(business_id, employee_id));
create policy leave_balances_write on public.leave_balances for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy leave_requests_select on public.leave_requests for select to authenticated
using (private.can_view_team_record(business_id, employee_id));
create policy leave_requests_insert on public.leave_requests for insert to authenticated
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or (private.is_business_member(business_id) and private.owns_employee(employee_id))
);
create policy leave_requests_employee_update on public.leave_requests for update to authenticated
using (private.owns_employee(employee_id) and status in ('draft','pending'))
with check (private.owns_employee(employee_id) and status in ('draft','pending','cancelled'));
create policy leave_requests_approver_update on public.leave_requests for update to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr','manager']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr','manager']));
create policy leave_requests_delete on public.leave_requests for delete to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or (private.owns_employee(employee_id) and status = 'draft')
);

create policy leave_request_events_select on public.leave_request_events for select to authenticated
using (
  private.is_super_admin()
  or private.is_business_member(private.leave_request_business_id(leave_request_id))
);
create policy leave_request_events_insert on public.leave_request_events for insert to authenticated
with check (
  private.is_super_admin()
  or (
    actor_user_id = (select auth.uid())
    and private.is_business_member(private.leave_request_business_id(leave_request_id))
  )
);
