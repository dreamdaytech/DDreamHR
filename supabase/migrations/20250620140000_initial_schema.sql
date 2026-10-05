-- Initial Schema Setup

-- Create Businesses Table
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create User Profiles Table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Business Users Junction Table
CREATE TABLE public.business_users (
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'employee')),
    PRIMARY KEY (business_id, user_id)
);

-- Create Employees Table
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    employee_id_number VARCHAR(50) UNIQUE,
    job_title VARCHAR(100),
    department VARCHAR(100),
    start_date DATE,
    employment_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Employee Salary Profiles Table
CREATE TABLE public.employee_salary_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    salary NUMERIC(12, 2) NOT NULL,
    pay_frequency VARCHAR(50) NOT NULL, -- e.g., 'monthly', 'bi-weekly'
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    effective_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Announcements Table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Attendance Table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    status VARCHAR(50), -- e.g., 'present', 'late', 'absent'
    work_date DATE NOT NULL
);

-- Create Payroll Table
CREATE TABLE public.payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    gross_pay NUMERIC(12, 2) NOT NULL,
    net_pay NUMERIC(12, 2) NOT NULL,
    deductions NUMERIC(12, 2),
    payment_date DATE,
    status VARCHAR(50) DEFAULT 'processed'
);

-- Create Recognitions Table
CREATE TABLE public.recognitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    recognized_employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    recognizing_user_id UUID REFERENCES auth.users(id),
    message TEXT,
    recognition_date DATE DEFAULT CURRENT_DATE
);

-- Create Surveys Table
CREATE TABLE public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Survey Responses Table
CREATE TABLE public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    response_data JSONB, -- For storing answers
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Timesheets Table
CREATE TABLE public.timesheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    total_hours NUMERIC(5, 2),
    status VARCHAR(50) DEFAULT 'pending' -- e.g., pending, approved, rejected
);

-- Helper function to get current user's business_id
CREATE OR REPLACE FUNCTION get_my_business_id()
RETURNS UUID AS $$
DECLARE
    business_id_val UUID;
BEGIN
    SELECT business_id INTO business_id_val
    FROM public.business_users
    WHERE user_id = auth.uid()
    LIMIT 1;
    RETURN business_id_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see their own business" ON public.businesses FOR SELECT USING (id = get_my_business_id());

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see profiles in their business" ON public.user_profiles FOR SELECT USING (id IN (SELECT user_id FROM public.business_users WHERE business_id = get_my_business_id()));

ALTER TABLE public.business_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see user roles in their own business" ON public.business_users FOR SELECT USING (business_id = get_my_business_id());

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see employees in their own business" ON public.employees FOR SELECT USING (business_id = get_my_business_id());

ALTER TABLE public.employee_salary_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see salary profiles in their own business" ON public.employee_salary_profiles FOR SELECT USING (business_id = get_my_business_id());

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see announcements in their own business" ON public.announcements FOR SELECT USING (business_id = get_my_business_id());

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see attendance in their own business" ON public.attendance FOR SELECT USING (business_id = get_my_business_id());

ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see payroll in their own business" ON public.payroll FOR SELECT USING (business_id = get_my_business_id());

ALTER TABLE public.recognitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see recognitions in their own business" ON public.recognitions FOR SELECT USING (business_id = get_my_business_id());

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see surveys in their own business" ON public.surveys FOR SELECT USING (business_id = get_my_business_id());

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see survey responses in their own business" ON public.survey_responses FOR SELECT USING (business_id = get_my_business_id());

ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to see timesheets in their own business" ON public.timesheets FOR SELECT USING (business_id = get_my_business_id());
