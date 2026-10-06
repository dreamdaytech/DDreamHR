import { supabase } from '@/integrations/supabase/client';
import { getTenantContext } from '@/hooks/useTenantContext';

export type TenantEmployee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  status: 'Active' | 'Inactive' | 'Onboarding' | 'On Leave' | 'Probation' | 'Terminated';
  imageUrl?: string;
  joiningDate: string;
  employeeId: string;
  employmentType: string;
  reportingManager?: string;
};

const toUiStatus = (row: any): TenantEmployee['status'] => {
  if (row.status === 'terminated' || row.lifecycle_state === 'former_employee') return 'Terminated';
  if (row.status === 'inactive') return 'Inactive';
  if (row.lifecycle_state === 'onboarding' || row.lifecycle_state === 'preboarding') return 'Onboarding';
  if (row.employment_condition === 'on_leave') return 'On Leave';
  if (row.employment_condition === 'probation') return 'Probation';
  return 'Active';
};

const toDbEmploymentType = (value?: string) => {
  const normalized = (value || '').toLowerCase().replace(/[ -]+/g, '_');
  if (normalized.includes('part')) return 'part_time';
  if (normalized.includes('contract')) return 'contract';
  if (normalized.includes('temporary')) return 'temporary';
  if (normalized.includes('intern')) return 'intern';
  return 'full_time';
};

const mapEmployee = (row: any): TenantEmployee => ({
  id: row.id,
  name: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
  email: row.email || '',
  phone: row.phone || '',
  department: row.department || 'Unassigned',
  position: row.position || 'Employee',
  location: row.location || '',
  status: toUiStatus(row),
  imageUrl: row.profile_image_url || '/placeholder.svg',
  joiningDate: row.start_date || row.hire_date || row.created_at?.slice(0, 10) || '',
  employeeId: row.employee_id_number || '',
  employmentType: row.employment_type || 'full_time',
  reportingManager: row.manager
    ? `${row.manager.first_name || ''} ${row.manager.last_name || ''}`.trim()
    : '',
});

export const listTenantEmployees = async (): Promise<TenantEmployee[]> => {
  const context = await getTenantContext();
  if (!context?.businessId) return [];

  const { data, error } = await supabase
    .from('employees')
    .select(`
      id,
      employee_id_number,
      first_name,
      last_name,
      email,
      phone,
      department,
      position,
      location,
      status,
      lifecycle_state,
      employment_condition,
      employment_type,
      profile_image_url,
      hire_date,
      start_date,
      created_at,
      manager:manager_id(first_name,last_name)
    `)
    .eq('business_id', context.businessId)
    .order('first_name', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapEmployee);
};

export const getTenantEmployee = async (employeeId: string) => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      manager:manager_id(first_name,last_name,email)
    `)
    .eq('business_id', context.businessId)
    .eq('id', employeeId)
    .single();

  if (error) throw error;
  return data;
};

export const createTenantEmployee = async (values: any, extras: Record<string, unknown> = {}) => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  let managerId: string | null = null;
  const managerSearch = String(values.reportingManager || '').trim();
  if (managerSearch) {
    const { data: manager } = await supabase
      .from('employees')
      .select('id,first_name,last_name,email')
      .eq('business_id', context.businessId)
      .or(`email.eq.${managerSearch},first_name.ilike.%${managerSearch}%,last_name.ilike.%${managerSearch}%`)
      .limit(1)
      .maybeSingle();
    managerId = manager?.id || null;
  }

  const rawStatus = String(values.status || 'Active').toLowerCase();
  const lifecycleState = rawStatus.includes('onboarding') ? 'onboarding' : rawStatus.includes('terminated') ? 'former_employee' : 'active';
  const employmentCondition = rawStatus.includes('leave') ? 'on_leave' : rawStatus.includes('probation') ? 'probation' : 'working';
  const status = rawStatus.includes('terminated') ? 'terminated' : rawStatus.includes('inactive') ? 'inactive' : 'active';

  const { data, error } = await supabase
    .from('employees')
    .insert({
      business_id: context.businessId,
      employee_id_number: values.employeeId,
      first_name: values.firstName,
      last_name: values.lastName,
      email: String(values.email).toLowerCase(),
      phone: values.workPhone || values.personalMobile || null,
      position: values.designation || 'Employee',
      department: values.department || 'Unassigned',
      location: values.location || null,
      manager_id: managerId,
      employment_type: toDbEmploymentType(values.employmentType),
      lifecycle_state: lifecycleState,
      employment_condition: employmentCondition,
      status,
      hire_date: values.dateOfJoining || null,
      start_date: values.dateOfJoining || null,
      metadata: {
        nickname: values.nickname || null,
        role: values.role || null,
        sourceOfHire: values.sourceOfHire || null,
        currentExperience: values.currentExperience || null,
        totalExperience: values.totalExperience || null,
        dateOfBirth: values.dateOfBirth || null,
        age: values.age || null,
        gender: values.gender || null,
        maritalStatus: values.maritalStatus || null,
        aboutMe: values.aboutMe || null,
        expertise: values.expertise || null,
        workPhone: values.workPhone || null,
        extension: values.extension || null,
        seatingLocation: values.seatingLocation || null,
        tags: values.tags || null,
        ...extras,
      },
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTenantEmployee = async (employeeId: string, updates: {
  name?: string;
  position?: string;
  department?: string;
  location?: string;
  manager?: string;
}) => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  const payload: Record<string, any> = {};
  if (updates.name) {
    const [firstName, ...rest] = updates.name.trim().split(/\s+/);
    payload.first_name = firstName;
    payload.last_name = rest.join(' ') || 'User';
  }
  if (updates.position !== undefined) payload.position = updates.position;
  if (updates.department !== undefined) payload.department = updates.department;
  if (updates.location !== undefined) payload.location = updates.location;

  if (updates.manager !== undefined) {
    const managerSearch = updates.manager.trim();
    if (!managerSearch) {
      payload.manager_id = null;
    } else {
      const { data: manager } = await supabase
        .from('employees')
        .select('id')
        .eq('business_id', context.businessId)
        .or(`email.eq.${managerSearch},first_name.ilike.%${managerSearch}%,last_name.ilike.%${managerSearch}%`)
        .limit(1)
        .maybeSingle();
      payload.manager_id = manager?.id || null;
    }
  }

  const { data, error } = await supabase
    .from('employees')
    .update(payload)
    .eq('business_id', context.businessId)
    .eq('id', employeeId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const changeTypeMap: Record<string, string> = {
  Promotion: 'promotion',
  'Salary Change': 'salary_change',
  'Department Transfer': 'department_transfer',
  'Manager Change': 'manager_change',
  'Employment Type Change': 'employment_type_change',
  'Location Change': 'location_change',
  Termination: 'termination',
};

export const listEmployeeChanges = async () => {
  const context = await getTenantContext();
  if (!context?.businessId) return [];

  const { data, error } = await supabase
    .from('employee_changes')
    .select('*, employees!inner(first_name,last_name,employee_id_number)')
    .eq('business_id', context.businessId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createEmployeeChange = async (draft: any) => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  let employeeId = draft.employeeId;
  if (!employeeId || !String(employeeId).includes('-')) {
    const { data: employee, error } = await supabase
      .from('employees')
      .select('id')
      .eq('business_id', context.businessId)
      .ilike('email', draft.employeeEmail || '')
      .maybeSingle();
    if (error) throw error;
    employeeId = employee?.id || employeeId;
  }

  if (!employeeId) throw new Error('Select a valid employee.');

  const { data, error } = await supabase
    .from('employee_changes')
    .insert({
      business_id: context.businessId,
      employee_id: employeeId,
      change_type: changeTypeMap[draft.type] || 'other',
      effective_date: draft.effectiveDate,
      before_value: { value: draft.oldValue },
      after_value: { value: draft.newValue },
      reason: draft.reason,
      status: 'pending',
      requested_by: context.userId,
    })
    .select()
    .single();

  if (error) throw error;

  await supabase.from('workflow_requests').insert({
    business_id: context.businessId,
    request_type: 'employee_change',
    source_type: 'employee_change',
    source_id: data.id,
    employee_id: employeeId,
    submitted_by: context.userId,
    status: 'pending',
    payload: {
      change_type: draft.type,
      effective_date: draft.effectiveDate,
      before: draft.oldValue,
      after: draft.newValue,
      reason: draft.reason,
    },
    submitted_at: new Date().toISOString(),
  });

  return data;
};

export const advanceEmployeeChange = async (id: string, status: 'approved' | 'scheduled' | 'completed') => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  const payload: Record<string, any> = { status };
  if (status === 'approved') {
    payload.approved_by = context.userId;
    payload.approved_at = new Date().toISOString();
  }
  if (status === 'completed') payload.completed_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('employee_changes')
    .update(payload)
    .eq('business_id', context.businessId)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  if (status === 'completed') {
    await supabase
      .from('workflow_requests')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('source_type', 'employee_change')
      .eq('source_id', id);
  } else if (status === 'approved') {
    await supabase
      .from('workflow_requests')
      .update({ status: 'approved' })
      .eq('source_type', 'employee_change')
      .eq('source_id', id);
  }

  return data;
};
