
import { AttendanceStatus } from '@/types/attendance';
import { format } from 'date-fns';

// Function to determine attendance status based on check-in time
export const determineAttendanceStatus = (
  checkInTime: string, 
  workingHoursStart: string,
  graceTimeLate: number
): AttendanceStatus => {
  const [hours, minutes] = checkInTime.split(':').map(Number);
  const [workHours, workMinutes] = workingHoursStart.split(':').map(Number);
  
  // Calculate minutes difference
  const checkInMinutes = hours * 60 + minutes;
  const workStartMinutes = workHours * 60 + workMinutes;
  
  if (checkInMinutes > workStartMinutes + graceTimeLate) {
    return 'Late';
  }
  
  return 'Present';
};

// Calculate total working hours between check-in and check-out times
export const calculateTotalHours = (checkInTime: string, checkOutTime: string): number => {
  const [checkInHours, checkInMinutes] = checkInTime.split(':').map(Number);
  const [checkOutHours, checkOutMinutes] = checkOutTime.split(':').map(Number);
  
  const checkInMinutesTotal = checkInHours * 60 + checkInMinutes;
  const checkOutMinutesTotal = checkOutHours * 60 + checkOutMinutes;
  
  const minutesDiff = checkOutMinutesTotal - checkInMinutesTotal;
  return Math.round((minutesDiff / 60) * 100) / 100; // Round to 2 decimal places
};

// Generate mock attendance data for a date range
export const generateMockAttendanceData = (
  startDate: Date,
  endDate: Date,
  employeeId: number,
  employeeName: string
) => {
  const mockData = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const isWeekend = [0, 6].includes(currentDate.getDay()); // 0 = Sunday, 6 = Saturday
    
    if (!isWeekend) {
      const randomStatus: AttendanceStatus = Math.random() > 0.2 ? 'Present' : 
                                            Math.random() > 0.5 ? 'Late' : 'Absent';
      
      const checkIn = randomStatus !== 'Absent' ? 
        `0${Math.floor(Math.random() * 2) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 
        null;
        
      const checkOut = checkIn ? 
        `${Math.floor(Math.random() * 2) + 17}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 
        null;
        
      const totalHours = checkIn && checkOut ? 
        Math.round((9 - Math.random()) * 100) / 100 : 
        null;
      
      mockData.push({
        id: `att-mock-${employeeId}-${dateStr}`,
        employeeId,
        employeeName,
        date: dateStr,
        checkIn,
        checkOut,
        totalHours,
        status: randomStatus,
        location: 'Main Office',
        ipAddress: '192.168.1.1',
        device: navigator.userAgent,
        notes: null,
        isRegularized: false
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return mockData;
};
