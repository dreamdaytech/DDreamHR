import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { getTenantContext } from '@/hooks/useTenantContext';

export type TenantProject = {
  id: string;
  name: string;
  assignedTo: string[];
  department: string;
  createdBy?: string;
  dueDate?: string;
};

export type TenantTask = {
  id: string;
  name: string;
  projectId: string;
  estimatedHours: number;
  assignedTo?: string;
  status?: string;
};

export const listProjectsAndTasks = async () => {
  const context = await getTenantContext();
  if (!context?.businessId) return { projects: [], tasks: [] };

  const [{ data: projects, error: projectError }, { data: tasks, error: taskError }] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('business_id', context.businessId)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: true }),
    supabase
      .from('tasks')
      .select('*')
      .eq('business_id', context.businessId)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: true }),
  ]);

  if (projectError) throw projectError;
  if (taskError) throw taskError;

  return {
    projects: (projects || []).map((row): TenantProject => ({
      id: row.id,
      name: row.name,
      assignedTo: ['all'],
      department: row.department || 'General',
      createdBy: row.created_by || undefined,
      dueDate: row.due_date || undefined,
    })),
    tasks: (tasks || []).map((row): TenantTask => ({
      id: row.id,
      name: row.name,
      projectId: row.project_id || '',
      estimatedHours: Number(row.estimated_hours || 0),
      assignedTo: row.assigned_to || 'individual',
      status: row.status === 'completed' ? 'completed' : 'active',
    })),
  };
};

export const createTenantProject = async (project: any) => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  const { data, error } = await supabase
    .from('projects')
    .insert({
      business_id: context.businessId,
      name: project.name,
      description: project.notes || null,
      department: project.department || null,
      status: 'active',
      due_date: project.dueDate || null,
      created_by: context.userId,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    assignedTo: project.assignedTo || ['all'],
    department: data.department || 'General',
    createdBy: data.created_by || undefined,
    dueDate: data.due_date || undefined,
  } as TenantProject;
};

export const createTenantTask = async (task: any) => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      business_id: context.businessId,
      project_id: task.projectId || null,
      name: task.name,
      description: task.notes || null,
      assigned_to: task.assignedTo && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(task.assignedTo) ? task.assignedTo : null,
      estimated_hours: Number(task.estimatedHours || 0),
      due_date: task.dueDate || null,
      priority: 'normal',
      status: 'not_started',
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    projectId: data.project_id || '',
    estimatedHours: Number(data.estimated_hours || 0),
    assignedTo: data.assigned_to || 'individual',
    status: 'active',
  } as TenantTask;
};

export const saveTenantTimeLog = async (input: {
  date: Date;
  projectName: string;
  taskName: string;
  description: string;
  seconds: number;
  billable: boolean;
}) => {
  const context = await getTenantContext();
  if (!context?.businessId || !context.employeeId) {
    throw new Error('Your account is not linked to an employee record.');
  }

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('business_id', context.businessId)
    .eq('name', input.projectName)
    .maybeSingle();

  const { data: task } = project?.id
    ? await supabase
        .from('tasks')
        .select('id')
        .eq('business_id', context.businessId)
        .eq('project_id', project.id)
        .eq('name', input.taskName)
        .maybeSingle()
    : { data: null };

  const { data, error } = await supabase
    .from('time_logs')
    .insert({
      business_id: context.businessId,
      user_id: context.userId,
      employee_id: context.employeeId,
      project_id: project?.id || null,
      task_id: task?.id || null,
      date: format(input.date, 'yyyy-MM-dd'),
      duration_seconds: input.seconds,
      description: input.description || null,
      is_billable: input.billable,
      status: 'saved',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

const resolveTimesheetWindow = (type: string) => {
  const now = new Date();
  if (type === 'daily') return { start: now, end: now };
  if (type === 'monthly') return { start: startOfMonth(now), end: endOfMonth(now) };
  return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
};

const resolveApprover = async (businessId: string, target: string) => {
  const role = target === 'team-lead' ? 'manager' : target;
  const { data, error } = await supabase
    .from('business_users')
    .select('user_id, role, user_profiles!inner(first_name,last_name)')
    .eq('business_id', businessId)
    .eq('status', 'active')
    .eq('role', role)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const listMyTimesheets = async () => {
  const context = await getTenantContext();
  if (!context?.businessId || !context.employeeId) return [];

  const { data, error } = await supabase
    .from('timesheets')
    .select('*')
    .eq('business_id', context.businessId)
    .eq('employee_id', context.employeeId)
    .order('period_start', { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    period: row.period_start === row.period_end ? 'Daily' : 'Timesheet',
    startDate: row.period_start,
    endDate: row.period_end,
    status: row.status,
    submittedTo: row.submitted_to ? 'Approver' : 'Not assigned',
    totalHours: Number(row.total_hours || 0),
    comments: row.comments || undefined,
  }));
};

export const createTenantTimesheet = async (
  type: string,
  submissionTarget: string,
  comments?: string,
) => {
  const context = await getTenantContext();
  if (!context?.businessId || !context.employeeId) {
    throw new Error('Your account is not linked to an employee record.');
  }

  const { start, end } = resolveTimesheetWindow(type);
  const approver = await resolveApprover(context.businessId, submissionTarget);

  const { data: logs, error: logError } = await supabase
    .from('time_logs')
    .select('duration_seconds')
    .eq('business_id', context.businessId)
    .eq('employee_id', context.employeeId)
    .gte('date', format(start, 'yyyy-MM-dd'))
    .lte('date', format(end, 'yyyy-MM-dd'));

  if (logError) throw logError;
  const totalHours = (logs || []).reduce((sum, row) => sum + Number(row.duration_seconds || 0), 0) / 3600;

  const { data, error } = await supabase
    .from('timesheets')
    .insert({
      business_id: context.businessId,
      employee_id: context.employeeId,
      period_start: format(start, 'yyyy-MM-dd'),
      period_end: format(end, 'yyyy-MM-dd'),
      total_hours: Number(totalHours.toFixed(2)),
      status: 'draft',
      submitted_to: approver?.user_id || null,
      comments: comments || null,
    })
    .select()
    .single();

  if (error) throw error;

  const approverProfile = approver
    ? Array.isArray(approver.user_profiles) ? approver.user_profiles[0] : approver.user_profiles
    : null;

  await supabase
    .from('time_logs')
    .update({ timesheet_id: data.id })
    .eq('business_id', context.businessId)
    .eq('employee_id', context.employeeId)
    .is('timesheet_id', null)
    .gte('date', data.period_start)
    .lte('date', data.period_end);

  return {
    id: data.id,
    period: type.charAt(0).toUpperCase() + type.slice(1),
    startDate: data.period_start,
    endDate: data.period_end,
    status: data.status,
    submittedTo: approver
      ? `${approverProfile?.first_name || ''} ${approverProfile?.last_name || ''}`.trim() || submissionTarget
      : submissionTarget,
    totalHours: Number(data.total_hours || 0),
    comments: data.comments || undefined,
  };
};

export const submitTenantTimesheet = async (timesheetId: string) => {
  const context = await getTenantContext();
  if (!context?.businessId || !context.employeeId) throw new Error('No employee context is available.');

  const { data, error } = await supabase
    .from('timesheets')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      comments: null,
    })
    .eq('business_id', context.businessId)
    .eq('employee_id', context.employeeId)
    .eq('id', timesheetId)
    .in('status', ['draft', 'rejected'])
    .select()
    .single();

  if (error) throw error;

  const { data: existingWorkflow } = await supabase
    .from('workflow_requests')
    .select('id')
    .eq('source_type', 'timesheet')
    .eq('source_id', timesheetId)
    .maybeSingle();

  let workflowId = existingWorkflow?.id || null;

  if (!workflowId) {
    const { data: workflow, error: workflowError } = await supabase
      .from('workflow_requests')
      .insert({
        business_id: context.businessId,
        request_type: 'timesheet',
        source_type: 'timesheet',
        source_id: timesheetId,
        employee_id: context.employeeId,
        submitted_by: context.userId,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        payload: {
          period_start: data.period_start,
          period_end: data.period_end,
          total_hours: data.total_hours,
        },
      })
      .select()
      .single();

    if (workflowError) throw workflowError;
    workflowId = workflow.id;
  } else {
    const { error: resubmitError } = await supabase.rpc('resubmit_workflow_request', {
      target_workflow_id: workflowId,
    });
    if (resubmitError) throw resubmitError;
  }

  const { error: routeError } = await supabase.rpc('route_workflow_to_inbox', {
    target_workflow_id: workflowId,
    preferred_assignee_user_id: data.submitted_to || null,
    preferred_assignee_role: data.submitted_to ? null : 'manager',
  });
  if (routeError) throw routeError;

  return data;
};
