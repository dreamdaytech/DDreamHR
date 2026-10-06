
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AttendanceRecord, BreakRecord } from '@/types/attendance';
import { useLocationCheck } from '@/hooks/useLocationCheck';
import { determineAttendanceStatus, calculateTotalHours } from '@/utils/attendanceUtils';
import { getClientIpAddress } from '@/utils/locationUtils';
import { isDemoSession, writeDemoData } from '@/lib/demoStore';
import { createAttendanceCheckIn, updateAttendanceCheckOut } from '@/services/tenantAttendance';

export function useCheckInOutService(
  user: any,
  attendanceSettings: any,
  todayAttendance: AttendanceRecord | null,
  setTodayAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord | null>>,
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>,
  isOnBreak: boolean,
  currentBreak: BreakRecord | null
) {
  const { toast } = useToast();
  const { validateLocation, getNearestLocationName } = useLocationCheck(attendanceSettings);
  
  // Check-in function - now accepts optional location parameter
  const checkIn = async (locationName?: string): Promise<boolean> => {
    console.log('checkIn called with locationName:', locationName);
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to check in",
        variant: "destructive",
      });
      return false;
    }
    
    if (todayAttendance?.checkIn) {
      toast({
        title: "Already checked in",
        description: "You are already checked in for today",
        variant: "destructive",
      });
      return false;
    }
    
    if (!locationName) {
      toast({
        title: "Location required",
        description: "Please select a valid location to check in",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const clientIp = isDemoSession() ? 'demo-session' : await getClientIpAddress();
      
      const status = determineAttendanceStatus(
        currentTime,
        attendanceSettings.workingHoursStart,
        attendanceSettings.graceTimeLate
      );

      const newAttendance: AttendanceRecord = isDemoSession()
        ? {
            id: `att-${Date.now()}`,
            employeeId: user.id,
            employeeName: user.name,
            date: format(now, 'yyyy-MM-dd'),
            checkIn: currentTime,
            checkOut: null,
            totalHours: null,
            status,
            location: locationName,
            ipAddress: clientIp,
            device: navigator.userAgent,
            notes: null,
            isRegularized: false,
          }
        : {
            ...(await createAttendanceCheckIn({
              locationName,
              status,
              ipAddress: clientIp,
              device: navigator.userAgent,
            })),
            employeeName: user.name,
          };

      setAttendanceRecords(prev => {
        const next = [...prev.filter((record) => record.id !== newAttendance.id), newAttendance];
        if (isDemoSession()) writeDemoData('attendance-records', next);
        return next;
      });
      setTodayAttendance(newAttendance);
      
      toast({
        title: "Checked in successfully",
        description: `Time: ${currentTime}, Location: ${locationName}`,
      });
      
      return true;
    } catch (error) {
      console.error('Check-in error:', error);
      toast({
        title: "Check-in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Check-out function
  const checkOut = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to check out",
        variant: "destructive",
      });
      return false;
    }
    
    if (!todayAttendance?.checkIn) {
      toast({
        title: "Not checked in",
        description: "You need to check in first",
        variant: "destructive",
      });
      return false;
    }
    
    if (isOnBreak) {
      toast({
        title: "Active break",
        description: "Please end your break before checking out",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // Validate location
      const locationValid = isDemoSession() ? true : await validateLocation(false);
      if (!locationValid) return false;
      
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      
      if (todayAttendance) {
        // Calculate total hours
        const checkInTime = todayAttendance.checkIn;
        let totalHours = null;
        
        if (checkInTime) {
          totalHours = calculateTotalHours(checkInTime, currentTime);
        }
        
        const updatedAttendance: AttendanceRecord = isDemoSession()
          ? {
              ...todayAttendance,
              checkOut: currentTime,
              totalHours,
            }
          : {
              ...(await updateAttendanceCheckOut(todayAttendance.id, {
                totalHours,
                locationName: (await getNearestLocationName()) || todayAttendance.location,
                ipAddress: await getClientIpAddress(),
                device: navigator.userAgent,
              })),
              employeeName: user.name,
            };

        setAttendanceRecords(prev => {
          const next = prev.map(record => record.id === todayAttendance.id ? updatedAttendance : record);
          if (isDemoSession()) writeDemoData('attendance-records', next);
          return next;
        });
        setTodayAttendance(updatedAttendance);
        
        toast({
          title: "Checked out successfully",
          description: `Time: ${currentTime}, Total hours: ${totalHours} hrs`,
        });
        
        return true;
      } else {
        toast({
          title: "No active attendance record",
          description: "Cannot check out without an active record",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Check-out error:', error);
      toast({
        title: "Check-out failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    checkIn,
    checkOut
  };
}
