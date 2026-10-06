create or replace function private.bootstrap_business_defaults()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.attendance_settings (
    business_id,
    working_hours_start,
    working_hours_end,
    grace_time_late,
    grace_time_early,
    timezone,
    enable_break_tracking,
    enable_location_validation,
    enable_remote_checkin
  )
  values (
    new.id,
    '09:00',
    '17:00',
    15,
    15,
    'UTC',
    true,
    false,
    true
  )
  on conflict (business_id) do nothing;

  insert into public.leave_settings (
    business_id,
    leave_year_start_month,
    allow_negative_balance,
    manager_approval_required,
    hr_approval_required,
    allow_half_days
  )
  values (new.id, 1, false, true, false, true)
  on conflict (business_id) do nothing;

  insert into public.leave_types (
    business_id, code, name, description, annual_allowance, carry_forward, max_carry_forward, is_paid, color
  )
  values
    (new.id, 'ANNUAL', 'Annual Leave', 'Paid annual leave entitlement', 21, true, 5, true, '#29a2d4'),
    (new.id, 'SICK', 'Sick Leave', 'Paid sick leave entitlement', 10, false, 0, true, '#e86625'),
    (new.id, 'COMPASSIONATE', 'Compassionate Leave', 'Leave for bereavement or urgent family circumstances', 5, false, 0, true, '#7c3aed'),
    (new.id, 'UNPAID', 'Unpaid Leave', 'Approved leave without pay', 0, false, 0, false, '#6b7280')
  on conflict (business_id, code) do nothing;

  insert into public.payroll_schedules (
    business_id, name, frequency, pay_day, active
  )
  values (new.id, 'Monthly Payroll', 'monthly', 30, true);

  insert into public.onboarding_checklists (
    business_id,
    template_name,
    lifecycle_type,
    checklist_items,
    is_active
  )
  values
    (
      new.id,
      'Standard Onboarding',
      'onboarding',
      '[
        {"id":"personal-details","title":"Complete personal details","required":true},
        {"id":"employment-documents","title":"Upload employment documents","required":true},
        {"id":"policy-acknowledgement","title":"Acknowledge company policies","required":true},
        {"id":"manager-introduction","title":"Manager introduction","required":true},
        {"id":"equipment-access","title":"Confirm equipment and system access","required":false}
      ]'::jsonb,
      true
    ),
    (
      new.id,
      'Standard Offboarding',
      'offboarding',
      '[
        {"id":"notice","title":"Confirm notice and final working date","required":true},
        {"id":"handover","title":"Complete role handover","required":true},
        {"id":"assets","title":"Return company assets","required":true},
        {"id":"access","title":"Revoke system access","required":true},
        {"id":"final-pay","title":"Confirm final payroll review","required":true}
      ]'::jsonb,
      true
    );

  return new;
end;
$$;

revoke all on function private.bootstrap_business_defaults() from public, anon, authenticated;

drop trigger if exists on_business_created_bootstrap_defaults on public.businesses;
create trigger on_business_created_bootstrap_defaults
after insert on public.businesses
for each row execute function private.bootstrap_business_defaults();

insert into public.feature_flags (feature_key, name, description, enabled, tags)
values
  ('people', 'People', 'Employee records, lifecycle and employee changes', true, array['core']),
  ('attendance', 'Time & Attendance', 'Attendance, breaks, regularization and timesheets', true, array['core']),
  ('leave', 'Leave', 'Leave balances, requests and approvals', true, array['core']),
  ('payroll', 'Payroll', 'Compensation, payroll runs and payslips', true, array['core']),
  ('engagement', 'Engagement', 'Surveys, recognition and events', true, array['core']),
  ('documents', 'Documents', 'Employee and business document management', true, array['core']),
  ('analytics', 'Analytics', 'Operational reports and analytics', true, array['core'])
on conflict (feature_key) do update
set name = excluded.name,
    description = excluded.description,
    tags = excluded.tags,
    updated_at = now();
