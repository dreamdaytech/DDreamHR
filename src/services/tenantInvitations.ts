import { supabase } from '@/integrations/supabase/client';

export type EmployeeAccessRole = 'admin' | 'hr' | 'manager' | 'employee';

export type InvitationPreview = {
  valid: boolean;
  status: 'pending' | 'accepted' | 'revoked' | 'expired' | 'invalid';
  business_name?: string;
  business_id?: string;
  employee_name?: string;
  email?: string;
  role?: EmployeeAccessRole;
  expires_at?: string;
  requires_password?: boolean;
};

export const sendEmployeeInvitation = async (
  employeeId: string,
  role: EmployeeAccessRole,
) => {
  const { data, error } = await supabase.functions.invoke('invite-employee', {
    body: {
      employee_id: employeeId,
      role,
      site_url: window.location.origin,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as {
    invitation_id: string;
    invite_url: string;
    expires_at: string;
    delivery_status: 'sent' | 'link_only';
    existing_user: boolean;
  };
};

export const previewEmployeeInvitation = async (
  token: string,
): Promise<InvitationPreview> => {
  const { data, error } = await supabase.rpc('preview_employee_invitation', {
    invitation_token: token,
  });
  if (error) throw error;
  return data as unknown as InvitationPreview;
};

export const acceptEmployeeInvitation = async (token: string) => {
  const { data, error } = await supabase.rpc('accept_employee_invitation', {
    invitation_token: token,
  });
  if (error) throw error;
  return data as unknown as {
    business_id: string;
    business_name: string;
    employee_id: string;
    role: EmployeeAccessRole;
    status: 'accepted';
  };
};

export const sendExistingUserSignInLink = async (email: string, token: string) => {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${window.location.origin}/invite/${token}`,
    },
  });
};

export const roleHome = (role?: string) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'hr') return '/hr/dashboard';
  if (role === 'super_admin') return '/super-admin/dashboard';
  return '/employee/dashboard';
};


export const listEmployeeInvitations = async () => {
  const { data, error } = await supabase
    .from('business_invitations')
    .select(`
      id,
      employee_id,
      email,
      role,
      status,
      delivery_status,
      delivery_error,
      expires_at,
      last_sent_at,
      accepted_at,
      created_at,
      employees!inner(first_name,last_name,employee_id_number,department,position)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => {
    const employee = Array.isArray(row.employees) ? row.employees[0] : row.employees;
    return {
      id: row.id as string,
      employeeId: row.employee_id as string,
      employeeName: `${employee?.first_name || ''} ${employee?.last_name || ''}`.trim(),
      employeeNumber: employee?.employee_id_number || '',
      department: employee?.department || 'General',
      position: employee?.position || 'Employee',
      email: row.email as string,
      role: row.role as EmployeeAccessRole,
      status: row.status as 'pending' | 'accepted' | 'revoked' | 'expired',
      deliveryStatus: row.delivery_status as 'pending' | 'sent' | 'link_only' | 'failed',
      deliveryError: row.delivery_error as string | null,
      expiresAt: row.expires_at as string,
      lastSentAt: row.last_sent_at as string | null,
      acceptedAt: row.accepted_at as string | null,
      createdAt: row.created_at as string,
    };
  });
};

export const revokeEmployeeInvitation = async (invitationId: string) => {
  const { error } = await supabase
    .from('business_invitations')
    .update({ status: 'revoked' })
    .eq('id', invitationId)
    .eq('status', 'pending');

  if (error) throw error;
};
