
import { AttendanceRecord, AttendanceStatus, ReviewStatus } from '@/types/attendance';

// Attendance summary data for charts
export interface AttendanceSummary {
  present: number;
  late: number;
  absent: number;
  remote: number;
  total: number;
}

// Early/late deviation record
export interface DeviationRecord {
  employeeId: string;
  employeeName: string;
  date: string;
  scheduledTime: string;
  actualTime: string;
  deviationMinutes: number;
  isEarly: boolean;
  isCheckIn: boolean;
}

// Working hours breakdown
export interface HoursBreakdown {
  employeeId: string;
  employeeName: string;
  date: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
}

// Payroll data record
export interface PayrollRecord {
  employeeId: string;
  employeeName: string;
  payableDays: number;
  workingDays: number;
  paidLeave: number;
  unpaidLeave: number;
  totalWorkingHours: number;
  overtimeHours: number;
}
