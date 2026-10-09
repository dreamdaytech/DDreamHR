create or replace function public.process_payroll_period(target_period_id uuid)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
begin
  -- Fail closed until lifecycle, idempotency, leave, attendance and overtime
  -- calculations are reviewed and covered by automated tests.
  raise exception using
    errcode = '55000',
    message = 'Payroll processing is temporarily disabled pending payroll safety remediation';
end;
$function$;

revoke all on function public.process_payroll_period(uuid) from public, anon;
grant execute on function public.process_payroll_period(uuid) to authenticated, service_role;
