import { supabase } from '@/integrations/supabase/client';
import { getTenantContext } from '@/hooks/useTenantContext';

const leaveCodeMap: Record<string, string> = {
  annual: 'ANNUAL',
  sick: 'SICK',
  personal: 'PERSONAL',
  maternity: 'MATERNITY',
  paternity: 'PATERNITY',
  compassionate: 'COMPASSIONATE',
  unpaid: 'UNPAID',
};

export const listLeaveTypes = async () => {
  const context = await getTenantContext();
  if (!context?.businessId) return [];

  const { data, error } = await supabase
    .from('leave_types')
    .select('*')
    .eq('business_id', context.businessId)
    .eq('active', true)
    .order('name');

  if (error) throw error;
  return data || [];
};

export const listMyLeaveBalances = async () => {
  const context = await getTenantContext();
  if (!context?.businessId || !context.employeeId) return [];

  const { data, error } = await supabase
    .from('leave_balances')
    .select('*, leave_types(name,code,color,is_paid)')
    .eq('business_id', context.businessId)
    .eq('employee_id', context.employeeId)
    .eq('year', new Date().getFullYear())
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const submitLeaveRequest = async (input: {
  leaveType: string;
  startDate: Date;
  endDate?: Date;
  halfDay: boolean;
  reason: string;
  documents?: File[];
}) => {
  const context = await getTenantContext();
  if (!context?.businessId || !context.employeeId) {
    throw new Error('Your account is not linked to an employee record.');
  }

  const code = leaveCodeMap[input.leaveType] || input.leaveType.toUpperCase();
  const { data: leaveType, error: leaveTypeError } = await supabase
    .from('leave_types')
    .select('id,name')
    .eq('business_id', context.businessId)
    .eq('code', code)
    .eq('active', true)
    .single();

  if (leaveTypeError) throw leaveTypeError;

  const endDate = input.endDate || input.startDate;
  const oneDay = 24 * 60 * 60 * 1000;
  const calendarDays = Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) -
    Date.UTC(input.startDate.getFullYear(), input.startDate.getMonth(), input.startDate.getDate())) / oneDay) + 1;
  const days = input.halfDay ? 0.5 : Math.max(1, calendarDays);

  const { data: request, error } = await supabase
    .from('leave_requests')
    .insert({
      business_id: context.businessId,
      employee_id: context.employeeId,
      leave_type_id: leaveType.id,
      start_date: input.startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
      days,
      half_day: input.halfDay,
      reason: input.reason,
      status: 'pending',
      attachment_paths: [],
      applied_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  const uploadedPaths: string[] = [];
  for (const file of input.documents || []) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const storagePath = `${context.businessId}/leave/${context.employeeId}/${request.id}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, { upsert: false, contentType: file.type || undefined });

    if (uploadError) throw uploadError;

    const { error: documentError } = await supabase
      .from('documents')
      .insert({
        business_id: context.businessId,
        employee_id: context.employeeId,
        name: file.name,
        category: 'Leave',
        storage_bucket: 'documents',
        storage_path: storagePath,
        mime_type: file.type || null,
        size_bytes: file.size,
        access_level: 'private',
        uploaded_by: context.userId,
        metadata: { leave_request_id: request.id },
      });

    if (documentError) throw documentError;
    uploadedPaths.push(storagePath);
  }

  if (uploadedPaths.length) {
    const { error: attachmentError } = await supabase
      .from('leave_requests')
      .update({ attachment_paths: uploadedPaths })
      .eq('id', request.id);

    if (attachmentError) throw attachmentError;
  }

  const { data: employee } = await supabase
    .from('employees')
    .select('manager:manager_id(user_id)')
    .eq('id', context.employeeId)
    .maybeSingle();
  const manager = Array.isArray((employee as any)?.manager)
    ? (employee as any).manager[0]
    : (employee as any)?.manager;

  const { data: workflow, error: workflowError } = await supabase
    .from('workflow_requests')
    .insert({
      business_id: context.businessId,
      request_type: 'leave',
      source_type: 'leave_request',
      source_id: request.id,
      employee_id: context.employeeId,
      submitted_by: context.userId,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      payload: {
        leave_type: leaveType.name,
        start_date: request.start_date,
        end_date: request.end_date,
        days: request.days,
        reason: request.reason,
      },
    })
    .select()
    .single();

  if (workflowError) throw workflowError;

  const { error: routeError } = await (supabase as any).rpc('route_workflow_to_inbox', {
    target_workflow_id: workflow.id,
    preferred_assignee_user_id: manager?.user_id || null,
    preferred_assignee_role: manager?.user_id ? null : 'manager',
  });

  if (routeError) throw routeError;

  return request;
};

export const listLeaveHistory = async (team = false) => {
  const context = await getTenantContext();
  if (!context?.businessId) return [];

  let query = supabase
    .from('leave_requests')
    .select(`
      id,
      employee_id,
      start_date,
      end_date,
      days,
      half_day,
      reason,
      status,
      attachment_paths,
      applied_at,
      approved_at,
      review_comment,
      employees!inner(first_name,last_name,employee_id_number,user_id),
      leave_types!inner(name,code),
      approver:approved_by(first_name,last_name),
      leave_request_events(action,comment,created_at,actor_user_id)
    `)
    .eq('business_id', context.businessId)
    .order('applied_at', { ascending: false });

  if (!team && context.employeeId) query = query.eq('employee_id', context.employeeId);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    employeeId: row.employee_id,
    employeeName: `${row.employees?.first_name || ''} ${row.employees?.last_name || ''}`.trim(),
    employee: `${row.employees?.first_name || ''} ${row.employees?.last_name || ''}`.trim(),
    employeeNumber: row.employees?.employee_id_number || '',
    type: row.leave_types?.name || 'Leave',
    startDate: row.start_date,
    endDate: row.end_date,
    days: Number(row.days),
    status: row.status,
    appliedDate: row.applied_at?.slice(0, 10) || '',
    approvedBy: row.approver
      ? `${row.approver.first_name || ''} ${row.approver.last_name || ''}`.trim()
      : null,
    reason: row.reason,
    documents: Array.isArray(row.attachment_paths) ? row.attachment_paths : [],
    timeline: (row.leave_request_events || []).map((event: any) => ({
      date: event.created_at?.slice(0, 10),
      action: event.action,
      comment: event.comment || undefined,
    })),
  }));
};

export const listPendingLeaveRequests = async () => {
  const context = await getTenantContext();
  if (!context?.businessId) return [];

  const [{ data: requests, error: requestError }, { data: balances, error: balanceError }] = await Promise.all([
    supabase
      .from('leave_requests')
      .select(`
        id,
        employee_id,
        leave_type_id,
        start_date,
        end_date,
        days,
        reason,
        status,
        attachment_paths,
        applied_at,
        employees!inner(first_name,last_name,employee_id_number),
        leave_types!inner(id,name,code)
      `)
      .eq('business_id', context.businessId)
      .eq('status', 'pending')
      .order('applied_at', { ascending: true }),
    supabase
      .from('leave_balances')
      .select('employee_id,leave_type_id,allocated,carried_over,used,pending,year')
      .eq('business_id', context.businessId)
      .eq('year', new Date().getFullYear()),
  ]);

  if (requestError) throw requestError;
  if (balanceError) throw balanceError;

  return (requests || []).map((row: any) => {
    const balance = (balances || []).find((item: any) =>
      item.employee_id === row.employee_id && item.leave_type_id === row.leave_type_id
    );
    const currentBalance = balance
      ? Number(balance.allocated) + Number(balance.carried_over) - Number(balance.used) - Number(balance.pending) + Number(row.days)
      : 0;

    return {
      id: row.id,
      employee: `${row.employees?.first_name || ''} ${row.employees?.last_name || ''}`.trim(),
      employeeId: row.employees?.employee_id_number || '',
      type: row.leave_types?.name || 'Leave',
      startDate: row.start_date,
      endDate: row.end_date,
      days: Number(row.days),
      reason: row.reason,
      appliedDate: row.applied_at?.slice(0, 10) || '',
      currentBalance,
      afterLeaveBalance: currentBalance - Number(row.days),
      documents: Array.isArray(row.attachment_paths) ? row.attachment_paths : [],
      status: row.status,
    };
  });
};

export const decideLeaveRequest = async (
  requestId: string,
  action: 'approve' | 'reject',
  comment?: string,
) => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  const nextStatus = action === 'approve' ? 'approved' : 'rejected';
  const { data, error } = await supabase
    .from('leave_requests')
    .update({
      status: nextStatus,
      approved_by: context.userId,
      approved_at: new Date().toISOString(),
      review_comment: comment || null,
    })
    .eq('business_id', context.businessId)
    .eq('id', requestId)
    .eq('status', 'pending')
    .select()
    .single();

  if (error) throw error;

  const { data: workflow } = await supabase
    .from('workflow_requests')
    .select('id')
    .eq('source_type', 'leave_request')
    .eq('source_id', requestId)
    .maybeSingle();

  if (workflow) {
    const completedAt = new Date().toISOString();
    await supabase
      .from('workflow_requests')
      .update({ status: nextStatus, completed_at: completedAt })
      .eq('id', workflow.id);
    await supabase
      .from('work_items')
      .update({
        status: action === 'approve' ? 'completed' : 'dismissed',
        completed_at: completedAt,
      })
      .eq('source_type', 'workflow_request')
      .eq('source_id', workflow.id)
      .in('status', ['open', 'in_progress']);
  }

  return data;
};
