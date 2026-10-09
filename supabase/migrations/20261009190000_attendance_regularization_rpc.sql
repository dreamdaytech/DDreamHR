-- Make attendance regularization approval and its attendance mutation atomic.
-- Source-only until exercised against a disposable Supabase environment.

create or replace function public.decide_attendance_regularization(
  p_request_id uuid,
  p_action text,
  p_review_comment text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_request public.regularization_requests%rowtype;
  v_record public.attendance_records%rowtype;
  v_timezone text;
  v_work_start time;
  v_work_end time;
  v_check_in timestamptz;
  v_check_out timestamptz;
  v_existing_id uuid;
begin
  if v_actor is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;

  if p_action not in ('Approved', 'Rejected') then
    raise exception 'Action must be Approved or Rejected' using errcode = '22023';
  end if;

  select *
    into v_request
    from public.regularization_requests
   where id = p_request_id
   for update;

  if not found then
    raise exception 'Regularization request not found' using errcode = 'P0002';
  end if;

  if not (
    private.is_super_admin()
    or private.has_business_role(v_request.business_id, array['admin','hr'])
  ) then
    raise exception 'You are not authorized to review this tenant request'
      using errcode = '42501';
  end if;

  if v_request.status <> 'Pending' then
    raise exception 'Only pending requests can be reviewed' using errcode = '55000';
  end if;

  if p_action = 'Approved' then
    if v_request.request_type = 'Check-In' then
      if v_request.attendance_id is null or v_request.requested_check_in is null then
        raise exception 'Check-In request is missing its attendance record or requested time'
          using errcode = '22023';
      end if;

      update public.attendance_records
         set check_in = v_request.requested_check_in,
             is_regularized = true,
             updated_at = now()
       where id = v_request.attendance_id
         and business_id = v_request.business_id
         and employee_id = v_request.employee_id;
      if not found then
        raise exception 'Matching attendance record not found' using errcode = 'P0002';
      end if;

    elsif v_request.request_type = 'Check-Out' then
      if v_request.attendance_id is null or v_request.requested_check_out is null then
        raise exception 'Check-Out request is missing its attendance record or requested time'
          using errcode = '22023';
      end if;

      update public.attendance_records
         set check_out = v_request.requested_check_out,
             is_regularized = true,
             updated_at = now()
       where id = v_request.attendance_id
         and business_id = v_request.business_id
         and employee_id = v_request.employee_id;
      if not found then
        raise exception 'Matching attendance record not found' using errcode = 'P0002';
      end if;

    elsif v_request.request_type = 'Full Day' then
      select s.timezone, s.working_hours_start, s.working_hours_end
        into v_timezone, v_work_start, v_work_end
        from public.attendance_settings s
       where s.business_id = v_request.business_id;

      if not found or v_timezone is null or v_timezone = '' then
        raise exception 'Attendance timezone and working hours must be configured before approving a Full Day request'
          using errcode = '22023';
      end if;

      v_check_in := (v_request.requested_date + v_work_start) at time zone v_timezone;
      if v_work_end <= v_work_start then
        v_check_out := ((v_request.requested_date + 1) + v_work_end) at time zone v_timezone;
      else
        v_check_out := (v_request.requested_date + v_work_end) at time zone v_timezone;
      end if;

      if v_request.attendance_id is not null then
        select * into v_record
          from public.attendance_records
         where id = v_request.attendance_id
           and business_id = v_request.business_id
           and employee_id = v_request.employee_id
         for update;
      else
        select * into v_record
          from public.attendance_records
         where business_id = v_request.business_id
           and employee_id = v_request.employee_id
           and work_date = v_request.requested_date
         for update;
      end if;

      if v_request.attendance_id is not null and not found then
        raise exception 'Matching attendance record not found' using errcode = 'P0002';
      end if;

      if found then
        update public.attendance_records
           set check_in = v_check_in,
               check_out = v_check_out,
               status = 'Present',
               is_regularized = true,
               updated_at = now()
         where id = v_record.id;
      else
        insert into public.attendance_records (
          business_id, employee_id, work_date, check_in, check_out,
          total_hours, status, is_regularized
        ) values (
          v_request.business_id, v_request.employee_id, v_request.requested_date,
          v_check_in, v_check_out,
          greatest(0, round(extract(epoch from (v_check_out - v_check_in)) / 3600.0, 2)),
          'Present', true
        )
        returning id into v_existing_id;
      end if;

    elsif v_request.request_type = 'Break' then
      raise exception 'Break regularization is not supported by the current request schema; request left pending'
        using errcode = '0A000';
    else
      raise exception 'Unsupported regularization request type' using errcode = '22023';
    end if;
  end if;

  update public.regularization_requests
     set status = p_action,
         reviewer_id = v_actor,
         reviewed_at = now(),
         review_comment = coalesce(p_review_comment, review_comment),
         updated_at = now()
   where id = v_request.id;

  return v_request.id;
end;
$$;

revoke all on function public.decide_attendance_regularization(uuid, text, text) from public, anon;
grant execute on function public.decide_attendance_regularization(uuid, text, text) to authenticated;
