create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated, service_role;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  admin_email text not null,
  admin_name text not null,
  phone text,
  address text,
  country text,
  industry text,
  company_size text,
  entity_type text not null default 'company' check (entity_type in ('company','organization','institution')),
  subscription_plan text not null default 'trial' check (subscription_plan in ('trial','basic','standard','premium','enterprise')),
  status text not null default 'trial' check (status in ('active','suspended','trial','pending','inactive')),
  brand_color text,
  logo_url text,
  monthly_revenue numeric(14,2) not null default 0 check (monthly_revenue >= 0),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  role text not null default 'employee' check (role in ('admin','hr','manager','employee')),
  is_super_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_users (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references public.user_profiles(user_id) on delete cascade,
  role text not null check (role in ('admin','hr','manager','employee')),
  status text not null default 'active' check (status in ('invited','active','suspended','inactive')),
  permissions jsonb not null default '{}'::jsonb,
  is_primary_admin boolean not null default false,
  invited_by uuid references public.user_profiles(user_id) on delete set null,
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid unique references public.user_profiles(user_id) on delete set null,
  employee_id_number text,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  position text not null default 'Employee',
  department text not null default 'Unassigned',
  location text,
  manager_id uuid references public.employees(id) on delete set null,
  employment_type text not null default 'full_time'
    check (employment_type in ('full_time','part_time','contract','temporary','intern')),
  lifecycle_state text not null default 'active'
    check (lifecycle_state in ('candidate','preboarding','onboarding','active','offboarding','former_employee')),
  employment_condition text not null default 'working'
    check (employment_condition in ('working','on_leave','probation','notice_period','suspended')),
  status text not null default 'active'
    check (status in ('active','inactive','terminated')),
  hire_date date,
  start_date date,
  termination_date date,
  profile_image_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, employee_id_number),
  unique (business_id, email)
);

create table public.employee_changes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  change_type text not null check (change_type in (
    'promotion','salary_change','department_transfer','manager_change',
    'employment_type_change','location_change','termination','other'
  )),
  effective_date date not null,
  before_value jsonb not null default '{}'::jsonb,
  after_value jsonb not null default '{}'::jsonb,
  reason text not null,
  status text not null default 'pending'
    check (status in ('draft','pending','approved','rejected','scheduled','completed','cancelled')),
  requested_by uuid references public.user_profiles(user_id) on delete set null,
  approved_by uuid references public.user_profiles(user_id) on delete set null,
  approved_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employee_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  event_type text not null check (event_type in (
    'preboarding_started','onboarding_started','activated','leave_started','leave_ended',
    'offboarding_started','terminated','rehired','change_applied','note'
  )),
  event_date timestamptz not null default now(),
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.onboarding_checklists (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  template_name text not null,
  lifecycle_type text not null default 'onboarding'
    check (lifecycle_type in ('preboarding','onboarding','offboarding')),
  checklist_items jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employee_onboarding (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  checklist_id uuid not null references public.onboarding_checklists(id) on delete restrict,
  lifecycle_type text not null default 'onboarding'
    check (lifecycle_type in ('preboarding','onboarding','offboarding')),
  completed_items jsonb not null default '[]'::jsonb,
  completion_percentage numeric(5,2) not null default 0 check (completion_percentage between 0 and 100),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, checklist_id)
);

create table public.workflow_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  request_type text not null,
  source_type text not null,
  source_id uuid,
  employee_id uuid references public.employees(id) on delete cascade,
  submitted_by uuid references public.user_profiles(user_id) on delete set null,
  status text not null default 'pending'
    check (status in ('draft','pending','approved','rejected','cancelled','completed')),
  current_step integer not null default 1 check (current_step >= 1),
  payload jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_steps (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.workflow_requests(id) on delete cascade,
  step_order integer not null check (step_order >= 1),
  approver_role text,
  approver_user_id uuid references public.user_profiles(user_id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','skipped')),
  acted_by uuid references public.user_profiles(user_id) on delete set null,
  acted_at timestamptz,
  comment text,
  created_at timestamptz not null default now(),
  unique (request_id, step_order)
);

create table public.work_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  assignee_user_id uuid references public.user_profiles(user_id) on delete cascade,
  assignee_role text,
  category text not null,
  source_type text not null,
  source_id uuid,
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open','in_progress','completed','dismissed')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index business_users_user_id_idx on public.business_users(user_id);
create index business_users_business_role_idx on public.business_users(business_id, role, status);
create index employees_business_id_idx on public.employees(business_id);
create index employees_user_id_idx on public.employees(user_id);
create index employees_manager_id_idx on public.employees(manager_id);
create index employees_lifecycle_idx on public.employees(business_id, lifecycle_state, status);
create index employee_changes_business_status_idx on public.employee_changes(business_id, status, effective_date);
create index employee_changes_employee_id_idx on public.employee_changes(employee_id);
create index employee_lifecycle_events_employee_idx on public.employee_lifecycle_events(employee_id, event_date desc);
create index workflow_requests_business_status_idx on public.workflow_requests(business_id, status, created_at desc);
create index workflow_steps_request_idx on public.workflow_steps(request_id, step_order);
create index work_items_assignee_status_idx on public.work_items(assignee_user_id, status, created_at desc);
create index work_items_business_role_idx on public.work_items(business_id, assignee_role, status);

create trigger set_businesses_updated_at before update on public.businesses
for each row execute function private.set_updated_at();
create trigger set_user_profiles_updated_at before update on public.user_profiles
for each row execute function private.set_updated_at();
create trigger set_business_users_updated_at before update on public.business_users
for each row execute function private.set_updated_at();
create trigger set_employees_updated_at before update on public.employees
for each row execute function private.set_updated_at();
create trigger set_employee_changes_updated_at before update on public.employee_changes
for each row execute function private.set_updated_at();
create trigger set_onboarding_checklists_updated_at before update on public.onboarding_checklists
for each row execute function private.set_updated_at();
create trigger set_employee_onboarding_updated_at before update on public.employee_onboarding
for each row execute function private.set_updated_at();
create trigger set_workflow_requests_updated_at before update on public.workflow_requests
for each row execute function private.set_updated_at();
create trigger set_work_items_updated_at before update on public.work_items
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles (user_id, first_name, last_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();
