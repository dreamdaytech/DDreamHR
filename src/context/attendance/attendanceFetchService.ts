
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AttendanceRecord, AttendanceStatus } from '@/types/attendance';
import { supabase } from '@/integrations/supabase/client';
import { isDemoSession, readDemoData } from '@/lib/demoStore';

export function useAttendanceFetchService(
  user: any,
  attendanceRecords: AttendanceRecord[],
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { toast } = useToast();

  // Fetch attendance records for a given date range
  const fetchAttendanceRecords = async (startDate: Date, endDate: Date): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);

    if (isDemoSession()) {
      const stored = readDemoData<AttendanceRecord[]>('attendance-records', []);
      const start = format(startDate, 'yyyy-MM-dd');
      const end = format(endDate, 'yyyy-MM-dd');
      setAttendanceRecords(stored.filter((record) => record.employeeId === user.id && record.date >= start && record.date <= end));
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', user.id)
        .gte('check_in', format(startDate, "yyyy-MM-dd'T'00:00:00"))
        .lte('check_in', format(endDate, "yyyy-MM-dd'T'23:59:59"));

      if (error) {
        throw error;
      }
      
      const formattedData = data.map((record): AttendanceRecord => ({
        id: record.id,
        employeeId: record.employee_id,
        employeeName: user.name,
        date: format(new Date(record.check_in!), 'yyyy-MM-dd'),
        checkIn: record.check_in,
        checkOut: record.check_out,
        totalHours: record.total_hours,
        status: record.status as AttendanceStatus,
        location: record.location_check_in || '',
        ipAddress: record.ip_address_check_in,
        device: record.device_check_in,
        notes: record.notes,
        isRegularized: false, // This would come from another source
      }));
      
      setAttendanceRecords(formattedData);
    } catch (error) {
      console.error('Fetch attendance error:', error);
      toast({
        title: "Failed to fetch attendance records",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get attendance for a specific date
  const fetchAttendanceByDate = async (date: Date): Promise<AttendanceRecord[]> => {
    if (!user) return [];
    
    const dateStr = format(date, 'yyyy-MM-dd');

    const source = isDemoSession()
      ? readDemoData<AttendanceRecord[]>('attendance-records', [])
      : attendanceRecords;
    if (isDemoSession()) setAttendanceRecords(source);

    const records = source.filter(record => 
      record.employeeId === user.id && record.date === dateStr
    );
    
    // If today and no record exists, check if we should create an 'Absent' record
    const today = new Date();
    const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    const currentHour = today.getHours();
    
    if (isToday && records.length === 0 && currentHour >= 12) { // Past noon and no check-in
      const [workHours] = attendanceSettings.workingHoursStart.split(':').map(Number);
      
      // Only mark as absent if work hours have started
      if (currentHour > workHours) {
        const absentRecord: AttendanceRecord = {
          id: `att-absent-${Date.now()}`,
          employeeId: user.id,
          employeeName: user.name,
          date: dateStr,
          checkIn: null,
          checkOut: null,
          totalHours: null,
          status: 'Absent',
          location: '',
          ipAddress: null,
          device: null,
          notes: null,
          isRegularized: false
        };
        
        return [absentRecord];
      }
    }
    
    return records;
  };

  // Get attendance status for a specific date
  const getAttendanceStatusForDate = (date: Date): AttendanceStatus | null => {
    if (!user) return null;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const record = attendanceRecords.find(r => 
      r.employeeId === user.id && r.date === dateStr
    );
    
    return record ? record.status : null;
  };

  // Get attendance by employee ID (for managers/admins)
  const getAttendanceByEmployeeId = async (employeeId: string, startDate: Date, endDate: Date): Promise<AttendanceRecord[]> => {
    if (!user || !['admin', 'hr', 'manager'].includes(user.role)) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to view other employees' attendance",
        variant: "destructive",
      });
      return [];
    }

    if (isDemoSession()) {
      const start = format(startDate, 'yyyy-MM-dd');
      const end = format(endDate, 'yyyy-MM-dd');
      return readDemoData<AttendanceRecord[]>('attendance-records', []).filter(
        (record) => record.employeeId === employeeId && record.date >= start && record.date <= end,
      );
    }

    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', employeeId)
        .gte('check_in', format(startDate, "yyyy-MM-dd'T'00:00:00"))
        .lte('check_in', format(endDate, "yyyy-MM-dd'T'23:59:59"));
      
      if (error) throw error;

      if (data.length === 0) return [];
      
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('user_id', employeeId)
        .single();

      if (profileError) throw profileError;

      const employeeName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || `Employee ${employeeId}`;

      return data.map((record): AttendanceRecord => ({
        id: record.id,
        employeeId: record.employee_id,
        employeeName: employeeName,
        date: format(new Date(record.check_in!), 'yyyy-MM-dd'),
        checkIn: record.check_in,
        checkOut: record.check_out,
        totalHours: record.total_hours,
        status: record.status as AttendanceStatus,
        location: record.location_check_in || '',
        ipAddress: record.ip_address_check_in,
        device: record.device_check_in,
        notes: record.notes,
        isRegularized: false,
      }));
    } catch (error) {
       console.error('Fetch attendance by employee error:', error);
      toast({
        title: "Failed to fetch attendance records",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    fetchAttendanceRecords,
    fetchAttendanceByDate,
    getAttendanceStatusForDate,
    getAttendanceByEmployeeId
  };
}

// Mock settings for development - would be passed from context in real app
const attendanceSettings = {
  workingHoursStart: '09:00',
  workingHoursEnd: '17:00',
  graceTimeLate: 15, // 15 minutes grace period for being late
  graceTimeEarly: 15 // 15 minutes grace period for leaving early
};
