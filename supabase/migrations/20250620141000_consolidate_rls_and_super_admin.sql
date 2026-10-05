-- Consolidated Migration for Multitenancy, RLS, and Super Admin

--
-- Part 1: Add Columns
--

-- Add is_super_admin to user_profiles for the super admin feature.
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;

-- Add business_id to all tenant-specific tables.
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.employee_salary_profiles ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.payroll ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.recognitions ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.surveys ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.survey_responses ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;
ALTER TABLE public.timesheets ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Part 2: Helper Functions
--

-- Gets the business_id for the current user from their JWT claims.
CREATE OR REPLACE FUNCTION public.get_current_business_id()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb ->> 'business_id', '')::uuid;
$$;

-- Checks if the current user is a super admin.
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = auth.uid() AND is_super_admin = true
  );
$$;


--
-- Part 3: Enable RLS and Create Policies
--

-- Generic policy creation function to reduce repetition.
CREATE OR REPLACE FUNCTION private.create_tenant_rls_policy(table_name TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_name);
  EXECUTE format('DROP POLICY IF EXISTS "Tenant Isolation Policy" ON public.%I;', table_name);
  EXECUTE format('CREATE POLICY "Tenant Isolation Policy" ON public.%I FOR ALL USING ((business_id = public.get_current_business_id()) OR (public.is_super_admin())) WITH CHECK ((business_id = public.get_current_business_id()) OR (public.is_super_admin()));', table_name);
END;
$$;

-- Apply the policy to all tenant-specific tables.
SELECT private.create_tenant_rls_policy('announcements');
SELECT private.create_tenant_rls_policy('attendance');
SELECT private.create_tenant_rls_policy('employees');
SELECT private.create_tenant_rls_policy('employee_salary_profiles');
SELECT private.create_tenant_rls_policy('payroll');
SELECT private.create_tenant_rls_policy('recognitions');
SELECT private.create_tenant_rls_policy('surveys');
SELECT private.create_tenant_rls_policy('survey_responses');
SELECT private.create_tenant_rls_policy('timesheets');

-- Drop the helper function as it's no longer needed.
DROP FUNCTION private.create_tenant_rls_policy(TEXT);
