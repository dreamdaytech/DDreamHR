create extension if not exists pgcrypto with schema extensions;

create table if not exists public.business_invitations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin','hr','manager','employee')),
  token_hash text not null unique,
  status text not null default 'pending'
    check (status in ('pending','accepted','revoked','expired')),
  delivery_status text not null default 'pending'
    check (delivery_status in ('pending','sent','link_only','failed')),
  delivery_error text,
  requires_password boolean not null default true,
  invited_by uuid not null references public.user_profiles(user_id) on delete restrict,
  expires_at timestamptz not null,
  last_sent_at timestamptz,
  accepted_by uuid references public.user_profiles(user_id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create unique index if not exists business_invitations_one_pending_per_employee
  on public.business_invitations(employee_id)
  where status = 'pending';

create index if not exists business_invitations_business_status_idx
  on public.business_invitations(business_id, status, created_at desc);

create index if not exists business_invitations_email_idx
  on public.business_invitations(lower(email), status);

drop trigger if exists set_business_invitations_updated_at on public.business_invitations;
create trigger set_business_invitations_updated_at
before update on public.business_invitations
for each row execute function private.set_updated_at();

alter table public.business_invitations enable row level security;

revoke all on public.business_invitations from anon;
grant select, insert, update on public.business_invitations to authenticated, service_role;

drop policy if exists business_invitations_select on public.business_invitations;
create policy business_invitations_select
on public.business_invitations
for select
to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
);

drop policy if exists business_invitations_insert on public.business_invitations;
create policy business_invitations_insert
on public.business_invitations
for insert
to authenticated
with check (
  private.is_super_admin()
  or (
    invited_by = (select auth.uid())
    and private.has_business_role(business_id, array['admin','hr'])
  )
);

drop policy if exists business_invitations_update on public.business_invitations;
create policy business_invitations_update
on public.business_invitations
for update
to authenticated
using (
  private.is_super_admin()
  or private.has_business_role(business_id, array['admin','hr'])
)
with check (
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
  caller_id uuid := (select auth.uid());
  auth_row auth.users%rowtype;
  profile_row public.user_profiles%rowtype;
  existing_membership public.business_users%rowtype;
  existing_business public.businesses%rowtype;
  new_business public.businesses%rowtype;
  new_employee public.employees%rowtype;
  normalized_slug text;
  first_name_value text;
  last_name_value text;
begin
  if caller_id is null then
    raise insufficient_privilege using message = 'Authentication required';
  end if;

  select * into auth_row
  from auth.users
  where id = caller_id;

  if not found then
    raise insufficient_privilege using message = 'Authenticated user not found';
  end if;

  if auth_row.email_confirmed_at is null then
    raise exception 'Verify your email before creating a workspace';
  end if;

  select * into profile_row
  from public.user_profiles
  where user_id = caller_id;

  if not found then
    raise exception 'User profile is not ready yet';
  end if;

  if profile_row.is_super_admin then
    raise exception 'Super administrators cannot register a tenant from this flow';
  end if;

  select bu.* into existing_membership
  from public.business_users bu
  where bu.user_id = caller_id
    and bu.status = 'active'
  order by bu.is_primary_admin desc, bu.created_at
  limit 1;

  if found then
    select * into existing_business
    from public.businesses
    where id = existing_membership.business_id;

    if existing_membership.role = 'admin' and existing_membership.is_primary_admin then
      select * into new_employee
      from public.employees
      where business_id = existing_membership.business_id
        and user_id = caller_id
      limit 1;

      return jsonb_build_object(
        'business_id', existing_business.id,
        'business_name', existing_business.name,
        'business_slug', existing_business.slug,
        'role', existing_membership.role,
        'employee_id', new_employee.id,
        'status', existing_business.status,
        'subscription_plan', existing_business.subscription_plan
      );
    end if;

    raise exception 'This account already belongs to a DDreamHR workspace';
  end if;

  normalized_slug := lower(trim(coalesce(business_slug, '')));
  normalized_slug := regexp_replace(normalized_slug, '[^a-z0-9-]+', '-', 'g');
  normalized_slug := regexp_replace(normalized_slug, '(^-+|-+$)', '', 'g');

  if length(trim(coalesce(business_name, ''))) < 2 then
    raise exception 'Business name is required';
  end if;

  if length(normalized_slug) < 3 or length(normalized_slug) > 48 then
    raise exception 'Workspace URL must be between 3 and 48 characters';
  end if;

  if business_entity_type not in ('company','organization','institution') then
    raise exception 'Invalid organization type';
  end if;

  if selected_plan not in ('trial','basic','standard','premium','enterprise') then
    raise exception 'Invalid subscription plan';
  end if;

  if payroll_frequency not in ('weekly','biweekly','semimonthly','monthly') then
    raise exception 'Invalid payroll frequency';
  end if;

  if payroll_pay_day < 1 or payroll_pay_day > 31 then
    raise exception 'Payroll pay day must be between 1 and 31';
  end if;

  if leave_year_start < 1 or leave_year_start > 12 then
    raise exception 'Leave year start must be between 1 and 12';
  end if;

  if work_end <= work_start then
    raise exception 'Work end time must be later than work start time';
  end if;

  if exists(select 1 from public.businesses where slug = normalized_slug) then
    raise exception 'That workspace URL is already taken';
  end if;

  first_name_value := coalesce(nullif(trim(profile_row.first_name), ''), nullif(trim(auth_row.raw_user_meta_data ->> 'first_name'), ''), 'Workspace');
  last_name_value := coalesce(nullif(trim(profile_row.last_name), ''), nullif(trim(auth_row.raw_user_meta_data ->> 'last_name'), ''), 'Owner');

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
    status
  )
  values (
    trim(business_name),
    normalized_slug,
    lower(auth_row.email),
    trim(first_name_value || ' ' || last_name_value),
    nullif(trim(coalesce(business_phone, '')), ''),
    trim(business_country),
    trim(business_industry),
    trim(business_company_size),
    business_entity_type,
    selected_plan,
    'trial'
  )
  returning * into new_business;

  insert into public.business_users (
    business_id,
    user_id,
    role,
    status,
    is_primary_admin,
    joined_at
  )
  values (
    new_business.id,
    caller_id,
    'admin',
    'active',
    true,
    now()
  );

  update public.user_profiles
  set role = 'admin',
      updated_at = now()
  where user_id = caller_id;

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
    location,
    employment_type,
    lifecycle_state,
    employment_condition,
    status,
    hire_date,
    start_date
  )
  values (
    new_business.id,
    caller_id,
    'ADM-' || upper(substr(replace(new_business.id::text, '-', ''), 1, 8)),
    first_name_value,
    last_name_value,
    lower(auth_row.email),
    nullif(trim(coalesce(business_phone, '')), ''),
    'Administrator',
    'Administration',
    nullif(trim(coalesce(business_country, '')), ''),
    'full_time',
    'active',
    'working',
    'active',
    current_date,
    current_date
  )
  returning * into new_employee;

  update public.attendance_settings
  set working_hours_start = work_start,
      working_hours_end = work_end,
      timezone = coalesce(nullif(trim(business_timezone), ''), 'UTC'),
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

  insert into public.employee_lifecycle_events (
    business_id,
    employee_id,
    event_type,
    event_date,
    title,
    description,
    created_by
  )
  values (
    new_business.id,
    new_employee.id,
    'activated',
    now(),
    'Workspace administrator activated',
    'Primary administrator created during business registration.',
    caller_id
  );

  return jsonb_build_object(
    'business_id', new_business.id,
    'business_name', new_business.name,
    'business_slug', new_business.slug,
    'role', 'admin',
    'employee_id', new_employee.id,
    'status', new_business.status,
    'subscription_plan', new_business.subscription_plan
  );
end;
$$;

revoke all on function public.register_business_tenant(
  text,text,text,text,text,text,text,text,time,time,text,integer,integer,text
) from public, anon;
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
  token_digest text;
  invitation public.business_invitations%rowtype;
  employee public.employees%rowtype;
  business public.businesses%rowtype;
  effective_status text;
begin
  if invitation_token is null or length(invitation_token) < 20 then
    return jsonb_build_object('valid', false, 'status', 'invalid');
  end if;

  token_digest := encode(extensions.digest(invitation_token, 'sha256'), 'hex');

  select * into invitation
  from public.business_invitations
  where token_hash = token_digest
  limit 1;

  if not found then
    return jsonb_build_object('valid', false, 'status', 'invalid');
  end if;

  effective_status := case
    when invitation.status = 'pending' and invitation.expires_at <= now() then 'expired'
    else invitation.status
  end;

  select * into employee from public.employees where id = invitation.employee_id;
  select * into business from public.businesses where id = invitation.business_id;

  return jsonb_build_object(
    'valid', effective_status = 'pending',
    'status', effective_status,
    'business_name', business.name,
    'business_id', business.id,
    'employee_name', trim(employee.first_name || ' ' || employee.last_name),
    'email', invitation.email,
    'role', invitation.role,
    'expires_at', invitation.expires_at,
    'requires_password', invitation.requires_password
  );
end;
$$;

revoke all on function public.preview_employee_invitation(text) from public;
grant execute on function public.preview_employee_invitation(text) to anon, authenticated, service_role;

create or replace function public.accept_employee_invitation(invitation_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
  caller_email text;
  caller_confirmed_at timestamptz;
  token_digest text;
  invitation public.business_invitations%rowtype;
  employee public.employees%rowtype;
  business public.businesses%rowtype;
  existing_membership public.business_users%rowtype;
  checklist_id uuid;
begin
  if caller_id is null then
    raise insufficient_privilege using message = 'Authentication required';
  end if;

  select lower(email), email_confirmed_at
  into caller_email, caller_confirmed_at
  from auth.users
  where id = caller_id;

  if caller_email is null then
    raise exception 'Authenticated email not found';
  end if;

  if caller_confirmed_at is null then
    raise exception 'Verify your email before accepting this invitation';
  end if;

  token_digest := encode(extensions.digest(invitation_token, 'sha256'), 'hex');

  select * into invitation
  from public.business_invitations
  where token_hash = token_digest
  for update;

  if not found then
    raise exception 'Invitation is invalid';
  end if;

  if invitation.status = 'accepted' then
    if invitation.accepted_by = caller_id then
      select * into employee from public.employees where id = invitation.employee_id;
      select * into business from public.businesses where id = invitation.business_id;
      return jsonb_build_object(
        'business_id', business.id,
        'business_name', business.name,
        'employee_id', employee.id,
        'role', invitation.role,
        'status', 'accepted'
      );
    end if;
    raise exception 'Invitation has already been accepted';
  end if;

  if invitation.status <> 'pending' then
    raise exception 'Invitation is no longer available';
  end if;

  if invitation.expires_at <= now() then
    update public.business_invitations
    set status = 'expired'
    where id = invitation.id;
    raise exception 'Invitation has expired';
  end if;

  if lower(invitation.email) <> caller_email then
    raise insufficient_privilege using message = 'Sign in with the email address that received this invitation';
  end if;

  select * into employee
  from public.employees
  where id = invitation.employee_id
    and business_id = invitation.business_id
  for update;

  if not found then
    raise exception 'Employee record is no longer available';
  end if;

  if employee.user_id is not null and employee.user_id <> caller_id then
    raise exception 'Employee record is already linked to another account';
  end if;

  select bu.* into existing_membership
  from public.business_users bu
  where bu.user_id = caller_id
    and bu.status = 'active'
    and bu.business_id <> invitation.business_id
  limit 1;

  if found then
    raise exception 'This DDreamHR account already belongs to another active workspace';
  end if;

  insert into public.business_users (
    business_id,
    user_id,
    role,
    status,
    is_primary_admin,
    invited_by,
    invited_at,
    joined_at
  )
  values (
    invitation.business_id,
    caller_id,
    invitation.role,
    'active',
    false,
    invitation.invited_by,
    invitation.created_at,
    now()
  )
  on conflict (business_id, user_id) do update
  set role = excluded.role,
      status = 'active',
      invited_by = excluded.invited_by,
      invited_at = coalesce(public.business_users.invited_at, excluded.invited_at),
      joined_at = coalesce(public.business_users.joined_at, excluded.joined_at),
      updated_at = now();

  update public.user_profiles
  set role = invitation.role,
      updated_at = now()
  where user_id = caller_id;

  update public.employees
  set user_id = caller_id,
      lifecycle_state = case
        when lifecycle_state in ('preboarding','onboarding') then 'onboarding'
        else lifecycle_state
      end,
      status = case when status = 'inactive' then 'active' else status end,
      updated_at = now()
  where id = employee.id;

  insert into public.leave_balances (
    business_id,
    employee_id,
    leave_type_id,
    year,
    allocated,
    carried_over,
    used,
    pending
  )
  select
    invitation.business_id,
    employee.id,
    lt.id,
    extract(year from current_date)::integer,
    lt.annual_allowance,
    0,
    0,
    0
  from public.leave_types lt
  where lt.business_id = invitation.business_id
    and lt.active
  on conflict (employee_id, leave_type_id, year) do nothing;

  select oc.id into checklist_id
  from public.onboarding_checklists oc
  where oc.business_id = invitation.business_id
    and oc.lifecycle_type = 'onboarding'
    and oc.is_active
  order by oc.created_at
  limit 1;

  if checklist_id is not null then
    insert into public.employee_onboarding (
      business_id,
      employee_id,
      checklist_id,
      lifecycle_type,
      completed_items,
      completion_percentage
    )
    values (
      invitation.business_id,
      employee.id,
      checklist_id,
      'onboarding',
      '[]'::jsonb,
      0
    )
    on conflict (employee_id, checklist_id) do nothing;
  end if;

  update public.business_invitations
  set status = 'accepted',
      accepted_by = caller_id,
      accepted_at = now(),
      updated_at = now()
  where id = invitation.id;

  select * into business
  from public.businesses
  where id = invitation.business_id;

  insert into public.employee_lifecycle_events (
    business_id,
    employee_id,
    event_type,
    event_date,
    title,
    description,
    created_by
  )
  values (
    invitation.business_id,
    employee.id,
    'onboarding_started',
    now(),
    'DDreamHR invitation accepted',
    'Employee account linked to the existing employment record.',
    caller_id
  );

  return jsonb_build_object(
    'business_id', business.id,
    'business_name', business.name,
    'employee_id', employee.id,
    'role', invitation.role,
    'status', 'accepted'
  );
end;
$$;

revoke all on function public.accept_employee_invitation(text) from public, anon;
grant execute on function public.accept_employee_invitation(text) to authenticated, service_role;
