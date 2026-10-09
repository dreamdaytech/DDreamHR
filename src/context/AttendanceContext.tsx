
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { 
  AttendanceRecord,
  BreakRecord, 
  RegularizationRequest, 
  AttendanceSettings,
  AttendanceStatus
} from '@/types/attendance';
import { format } from 'date-fns';
import { useCheckInOutService } from './attendance/checkInOutService';
import { useBreakService } from './attendance/breakService';
import { useRegularizationService } from './attendance/regularizationService';
import { useAttendanceFetchService } from './attendance/attendanceFetchService';
import { isDemoSession, readDemoData } from '@/lib/demoStore';
import { listAttendanceBreaks, listRegularizationRequests, loadAttendanceSettings } from '@/services/tenantAttendance';

// Mock data for development
const MOCK_ATTENDANCE_SETTINGS: AttendanceSettings = {
  workingHoursStart: '09:00',
  workingHoursEnd: '17:00',
  graceTimeLate: 15, // 15 minutes grace period for being late
  graceTimeEarly: 15, // 15 minutes grace period for leaving early
  allowedIpAddresses: ['192.168.1.*', '10.0.0.*'],
  geoFencingEnabled: true,
  geoFencingRadius: 100,
  geoFencingLocations: [
    { lat: 40.7128, lng: -74.006, name: 'Main Office' },
    { lat: 37.7749, lng: -122.4194, name: 'Branch Office' }
  ],
  biometricRequired: false,
  facialRecognitionRequired: false
};

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  todayAttendance: AttendanceRecord | null;
  breakRecords: BreakRecord[];
  regularizationRequests: RegularizationRequest[];
  attendanceSettings: AttendanceSettings;
  isLoading: boolean;
  checkIn: (locationName?: string) => Promise<boolean>;
  checkOut: () => Promise<boolean>;
  startBreak: (type: BreakRecord['type'], isPaid: boolean) => Promise<boolean>;
  endBreak: (breakId: string) => Promise<boolean>;
  submitRegularizationRequest: (request: Omit<RegularizationRequest, 'id' | 'employeeId' | 'employeeName' | 'status' | 'requestedAt' | 'approvedBy' | 'approvedAt'>) => Promise<boolean>;
  approveRegularizationRequest: (requestId: string) => Promise<boolean>;
  rejectRegularizationRequest: (requestId: string) => Promise<boolean>;
  fetchAttendanceRecords: (startDate: Date, endDate: Date) => Promise<void>;
  fetchAttendanceByDate: (date: Date) => Promise<AttendanceRecord[]>;
  getAttendanceStatusForDate: (date: Date) => AttendanceStatus | null;
  getAttendanceByEmployeeId: (employeeId: string, startDate: Date, endDate: Date) => Promise<AttendanceRecord[]>;
  isCheckedIn: boolean;
  isOnBreak: boolean;
  currentBreak: BreakRecord | null;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [breakRecords, setBreakRecords] = useState<BreakRecord[]>([]);
  const [regularizationRequests, setRegularizationRequests] = useState<RegularizationRequest[]>([]);
  const [attendanceSettings, setAttendanceSettings] = useState<AttendanceSettings>(MOCK_ATTENDANCE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [currentBreak, setCurrentBreak] = useState<BreakRecord | null>(null);
  
  const { user } = useAuth();
  
  // Check if user is checked in
  const isCheckedIn = !!todayAttendance?.checkIn && !todayAttendance?.checkOut;
  
  // Check if user is on break
  const isOnBreak = !!currentBreak && !currentBreak.endTime;

  // Initialize services
  const { checkIn, checkOut } = useCheckInOutService(
    user,
    attendanceSettings,
    todayAttendance,
    setTodayAttendance,
    setAttendanceRecords,
    isOnBreak,
    currentBreak
  );

  const { startBreak, endBreak } = useBreakService(
    user,
    todayAttendance,
    isCheckedIn,
    isOnBreak,
    currentBreak,
    setBreakRecords,
    setCurrentBreak
  );

  const { 
    submitRegularizationRequest, 
    approveRegularizationRequest, 
    rejectRegularizationRequest 
  } = useRegularizationService(
    user,
    attendanceSettings,
    attendanceRecords,
    regularizationRequests,
    setRegularizationRequests,
    setAttendanceRecords,
    setTodayAttendance,
    todayAttendance
  );

  const { 
    fetchAttendanceRecords,
    fetchAttendanceByDate,
    getAttendanceStatusForDate,
    getAttendanceByEmployeeId
  } = useAttendanceFetchService(
    user,
    attendanceRecords,
    setAttendanceRecords,
    setIsLoading
  );

  // Fetch tenant-backed attendance data on load.
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const initializeAttendance = async () => {
      setIsLoading(true);
      try {
        if (isDemoSession()) {
          const storedBreaks = readDemoData<BreakRecord[]>('attendance-breaks', []);
          setBreakRecords(storedBreaks);
          setRegularizationRequests(readDemoData<RegularizationRequest[]>('attendance-regularization', []));

          const records = await fetchAttendanceByDate(new Date());
          if (cancelled) return;
          const todayRecord = records[0] || null;
          setTodayAttendance(todayRecord);
          setCurrentBreak(
            todayRecord
              ? storedBreaks.find((item) => item.attendanceId === todayRecord.id && !item.endTime) || null
              : null,
          );
          return;
        }

        const [settings, requests] = await Promise.all([
          loadAttendanceSettings(),
          listRegularizationRequests(),
        ]);

        if (cancelled) return;
        if (settings) setAttendanceSettings(settings);
        setRegularizationRequests(requests);

        const records = await fetchAttendanceByDate(new Date());
        if (cancelled) return;
        const todayRecord = records[0] || null;
        setTodayAttendance(todayRecord);

        if (todayRecord) {
          const breaks = await listAttendanceBreaks(todayRecord.id);
          if (cancelled) return;
          setBreakRecords(breaks);
          setCurrentBreak(breaks.find((item) => !item.endTime) || null);
        } else {
          setBreakRecords([]);
          setCurrentBreak(null);
        }
      } catch (error) {
        console.error('Failed to initialize attendance', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void initializeAttendance();
    return () => {
      cancelled = true;
    };
  }, [user, fetchAttendanceByDate]);

  const value = {
    attendanceRecords,
    todayAttendance,
    breakRecords,
    regularizationRequests,
    attendanceSettings,
    isLoading,
    checkIn,
    checkOut,
    startBreak,
    endBreak,
    submitRegularizationRequest,
    approveRegularizationRequest,
    rejectRegularizationRequest,
    fetchAttendanceRecords,
    fetchAttendanceByDate,
    getAttendanceStatusForDate,
    getAttendanceByEmployeeId,
    isCheckedIn,
    isOnBreak,
    currentBreak
  };

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};
