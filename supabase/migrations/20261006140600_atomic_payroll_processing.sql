create or replace function public.process_payroll_period(target_period_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  period_row public.payroll_periods%rowtype;
  working_day_count integer;
  processed_count integer;
  processed_total numeric(16,2);
begin
  select * into period_row
  from public.payroll_periods
  where id = target_period_id;

  if not found then
    raise exception 'Payroll period not found';
  end if;

  if not (
    private.is_super_admin()
    or private.has_business_role(period_row.business_id, array['admin','hr'])
  ) then
    raise insufficient_privilege using message = 'Payroll access required';
  end if;

  if period_row.status = 'cancelled' then
    raise exception 'Cancelled payroll periods cannot be processed';
  end if;

  select count(*)::integer
  into working_day_count
  from generate_series(period_row.start_date, period_row.end_date, interval '1 day') as d(day)
  where extract(isodow from d.day) < 6;

  update public.payroll_periods
  set status = 'in_progress',
      processed_by = (select auth.uid()),
      updated_at = now()
  where id = target_period_id;

  insert into public.payroll_records (
    payroll_period_id,
    employee_id,
    salary_profile_id,
    basic_salary,
    gross_salary,
    total_allowances,
    total_deductions,
    net_salary,
    working_days,
    actual_days_worked,
    leave_days,
    leave_deduction,
    overtime_hours,
    overtime_amount,
    payment_status,
    payment_date
  )
  select
    period_row.id,
    sp.employee_id,
    sp.id,
    sp.basic_salary,
    sp.basic_salary + coalesce(a.total_allowances, 0),
    coalesce(a.total_allowances, 0),
    coalesce(d.total_deductions, 0),
    greatest(0, sp.basic_salary + coalesce(a.total_allowances, 0) - coalesce(d.total_deductions, 0)),
    working_day_count,
    working_day_count,
    coalesce(l.leave_days, 0),
    0,
    0,
    0,
    'processed',
    period_row.pay_date
  from public.employee_salary_profiles sp
  join public.employees e
    on e.id = sp.employee_id
   and e.business_id = period_row.business_id
   and e.status = 'active'
  left join lateral (
    select sum(sa.amount) as total_allowances
    from public.salary_allowances sa
    where sa.salary_profile_id = sp.id
      and sa.is_active
  ) a on true
  left join lateral (
    select sum(
      case
        when sd.amount is not null then sd.amount
        when sd.percentage is not null then sp.basic_salary * sd.percentage / 100
        else 0
      end
    ) as total_deductions
    from public.salary_deductions sd
    where sd.salary_profile_id = sp.id
      and sd.is_active
  ) d on true
  left join lateral (
    select coalesce(sum(lr.days), 0) as leave_days
    from public.leave_requests lr
    where lr.employee_id = sp.employee_id
      and lr.status = 'approved'
      and lr.start_date <= period_row.end_date
      and lr.end_date >= period_row.start_date
  ) l on true
  where sp.business_id = period_row.business_id
    and sp.is_active
    and sp.effective_from <= period_row.end_date
    and (sp.effective_to is null or sp.effective_to >= period_row.start_date)
  on conflict (payroll_period_id, employee_id) do update
  set salary_profile_id = excluded.salary_profile_id,
      basic_salary = excluded.basic_salary,
      gross_salary = excluded.gross_salary,
      total_allowances = excluded.total_allowances,
      total_deductions = excluded.total_deductions,
      net_salary = excluded.net_salary,
      working_days = excluded.working_days,
      actual_days_worked = excluded.actual_days_worked,
      leave_days = excluded.leave_days,
      leave_deduction = excluded.leave_deduction,
      overtime_hours = excluded.overtime_hours,
      overtime_amount = excluded.overtime_amount,
      payment_status = excluded.payment_status,
      payment_date = excluded.payment_date,
      updated_at = now();

  delete from public.payroll_record_allowances pra
  using public.payroll_records pr
  where pra.payroll_record_id = pr.id
    and pr.payroll_period_id = period_row.id;

  insert into public.payroll_record_allowances (
    payroll_record_id, allowance_id, allowance_name, amount
  )
  select pr.id, sa.id, sa.name, sa.amount
  from public.payroll_records pr
  join public.salary_allowances sa on sa.salary_profile_id = pr.salary_profile_id
  where pr.payroll_period_id = period_row.id
    and sa.is_active;

  delete from public.payroll_record_deductions prd
  using public.payroll_records pr
  where prd.payroll_record_id = pr.id
    and pr.payroll_period_id = period_row.id;

  insert into public.payroll_record_deductions (
    payroll_record_id, deduction_id, deduction_name, amount
  )
  select
    pr.id,
    sd.id,
    sd.name,
    case
      when sd.amount is not null then sd.amount
      when sd.percentage is not null then pr.basic_salary * sd.percentage / 100
      else 0
    end
  from public.payroll_records pr
  join public.salary_deductions sd on sd.salary_profile_id = pr.salary_profile_id
  where pr.payroll_period_id = period_row.id
    and sd.is_active;

  insert into public.payslips (payroll_record_id, employee_id)
  select pr.id, pr.employee_id
  from public.payroll_records pr
  where pr.payroll_period_id = period_row.id
  on conflict (payroll_record_id) do nothing;

  select count(*)::integer, coalesce(sum(net_salary), 0)
  into processed_count, processed_total
  from public.payroll_records
  where payroll_period_id = period_row.id;

  update public.payroll_periods
  set status = 'completed',
      total_employees = processed_count,
      total_amount = processed_total,
      processed_by = (select auth.uid()),
      processed_at = now(),
      updated_at = now()
  where id = period_row.id;

  return jsonb_build_object(
    'period_id', period_row.id,
    'employees', processed_count,
    'total_amount', processed_total,
    'status', 'completed'
  );
end;
$$;

revoke all on function public.process_payroll_period(uuid) from public, anon;
grant execute on function public.process_payroll_period(uuid) to authenticated, service_role;
