create or replace function public.accept_employee_invitation(invitation_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  auth_row auth.users%rowtype;
  invite_row public.business_invitations%rowtype;
  employee_row public.employees%rowtype;
  business_row public.businesses%rowtype;
  target_checklist_id uuid;
  calculated_hash text;
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'Authentication required';
  end if;

  select * into auth_row from auth.users where id = current_user_id;
  if auth_row.id is null or auth_row.email is null then
    raise exception 'Authenticated user email is unavailable';
  end if;
  if auth_row.email_confirmed_at is null then
    raise exception 'Verify your email before accepting an invitation';
  end if;

  calculated_hash := encode(extensions.digest(invitation_token, 'sha256'), 'hex');

  select * into invite_row
  from public.business_invitations
  where token_hash = calculated_hash
  for update;

  if invite_row.id is null then
    raise exception 'Invitation not found';
  end if;
  if invite_row.status <> 'pending' then
    raise exception 'This invitation is no longer active';
  end if;
  if invite_row.expires_at <= now() then
    update public.business_invitations
    set status = 'expired', updated_at = now()
    where id = invite_row.id;
    raise exception 'This invitation has expired';
  end if;
  if lower(auth_row.email) <> lower(invite_row.email) then
    raise exception 'Sign in with the email address that received this invitation';
  end if;

  if exists (
    select 1
    from public.business_users
    where user_id = current_user_id
      and status = 'active'
      and business_id <> invite_row.business_id
  ) then
    raise exception 'This account already belongs to another business';
  end if;

  select * into employee_row
  from public.employees
  where id = invite_row.employee_id
    and business_id = invite_row.business_id
  for update;

  if employee_row.id is null then
    raise exception 'Employee record not found';
  end if;
  if employee_row.user_id is not null and employee_row.user_id <> current_user_id then
    raise exception 'This employee record is already linked to another account';
  end if;

  insert into public.business_users (
    business_id, user_id, role, status, permissions, is_primary_admin,
    invited_by, invited_at, joined_at
  )
  values (
    invite_row.business_id, current_user_id, invite_row.role, 'active',
    '{}'::jsonb, false, invite_row.invited_by, invite_row.created_at, now()
  )
  on conflict (business_id, user_id) do update
  set role = excluded.role,
      status = 'active',
      invited_by = excluded.invited_by,
      invited_at = excluded.invited_at,
      joined_at = coalesce(public.business_users.joined_at, excluded.joined_at),
      updated_at = now();

  update public.user_profiles
  set role = invite_row.role,
      updated_at = now()
  where user_id = current_user_id;

  update public.employees
  set user_id = current_user_id,
      lifecycle_state = case
        when lifecycle_state in ('former_employee','offboarding') then lifecycle_state
        else 'onboarding'
      end,
      status = case when status = 'terminated' then status else 'active' end,
      updated_at = now()
  where id = employee_row.id;

  select oc.id into target_checklist_id
  from public.onboarding_checklists oc
  where oc.business_id = invite_row.business_id
    and oc.lifecycle_type = 'onboarding'
    and oc.is_active = true
  order by oc.created_at
  limit 1;

  if target_checklist_id is not null then
    insert into public.employee_onboarding (
      business_id, employee_id, checklist_id, lifecycle_type,
      completed_items, completion_percentage, started_at
    )
    values (
      invite_row.business_id,
      employee_row.id,
      target_checklist_id,
      'onboarding',
      '[]'::jsonb,
      0,
      now()
    )
    on conflict on constraint employee_onboarding_employee_id_checklist_id_key do nothing;
  end if;

  insert into public.employee_lifecycle_events (
    business_id, employee_id, event_type, title, description, metadata, created_by
  )
  values (
    invite_row.business_id,
    employee_row.id,
    'onboarding_started',
    'DDreamHR invitation accepted',
    'Employee joined the business workspace and onboarding started.',
    jsonb_build_object('invitation_id', invite_row.id, 'role', invite_row.role),
    current_user_id
  );

  update public.business_invitations
  set status = 'accepted',
      accepted_by = current_user_id,
      accepted_at = now(),
      updated_at = now()
  where id = invite_row.id;

  select * into business_row from public.businesses where id = invite_row.business_id;

  return jsonb_build_object(
    'business_id', invite_row.business_id,
    'business_name', business_row.name,
    'employee_id', employee_row.id,
    'role', invite_row.role,
    'status', 'accepted'
  );
end;
$$;

revoke all on function public.accept_employee_invitation(text) from public, anon, authenticated;
grant execute on function public.accept_employee_invitation(text) to authenticated, service_role;
