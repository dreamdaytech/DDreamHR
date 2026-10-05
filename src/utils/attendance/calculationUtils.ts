
import { AttendanceRecord } from '@/types/attendance';
import { DeviationRecord, HoursBreakdown, PayrollRecord } from './interfaces';

// Get check-in/out deviation data
export const getDeviationData = (
  records: AttendanceRecord[],
  workingHoursStart: string,
  workingHoursEnd: string
): DeviationRecord[] => {
  return records
    .filter(record => record.checkIn)
    .map(record => {
      const [scheduledHour, scheduledMinute] = workingHoursStart.split(':').map(Number);
      
      const checkInTime = new Date(record.checkIn!);
      const actualHour = checkInTime.getUTCHours();
      const actualMinute = checkInTime.getUTCMinutes();
      
      const scheduledMinutes = scheduledHour * 60 + scheduledMinute;
      const actualMinutes = actualHour * 60 + actualMinute;
      
      const deviationMinutes = actualMinutes - scheduledMinutes;
      const isEarly = deviationMinutes < 0;
      
      return {
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        date: record.date,
        scheduledTime: workingHoursStart,
        actualTime: `${String(actualHour).padStart(2, '0')}:${String(actualMinute).padStart(2, '0')}`,
        deviationMinutes: Math.abs(deviationMinutes),
        isEarly,
        isCheckIn: true
      };
    })
    .filter(record => record.deviationMinutes > 5); // Only include significant deviations (>5 minutes)
};

// Calculate hours breakdown from attendance records
export const calculateHoursBreakdown = (
  records: AttendanceRecord[],
  regularHoursThreshold: number = 8 // Standard 8-hour workday
): HoursBreakdown[] => {
  return records
    .filter(record => record.checkIn && record.checkOut && record.totalHours !== null)
    .map(record => {
      const totalHours = record.totalHours!;
      const overtimeHours = Math.max(0, totalHours - regularHoursThreshold);
      const regularHours = Math.min(totalHours, regularHoursThreshold);
      
      return {
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        date: record.date,
        regularHours,
        overtimeHours,
        totalHours
      };
    });
};

// Calculate payroll data from attendance records
export const calculatePayrollData = (
  records: AttendanceRecord[],
  startDate: Date,
  endDate: Date
): PayrollRecord[] => {
  // Group records by employee
  const employeeMap = new Map<string, AttendanceRecord[]>();
  
  records.forEach(record => {
    if (!employeeMap.has(record.employeeId)) {
      employeeMap.set(record.employeeId, []);
    }
    employeeMap.get(record.employeeId)!.push(record);
  });
  
  // Calculate payroll data for each employee
  return Array.from(employeeMap.entries()).map(([employeeId, empRecords]) => {
    const workingDays = empRecords.filter(r => ['Present', 'Late', 'Remote'].includes(r.status)).length;
    const paidLeave = empRecords.filter(r => r.status === 'Absent' && r.isRegularized).length;
    const unpaidLeave = empRecords.filter(r => r.status === 'Absent' && !r.isRegularized).length;
    
    const totalWorkingHours = empRecords.reduce((sum, r) => sum + (r.totalHours || 0), 0);
    const overtimeHours = empRecords.reduce((sum, r) => {
      const dailyOvertime = r.totalHours && r.totalHours > 8 ? r.totalHours - 8 : 0;
      return sum + dailyOvertime;
    }, 0);
    
    return {
      employeeId,
      employeeName: empRecords[0]?.employeeName || `Employee ${employeeId}`,
      payableDays: workingDays + paidLeave,
      workingDays,
      paidLeave,
      unpaidLeave,
      totalWorkingHours,
      overtimeHours
    };
  });
};
