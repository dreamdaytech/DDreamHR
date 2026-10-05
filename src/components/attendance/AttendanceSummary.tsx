
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { format, subDays, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';

interface AttendanceSummaryProps {
  view?: 'daily' | 'weekly' | 'monthly';
  userRole?: 'admin' | 'hr' | 'manager' | 'employee';
}

export const AttendanceSummary = ({ 
  view = 'weekly',
  userRole = 'employee' 
}: AttendanceSummaryProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'daily' | 'weekly' | 'monthly'>(view);
  
  const isAdminView = userRole === 'admin' || userRole === 'hr';
  
  // Sample data for demonstration
  const dailyAttendance = {
    date: format(currentDate, 'yyyy-MM-dd'),
    checkIn: '09:00 AM',
    checkOut: '05:30 PM',
    breakTime: '01:00 PM - 02:00 PM',
    totalHours: 7.5,
    status: 'Present',
    location: 'Main Office'
  };
  
  // Generate weekly data
  const generateWeeklyData = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday
    
    const weeklyData = [];
    let currentDay = startDate;
    
    while (currentDay <= endDate) {
      // Skip weekends
      if (![0, 6].includes(currentDay.getDay())) { // 0 = Sunday, 6 = Saturday
        const isRandom = Math.random();
        
        weeklyData.push({
          date: format(currentDay, 'yyyy-MM-dd'),
          day: format(currentDay, 'EEEE'),
          checkIn: isRandom > 0.1 ? `0${8 + Math.floor(isRandom * 2)}:${Math.floor(isRandom * 60).toString().padStart(2, '0')} AM` : '-',
          checkOut: isRandom > 0.1 ? `0${5 + Math.floor(isRandom)}:${Math.floor(isRandom * 60).toString().padStart(2, '0')} PM` : '-',
          totalHours: isRandom > 0.1 ? (8 + isRandom).toFixed(1) : '-',
          status: isRandom > 0.9 ? 'Present' : isRandom > 0.8 ? 'Late' : isRandom > 0.1 ? 'Remote' : 'Absent',
          location: isRandom > 0.8 ? 'Main Office' : isRandom > 0.1 ? 'Remote' : '-'
        });
      }
      
      currentDay = addDays(currentDay, 1);
    }
    
    return weeklyData;
  };
  
  const weeklyData = generateWeeklyData();
  
  // Generate employee data for admin view
  const generateEmployeeData = () => {
    return [
      { id: 1, name: 'John Smith', department: 'Engineering', present: 5, late: 0, absent: 0 },
      { id: 2, name: 'Maria Garcia', department: 'Marketing', present: 4, late: 1, absent: 0 },
      { id: 3, name: 'Robert Johnson', department: 'Finance', present: 3, late: 1, absent: 1 },
      { id: 4, name: 'Sarah Williams', department: 'HR', present: 5, late: 0, absent: 0 },
      { id: 5, name: 'Michael Brown', department: 'Engineering', present: 4, late: 0, absent: 1 },
    ];
  };
  
  const employeeData = generateEmployeeData();
  
  // Navigation functions
  const navigatePrevious = () => {
    if (selectedView === 'daily') {
      setCurrentDate(subDays(currentDate, 1));
    } else if (selectedView === 'weekly') {
      setCurrentDate(subDays(currentDate, 7));
    } else {
      // Monthly view - go back one month
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };
  
  const navigateNext = () => {
    if (selectedView === 'daily') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (selectedView === 'weekly') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      // Monthly view - go forward one month
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };
  
  // Display range text based on view
  const getDisplayRange = () => {
    if (selectedView === 'daily') {
      return format(currentDate, 'MMMM d, yyyy');
    } else if (selectedView === 'weekly') {
      const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>;
      case 'Late':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>;
      case 'Absent':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>;
      case 'Remote':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Attendance Summary</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={selectedView} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSelectedView(value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">{getDisplayRange()}</div>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {selectedView === 'daily' && (
          <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-500">Date</div>
                <div className="font-medium">{format(new Date(dailyAttendance.date), 'MMMM d, yyyy')}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Status</div>
                <div>{getStatusBadge(dailyAttendance.status)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Check In</div>
                <div className="font-medium">{dailyAttendance.checkIn}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Check Out</div>
                <div className="font-medium">{dailyAttendance.checkOut}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Break Time</div>
                <div className="font-medium">{dailyAttendance.breakTime}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Total Hours</div>
                <div className="font-medium">{dailyAttendance.totalHours} hrs</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-slate-500">Location</div>
                <div className="font-medium">{dailyAttendance.location}</div>
              </div>
            </div>
          </div>
        )}
        
        {selectedView === 'weekly' && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyData.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{format(new Date(record.date), 'EEE, MMM d')}</div>
                    </TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.totalHours}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {selectedView === 'monthly' && (
          <div className="space-y-6">
            {isAdminView ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Late</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeData.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="font-medium">{employee.name}</div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.present}</TableCell>
                        <TableCell>{employee.late}</TableCell>
                        <TableCell>{employee.absent}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                Monthly detailed view will be available in the next update
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
