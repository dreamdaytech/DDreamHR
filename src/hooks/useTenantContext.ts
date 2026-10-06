import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isDemoSession } from '@/lib/demoStore';

export type TenantContext = {
  userId: string;
  role: 'super_admin' | 'admin' | 'hr' | 'manager' | 'employee';
  isSuperAdmin: boolean;
  businessId: string | null;
  businessName: string | null;
  employeeId: string | null;
  employeeNumber: string | null;
};

const loadTenantContext = async (): Promise<TenantContext | null> => {
  if (isDemoSession()) return null;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) return null;

  const { data, error } = await (supabase as any).rpc('get_my_tenant_context');
  if (error) throw error;
  if (!data) return null;

  return {
    userId: data.user_id,
    role: data.role,
    isSuperAdmin: Boolean(data.is_super_admin),
    businessId: data.business_id ?? null,
    businessName: data.business_name ?? null,
    employeeId: data.employee_id ?? null,
    employeeNumber: data.employee_number ?? null,
  };
};

export const useTenantContext = () => {
  const demo = isDemoSession();

  return useQuery({
    queryKey: ['tenant-context', demo],
    queryFn: loadTenantContext,
    enabled: !demo,
    staleTime: 5 * 60 * 1000,
  });
};

export const getTenantContext = loadTenantContext;
