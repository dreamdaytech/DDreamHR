create table public.employee_salary_profiles (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  basic_salary numeric(14,2) not null check (basic_salary >= 0),
  currency char(3) not null default 'SLE',
  effective_from date not null,
  effective_to date,
  is_active boolean not null default true,
  created_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_to is null or effective_to >= effective_from)
);

create table public.salary_allowances (
  id uuid primary key default gen_random_uuid(),
  salary_profile_id uuid not null references public.employee_salary_profiles(id) on delete cascade,
  name text not null,
  allowance_type text not null
    check (allowance_type in ('housing','transport','medical','communication','meal','other')),
  amount numeric(14,2) not null check (amount >= 0),
  is_taxable boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.salary_deductions (
  id uuid primary key default gen_random_uuid(),
  salary_profile_id uuid not null references public.employee_salary_profiles(id) on delete cascade,
  name text not null,
  deduction_type text not null
    check (deduction_type in ('tax','pension','insurance','loan','advance','other')),
  amount numeric(14,2),
  percentage numeric(7,4),
  is_mandatory boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (amount is null or amount >= 0),
  check (percentage is null or percentage between 0 and 100),
  check (amount is not null or percentage is not null)
);

create table public.payroll_schedules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  frequency text not null check (frequency in ('weekly','biweekly','semimonthly','monthly')),
  pay_day integer,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payroll_periods (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  schedule_id uuid references public.payroll_schedules(id) on delete set null,
  period_name text not null,
  start_date date not null,
  end_date date not null,
  pay_date date not null,
  status text not null default 'not_started'
    check (status in ('not_started','in_progress','completed','cancelled')),
  total_employees integer not null default 0 check (total_employees >= 0),
  total_amount numeric(16,2) not null default 0 check (total_amount >= 0),
  is_off_cycle boolean not null default false,
  processed_by uuid references public.user_profiles(user_id) on delete set null,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table public.payroll_records (
  id uuid primary key default gen_random_uuid(),
  payroll_period_id uuid not null references public.payroll_periods(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  salary_profile_id uuid not null references public.employee_salary_profiles(id) on delete restrict,
  basic_salary numeric(14,2) not null default 0,
  gross_salary numeric(14,2) not null default 0,
  total_allowances numeric(14,2) not null default 0,
  total_deductions numeric(14,2) not null default 0,
  net_salary numeric(14,2) not null default 0,
  working_days numeric(6,2) not null default 0,
  actual_days_worked numeric(6,2) not null default 0,
  leave_days numeric(6,2) not null default 0,
  leave_deduction numeric(14,2) not null default 0,
  overtime_hours numeric(8,2) not null default 0,
  overtime_amount numeric(14,2) not null default 0,
  payment_status text not null default 'pending'
    check (payment_status in ('pending','processed','failed','cancelled')),
  payment_date date,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (payroll_period_id, employee_id)
);

create table public.payroll_record_allowances (
  id uuid primary key default gen_random_uuid(),
  payroll_record_id uuid not null references public.payroll_records(id) on delete cascade,
  allowance_id uuid references public.salary_allowances(id) on delete set null,
  allowance_name text not null,
  amount numeric(14,2) not null check (amount >= 0),
  created_at timestamptz not null default now()
);

create table public.payroll_record_deductions (
  id uuid primary key default gen_random_uuid(),
  payroll_record_id uuid not null references public.payroll_records(id) on delete cascade,
  deduction_id uuid references public.salary_deductions(id) on delete set null,
  deduction_name text not null,
  amount numeric(14,2) not null check (amount >= 0),
  created_at timestamptz not null default now()
);

create table public.payslips (
  id uuid primary key default gen_random_uuid(),
  payroll_record_id uuid not null unique references public.payroll_records(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  file_path text,
  generated_at timestamptz not null default now(),
  emailed_at timestamptz,
  downloaded_at timestamptz
);

create table public.off_cycle_payroll (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  payroll_period_id uuid references public.payroll_periods(id) on delete set null,
  payroll_type text not null check (payroll_type in ('bonus','commission','correction','final_pay','other')),
  amount numeric(14,2) not null check (amount >= 0),
  reason text,
  processed_by uuid references public.user_profiles(user_id) on delete set null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.direct_deposit_accounts (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  bank_name text not null,
  account_type text not null check (account_type in ('checking','savings','mobile_money','other')),
  account_number_encrypted text not null,
  routing_number_encrypted text,
  account_last4 text,
  allocation_percentage numeric(5,2) not null default 100 check (allocation_percentage between 0 and 100),
  is_primary boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tax_documents (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  tax_year integer not null check (tax_year between 2000 and 2200),
  document_type text not null,
  file_path text,
  generated_at timestamptz not null default now(),
  downloaded_at timestamptz,
  unique (employee_id, tax_year, document_type)
);

create table public.engagement_surveys (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  description text,
  survey_type text not null default 'pulse'
    check (survey_type in ('pulse','onboarding','offboarding','annual','custom')),
  questions jsonb not null default '[]'::jsonb,
  target_audience jsonb not null default '{}'::jsonb,
  is_anonymous boolean not null default true,
  reminder_frequency integer,
  start_date date,
  end_date date,
  status text not null default 'draft'
    check (status in ('draft','active','paused','completed','archived')),
  created_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create table public.engagement_survey_responses (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.engagement_surveys(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete set null,
  responses jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending','in_progress','completed','expired')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.engagement_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  description text,
  event_type text not null default 'meeting'
    check (event_type in ('social','training','celebration','meeting','workshop','team_building')),
  start_datetime timestamptz not null,
  end_datetime timestamptz,
  location text,
  is_virtual boolean not null default false,
  max_participants integer check (max_participants is null or max_participants > 0),
  registration_required boolean not null default true,
  is_published boolean not null default false,
  organizer_id uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_datetime is null or end_datetime >= start_datetime)
);

create table public.engagement_event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.engagement_events(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  status text not null default 'registered'
    check (status in ('registered','waitlisted','cancelled','attended','no_show')),
  registered_at timestamptz not null default now(),
  attended_at timestamptz,
  unique (event_id, employee_id)
);

create table public.employee_recognitions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  from_employee_id uuid references public.employees(id) on delete set null,
  to_employee_id uuid not null references public.employees(id) on delete cascade,
  recognition_type text not null default 'peer_to_peer'
    check (recognition_type in ('peer_to_peer','manager_to_employee','team_recognition','milestone')),
  title text not null,
  message text,
  points_awarded integer not null default 0 check (points_awarded >= 0),
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete cascade,
  name text not null,
  category text not null default 'Employee',
  storage_bucket text not null default 'documents',
  storage_path text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  access_level text not null default 'private'
    check (access_level in ('public','business','hr_only','management','private')),
  uploaded_by uuid references public.user_profiles(user_id) on delete set null,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  content text not null,
  audience jsonb not null default '{"type":"all"}'::jsonb,
  published boolean not null default true,
  created_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(user_id) on delete cascade,
  settings_type text not null check (settings_type in ('profile','preferences','notifications')),
  settings_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, settings_type)
);

create table public.system_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  setting_key text not null,
  setting_value jsonb not null default '{}'::jsonb,
  category text not null default 'general',
  description text,
  created_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (business_id, setting_key)
);

create table public.system_integrations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  integration_type text not null,
  provider_name text not null,
  api_credentials_encrypted text,
  is_active boolean not null default false,
  sync_frequency text,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.settings_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(user_id) on delete set null,
  business_id uuid references public.businesses(id) on delete cascade,
  table_name text not null,
  record_id uuid,
  action text not null,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  feature_key text not null unique,
  name text not null,
  description text,
  enabled boolean not null default false,
  tags text[] not null default '{}'::text[],
  updated_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.platform_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  published boolean not null default true,
  created_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number bigint generated always as identity unique,
  business_id uuid references public.businesses(id) on delete set null,
  requester_user_id uuid references public.user_profiles(user_id) on delete set null,
  requester_email text,
  subject text not null,
  description text not null,
  status text not null default 'open'
    check (status in ('open','in_progress','resolved','closed')),
  priority text not null default 'normal'
    check (priority in ('low','normal','high','urgent')),
  assignee_user_id uuid references public.user_profiles(user_id) on delete set null,
  resolution text,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_management_log (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete set null,
  super_admin_id uuid references public.user_profiles(user_id) on delete set null,
  action text not null,
  old_values jsonb,
  new_values jsonb,
  notes text,
  created_at timestamptz not null default now()
);

create table public.super_admin_activities (
  id uuid primary key default gen_random_uuid(),
  super_admin_id uuid not null references public.user_profiles(user_id) on delete cascade,
  business_id uuid references public.businesses(id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.super_admin_dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_type text not null,
  metric_value numeric(18,4) not null,
  metric_date date not null default current_date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index salary_profiles_employee_active_idx on public.employee_salary_profiles(employee_id, is_active, effective_from desc);
create unique index one_active_salary_profile_per_employee
  on public.employee_salary_profiles(employee_id) where is_active;
create index payroll_periods_business_status_idx on public.payroll_periods(business_id, status, start_date desc);
create index payroll_records_period_idx on public.payroll_records(payroll_period_id, payment_status);
create index payroll_records_employee_idx on public.payroll_records(employee_id, created_at desc);
create index engagement_surveys_business_status_idx on public.engagement_surveys(business_id, status, start_date desc);
create index engagement_events_business_date_idx on public.engagement_events(business_id, start_datetime);
create index employee_recognitions_business_idx on public.employee_recognitions(business_id, created_at desc);
create index documents_business_category_idx on public.documents(business_id, category, created_at desc);
create index documents_employee_idx on public.documents(employee_id, created_at desc);
create index announcements_business_idx on public.announcements(business_id, published, created_at desc);
create index system_settings_business_category_idx on public.system_settings(business_id, category);
create index support_tickets_status_idx on public.support_tickets(status, priority, created_at desc);
create index business_management_log_business_idx on public.business_management_log(business_id, created_at desc);
create index super_admin_activities_created_idx on public.super_admin_activities(created_at desc);
create index super_admin_metrics_type_date_idx on public.super_admin_dashboard_metrics(metric_type, metric_date desc);

create trigger set_employee_salary_profiles_updated_at before update on public.employee_salary_profiles
for each row execute function private.set_updated_at();
create trigger set_payroll_schedules_updated_at before update on public.payroll_schedules
for each row execute function private.set_updated_at();
create trigger set_payroll_periods_updated_at before update on public.payroll_periods
for each row execute function private.set_updated_at();
create trigger set_payroll_records_updated_at before update on public.payroll_records
for each row execute function private.set_updated_at();
create trigger set_direct_deposit_accounts_updated_at before update on public.direct_deposit_accounts
for each row execute function private.set_updated_at();
create trigger set_engagement_surveys_updated_at before update on public.engagement_surveys
for each row execute function private.set_updated_at();
create trigger set_engagement_events_updated_at before update on public.engagement_events
for each row execute function private.set_updated_at();
create trigger set_documents_updated_at before update on public.documents
for each row execute function private.set_updated_at();
create trigger set_announcements_updated_at before update on public.announcements
for each row execute function private.set_updated_at();
create trigger set_user_settings_updated_at before update on public.user_settings
for each row execute function private.set_updated_at();
create trigger set_system_settings_updated_at before update on public.system_settings
for each row execute function private.set_updated_at();
create trigger set_system_integrations_updated_at before update on public.system_integrations
for each row execute function private.set_updated_at();
create trigger set_feature_flags_updated_at before update on public.feature_flags
for each row execute function private.set_updated_at();
create trigger set_platform_announcements_updated_at before update on public.platform_announcements
for each row execute function private.set_updated_at();
create trigger set_support_tickets_updated_at before update on public.support_tickets
for each row execute function private.set_updated_at();
