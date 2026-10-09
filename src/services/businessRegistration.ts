import { supabase } from '@/integrations/supabase/client';

export type BusinessRegistrationInput = {
  name: string;
  slug: string;
  country: string;
  industry: string;
  companySize: string;
  entityType: 'company' | 'organization' | 'institution';
  plan: 'trial' | 'basic' | 'standard' | 'premium' | 'enterprise';
  timezone: string;
  workStart: string;
  workEnd: string;
  payrollFrequency: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
  payrollPayDay: number;
  leaveYearStart: number;
  phone?: string;
};

export type RegisteredBusiness = {
  business_id: string;
  business_name: string;
  business_slug: string;
  role: 'admin';
  employee_id: string;
  status: string;
  subscription_plan: string;
};

export const signUpBusinessOwner = async (input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  return supabase.auth.signUp({
    email: input.email.trim().toLowerCase(),
    password: input.password,
    options: {
      data: {
        first_name: input.firstName.trim(),
        last_name: input.lastName.trim(),
        registration_intent: 'business_owner',
      },
      emailRedirectTo: `${window.location.origin}/setup`,
    },
  });
};

export const resendBusinessVerification = async (email: string) => {
  return supabase.auth.resend({
    type: 'signup',
    email: email.trim().toLowerCase(),
    options: {
      emailRedirectTo: `${window.location.origin}/setup`,
    },
  });
};

export const registerBusinessTenant = async (
  input: BusinessRegistrationInput,
): Promise<RegisteredBusiness> => {
  const { data, error } = await supabase.rpc('register_business_tenant', {
    business_name: input.name,
    business_slug: input.slug,
    business_country: input.country,
    business_industry: input.industry,
    business_company_size: input.companySize,
    business_entity_type: input.entityType,
    selected_plan: input.plan,
    business_timezone: input.timezone,
    work_start: input.workStart,
    work_end: input.workEnd,
    payroll_frequency: input.payrollFrequency,
    payroll_pay_day: input.payrollPayDay,
    leave_year_start: input.leaveYearStart,
    business_phone: input.phone || null,
  });

  if (error) throw error;
  return data as unknown as RegisteredBusiness;
};

export const slugifyWorkspace = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
