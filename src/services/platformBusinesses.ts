import { supabase } from '@/integrations/supabase/client';

export type PlatformBusiness = {
  id: string;
  name: string;
  email: string;
  industry: string;
  country: string;
  plan: 'trial' | 'basic' | 'standard' | 'premium' | 'enterprise';
  status: 'active' | 'suspended' | 'trial' | 'pending' | 'inactive';
  employees: number;
  monthlyRevenue: number;
  createdAt: string;
  companySize?: string;
  phone?: string;
};

export const listPlatformBusinesses = async (): Promise<PlatformBusiness[]> => {
  const [{ data: businesses, error: businessError }, { data: employees, error: employeeError }] = await Promise.all([
    supabase
      .from('businesses')
      .select('id,name,admin_email,industry,country,subscription_plan,status,monthly_revenue,created_at,company_size,phone')
      .order('created_at', { ascending: false }),
    supabase
      .from('employees')
      .select('business_id,id'),
  ]);

  if (businessError) throw businessError;
  if (employeeError) throw employeeError;

  const counts = new Map<string, number>();
  for (const employee of employees || []) {
    counts.set(employee.business_id, (counts.get(employee.business_id) || 0) + 1);
  }

  return (businesses || []).map((business) => ({
    id: business.id,
    name: business.name,
    email: business.admin_email,
    industry: business.industry || 'Unspecified',
    country: business.country || 'Unspecified',
    plan: business.subscription_plan as PlatformBusiness['plan'],
    status: business.status as PlatformBusiness['status'],
    employees: counts.get(business.id) || 0,
    monthlyRevenue: Number(business.monthly_revenue || 0),
    createdAt: business.created_at?.slice(0, 10) || '',
    companySize: business.company_size || undefined,
    phone: business.phone || undefined,
  }));
};

export const updatePlatformBusiness = async (
  id: string,
  updates: Partial<Pick<PlatformBusiness, 'name' | 'email' | 'industry' | 'country' | 'plan' | 'status' | 'monthlyRevenue' | 'companySize' | 'phone'>>,
) => {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.email !== undefined) payload.admin_email = updates.email;
  if (updates.industry !== undefined) payload.industry = updates.industry;
  if (updates.country !== undefined) payload.country = updates.country;
  if (updates.plan !== undefined) payload.subscription_plan = updates.plan;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.monthlyRevenue !== undefined) payload.monthly_revenue = updates.monthlyRevenue;
  if (updates.companySize !== undefined) payload.company_size = updates.companySize;
  if (updates.phone !== undefined) payload.phone = updates.phone;

  const { error } = await supabase
    .from('businesses')
    .update(payload)
    .eq('id', id);

  if (error) throw error;
};
