import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { getTenantContext } from '@/hooks/useTenantContext';
import type { AttendanceRecord, AttendanceSettings, AttendanceStatus, BreakRecord, RegularizationRequest } from '@/types/attendance';
import type { Database } from '@/integrations/supabase/types';

const toTime = (value: string | null) => value ? format(new Date(value), 'HH:mm') : null;

type AttendanceRow = Database['public']['Tables']['attendance_records']['Row'];
type AttendanceBreakRow = Database['public']['Tables']['attendance_breaks']['Row'];
type RegularizationRow = Database['public']['Tables']['regularization_requests']['Row'];

const mapAttendance = (row: AttendanceRow, employeeName = 'Employee'): AttendanceRecord => ({
  id: row.id,
  employeeId: row.employee_id,
  employeeName,
  date: row.work_date || (row.check_in ? format(new Date(row.check_in), 'yyyy-MM-dd') : ''),
  checkIn: toTime(row.check_in),
  checkOut: toTime(row.check_out),
  totalHours: row.total_hours === null ? null : Number(row.total_hours),
  status: row.status as AttendanceStatus,
  location: row.location_check_in || row.location_check_out || '',
  ipAddress: row.ip_address_check_in || row.ip_address_check_out || null,
  device: row.device_check_in || row.device_check_out || null,
  notes: row.notes || row.check_in_notes || row.check_out_notes || null,
  isRegularized: Boolean(row.is_regularized),
});

const mapBreak = (row: AttendanceBreakRow): BreakRecord => ({
  id: row.id,
  attendanceId: row.attendance_id,
  startTime: toTime(row.start_time) || '',
  endTime: toTime(row.end_time),
  type: row.break_type,
  isPaid: Boolean(row.is_paid),
  notes: row.notes || null,
});

const mapRegularization = (row: RegularizationRow, employeeName = 'Employee'): RegularizationRequest => ({
  id: row.id,
  employeeId: row.employee_id,
  employeeName,
  attendanceId: row.attendance_id || null,
  date: row.requested_date,
  requestType: row.request_type,
  requestedTime: row.requested_check_in
    ? toTime(row.requested_check_in)
    : row.requested_check_out
      ? toTime(row.requested_check_out)
      : null,
  reason: row.reason,
  status: row.status,
  requestedAt: row.created_at,
  approvedBy: row.reviewer_id || null,
  approvedAt: row.reviewed_at || null,
});

export const loadAttendanceSettings = async (): Promise<AttendanceSettings | null> => {
  const context = await getTenantContext();
  if (!context?.businessId) return null;

  const { data, error } = await supabase
    .from('attendance_settings')
    .select('*')
    .eq('business_id', context.businessId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    workingHoursStart: String(data.working_hours_start).slice(0, 5),
    workingHoursEnd: String(data.working_hours_end).slice(0, 5),
    graceTimeLate: data.grace_time_late,
    graceTimeEarly: data.grace_time_early,
    allowedIpAddresses: data.allowed_ip_addresses || [],
    geoFencingEnabled: data.geo_fencing_enabled,
    geoFencingRadius: data.geo_fencing_radius,
    geoFencingLocations: Array.isArray(data.geo_fencing_locations)
      ? data.geo_fencing_locations.filter((location): location is { lat: number; lng: number; name: string } =>
          typeof location === 'object' && location !== null && !Array.isArray(location) &&
          typeof location.lat === 'number' && typeof location.lng === 'number' && typeof location.name === 'string')
      : [],
    biometricRequired: data.biometric_required,
    facialRecognitionRequired: data.facial_recognition_required,
  };
};

export const listAttendanceRecords = async (
  startDate: Date,
  endDate: Date,
  employeeId?: string,
  employeeName?: string,
): Promise<AttendanceRecord[]> => {
  const context = await getTenantContext();
  if (!context?.businessId) return [];

  const targetEmployeeId = employeeId || context.employeeId;
  if (!targetEmployeeId) return [];

  const { data, error } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('business_id', context.businessId)
    .eq('employee_id', targetEmployeeId)
    .gte('work_date', format(startDate, 'yyyy-MM-dd'))
    .lte('work_date', format(endDate, 'yyyy-MM-dd'))
    .order('work_date', { ascending: false });

  if (error) throw error;

  let resolvedName = employeeName;
  if (!resolvedName) {
    const { data: employee } = await supabase
      .from('employees')
      .select('first_name,last_name')
      .eq('id', targetEmployeeId)
      .maybeSingle();
    resolvedName = employee ? `${employee.first_name} ${employee.last_name}`.trim() : 'Employee';
  }

  return (data || []).map((row) => mapAttendance(row, resolvedName));
};

export const fetchTodayAttendance = async (employeeName?: string) => {
  const today = new Date();
  const rows = await listAttendanceRecords(today, today, undefined, employeeName);
  return rows[0] || null;
};

export const createAttendanceCheckIn = async (input: {
  locationName: string;
  status: AttendanceStatus;
  ipAddress?: string | null;
  device?: string | null;
  notes?: string | null;
}) => {
  const context = await getTenantContext();
  if (!context?.businessId || !context.employeeId) {
    throw new Error('Your account is not linked to an employee record.');
  }

  const now = new Date();
  const { data, error } = await supabase
    .from('attendance_records')
    .insert({
      business_id: context.businessId,
      employee_id: context.employeeId,
      work_date: format(now, 'yyyy-MM-dd'),
      check_in: now.toISOString(),
      status: input.status,
      location_check_in: input.locationName,
      ip_address_check_in: input.ipAddress || null,
      device_check_in: input.device || null,
      check_in_notes: input.notes || null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapAttendance(data);
};

export const updateAttendanceCheckOut = async (attendanceId: string, input: {
  totalHours: number | null;
  locationName?: string | null;
  ipAddress?: string | null;
  device?: string | null;
  notes?: string | null;
}) => {
  const context = await getTenantContext();
  if (!context?.businessId || !context.employeeId) {
    throw new Error('Your account is not linked to an employee record.');
  }

  const { data, error } = await supabase
    .from('attendance_records')
    .update({
      check_out: new Date().toISOString(),
      // The database guard recalculates total_hours from timestamps and unpaid
      // breaks; this value is retained only for compatibility with callers.
      total_hours: input.totalHours,
      location_check_out: input.locationName || null,
      ip_address_check_out: input.ipAddress || null,
      device_check_out: input.device || null,
      check_out_notes: input.notes || null,
    })
    .eq('id', attendanceId)
    .eq('business_id', context.businessId)
    .eq('employee_id', context.employeeId)
    .select()
    .single();

  if (error) throw error;
  return mapAttendance(data);
};

export const listAttendanceBreaks = async (attendanceId: string): Promise<BreakRecord[]> => {
  const { data, error } = await supabase
    .from('attendance_breaks')
    .select('*')
    .eq('attendance_id', attendanceId)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapBreak);
};

export const createAttendanceBreak = async (
  attendanceId: string,
  type: BreakRecord['type'],
  isPaid: boolean,
) => {
  const { data, error } = await supabase
    .from('attendance_breaks')
    .insert({
      attendance_id: attendanceId,
      start_time: new Date().toISOString(),
      break_type: type,
      is_paid: isPaid,
    })
    .select()
    .single();

  if (error) throw error;
  return mapBreak(data);
};

export const finishAttendanceBreak = async (breakId: string) => {
  const { data, error } = await supabase
    .from('attendance_breaks')
    .update({ end_time: new Date().toISOString() })
    .eq('id', breakId)
    .select()
    .single();

  if (error) throw error;
  return mapBreak(data);
};

export const listRegularizationRequests = async (): Promise<RegularizationRequest[]> => {
  const context = await getTenantContext();
  if (!context?.businessId) return [];

  const { data, error } = await supabase
    .from('regularization_requests')
    .select('*, employees!inner(first_name,last_name)')
    .eq('business_id', context.businessId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((row) => mapRegularization(
    row,
    `${row.employees?.first_name || ''} ${row.employees?.last_name || ''}`.trim() || 'Employee',
  ));
};

export const createRegularizationRequest = async (
  request: Omit<RegularizationRequest, 'id' | 'employeeId' | 'employeeName' | 'status' | 'requestedAt' | 'approvedBy' | 'approvedAt'>,
) => {
  const context = await getTenantContext();
  if (!context?.businessId || !context.employeeId) {
    throw new Error('Your account is not linked to an employee record.');
  }

  const requestedDate = request.date;
  const requestedTime = request.requestedTime;
  const combine = requestedTime ? `${requestedDate}T${requestedTime}:00` : null;

  const { data, error } = await supabase
    .from('regularization_requests')
    .insert({
      business_id: context.businessId,
      employee_id: context.employeeId,
      attendance_id: request.attendanceId || null,
      requested_date: requestedDate,
      request_type: request.requestType,
      requested_check_in: request.requestType === 'Check-In' && combine ? new Date(combine).toISOString() : null,
      requested_check_out: request.requestType === 'Check-Out' && combine ? new Date(combine).toISOString() : null,
      reason: request.reason,
      status: 'Pending',
    })
    .select()
    .single();

  if (error) throw error;
  return mapRegularization(data);
};

export const decideRegularizationRequest = async (
  requestId: string,
  action: 'Approved' | 'Rejected',
  _attendanceSettings: AttendanceSettings,
) => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  // The database function authorizes the reviewer, locks the request, applies
  // the attendance mutation, and changes request status in one transaction.
  const { data, error } = await supabase.rpc('decide_attendance_regularization', {
    p_request_id: requestId,
    p_action: action,
    p_review_comment: null,
  });

  if (error) throw error;

  const { data: updated, error: fetchError } = await supabase
    .from('regularization_requests')
    .select('*, employees!inner(first_name,last_name)')
    .eq('business_id', context.businessId)
    .eq('id', requestId)
    .single();

  if (fetchError) throw fetchError;
  return mapRegularization(
    updated,
    `${updated.employees?.first_name || ''} ${updated.employees?.last_name || ''}`.trim() || 'Employee',
  );
};
