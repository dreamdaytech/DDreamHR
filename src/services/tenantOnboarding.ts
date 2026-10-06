import { supabase } from '@/integrations/supabase/client';
import { getTenantContext } from '@/hooks/useTenantContext';

export type OnboardingTask = {
  id: string;
  title: string;
  required: boolean;
};

export type MyOnboarding = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  position: string;
  department: string;
  startDate: string;
  templateName: string;
  tasks: OnboardingTask[];
  completedItems: string[];
  completionPercentage: number;
  completedAt?: string | null;
};

export const loadMyOnboarding = async (): Promise<MyOnboarding | null> => {
  const context = await getTenantContext();
  if (!context?.employeeId) return null;

  const [{ data: employee, error: employeeError }, { data: onboarding, error: onboardingError }] = await Promise.all([
    supabase
      .from('employees')
      .select('id,employee_id_number,first_name,last_name,position,department,start_date,hire_date')
      .eq('id', context.employeeId)
      .single(),
    supabase
      .from('employee_onboarding')
      .select('id,employee_id,completed_items,completion_percentage,completed_at,started_at,onboarding_checklists!inner(template_name,checklist_items)')
      .eq('employee_id', context.employeeId)
      .eq('lifecycle_type', 'onboarding')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (employeeError) throw employeeError;
  if (onboardingError) throw onboardingError;
  if (!onboarding) return null;

  const checklist = Array.isArray((onboarding as any).onboarding_checklists)
    ? (onboarding as any).onboarding_checklists[0]
    : (onboarding as any).onboarding_checklists;
  const rawTasks = Array.isArray(checklist?.checklist_items) ? checklist.checklist_items : [];

  return {
    id: onboarding.id,
    employeeId: onboarding.employee_id,
    employeeName: `${employee.first_name || ''} ${employee.last_name || ''}`.trim(),
    employeeNumber: employee.employee_id_number || '',
    position: employee.position || 'Employee',
    department: employee.department || 'General',
    startDate: employee.start_date || employee.hire_date || '',
    templateName: checklist?.template_name || 'Onboarding',
    tasks: rawTasks.map((task: any) => ({
      id: String(task.id),
      title: String(task.title || task.id),
      required: Boolean(task.required),
    })),
    completedItems: Array.isArray(onboarding.completed_items)
      ? onboarding.completed_items.map(String)
      : [],
    completionPercentage: Number(onboarding.completion_percentage || 0),
    completedAt: onboarding.completed_at,
  };
};

export const completeMyOnboardingItem = async (itemId: string) => {
  const { data, error } = await supabase.rpc('complete_my_onboarding_item', {
    item_id: itemId,
  });
  if (error) throw error;
  return data as unknown as {
    onboarding_id: string;
    employee_id: string;
    completed_items: string[];
    completion_percentage: number;
    completed: boolean;
    lifecycle_state: string;
  };
};

export const listTenantOnboardingAssignments = async () => {
  const context = await getTenantContext();
  if (!context?.businessId) return [];

  const { data, error } = await supabase
    .from('employee_onboarding')
    .select(`
      id,
      employee_id,
      completion_percentage,
      completed_at,
      started_at,
      completed_items,
      employees!inner(first_name,last_name,employee_id_number,position,department,start_date,lifecycle_state),
      onboarding_checklists!inner(template_name,checklist_items)
    `)
    .eq('business_id', context.businessId)
    .eq('lifecycle_type', 'onboarding')
    .order('started_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => {
    const employee = Array.isArray(row.employees) ? row.employees[0] : row.employees;
    const checklist = Array.isArray(row.onboarding_checklists) ? row.onboarding_checklists[0] : row.onboarding_checklists;
    return {
      id: row.id,
      employeeId: row.employee_id,
      employeeName: `${employee?.first_name || ''} ${employee?.last_name || ''}`.trim(),
      employeeNumber: employee?.employee_id_number || '',
      position: employee?.position || 'Employee',
      department: employee?.department || 'General',
      startDate: employee?.start_date || '',
      lifecycleState: employee?.lifecycle_state || 'onboarding',
      templateName: checklist?.template_name || 'Onboarding',
      totalTasks: Array.isArray(checklist?.checklist_items) ? checklist.checklist_items.length : 0,
      completedTasks: Array.isArray(row.completed_items) ? row.completed_items.length : 0,
      progress: Number(row.completion_percentage || 0),
      completedAt: row.completed_at,
    };
  });
};
