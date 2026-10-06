import { supabase } from '@/integrations/supabase/client';
import { getTenantContext } from '@/hooks/useTenantContext';

export type InboxDecisionStatus = 'pending' | 'approved' | 'rejected';

export type TenantInboxItem = {
  id: string;
  workflowId: string;
  type: string;
  employee: string;
  employeeAvatar: string;
  date: string;
  duration: string;
  status: InboxDecisionStatus;
  description: string;
  submittedAt: string;
  route: string;
  category: string;
};

const routeFor = (category: string) => {
  if (category === 'leave') return '/leave-tracking';
  if (category === 'timesheet') return '/time-tracking';
  if (category === 'employee_change') return '/employees?view=changes';
  if (category === 'onboarding') return '/hr-lifecycle/onboarding';
  if (category === 'offboarding') return '/hr-lifecycle/offboarding';
  if (category === 'document') return '/documents';
  return '/dashboard';
};

const labelFor = (category: string) => {
  if (category === 'leave') return 'Leave Request';
  if (category === 'timesheet') return 'Timesheet Review';
  if (category === 'employee_change') return 'Employee Change';
  if (category === 'onboarding') return 'Onboarding Task';
  if (category === 'offboarding') return 'Offboarding Task';
  if (category === 'document') return 'Document Review';
  return category.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

const sourceStatus = async (workflow: any): Promise<InboxDecisionStatus> => {
  if (workflow.status === 'rejected') return 'rejected';
  if (workflow.status === 'approved' || workflow.status === 'completed') return 'approved';

  if (workflow.source_type === 'leave_request' && workflow.source_id) {
    const { data } = await supabase.from('leave_requests').select('status').eq('id', workflow.source_id).maybeSingle();
    if (data?.status === 'approved') return 'approved';
    if (data?.status === 'rejected') return 'rejected';
  }
  if (workflow.source_type === 'timesheet' && workflow.source_id) {
    const { data } = await supabase.from('timesheets').select('status').eq('id', workflow.source_id).maybeSingle();
    if (data?.status === 'approved') return 'approved';
    if (data?.status === 'rejected') return 'rejected';
  }
  if (workflow.source_type === 'employee_change' && workflow.source_id) {
    const { data } = await supabase.from('employee_changes').select('status').eq('id', workflow.source_id).maybeSingle();
    if (['approved', 'scheduled', 'completed'].includes(data?.status || '')) return 'approved';
    if (data?.status === 'rejected') return 'rejected';
  }
  return 'pending';
};

export const listWorkInbox = async (): Promise<TenantInboxItem[]> => {
  const context = await getTenantContext();
  if (!context?.businessId) return [];

  const { data: workItems, error: workItemError } = await supabase
    .from('work_items')
    .select('*')
    .eq('business_id', context.businessId)
    .order('created_at', { ascending: false });

  if (workItemError) throw workItemError;
  if (!workItems?.length) return [];

  const workflowIds = workItems
    .filter((item) => item.source_type === 'workflow_request' && item.source_id)
    .map((item) => item.source_id as string);

  const { data: workflows, error: workflowError } = await supabase
    .from('workflow_requests')
    .select('*, employees(first_name,last_name,employee_id_number)')
    .in('id', workflowIds.length ? workflowIds : ['00000000-0000-0000-0000-000000000000']);

  if (workflowError) throw workflowError;

  const workflowMap = new Map((workflows || []).map((workflow: any) => [workflow.id, workflow]));
  const items: TenantInboxItem[] = [];

  for (const item of workItems) {
    const workflow = item.source_type === 'workflow_request' && item.source_id
      ? workflowMap.get(item.source_id)
      : null;

    if (!workflow) {
      items.push({
        id: item.id,
        workflowId: '',
        type: labelFor(item.category),
        employee: 'DDreamHR',
        employeeAvatar: 'DD',
        date: item.created_at.slice(0, 10),
        duration: item.priority,
        status: item.status === 'dismissed' ? 'rejected' : item.status === 'completed' ? 'approved' : 'pending',
        description: item.description || item.title,
        submittedAt: item.created_at,
        route: routeFor(item.category),
        category: item.category,
      });
      continue;
    }

    const employeeRelation = Array.isArray((workflow as any).employees)
      ? (workflow as any).employees[0]
      : (workflow as any).employees;
    const employeeName = employeeRelation
      ? `${employeeRelation.first_name || ''} ${employeeRelation.last_name || ''}`.trim()
      : 'Employee';
    const initials = employeeName
      .split(/\s+/)
      .filter(Boolean)
      .map((part: string) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'E';
    const payload = (workflow as any).payload || {};
    const status = await sourceStatus(workflow);
    const category = item.category || workflow.request_type;

    items.push({
      id: item.id,
      workflowId: workflow.id,
      type: labelFor(category),
      employee: employeeName,
      employeeAvatar: initials,
      date: payload.effective_date || payload.start_date || payload.period_start || workflow.created_at.slice(0, 10),
      duration: payload.days
        ? `${payload.days} day${Number(payload.days) === 1 ? '' : 's'}`
        : payload.total_hours
          ? `${payload.total_hours}h`
          : payload.change_type || item.priority,
      status,
      description: item.description || item.title,
      submittedAt: workflow.submitted_at || workflow.created_at,
      route: routeFor(category),
      category,
    });
  }

  return items;
};

export const decideWorkItem = async (
  workItemId: string,
  action: 'approve' | 'reject',
  comment?: string,
) => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  const { data: workItem, error: workItemError } = await supabase
    .from('work_items')
    .select('*')
    .eq('business_id', context.businessId)
    .eq('id', workItemId)
    .single();

  if (workItemError) throw workItemError;
  if (workItem.status === 'completed' || workItem.status === 'dismissed') {
    throw new Error('This inbox item has already been processed.');
  }
  if (workItem.source_type !== 'workflow_request' || !workItem.source_id) {
    const { error } = await supabase
      .from('work_items')
      .update({
        status: action === 'approve' ? 'completed' : 'dismissed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', workItemId);
    if (error) throw error;
    return;
  }

  const { data: workflow, error: workflowError } = await supabase
    .from('workflow_requests')
    .select('*')
    .eq('id', workItem.source_id)
    .single();

  if (workflowError) throw workflowError;
  const nextStatus = action === 'approve' ? 'approved' : 'rejected';
  const actedAt = new Date().toISOString();

  if (workflow.source_type === 'leave_request' && workflow.source_id) {
    const { error } = await supabase
      .from('leave_requests')
      .update({
        status: nextStatus,
        approved_by: context.userId,
        approved_at: actedAt,
        review_comment: comment || null,
      })
      .eq('business_id', context.businessId)
      .eq('id', workflow.source_id)
      .eq('status', 'pending');
    if (error) throw error;
  } else if (workflow.source_type === 'timesheet' && workflow.source_id) {
    const { error } = await supabase
      .from('timesheets')
      .update({
        status: nextStatus,
        approved_by: action === 'approve' ? context.userId : null,
        approved_at: action === 'approve' ? actedAt : null,
        comments: action === 'reject' ? (comment || 'Rejected from Work Inbox') : null,
      })
      .eq('business_id', context.businessId)
      .eq('id', workflow.source_id)
      .eq('status', 'submitted');
    if (error) throw error;
  } else if (workflow.source_type === 'employee_change' && workflow.source_id) {
    const { error } = await supabase
      .from('employee_changes')
      .update({
        status: nextStatus,
        approved_by: action === 'approve' ? context.userId : null,
        approved_at: action === 'approve' ? actedAt : null,
      })
      .eq('business_id', context.businessId)
      .eq('id', workflow.source_id)
      .eq('status', 'pending');
    if (error) throw error;
  }

  const { error: workflowUpdateError } = await supabase
    .from('workflow_requests')
    .update({
      status: nextStatus,
      completed_at: actedAt,
    })
    .eq('id', workflow.id);

  if (workflowUpdateError) throw workflowUpdateError;

  const { data: existingSteps } = await supabase
    .from('workflow_steps')
    .select('step_order')
    .eq('request_id', workflow.id)
    .order('step_order', { ascending: false })
    .limit(1);

  const { error: stepError } = await supabase.from('workflow_steps').insert({
    request_id: workflow.id,
    step_order: ((existingSteps?.[0]?.step_order || 0) + 1),
    approver_role: context.role,
    approver_user_id: context.userId,
    status: nextStatus,
    acted_by: context.userId,
    acted_at: actedAt,
    comment: comment || null,
  });
  if (stepError) throw stepError;

  const { error: workItemUpdateError } = await supabase
    .from('work_items')
    .update({
      status: action === 'approve' ? 'completed' : 'dismissed',
      completed_at: actedAt,
    })
    .eq('id', workItemId);

  if (workItemUpdateError) throw workItemUpdateError;
};
