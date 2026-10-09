-- Attendance audit remediation: prevent employees from moving or rewriting
-- attendance records across tenants and protect server-owned calculation fields.
-- This migration is intentionally source-only until reviewed and tested in a
-- disposable Supabase environment. Do not apply directly to production.

create or replace function private.guard_attendance_record_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  privileged boolean;
begin
  -- Service-role operations (auth.uid() is null) are handled by trusted server
  -- workflows; authenticated users must prove their role in this tenant.
  if actor is null then
    return new;
  end if;

  privileged := private.is_super_admin()
    or private.has_business_role(old.business_id, array['admin','hr']);

  if not privileged then
    if not private.owns_employee(old.employee_id)
       or old.employee_id is distinct from new.employee_id
       or old.business_id is distinct from new.business_id
       or old.work_date is distinct from new.work_date
       or old.created_at is distinct from new.created_at
       or old.total_hours is distinct from new.total_hours
       or old.status is distinct from new.status
       or old.is_regularized is distinct from new.is_regularized
       or old.check_in is distinct from new.check_in
       or old.location_id is distinct from new.location_id
       or old.ip_address_check_in is distinct from new.ip_address_check_in
       or old.device_check_in is distinct from new.device_check_in
    then
      raise exception 'Attendance record contains protected fields; submit a regularization request'
        using errcode = '42501';
    end if;

    if old.check_out is not null then
      raise exception 'A completed attendance record cannot be checked out again'
        using errcode = '42501';
    end if;

    if new.check_out is not null and new.check_in is not null and new.check_out < new.check_in then
      raise exception 'Check-out cannot precede check-in'
        using errcode = '23514';
    end if;
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

-- Index is deliberately retained even if currently unused: attendance tables
-- are empty and usage statistics are not representative of production load.
