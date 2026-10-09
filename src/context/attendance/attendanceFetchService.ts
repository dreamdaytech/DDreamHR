import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AttendanceRecord, AttendanceStatus } from '@/types/attendance';
import { isDemoSession, readDemoData } from '@/lib/demoStore';
import { listAttendanceRecords } from '@/services/tenantAttendance';
import type { User } from '@/context/AuthContext';

export function useAttendanceFetchService(
  user: User | null,
  attendanceRecords: AttendanceRecord[],
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const { toast } = useToast();

  const fetchAttendanceRecords = async (startDate: Date, endDate: Date): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    try {
      if (isDemoSession()) {
        const stored = readDemoData<AttendanceRecord[]>('attendance-records', []);
        const start = format(startDate, 'yyyy-MM-dd');
        const end = format(endDate, 'yyyy-MM-dd');
        setAttendanceRecords(
          stored.filter((record) => record.employeeId === user.id && record.date >= start && record.date <= end),
        );
        return;
      }

      setAttendanceRecords(await listAttendanceRecords(startDate, endDate, undefined, user.name));
    } catch (error) {
      console.error('Fetch attendance error:', error);
      toast({
        title: 'Failed to fetch attendance records',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceByDate = useCallback(async (date: Date): Promise<AttendanceRecord[]> => {
    if (!user) return [];

    const dateStr = format(date, 'yyyy-MM-dd');

    if (isDemoSession()) {
      const source = readDemoData<AttendanceRecord[]>('attendance-records', []);
      setAttendanceRecords(source);
      const records = source.filter((record) => record.employeeId === user.id && record.date === dateStr);

      const today = new Date();
      const isToday = dateStr === format(today, 'yyyy-MM-dd');
      const currentHour = today.getHours();
      if (isToday && records.length === 0 && currentHour >= 12) {
        return [{
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
          isRegularized: false,
        }];
      }
      return records;
    }

    try {
      const records = await listAttendanceRecords(date, date, undefined, user.name);
      setAttendanceRecords((current) => {
        const others = current.filter((record) => record.date !== dateStr);
        return [...records, ...others];
      });
      return records;
    } catch (error) {
      console.error('Fetch attendance by date error:', error);
      toast({
        title: 'Failed to fetch attendance',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return [];
    }
  }, [user, setAttendanceRecords, toast]);

  const getAttendanceStatusForDate = (date: Date): AttendanceStatus | null => {
    if (!user) return null;
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = attendanceRecords.find((item) => item.date === dateStr);
    return record ? record.status : null;
  };

  const getAttendanceByEmployeeId = async (
    employeeId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AttendanceRecord[]> => {
    if (!user || !['admin', 'hr', 'manager'].includes(user.role)) {
      toast({
        title: 'Permission denied',
        description: "You don't have permission to view other employees' attendance",
        variant: 'destructive',
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
      return await listAttendanceRecords(startDate, endDate, employeeId);
    } catch (error) {
      console.error('Fetch attendance by employee error:', error);
      toast({
        title: 'Failed to fetch attendance records',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    fetchAttendanceRecords,
    fetchAttendanceByDate,
    getAttendanceStatusForDate,
    getAttendanceByEmployeeId,
  };
}
