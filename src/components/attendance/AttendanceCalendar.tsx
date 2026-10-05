
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAttendance } from '@/context/AttendanceContext';
import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';

export const AttendanceCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { getAttendanceStatusForDate } = useAttendance();
  
  const getStatusColor = (date: Date) => {
    const status = getAttendanceStatusForDate(date);
    
    if (!status) return {};
    
    switch (status) {
      case 'Present':
        return { bg: 'bg-green-500' };
      case 'Late':
        return { bg: 'bg-yellow-500' };
      case 'Absent':
        return { bg: 'bg-red-500' };
      case 'Remote':
        return { bg: 'bg-blue-500' };
      default:
        return {};
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Attendance Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
            components={{
              DayContent: (props) => {
                const statusColor = getStatusColor(props.date);
                
                return (
                  <div className="relative flex h-8 w-8 items-center justify-center p-0">
                    <div className="absolute z-[1]">{props.date.getDate()}</div>
                    {Object.keys(statusColor).length > 0 && (
                      <div className={cn(
                        "absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full", 
                        statusColor.bg
                      )} />
                    )}
                  </div>
                )
              }
            }}
          />
        </div>
        
        <div className="flex justify-center space-x-4 mt-4">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs">Present</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-xs">Late</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs">Absent</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-xs">Remote</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
