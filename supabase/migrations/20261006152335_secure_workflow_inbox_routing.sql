create or replace function public.route_workflow_to_inbox(
  target_workflow_id uuid,
  preferred_assignee_user_id uuid default null,
  preferred_assignee_role text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  req public.workflow_requests%rowtype;
  resolved_user_id uuid;
  resolved_role text;
  existing_item_id uuid;
  new_item_id uuid;
  item_title text;
  item_description text;
begin
  if (select auth.uid()) is null then
    raise insufficient_privilege using message = 'Authentication required';
  end if;

  select * into req
  from public.workflow_requests
  where id = target_workflow_id;

  if not found then
    raise exception 'Workflow request not found';
  end if;

  if not (
    private.is_super_admin()
    or private.has_business_role(req.business_id, array['admin','hr','manager'])
    or req.submitted_by = (select auth.uid())
  ) then
    raise insufficient_privilege using message = 'Not allowed to route this workflow';
  end if;

  select wi.id into existing_item_id
  from public.work_items wi
  where wi.source_type = 'workflow_request'
    and wi.source_id = req.id
    and wi.status in ('open','in_progress')
  order by wi.created_at desc
  limit 1;

  if existing_item_id is not null then
    return existing_item_id;
  end if;

  if preferred_assignee_user_id is not null
     and exists (
       select 1
       from public.business_users bu
       where bu.business_id = req.business_id
         and bu.user_id = preferred_assignee_user_id
         and bu.status = 'active'
     ) then
    resolved_user_id := preferred_assignee_user_id;
  end if;

  if resolved_user_id is null then
    if preferred_assignee_role in ('manager','hr','admin') then
      resolved_role := preferred_assignee_role;
    else
      resolved_role := case
        when req.request_type in ('leave','timesheet') then 'manager'
        when req.request_type in ('employee_change','regularization','document','onboarding','offboarding') then 'hr'
        else 'hr'
      end;
    end if;
  end if;

  item_title := case req.request_type
    when 'leave' then 'Leave request approval'
    when 'timesheet' then 'Timesheet approval'
    when 'employee_change' then 'Employee change approval'
    when 'regularization' then 'Attendance regularization'
    when 'document' then 'Document review'
    when 'onboarding' then 'Onboarding task'
    when 'offboarding' then 'Offboarding task'
    else initcap(replace(req.request_type, '_', ' '))
  end;

  item_description := case req.request_type
    when 'leave' then concat_ws(
      ' ',
      coalesce(req.payload->>'leave_type', 'Leave'),
      coalesce(req.payload->>'start_date', ''),
      'to',
      coalesce(req.payload->>'end_date', '')
    )
    when 'timesheet' then concat_ws(
      ' ',
      coalesce(req.payload->>'period_start', ''),
      'to',
      coalesce(req.payload->>'period_end', ''),
      coalesce(req.payload->>'total_hours', '') || 'h'
    )
    when 'employee_change' then concat_ws(
      ' · ',
      coalesce(req.payload->>'change_type', 'Employee change'),
      'Effective ' || coalesce(req.payload->>'effective_date', '')
    )
    else item_title
  end;

  insert into public.work_items (
    business_id,
    assignee_user_id,
    assignee_role,
    category,
    source_type,
    source_id,
    title,
    description,
    status,
    priority
  )
  values (
    req.business_id,
    resolved_user_id,
    case when resolved_user_id is null then resolved_role else null end,
    req.request_type,
    'workflow_request',
    req.id,
    item_title,
    nullif(trim(item_description), ''),
    'open',
    'normal'
  )
  returning id into new_item_id;

  return new_item_id;
end;
$$;

revoke all on function public.route_workflow_to_inbox(uuid, uuid, text) from public, anon;
grant execute on function public.route_workflow_to_inbox(uuid, uuid, text) to authenticated, service_role;

create or replace function public.resubmit_workflow_request(target_workflow_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  req public.workflow_requests%rowtype;
begin
  if (select auth.uid()) is null then
    raise insufficient_privilege using message = 'Authentication required';
  end if;

  select * into req
  from public.workflow_requests
  where id = target_workflow_id;

  if not found then
    raise exception 'Workflow request not found';
  end if;

  if not (
    private.is_super_admin()
    or private.has_business_role(req.business_id, array['admin','hr','manager'])
    or req.submitted_by = (select auth.uid())
  ) then
    raise insufficient_privilege using message = 'Not allowed to resubmit this workflow';
  end if;

  if req.status <> 'rejected' then
    raise exception 'Only rejected workflows can be resubmitted';
  end if;

  update public.workflow_requests
  set status = 'pending',
      completed_at = null,
      updated_at = now()
  where id = req.id;
end;
$$;

revoke all on function public.resubmit_workflow_request(uuid) from public, anon;
grant execute on function public.resubmit_workflow_request(uuid) to authenticated, service_role;
