create table public.locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  type text not null default 'office' check (type in ('office','remote','client_site','other')),
  address text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  radius_meters integer not null default 100 check (radius_meters > 0),
  ip_addresses text[] not null default '{}'::text[],
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attendance_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references public.businesses(id) on delete cascade,
  working_hours_start time not null default '09:00',
  working_hours_end time not null default '17:00',
  grace_time_late integer not null default 15 check (grace_time_late >= 0),
  grace_time_early integer not null default 15 check (grace_time_early >= 0),
  timezone text not null default 'UTC',
  enable_break_tracking boolean not null default true,
  enable_location_validation boolean not null default false,
  enable_remote_checkin boolean not null default true,
  biometric_required boolean not null default false,
  facial_recognition_required boolean not null default false,
  allowed_ip_addresses text[] not null default '{}'::text[],
  geo_fencing_enabled boolean not null default false,
  geo_fencing_radius integer not null default 100 check (geo_fencing_radius > 0),
  geo_fencing_locations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attendance_policies (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  department text,
  mode text not null default 'standard',
  work_hours_per_day numeric(5,2) not null default 8,
  work_hours_per_week numeric(6,2) not null default 40,
  grace_period_minutes integer not null default 15,
  late_threshold_minutes integer not null default 15,
  early_departure_threshold_minutes integer not null default 15,
  half_day_hours numeric(5,2) not null default 4,
  overtime_threshold_hours numeric(5,2) not null default 8,
  overtime_rate numeric(6,2) not null default 1.5,
  include_weekends boolean not null default false,
  include_holidays boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shifts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  department text,
  start_time time not null,
  end_time time not null,
  break_duration_minutes integer not null default 60 check (break_duration_minutes >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employee_shifts (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  shift_id uuid not null references public.shifts(id) on delete cascade,
  effective_from date not null,
  effective_to date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_to is null or effective_to >= effective_from)
);

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  work_date date not null default current_date,
  check_in timestamptz,
  check_out timestamptz,
  total_hours numeric(6,2),
  status text not null default 'Present' check (status in ('Present','Late','Absent','Remote')),
  location_check_in text,
  location_check_out text,
  ip_address_check_in inet,
  ip_address_check_out inet,
  device_check_in text,
  device_check_out text,
  check_in_notes text,
  check_out_notes text,
  notes text,
  is_regularized boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, work_date),
  check (check_out is null or check_in is null or check_out >= check_in)
);

create table public.attendance_breaks (
  id uuid primary key default gen_random_uuid(),
  attendance_id uuid not null references public.attendance_records(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz,
  break_type text not null default 'Lunch' check (break_type in ('Lunch','Personal','Medical','Other')),
  is_paid boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  check (end_time is null or end_time >= start_time)
);

create table public.regularization_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  attendance_id uuid references public.attendance_records(id) on delete set null,
  requested_date date not null,
  request_type text not null check (request_type in ('Check-In','Check-Out','Full Day','Break')),
  requested_check_in timestamptz,
  requested_check_out timestamptz,
  reason text not null,
  status text not null default 'Pending' check (status in ('Pending','Approved','Rejected')),
  reviewer_id uuid references public.user_profiles(user_id) on delete set null,
  reviewed_at timestamptz,
  review_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attendance_reports (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  report_type text not null check (report_type in ('Daily','Weekly','Monthly')),
  start_date date not null,
  end_date date not null,
  status text not null default 'Pending'
    check (status in ('Pending','Approved','Rejected','NeedsClarification')),
  notes text,
  attachment_paths jsonb not null default '[]'::jsonb,
  record_ids uuid[] not null default '{}'::uuid[],
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references public.user_profiles(user_id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table public.attendance_report_feedback (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.attendance_reports(id) on delete cascade,
  user_id uuid not null references public.user_profiles(user_id) on delete cascade,
  comment text not null,
  parent_comment_id uuid references public.attendance_report_feedback(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  department text,
  status text not null default 'active' check (status in ('draft','active','on_hold','completed','cancelled')),
  due_date date,
  estimated_hours numeric(8,2),
  created_by uuid references public.user_profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  description text,
  assigned_to uuid references public.user_profiles(user_id) on delete set null,
  estimated_hours numeric(8,2) not null default 0,
  actual_hours numeric(8,2),
  due_date date,
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status text not null default 'not_started'
    check (status in ('not_started','in_progress','blocked','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.timesheets (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  total_hours numeric(8,2) not null default 0,
  status text not null default 'draft'
    check (status in ('draft','submitted','approved','rejected')),
  submitted_to uuid references public.user_profiles(user_id) on delete set null,
  submitted_at timestamptz,
  approved_by uuid references public.user_profiles(user_id) on delete set null,
  approved_at timestamptz,
  comments text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, period_start, period_end),
  check (period_end >= period_start)
);

create table public.time_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references public.user_profiles(user_id) on delete cascade,
  employee_id uuid references public.employees(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  timesheet_id uuid references public.timesheets(id) on delete set null,
  date date not null,
  start_time timestamptz,
  end_time timestamptz,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  description text,
  is_billable boolean not null default false,
  status text not null default 'saved' check (status in ('running','saved','submitted','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time is null or start_time is null or end_time >= start_time)
);

create table public.leave_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references public.businesses(id) on delete cascade,
  leave_year_start_month integer not null default 1 check (leave_year_start_month between 1 and 12),
  allow_negative_balance boolean not null default false,
  require_attachment_after_days numeric(5,2),
  manager_approval_required boolean not null default true,
  hr_approval_required boolean not null default false,
  allow_half_days boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leave_types (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  code text not null,
  name text not null,
  description text,
  annual_allowance numeric(6,2) not null default 0,
  carry_forward boolean not null default false,
  max_carry_forward numeric(6,2),
  is_paid boolean not null default true,
  active boolean not null default true,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, code)
);

create table public.leave_balances (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  leave_type_id uuid not null references public.leave_types(id) on delete cascade,
  year integer not null check (year between 2000 and 2200),
  allocated numeric(6,2) not null default 0,
  carried_over numeric(6,2) not null default 0,
  used numeric(6,2) not null default 0,
  pending numeric(6,2) not null default 0,
  updated_at timestamptz not null default now(),
  unique (employee_id, leave_type_id, year)
);

create table public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  leave_type_id uuid not null references public.leave_types(id) on delete restrict,
  start_date date not null,
  end_date date not null,
  days numeric(6,2) not null check (days > 0),
  half_day boolean not null default false,
  reason text not null,
  status text not null default 'pending'
    check (status in ('draft','pending','approved','rejected','cancelled')),
  attachment_paths jsonb not null default '[]'::jsonb,
  applied_at timestamptz not null default now(),
  approved_by uuid references public.user_profiles(user_id) on delete set null,
  approved_at timestamptz,
  review_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table public.leave_request_events (
  id uuid primary key default gen_random_uuid(),
  leave_request_id uuid not null references public.leave_requests(id) on delete cascade,
  action text not null,
  actor_user_id uuid references public.user_profiles(user_id) on delete set null,
  comment text,
  created_at timestamptz not null default now()
);

create index locations_business_active_idx on public.locations(business_id, active);
create index attendance_records_business_date_idx on public.attendance_records(business_id, work_date desc);
create index attendance_records_employee_date_idx on public.attendance_records(employee_id, work_date desc);
create index attendance_breaks_attendance_idx on public.attendance_breaks(attendance_id, start_time);
create index regularization_business_status_idx on public.regularization_requests(business_id, status, created_at desc);
create index attendance_reports_business_status_idx on public.attendance_reports(business_id, status, submitted_at desc);
create index projects_business_status_idx on public.projects(business_id, status);
create index tasks_business_assignee_idx on public.tasks(business_id, assigned_to, status);
create index time_logs_user_date_idx on public.time_logs(user_id, date desc);
create index time_logs_employee_date_idx on public.time_logs(employee_id, date desc);
create index timesheets_business_status_idx on public.timesheets(business_id, status, period_start desc);
create index leave_requests_business_status_idx on public.leave_requests(business_id, status, start_date desc);
create index leave_requests_employee_idx on public.leave_requests(employee_id, start_date desc);
create index leave_balances_employee_year_idx on public.leave_balances(employee_id, year);

create trigger set_locations_updated_at before update on public.locations
for each row execute function private.set_updated_at();
create trigger set_attendance_settings_updated_at before update on public.attendance_settings
for each row execute function private.set_updated_at();
create trigger set_attendance_policies_updated_at before update on public.attendance_policies
for each row execute function private.set_updated_at();
create trigger set_shifts_updated_at before update on public.shifts
for each row execute function private.set_updated_at();
create trigger set_employee_shifts_updated_at before update on public.employee_shifts
for each row execute function private.set_updated_at();
create trigger set_attendance_records_updated_at before update on public.attendance_records
for each row execute function private.set_updated_at();
create trigger set_regularization_requests_updated_at before update on public.regularization_requests
for each row execute function private.set_updated_at();
create trigger set_attendance_reports_updated_at before update on public.attendance_reports
for each row execute function private.set_updated_at();
create trigger set_projects_updated_at before update on public.projects
for each row execute function private.set_updated_at();
create trigger set_tasks_updated_at before update on public.tasks
for each row execute function private.set_updated_at();
create trigger set_timesheets_updated_at before update on public.timesheets
for each row execute function private.set_updated_at();
create trigger set_time_logs_updated_at before update on public.time_logs
for each row execute function private.set_updated_at();
create trigger set_leave_settings_updated_at before update on public.leave_settings
for each row execute function private.set_updated_at();
create trigger set_leave_types_updated_at before update on public.leave_types
for each row execute function private.set_updated_at();
create trigger set_leave_balances_updated_at before update on public.leave_balances
for each row execute function private.set_updated_at();
create trigger set_leave_requests_updated_at before update on public.leave_requests
for each row execute function private.set_updated_at();
