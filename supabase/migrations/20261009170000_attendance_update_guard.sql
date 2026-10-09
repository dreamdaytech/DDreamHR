-- Attendance audit remediation: enforce tenant immutability and protect attendance
-- facts/calculated fields. This migration is source-only until validated against
-- a disposable Supabase database; do not apply directly to production.

create or replace function private.guard_attendance_record_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  privileged boolean;
  elapsed_seconds numeric;
  unpaid_break_seconds numeric;
begin
  -- Unauthenticated callers cannot normally reach this table due to grants/RLS.
  -- Trusted service-role calls have no auth.uid() and retain server workflow access.
  if actor is null then
    return new;
  end if;

  -- A record must never be moved between tenants, employees, or work dates,
  -- including by an administrator. Correct it through a controlled workflow.
  if old.business_id is distinct from new.business_id
     or old.employee_id is distinct from new.employee_id
     or old.work_date is distinct from new.work_date
     or old.created_at is distinct from new.created_at
  then
    raise exception 'Attendance tenant, employee, work date, and creation time are immutable'
      using errcode = '42501';
  end if;

  privileged := private.is_super_admin()
    or private.has_business_role(old.business_id, array['admin','hr']);

  if not privileged then
    if not private.owns_employee(old.employee_id) then
      raise exception 'You may only update your own attendance record'
        using errcode = '42501';
    end if;

    -- Employees may only submit a one-time check-out. Every other field is
    -- server-owned or must be changed through a regularization workflow.
    if (to_jsonb(new) - array[
          'check_out', 'total_hours', 'location_check_out',
          'ip_address_check_out', 'device_check_out', 'check_out_notes',
          'updated_at'
        ]) is distinct from
       (to_jsonb(old) - array[
          'check_out', 'total_hours', 'location_check_out',
          'ip_address_check_out', 'device_check_out', 'check_out_notes',
          'updated_at'
        ]) then
      raise exception 'Attendance fields are protected; submit a regularization request'
        using errcode = '42501';
    end if;

    if old.check_out is not null or new.check_out is null then
      raise exception 'An employee may check out only once on an open attendance record'
        using errcode = '42501';
    end if;

    if new.check_out > now() then
      raise exception 'Check-out cannot be in the future'
        using errcode = '23514';
    end if;
  end if;

  if new.check_out is not null and new.check_in is not null
     and new.check_out < new.check_in then
    raise exception 'Check-out cannot precede check-in'
      using errcode = '23514';
  end if;

  -- Do not trust client-supplied total_hours. Derive it from timestamps and
  -- subtract unpaid breaks, clipping a break to the checkout time if needed.
  if new.check_out is not null and new.check_in is not null then
    elapsed_seconds := extract(epoch from (new.check_out - new.check_in));
    select coalesce(sum(extract(epoch from (
      least(coalesce(b.end_time, new.check_out), new.check_out) - b.start_time
    ))), 0)
      into unpaid_break_seconds
      from public.attendance_breaks b
     where b.attendance_id = old.id
       and not b.is_paid
       and b.start_time < new.check_out
       and coalesce(b.end_time, new.check_out) > b.start_time;

    new.total_hours := greatest(0, round((elapsed_seconds - unpaid_break_seconds) / 3600.0, 2));
  end if;

  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.guard_attendance_record_update() from public, anon, authenticated;

drop trigger if exists guard_attendance_record_update on public.attendance_records;
create trigger guard_attendance_record_update
before update on public.attendance_records
for each row execute function private.guard_attendance_record_update();

-- Indexes are deliberately retained: attendance tables are empty and usage
-- statistics are not representative of production workload.
