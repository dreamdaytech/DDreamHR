create table public.business_invitations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin','hr','manager','employee')),
  token_hash text not null unique,
  status text not null default 'pending' check (status in ('pending','accepted','revoked','expired')),
  auth_user_existed boolean not null default false,
  delivery_status text not null default 'pending' check (delivery_status in ('pending','sent','link_only','failed')),
  delivery_error text,
  invited_by uuid references public.user_profiles(user_id) on delete set null,
  accepted_by uuid references public.user_profiles(user_id) on delete set null,
  expires_at timestamptz not null default (now() + interval '7 days'),
  last_sent_at timestamptz,
  accepted_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index business_invitations_business_status_idx
  on public.business_invitations(business_id, status, created_at desc);
create index business_invitations_employee_idx
  on public.business_invitations(employee_id, created_at desc);
create index business_invitations_email_idx
  on public.business_invitations(lower(email), status);

create trigger set_business_invitations_updated_at
before update on public.business_invitations
for each row execute function private.set_updated_at();

alter table public.business_invitations enable row level security;

revoke all on public.business_invitations from anon;
grant select, update, delete on public.business_invitations to authenticated, service_role;
grant insert on public.business_invitations to service_role;

create policy business_invitations_select on public.business_invitations
for select to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
);

create policy business_invitations_update on public.business_invitations
for update to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
)
with check (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
);

create policy business_invitations_delete on public.business_invitations
for delete to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
);

create or replace function public.register_business_tenant(
  business_name text,
  business_slug text,
  business_country text,
  business_industry text,
  business_company_size text,
  business_entity_type text,
  selected_plan text,
  business_timezone text,
  work_start time,
  work_end time,
  payroll_frequency text,
  payroll_pay_day integer,
  leave_year_start integer,
  business_phone text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  auth_row auth.users%rowtype;
  profile_row public.user_profiles%rowtype;
  new_business public.businesses%rowtype;
  normalized_slug text;
  owner_employee_id uuid;
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'Authentication required';
  end if;

  select * into auth_row from auth.users where id = current_user_id;
  if auth_row.id is null then
    raise insufficient_privilege using message = 'Authenticated user not found';
  end if;
  if auth_row.email_confirmed_at is null then
    raise exception 'Verify your email before creating a workspace';
  end if;

  select * into profile_row
  from public.user_profiles
  where user_id = current_user_id;

  if profile_row.id is null then
    raise exception 'User profile is not ready yet';
  end if;

  if profile_row.is_super_admin then
    raise exception 'Super administrators cannot self-register a tenant';
  end if;

  if exists (
    select 1 from public.business_users
    where user_id = current_user_id
      and status = 'active'
  ) then
    raise exception 'This account already belongs to a business';
  end if;

  normalized_slug := lower(regexp_replace(trim(business_slug), '[^a-zA-Z0-9-]+', '-', 'g'));
  normalized_slug := trim(both '-' from normalized_slug);

  if length(trim(business_name)) < 2 then
    raise exception 'Business name is required';
  end if;
  if length(normalized_slug) < 3 then
    raise exception 'Workspace URL must be at least 3 characters';
  end if;
  if business_entity_type not in ('company','organization','institution') then
    raise exception 'Invalid organization type';
  end if;
  if selected_plan not in ('trial','basic','standard','premium','enterprise') then
    raise exception 'Invalid plan';
  end if;
  if payroll_frequency not in ('weekly','biweekly','semimonthly','monthly') then
    raise exception 'Invalid payroll frequency';
  end if;
  if payroll_pay_day < 1 or payroll_pay_day > 31 then
    raise exception 'Payroll day must be between 1 and 31';
  end if;
  if leave_year_start < 1 or leave_year_start > 12 then
    raise exception 'Leave year start month must be between 1 and 12';
  end if;
  if work_end <= work_start then
    raise exception 'Work end time must be after work start time';
  end if;

  insert into public.businesses (
    name,
    slug,
    admin_email,
    admin_name,
    phone,
    country,
    industry,
    company_size,
    entity_type,
    subscription_plan,
    status,
    settings
  )
  values (
    trim(business_name),
    normalized_slug,
    auth_row.email,
    trim(concat_ws(' ', profile_row.first_name, profile_row.last_name)),
    nullif(trim(business_phone), ''),
    nullif(trim(business_country), ''),
    nullif(trim(business_industry), ''),
    nullif(trim(business_company_size), ''),
    business_entity_type,
    selected_plan,
    'trial',
    jsonb_build_object(
      'registration', jsonb_build_object(
        'setup_complete', true,
        'registered_at', now(),
        'selected_plan', selected_plan,
        'billing_status', 'not_connected'
      )
    )
  )
  returning * into new_business;

  insert into public.business_users (
    business_id,
    user_id,
    role,
    status,
    permissions,
    is_primary_admin,
    joined_at
  )
  values (
    new_business.id,
    current_user_id,
    'admin',
    'active',
    '{}'::jsonb,
    true,
    now()
  );

  update public.user_profiles
  set role = 'admin',
      updated_at = now()
  where user_id = current_user_id;

  insert into public.employees (
    business_id,
    user_id,
    employee_id_number,
    first_name,
    last_name,
    email,
    phone,
    position,
    department,
    employment_type,
    lifecycle_state,
    employment_condition,
    status,
    hire_date,
    start_date,
    metadata
  )
  values (
    new_business.id,
    current_user_id,
    'ADM-' || upper(substr(replace(current_user_id::text, '-', ''), 1, 8)),
    coalesce(nullif(profile_row.first_name, ''), 'Workspace'),
    coalesce(nullif(profile_row.last_name, ''), 'Owner'),
    auth_row.email,
    profile_row.phone,
    'Administrator',
    'Administration',
    'full_time',
    'active',
    'working',
    'active',
    current_date,
    current_date,
    jsonb_build_object('workspace_owner', true)
  )
  returning id into owner_employee_id;

  update public.attendance_settings
  set timezone = coalesce(nullif(trim(business_timezone), ''), 'UTC'),
      working_hours_start = work_start,
      working_hours_end = work_end,
      updated_at = now()
  where business_id = new_business.id;

  update public.leave_settings
  set leave_year_start_month = leave_year_start,
      updated_at = now()
  where business_id = new_business.id;

  update public.payroll_schedules
  set frequency = payroll_frequency,
      pay_day = payroll_pay_day,
      updated_at = now()
  where business_id = new_business.id
    and active = true;

  return jsonb_build_object(
    'business_id', new_business.id,
    'business_name', new_business.name,
    'business_slug', new_business.slug,
    'role', 'admin',
    'employee_id', owner_employee_id,
    'status', new_business.status,
    'subscription_plan', new_business.subscription_plan
  );

exception
  when unique_violation then
    raise exception 'That workspace URL is already in use';
end;
$$;

revoke all on function public.register_business_tenant(
  text,text,text,text,text,text,text,text,time,time,text,integer,integer,text
) from public, anon, authenticated;
grant execute on function public.register_business_tenant(
  text,text,text,text,text,text,text,text,time,time,text,integer,integer,text
) to authenticated, service_role;

create or replace function public.preview_employee_invitation(invitation_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  invite_row public.business_invitations%rowtype;
  business_row public.businesses%rowtype;
  employee_row public.employees%rowtype;
  calculated_hash text;
begin
  if invitation_token is null or length(invitation_token) < 20 then
    return jsonb_build_object('valid', false, 'status', 'invalid');
  end if;

  calculated_hash := encode(extensions.digest(invitation_token, 'sha256'), 'hex');

  select * into invite_row
  from public.business_invitations
  where token_hash = calculated_hash
  limit 1;

  if invite_row.id is null then
    return jsonb_build_object('valid', false, 'status', 'invalid');
  end if;

  if invite_row.status = 'pending' and invite_row.expires_at <= now() then
    update public.business_invitations
    set status = 'expired', updated_at = now()
    where id = invite_row.id;
    invite_row.status := 'expired';
  end if;

  select * into business_row from public.businesses where id = invite_row.business_id;
  select * into employee_row from public.employees where id = invite_row.employee_id;

  return jsonb_build_object(
    'valid', invite_row.status = 'pending' and invite_row.expires_at > now(),
    'status', invite_row.status,
    'business_name', business_row.name,
    'business_id', business_row.id,
    'employee_name', trim(concat_ws(' ', employee_row.first_name, employee_row.last_name)),
    'email', invite_row.email,
    'role', invite_row.role,
    'expires_at', invite_row.expires_at,
    'requires_password', not invite_row.auth_user_existed
  );
end;
$$;

revoke all on function public.preview_employee_invitation(text) from public, anon, authenticated;
grant execute on function public.preview_employee_invitation(text) to anon, authenticated, service_role;

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
  checklist_id uuid;
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
    business_id,
    user_id,
    role,
    status,
    permissions,
    is_primary_admin,
    invited_by,
    invited_at,
    joined_at
  )
  values (
    invite_row.business_id,
    current_user_id,
    invite_row.role,
    'active',
    '{}'::jsonb,
    false,
    invite_row.invited_by,
    invite_row.created_at,
    now()
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

  select id into checklist_id
  from public.onboarding_checklists
  where business_id = invite_row.business_id
    and lifecycle_type = 'onboarding'
    and is_active = true
  order by created_at
  limit 1;

  if checklist_id is not null then
    insert into public.employee_onboarding (
      business_id,
      employee_id,
      checklist_id,
      lifecycle_type,
      completed_items,
      completion_percentage,
      started_at
    )
    values (
      invite_row.business_id,
      employee_row.id,
      checklist_id,
      'onboarding',
      '[]'::jsonb,
      0,
      now()
    )
    on conflict (employee_id, checklist_id) do nothing;
  end if;

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

create or replace function public.lookup_auth_user_for_invitation(target_email text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select u.id
  from auth.users u
  where lower(u.email) = lower(target_email)
  limit 1;
$$;

revoke all on function public.lookup_auth_user_for_invitation(text) from public, anon, authenticated;
grant execute on function public.lookup_auth_user_for_invitation(text) to service_role;
