create or replace function public.complete_my_onboarding_item(item_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  employee_row public.employees%rowtype;
  onboarding_row public.employee_onboarding%rowtype;
  checklist_row public.onboarding_checklists%rowtype;
  next_completed jsonb;
  total_count integer;
  completed_count integer;
  required_count integer;
  required_completed_count integer;
  next_percentage numeric(5,2);
  required_complete boolean;
  all_complete boolean;
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'Authentication required';
  end if;

  select * into employee_row
  from public.employees
  where user_id = current_user_id
  limit 1;

  if employee_row.id is null then
    raise exception 'Your account is not linked to an employee record';
  end if;

  select * into onboarding_row
  from public.employee_onboarding
  where employee_id = employee_row.id
    and lifecycle_type = 'onboarding'
  order by started_at desc
  limit 1
  for update;

  if onboarding_row.id is null then
    raise exception 'No onboarding checklist is assigned to this employee';
  end if;

  select * into checklist_row
  from public.onboarding_checklists
  where id = onboarding_row.checklist_id;

  if checklist_row.id is null then
    raise exception 'Onboarding checklist not found';
  end if;

  if not exists (
    select 1
    from jsonb_array_elements(checklist_row.checklist_items) as item
    where item ->> 'id' = item_id
  ) then
    raise exception 'Onboarding task not found';
  end if;

  next_completed := coalesce(onboarding_row.completed_items, '[]'::jsonb);

  if not exists (
    select 1
    from jsonb_array_elements_text(next_completed) as completed(value)
    where completed.value = item_id
  ) then
    next_completed := next_completed || jsonb_build_array(item_id);
  end if;

  total_count := jsonb_array_length(checklist_row.checklist_items);
  completed_count := jsonb_array_length(next_completed);

  select count(*)::integer
  into required_count
  from jsonb_array_elements(checklist_row.checklist_items) as item
  where coalesce((item ->> 'required')::boolean, false);

  select count(*)::integer
  into required_completed_count
  from jsonb_array_elements(checklist_row.checklist_items) as item
  where coalesce((item ->> 'required')::boolean, false)
    and exists (
      select 1
      from jsonb_array_elements_text(next_completed) as completed(value)
      where completed.value = item ->> 'id'
    );

  next_percentage := case
    when total_count = 0 then 100
    else round((completed_count::numeric / total_count::numeric) * 100, 2)
  end;

  required_complete := required_count = 0 or required_completed_count >= required_count;
  all_complete := total_count = 0 or completed_count >= total_count;

  update public.employee_onboarding
  set completed_items = next_completed,
      completion_percentage = next_percentage,
      completed_at = case when all_complete then coalesce(completed_at, now()) else completed_at end,
      updated_at = now()
  where id = onboarding_row.id;

  if required_complete
     and employee_row.lifecycle_state not in ('active','offboarding','former_employee') then
    update public.employees
    set lifecycle_state = 'active',
        employment_condition = case
          when employment_condition = 'probation' then employment_condition
          else 'working'
        end,
        updated_at = now()
    where id = employee_row.id;

    if not exists (
      select 1
      from public.employee_lifecycle_events
      where employee_id = employee_row.id
        and event_type = 'activated'
        and metadata ->> 'source' = 'onboarding'
    ) then
      insert into public.employee_lifecycle_events (
        business_id,
        employee_id,
        event_type,
        title,
        description,
        metadata,
        created_by
      )
      values (
        employee_row.business_id,
        employee_row.id,
        'activated',
        'Required onboarding completed',
        'Required onboarding tasks were completed and the employee became active.',
        jsonb_build_object(
          'source', 'onboarding',
          'onboarding_id', onboarding_row.id,
          'required_tasks', required_count,
          'optional_tasks_remaining', greatest(total_count - completed_count, 0)
        ),
        current_user_id
      );
    end if;
  end if;

  return jsonb_build_object(
    'onboarding_id', onboarding_row.id,
    'employee_id', employee_row.id,
    'completed_items', next_completed,
    'completion_percentage', next_percentage,
    'completed', all_complete,
    'activated', required_complete,
    'required_tasks', required_count,
    'required_tasks_completed', required_completed_count,
    'lifecycle_state', case
      when required_complete and employee_row.lifecycle_state not in ('offboarding','former_employee') then 'active'
      else employee_row.lifecycle_state
    end
  );
end;
$$;

revoke all on function public.complete_my_onboarding_item(text) from public, anon, authenticated;
grant execute on function public.complete_my_onboarding_item(text) to authenticated, service_role;
