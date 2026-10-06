-- Expand DDreamHR's default leave catalog to match the application UI.
insert into public.leave_types (
  business_id, code, name, description, annual_allowance, carry_forward, max_carry_forward, is_paid, active, color
)
select b.id, v.code, v.name, v.description, v.allowance, false, 0, v.is_paid, true, v.color
from public.businesses b
cross join (
  values
    ('PERSONAL','Personal Leave','Short personal leave entitlement',3::numeric,true,'#64748b'),
    ('MATERNITY','Maternity Leave','Maternity leave entitlement',90::numeric,true,'#ec4899'),
    ('PATERNITY','Paternity Leave','Paternity leave entitlement',14::numeric,true,'#0ea5e9')
) as v(code,name,description,allowance,is_paid,color)
where b.slug = 'ddreamhr'
on conflict (business_id, code) do update
set name = excluded.name,
    description = excluded.description,
    annual_allowance = excluded.annual_allowance,
    is_paid = excluded.is_paid,
    active = true,
    color = excluded.color,
    updated_at = now();

insert into public.leave_balances (
  business_id, employee_id, leave_type_id, year, allocated, carried_over, used, pending
)
select e.business_id, e.id, lt.id, extract(year from current_date)::int, lt.annual_allowance, 0, 0, 0
from public.employees e
join public.leave_types lt on lt.business_id = e.business_id
where e.business_id = (select id from public.businesses where slug = 'ddreamhr')
on conflict (employee_id, leave_type_id, year) do update
set allocated = excluded.allocated,
    updated_at = now();

create or replace function private.bootstrap_business_defaults()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.attendance_settings (
    business_id, working_hours_start, working_hours_end, grace_time_late, grace_time_early,
    timezone, enable_break_tracking, enable_location_validation, enable_remote_checkin
  )
  values (new.id, '09:00', '17:00', 15, 15, 'UTC', true, false, true)
  on conflict (business_id) do nothing;

  insert into public.leave_settings (
    business_id, leave_year_start_month, allow_negative_balance,
    manager_approval_required, hr_approval_required, allow_half_days
  )
  values (new.id, 1, false, true, false, true)
  on conflict (business_id) do nothing;

  insert into public.leave_types (
    business_id, code, name, description, annual_allowance, carry_forward,
    max_carry_forward, is_paid, active, color
  )
  values
    (new.id, 'ANNUAL', 'Annual Leave', 'Paid annual leave entitlement', 21, true, 5, true, true, '#29a2d4'),
    (new.id, 'SICK', 'Sick Leave', 'Paid sick leave entitlement', 10, false, 0, true, true, '#e86625'),
    (new.id, 'PERSONAL', 'Personal Leave', 'Short personal leave entitlement', 3, false, 0, true, true, '#64748b'),
    (new.id, 'MATERNITY', 'Maternity Leave', 'Maternity leave entitlement', 90, false, 0, true, true, '#ec4899'),
    (new.id, 'PATERNITY', 'Paternity Leave', 'Paternity leave entitlement', 14, false, 0, true, true, '#0ea5e9'),
    (new.id, 'COMPASSIONATE', 'Compassionate Leave', 'Leave for bereavement or urgent family circumstances', 5, false, 0, true, true, '#7c3aed'),
    (new.id, 'UNPAID', 'Unpaid Leave', 'Approved leave without pay', 0, false, 0, false, true, '#6b7280')
  on conflict (business_id, code) do nothing;

  insert into public.payroll_schedules (business_id, name, frequency, pay_day, active)
  values (new.id, 'Monthly Payroll', 'monthly', 30, true);

  insert into public.onboarding_checklists (
    business_id, template_name, lifecycle_type, checklist_items, is_active
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
