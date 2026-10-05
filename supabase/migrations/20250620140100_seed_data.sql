-- SEED DEMO DATA
-- This script populates the database with realistic demo data for 5 businesses.

-- Create Businesses
INSERT INTO public.businesses (id, name) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'NovaTech Ltd'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'GreenLeaf Inc'),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'SunRise Corp'),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'Oceanic Systems'),
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Evergrowth Group');

-- Create Users for NovaTech Ltd
DO $$
DECLARE
    user_id_admin UUID := 'a0a0a0a0-0000-0000-0000-000000000001';
    user_id_manager UUID := 'a0a0a0a0-0000-0000-0000-000000000002';
    user_id_emp1 UUID := 'a0a0a0a0-0000-0000-0000-000000000003';
    user_id_emp2 UUID := 'a0a0a0a0-0000-0000-0000-000000000004';
    business_id_nova UUID := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
BEGIN
    -- Admin
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at) VALUES (user_id_admin, 'authenticated', 'authenticated', 'admin.nova@example.com', crypt('password123', gen_salt('bf')), NOW());
    INSERT INTO public.user_profiles (id, first_name, last_name) VALUES (user_id_admin, 'Alex', 'Chen');
    INSERT INTO public.business_users (business_id, user_id, role) VALUES (business_id_nova, user_id_admin, 'admin');
    INSERT INTO public.employees (user_id, business_id, job_title, department, start_date) VALUES (user_id_admin, business_id_nova, 'HR Director', 'Human Resources', NOW() - interval '1 year');

    -- Manager
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at) VALUES (user_id_manager, 'authenticated', 'authenticated', 'manager.nova@example.com', crypt('password123', gen_salt('bf')), NOW());
    INSERT INTO public.user_profiles (id, first_name, last_name) VALUES (user_id_manager, 'Brenda', 'Miller');
    INSERT INTO public.business_users (business_id, user_id, role) VALUES (business_id_nova, user_id_manager, 'manager');
    INSERT INTO public.employees (user_id, business_id, job_title, department, start_date) VALUES (user_id_manager, business_id_nova, 'Engineering Manager', 'Engineering', NOW() - interval '1 year');

    -- Employee 1
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at) VALUES (user_id_emp1, 'authenticated', 'authenticated', 'emp1.nova@example.com', crypt('password123', gen_salt('bf')), NOW());
    INSERT INTO public.user_profiles (id, first_name, last_name) VALUES (user_id_emp1, 'Charlie', 'Davis');
    INSERT INTO public.business_users (business_id, user_id, role) VALUES (business_id_nova, user_id_emp1, 'employee');
    INSERT INTO public.employees (user_id, business_id, job_title, department, start_date) VALUES (user_id_emp1, business_id_nova, 'Software Engineer', 'Engineering', NOW() - interval '6 months');
END $$;

-- Create Users for GreenLeaf Inc
DO $$
DECLARE
    user_id_admin UUID := 'b0b0b0b0-0000-0000-0000-000000000001';
    user_id_manager UUID := 'b0b0b0b0-0000-0000-0000-000000000002';
    business_id_green UUID := 'b2c3d4e5-f6a7-8901-2345-67890abcdef0';
BEGIN
    -- Admin
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at) VALUES (user_id_admin, 'authenticated', 'authenticated', 'admin.green@example.com', crypt('password123', gen_salt('bf')), NOW());
    INSERT INTO public.user_profiles (id, first_name, last_name) VALUES (user_id_admin, 'Ethan', 'Wilson');
    INSERT INTO public.business_users (business_id, user_id, role) VALUES (business_id_green, user_id_admin, 'admin');
    INSERT INTO public.employees (user_id, business_id, job_title, department, start_date) VALUES (user_id_admin, business_id_green, 'Operations Head', 'Operations', NOW() - interval '2 years');

    -- Manager
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at) VALUES (user_id_manager, 'authenticated', 'authenticated', 'manager.green@example.com', crypt('password123', gen_salt('bf')), NOW());
    INSERT INTO public.user_profiles (id, first_name, last_name) VALUES (user_id_manager, 'Fiona', 'Martinez');
    INSERT INTO public.business_users (business_id, user_id, role) VALUES (business_id_green, user_id_manager, 'manager');
    INSERT INTO public.employees (user_id, business_id, job_title, department, start_date) VALUES (user_id_manager, business_id_green, 'Marketing Lead', 'Marketing', NOW() - interval '1.5 years');
END $$;

-- Add some attendance data for an employee at NovaTech
WITH nova_emp AS (
    SELECT id FROM public.employees WHERE user_id = 'a0a0a0a0-0000-0000-0000-000000000003'
)
INSERT INTO public.attendance (employee_id, business_id, check_in, check_out, status, work_date)
SELECT
    id,
    'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    (CURRENT_DATE - s.a) + interval '9 hour',
    (CURRENT_DATE - s.a) + interval '17 hour',
    'present',
    CURRENT_DATE - s.a
FROM nova_emp, generate_series(0, 13) AS s(a);

-- Add an announcement for NovaTech
INSERT INTO public.announcements (business_id, title, content, created_by)
VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Q3 Town Hall Meeting', 'Join us for the quarterly town hall next Friday!', 'a0a0a0a0-0000-0000-0000-000000000001');
