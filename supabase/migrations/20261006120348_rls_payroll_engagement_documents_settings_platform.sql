create or replace function private.salary_profile_business_id(target_profile uuid)
returns uuid
language sql stable security definer set search_path = ''
as $$ select p.business_id from public.employee_salary_profiles p where p.id = target_profile; $$;

create or replace function private.salary_profile_employee_id(target_profile uuid)
returns uuid
language sql stable security definer set search_path = ''
as $$ select p.employee_id from public.employee_salary_profiles p where p.id = target_profile; $$;

create or replace function private.payroll_period_business_id(target_period uuid)
returns uuid
language sql stable security definer set search_path = ''
as $$ select p.business_id from public.payroll_periods p where p.id = target_period; $$;

create or replace function private.payroll_record_business_id(target_record uuid)
returns uuid
language sql stable security definer set search_path = ''
as $$
  select pp.business_id
  from public.payroll_records pr
  join public.payroll_periods pp on pp.id = pr.payroll_period_id
  where pr.id = target_record;
$$;

create or replace function private.payroll_record_employee_id(target_record uuid)
returns uuid
language sql stable security definer set search_path = ''
as $$ select pr.employee_id from public.payroll_records pr where pr.id = target_record; $$;

create or replace function private.engagement_survey_business_id(target_survey uuid)
returns uuid
language sql stable security definer set search_path = ''
as $$ select s.business_id from public.engagement_surveys s where s.id = target_survey; $$;

create or replace function private.engagement_event_business_id(target_event uuid)
returns uuid
language sql stable security definer set search_path = ''
as $$ select e.business_id from public.engagement_events e where e.id = target_event; $$;

revoke all on function private.salary_profile_business_id(uuid) from public, anon, authenticated;
revoke all on function private.salary_profile_employee_id(uuid) from public, anon, authenticated;
revoke all on function private.payroll_period_business_id(uuid) from public, anon, authenticated;
revoke all on function private.payroll_record_business_id(uuid) from public, anon, authenticated;
revoke all on function private.payroll_record_employee_id(uuid) from public, anon, authenticated;
revoke all on function private.engagement_survey_business_id(uuid) from public, anon, authenticated;
revoke all on function private.engagement_event_business_id(uuid) from public, anon, authenticated;

grant execute on function private.salary_profile_business_id(uuid) to authenticated;
grant execute on function private.salary_profile_employee_id(uuid) to authenticated;
grant execute on function private.payroll_period_business_id(uuid) to authenticated;
grant execute on function private.payroll_record_business_id(uuid) to authenticated;
grant execute on function private.payroll_record_employee_id(uuid) to authenticated;
grant execute on function private.engagement_survey_business_id(uuid) to authenticated;
grant execute on function private.engagement_event_business_id(uuid) to authenticated;

-- Compensation and payroll
create policy salary_profiles_select on public.employee_salary_profiles for select to authenticated
using (private.can_view_sensitive_employee_record(business_id, employee_id));
create policy salary_profiles_write on public.employee_salary_profiles for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy salary_allowances_select on public.salary_allowances for select to authenticated
using (
  private.can_view_sensitive_employee_record(
    private.salary_profile_business_id(salary_profile_id),
    private.salary_profile_employee_id(salary_profile_id)
  )
);
create policy salary_allowances_write on public.salary_allowances for all to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(private.salary_profile_business_id(salary_profile_id), array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.has_business_role(private.salary_profile_business_id(salary_profile_id), array['admin','hr'])
);

create policy salary_deductions_select on public.salary_deductions for select to authenticated
using (
  private.can_view_sensitive_employee_record(
    private.salary_profile_business_id(salary_profile_id),
    private.salary_profile_employee_id(salary_profile_id)
  )
);
create policy salary_deductions_write on public.salary_deductions for all to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(private.salary_profile_business_id(salary_profile_id), array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.has_business_role(private.salary_profile_business_id(salary_profile_id), array['admin','hr'])
);

create policy payroll_schedules_select on public.payroll_schedules for select to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));
create policy payroll_schedules_write on public.payroll_schedules for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy payroll_periods_select on public.payroll_periods for select to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));
create policy payroll_periods_write on public.payroll_periods for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy payroll_records_select on public.payroll_records for select to authenticated
using (
  private.can_view_sensitive_employee_record(
    private.payroll_period_business_id(payroll_period_id),
    employee_id
  )
);
create policy payroll_records_write on public.payroll_records for all to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(private.payroll_period_business_id(payroll_period_id), array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.has_business_role(private.payroll_period_business_id(payroll_period_id), array['admin','hr'])
);

create policy payroll_record_allowances_select on public.payroll_record_allowances for select to authenticated
using (
  private.can_view_sensitive_employee_record(
    private.payroll_record_business_id(payroll_record_id),
    private.payroll_record_employee_id(payroll_record_id)
  )
);
create policy payroll_record_allowances_write on public.payroll_record_allowances for all to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(private.payroll_record_business_id(payroll_record_id), array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.has_business_role(private.payroll_record_business_id(payroll_record_id), array['admin','hr'])
);

create policy payroll_record_deductions_select on public.payroll_record_deductions for select to authenticated
using (
  private.can_view_sensitive_employee_record(
    private.payroll_record_business_id(payroll_record_id),
    private.payroll_record_employee_id(payroll_record_id)
  )
);
create policy payroll_record_deductions_write on public.payroll_record_deductions for all to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(private.payroll_record_business_id(payroll_record_id), array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.has_business_role(private.payroll_record_business_id(payroll_record_id), array['admin','hr'])
);

create policy payslips_select on public.payslips for select to authenticated
using (
  private.can_view_sensitive_employee_record(
    private.employee_business_id(employee_id),
    employee_id
  )
);
create policy payslips_write on public.payslips for all to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(private.employee_business_id(employee_id), array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.has_business_role(private.employee_business_id(employee_id), array['admin','hr'])
);

create policy off_cycle_payroll_select on public.off_cycle_payroll for select to authenticated
using (private.can_view_sensitive_employee_record(business_id, employee_id));
create policy off_cycle_payroll_write on public.off_cycle_payroll for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

create policy direct_deposit_select on public.direct_deposit_accounts for select to authenticated
using (
  private.can_view_sensitive_employee_record(private.employee_business_id(employee_id), employee_id)
);
create policy direct_deposit_insert on public.direct_deposit_accounts for insert to authenticated
with check (
  private.is_super_admin()
  or private.owns_employee(employee_id)
  or private.has_business_role(private.employee_business_id(employee_id), array['admin','hr'])
);
create policy direct_deposit_update on public.direct_deposit_accounts for update to authenticated
using (
  private.is_super_admin()
  or private.owns_employee(employee_id)
  or private.has_business_role(private.employee_business_id(employee_id), array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.owns_employee(employee_id)
  or private.has_business_role(private.employee_business_id(employee_id), array['admin','hr'])
);
create policy direct_deposit_delete on public.direct_deposit_accounts for delete to authenticated
using (
  private.is_super_admin()
  or private.owns_employee(employee_id)
  or private.has_business_role(private.employee_business_id(employee_id), array['admin','hr'])
);

create policy tax_documents_select on public.tax_documents for select to authenticated
using (
  private.can_view_sensitive_employee_record(private.employee_business_id(employee_id), employee_id)
);
create policy tax_documents_write on public.tax_documents for all to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(private.employee_business_id(employee_id), array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.has_business_role(private.employee_business_id(employee_id), array['admin','hr'])
);

-- Engagement
create policy engagement_surveys_select on public.engagement_surveys for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy engagement_surveys_insert on public.engagement_surveys for insert to authenticated
with check (
  private.is_super_admin()
  or (created_by = (select auth.uid()) and private.is_business_member(business_id))
  or private.has_business_role(business_id, array['admin','hr'])
);
create policy engagement_surveys_update on public.engagement_surveys for update to authenticated
using (
  private.is_super_admin()
  or created_by = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
)
with check (
  private.is_super_admin()
  or created_by = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
);
create policy engagement_surveys_delete on public.engagement_surveys for delete to authenticated
using (
  private.is_super_admin()
  or created_by = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
);

create policy survey_responses_select on public.engagement_survey_responses for select to authenticated
using (
  private.is_super_admin()
  or (employee_id is not null and private.owns_employee(employee_id))
  or private.has_business_role(private.engagement_survey_business_id(survey_id), array['admin','hr'])
);
create policy survey_responses_insert on public.engagement_survey_responses for insert to authenticated
with check (
  private.is_super_admin()
  or (
    private.is_business_member(private.engagement_survey_business_id(survey_id))
    and (employee_id is null or private.owns_employee(employee_id))
  )
);
create policy survey_responses_update on public.engagement_survey_responses for update to authenticated
using (
  private.is_super_admin()
  or (employee_id is not null and private.owns_employee(employee_id))
)
with check (
  private.is_super_admin()
  or (employee_id is not null and private.owns_employee(employee_id))
);

create policy engagement_events_select on public.engagement_events for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy engagement_events_insert on public.engagement_events for insert to authenticated
with check (
  private.is_super_admin()
  or (organizer_id = (select auth.uid()) and private.is_business_member(business_id))
  or private.has_business_role(business_id, array['admin','hr'])
);
create policy engagement_events_update on public.engagement_events for update to authenticated
using (
  private.is_super_admin()
  or organizer_id = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
)
with check (
  private.is_super_admin()
  or organizer_id = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
);
create policy engagement_events_delete on public.engagement_events for delete to authenticated
using (
  private.is_super_admin()
  or organizer_id = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
);

create policy event_participants_select on public.engagement_event_participants for select to authenticated
using (
  private.is_super_admin()
  or private.owns_employee(employee_id)
  or private.has_business_role(private.engagement_event_business_id(event_id), array['admin','hr'])
);
create policy event_participants_insert on public.engagement_event_participants for insert to authenticated
with check (
  private.is_super_admin()
  or (
    private.owns_employee(employee_id)
    and private.is_business_member(private.engagement_event_business_id(event_id))
  )
  or private.has_business_role(private.engagement_event_business_id(event_id), array['admin','hr'])
);
create policy event_participants_update on public.engagement_event_participants for update to authenticated
using (
  private.is_super_admin()
  or private.owns_employee(employee_id)
  or private.has_business_role(private.engagement_event_business_id(event_id), array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.owns_employee(employee_id)
  or private.has_business_role(private.engagement_event_business_id(event_id), array['admin','hr'])
);
create policy event_participants_delete on public.engagement_event_participants for delete to authenticated
using (
  private.is_super_admin()
  or private.owns_employee(employee_id)
  or private.has_business_role(private.engagement_event_business_id(event_id), array['admin','hr'])
);

create policy recognitions_select on public.employee_recognitions for select to authenticated
using (
  private.is_super_admin()
  or (
    private.is_business_member(business_id)
    and (
      is_public
      or private.owns_employee(to_employee_id)
      or (from_employee_id is not null and private.owns_employee(from_employee_id))
      or private.has_business_role(business_id, array['admin','hr'])
    )
  )
);
create policy recognitions_insert on public.employee_recognitions for insert to authenticated
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or (
    from_employee_id is not null
    and private.owns_employee(from_employee_id)
    and private.is_business_member(business_id)
  )
);
create policy recognitions_update on public.employee_recognitions for update to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or (from_employee_id is not null and private.owns_employee(from_employee_id))
)
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or (from_employee_id is not null and private.owns_employee(from_employee_id))
);
create policy recognitions_delete on public.employee_recognitions for delete to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
  or (from_employee_id is not null and private.owns_employee(from_employee_id))
);

-- Documents and announcements
create policy documents_select on public.documents for select to authenticated
using (
  private.is_super_admin()
  or (
    private.is_business_member(business_id)
    and (
      access_level in ('public','business')
      or uploaded_by = (select auth.uid())
      or (employee_id is not null and private.owns_employee(employee_id))
      or private.has_business_role(business_id, array['admin','hr'])
      or (access_level = 'management' and private.has_business_role(business_id, array['manager']))
    )
  )
);
create policy documents_insert on public.documents for insert to authenticated
with check (
  private.is_super_admin()
  or (
    uploaded_by = (select auth.uid())
    and private.is_business_member(business_id)
    and (
      employee_id is null
      or private.owns_employee(employee_id)
      or private.has_business_role(business_id, array['admin','hr'])
    )
  )
);
create policy documents_update on public.documents for update to authenticated
using (
  private.is_super_admin()
  or uploaded_by = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
)
with check (
  private.is_super_admin()
  or uploaded_by = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
);
create policy documents_delete on public.documents for delete to authenticated
using (
  private.is_super_admin()
  or uploaded_by = (select auth.uid())
  or private.has_business_role(business_id, array['admin','hr'])
);

create policy announcements_select on public.announcements for select to authenticated
using (private.is_super_admin() or private.is_business_member(business_id));
create policy announcements_write on public.announcements for all to authenticated
using (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']))
with check (private.is_super_admin() or private.has_business_role(business_id, array['admin','hr']));

-- Settings
create policy user_settings_select on public.user_settings for select to authenticated
using (user_id = (select auth.uid()) or private.is_super_admin());
create policy user_settings_insert on public.user_settings for insert to authenticated
with check (user_id = (select auth.uid()) or private.is_super_admin());
create policy user_settings_update on public.user_settings for update to authenticated
using (user_id = (select auth.uid()) or private.is_super_admin())
with check (user_id = (select auth.uid()) or private.is_super_admin());
create policy user_settings_delete on public.user_settings for delete to authenticated
using (user_id = (select auth.uid()) or private.is_super_admin());

create policy system_settings_select on public.system_settings for select to authenticated
using (
  private.is_super_admin()
  or (
    business_id is not null
    and private.has_business_role(business_id, array['admin','hr'])
  )
);
create policy system_settings_insert on public.system_settings for insert to authenticated
with check (
  private.is_super_admin()
  or (
    business_id is not null
    and created_by = (select auth.uid())
    and private.has_business_role(business_id, array['admin','hr'])
  )
);
create policy system_settings_update on public.system_settings for update to authenticated
using (
  private.is_super_admin()
  or (
    business_id is not null
    and private.has_business_role(business_id, array['admin','hr'])
  )
)
with check (
  private.is_super_admin()
  or (
    business_id is not null
    and private.has_business_role(business_id, array['admin','hr'])
  )
);
create policy system_settings_delete on public.system_settings for delete to authenticated
using (
  private.is_super_admin()
  or (
    business_id is not null
    and private.has_business_role(business_id, array['admin','hr'])
  )
);

revoke select on public.system_integrations from authenticated;
grant select (id,business_id,integration_type,provider_name,is_active,sync_frequency,last_sync_at,created_at,updated_at)
on public.system_integrations to authenticated;
create policy system_integrations_select on public.system_integrations for select to authenticated
using (
  private.is_super_admin()
  or (business_id is not null and private.has_business_role(business_id, array['admin','hr']))
);
create policy system_integrations_write on public.system_integrations for all to authenticated
using (
  private.is_super_admin()
  or (business_id is not null and private.has_business_role(business_id, array['admin']))
)
with check (
  private.is_super_admin()
  or (business_id is not null and private.has_business_role(business_id, array['admin']))
);

create policy settings_audit_select on public.settings_audit_log for select to authenticated
using (
  private.is_super_admin()
  or (business_id is not null and private.has_business_role(business_id, array['admin','hr']))
);
create policy settings_audit_insert on public.settings_audit_log for insert to authenticated
with check (
  private.is_super_admin()
  or (
    user_id = (select auth.uid())
    and business_id is not null
    and private.is_business_member(business_id)
  )
);

-- Platform-only administration
create policy feature_flags_super_admin on public.feature_flags for all to authenticated
using (private.is_super_admin())
with check (private.is_super_admin());

create policy platform_announcements_super_admin on public.platform_announcements for all to authenticated
using (private.is_super_admin())
with check (private.is_super_admin());

create policy support_tickets_select on public.support_tickets for select to authenticated
using (
  private.is_super_admin()
  or requester_user_id = (select auth.uid())
  or (
    business_id is not null
    and private.has_business_role(business_id, array['admin','hr'])
  )
);
create policy support_tickets_insert on public.support_tickets for insert to authenticated
with check (
  private.is_super_admin()
  or (
    requester_user_id = (select auth.uid())
    and (business_id is null or private.is_business_member(business_id))
  )
);
create policy support_tickets_update on public.support_tickets for update to authenticated
using (
  private.is_super_admin()
  or (
    business_id is not null
    and private.has_business_role(business_id, array['admin','hr'])
  )
)
with check (
  private.is_super_admin()
  or (
    business_id is not null
    and private.has_business_role(business_id, array['admin','hr'])
  )
);

create policy business_management_log_super_admin on public.business_management_log for all to authenticated
using (private.is_super_admin())
with check (private.is_super_admin());

create policy super_admin_activities_super_admin on public.super_admin_activities for all to authenticated
using (private.is_super_admin())
with check (private.is_super_admin());

create policy super_admin_metrics_super_admin on public.super_admin_dashboard_metrics for all to authenticated
using (private.is_super_admin())
with check (private.is_super_admin());

-- RPCs used by the real Super Admin dashboard.
create or replace function public.get_super_admin_dashboard_metrics()
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare result jsonb;
begin
  if not private.is_super_admin() then
    raise insufficient_privilege using message = 'Super admin access required';
  end if;

  select jsonb_build_object(
    'totalBusinesses', (select count(*) from public.businesses),
    'activeBusinesses', (select count(*) from public.businesses where status = 'active'),
    'totalUsers', (select count(*) from public.user_profiles),
    'activeUsers', (
      select count(distinct user_id)
      from public.business_users
      where status = 'active'
    ),
    'monthlyRevenue', coalesce((select sum(monthly_revenue) from public.businesses where status = 'active'), 0),
    'growthRate', 0,
    'systemHealth', jsonb_build_object(
      'uptime', 100,
      'responseTime', 0,
      'apiCalls', 0,
      'errorRate', 0
    )
  ) into result;

  return result;
end;
$$;

create or replace function public.get_business_growth_data()
returns table(month text, businesses bigint, users bigint)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if not private.is_super_admin() then
    raise insufficient_privilege using message = 'Super admin access required';
  end if;

  return query
  with months as (
    select date_trunc('month', current_date) - (n || ' months')::interval as month_start
    from generate_series(5,0,-1) n
  )
  select
    to_char(m.month_start, 'Mon')::text,
    (select count(*) from public.businesses b where b.created_at < m.month_start + interval '1 month')::bigint,
    (select count(*) from public.user_profiles u where u.created_at < m.month_start + interval '1 month')::bigint
  from months m
  order by m.month_start;
end;
$$;

create or replace function public.get_revenue_data()
returns table(month text, revenue numeric)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if not private.is_super_admin() then
    raise insufficient_privilege using message = 'Super admin access required';
  end if;

  return query
  with months as (
    select date_trunc('month', current_date) - (n || ' months')::interval as month_start
    from generate_series(5,0,-1) n
  )
  select
    to_char(m.month_start, 'Mon')::text,
    case
      when m.month_start = date_trunc('month', current_date)
      then coalesce((select sum(b.monthly_revenue) from public.businesses b where b.status = 'active'),0)
      else coalesce((
        select sum(sm.metric_value)
        from public.super_admin_dashboard_metrics sm
        where sm.metric_type = 'revenue'
          and date_trunc('month', sm.metric_date::timestamp) = m.month_start
      ),0)
    end::numeric
  from months m
  order by m.month_start;
end;
$$;

create or replace function public.get_recent_super_admin_activities()
returns table(
  id uuid,
  type text,
  status text,
  description text,
  activity_timestamp timestamptz
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if not private.is_super_admin() then
    raise insufficient_privilege using message = 'Super admin access required';
  end if;

  return query
  select
    a.id,
    a.action,
    coalesce(a.details ->> 'status', 'success'),
    coalesce(a.details ->> 'description', a.action),
    a.created_at
  from public.super_admin_activities a
  order by a.created_at desc
  limit 50;
end;
$$;

revoke all on function public.get_super_admin_dashboard_metrics() from public, anon;
revoke all on function public.get_business_growth_data() from public, anon;
revoke all on function public.get_revenue_data() from public, anon;
revoke all on function public.get_recent_super_admin_activities() from public, anon;
grant execute on function public.get_super_admin_dashboard_metrics() to authenticated, service_role;
grant execute on function public.get_business_growth_data() to authenticated, service_role;
grant execute on function public.get_revenue_data() to authenticated, service_role;
grant execute on function public.get_recent_super_admin_activities() to authenticated, service_role;
