import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportExportOptions } from '../ReportExportOptions';
import { format, parseISO, eachDayOfInterval, isWeekend } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { generateMockAttendanceForMultipleEmployees, generateAttendanceCalendarData } from '@/utils/attendance';

interface EmployeeMonthlyReportProps {
  startDate: Date;
  endDate: Date;
  department: string;
  location: string;
  employee: string;
  userRole?: string;
}

interface CalendarDay {
  date: string;
  dayOfWeek: string;
  dayOfMonth: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
}

export const EmployeeMonthlyReport: React.FC<EmployeeMonthlyReportProps> = ({
  startDate,
  endDate,
  department,
  location,
  employee,
}) => {
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [summary, setSummary] = useState({ present: 0, late: 0, absent: 0, remote: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock attendance data for the date range
        const employeeId = employee === 'all' ? '1' : employee;
        const records = generateMockAttendanceForMultipleEmployees(startDate, endDate, 5);
        
        // Generate calendar data
        const calendarData = generateAttendanceCalendarData(
          records,
          employeeId,
          startDate,
          endDate
        );
        
        setCalendarData(calendarData);
        
        // Set employee name
        if (records.length > 0) {
          const employeeRecord = records.find(r => r.employeeId === employeeId);
          if (employeeRecord) {
            setSelectedEmployeeName(employeeRecord.employeeName);
          } else {
            setSelectedEmployeeName(`Employee ${employeeId}`);
          }
        }
        
        // Calculate summary
        const present = calendarData.filter(d => d.status === 'Present').length;
        const late = calendarData.filter(d => d.status === 'Late').length;
        const absent = calendarData.filter(d => d.status === 'Absent').length;
        const remote = calendarData.filter(d => d.status === 'Remote').length;
        
        setSummary({
          present,
          late,
          absent,
          remote,
          total: calendarData.length
        });
      } catch (error) {
        console.error('Error fetching employee monthly data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, department, location, employee]);

  // Group days by week for calendar display
  const weeks = calendarData.reduce((acc, day, index) => {
    const weekIndex = Math.floor(index / 7);
    if (!acc[weekIndex]) acc[weekIndex] = [];
    acc[weekIndex].push(day);
    return acc;
  }, [] as CalendarDay[][]);

  // Function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Present</Badge>;
      case 'Late':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Late</Badge>;
      case 'Absent':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Absent</Badge>;
      case 'Remote':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Remote</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const exportData = calendarData.map(day => ({
    date: day.date,
    day: day.dayOfWeek,
    status: day.status,
    checkIn: day.checkIn || '',
    checkOut: day.checkOut || ''
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Employee Monthly Status</CardTitle>
          <CardDescription>
            Monthly attendance calendar for {selectedEmployeeName || 'Selected Employee'}
          </CardDescription>
        </div>
        <ReportExportOptions 
          reportTitle={`Monthly Attendance - ${selectedEmployeeName}`} 
          data={exportData}
        />
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-48"></div>
            <div className="h-80 bg-muted rounded"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                <div className="text-2xl font-bold text-green-700">{summary.present}</div>
                <div className="text-sm text-green-600">Present Days</div>
              </div>
              
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                <div className="text-2xl font-bold text-amber-700">{summary.late}</div>
                <div className="text-sm text-amber-600">Late Days</div>
              </div>
              
              <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                <div className="text-2xl font-bold text-red-700">{summary.absent}</div>
                <div className="text-sm text-red-600">Absent Days</div>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">{summary.remote}</div>
                <div className="text-sm text-blue-600">Remote Days</div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 bg-muted text-center font-medium py-2">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 border-t">
                  {week.map((day, dayIndex) => {
                    const dayDate = parseISO(day.date);
                    const isWeekendDay = isWeekend(dayDate);
                    
                    return (
                      <div 
                        key={dayIndex}
                        className={`p-2 min-h-[80px] border-r last:border-r-0 ${
                          isWeekendDay ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="font-medium text-sm">{day.dayOfMonth}</div>
                        <div className="mt-1">
                          {getStatusBadge(day.status)}
                        </div>
                        {day.checkIn && (
                          <div className="text-xs mt-1 text-gray-600">
                            In: {day.checkIn}
                          </div>
                        )}
                        {day.checkOut && (
                          <div className="text-xs mt-0.5 text-gray-600">
                            Out: {day.checkOut}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
