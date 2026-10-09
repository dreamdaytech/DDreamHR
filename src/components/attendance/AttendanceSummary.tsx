
import { useEffect, useState } from 'react';
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
import { format, subDays, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { listAttendanceRecords, listTenantAttendanceRecords } from '@/services/tenantAttendance';
import type { AttendanceRecord } from '@/types/attendance';

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
  
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [tenantRecords, setTenantRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const startDate = selectedView === 'daily'
      ? currentDate
      : selectedView === 'weekly'
        ? startOfWeek(currentDate, { weekStartsOn: 1 })
        : startOfMonth(currentDate);
    const endDate = selectedView === 'daily'
      ? currentDate
      : selectedView === 'weekly'
        ? endOfWeek(currentDate, { weekStartsOn: 1 })
        : endOfMonth(currentDate);

    const loadRecords = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [ownRecords, organizationRecords] = await Promise.all([
          listAttendanceRecords(startDate, endDate),
          isAdminView && selectedView === 'monthly'
            ? listTenantAttendanceRecords(startDate, endDate)
            : Promise.resolve([]),
        ]);
        if (!cancelled) {
          setAttendanceRecords(ownRecords);
          setTenantRecords(organizationRecords);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load attendance records.');
          setAttendanceRecords([]);
          setTenantRecords([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadRecords();
    return () => {
      cancelled = true;
    };
  }, [currentDate, selectedView, isAdminView]);

  const dailyRecord = attendanceRecords.find(
    (record) => record.date === format(currentDate, 'yyyy-MM-dd'),
  );
  const dailyAttendance = dailyRecord ? {
    date: dailyRecord.date,
    checkIn: dailyRecord.checkIn || '—',
    checkOut: dailyRecord.checkOut || '—',
    breakTime: '—',
    totalHours: dailyRecord.totalHours === null ? '—' : dailyRecord.totalHours.toFixed(1),
    status: dailyRecord.status,
    location: dailyRecord.location || '—',
  } : null;

  const weeklyData = attendanceRecords.map((record) => ({
    date: record.date,
    checkIn: record.checkIn || '—',
    checkOut: record.checkOut || '—',
    totalHours: record.totalHours === null ? '—' : record.totalHours.toFixed(1),
    status: record.status,
    location: record.location || '—',
  }));

  const employeeSummary = new Map<string, {
    id: string;
    name: string;
    department: string;
    present: number;
    late: number;
    absent: number;
  }>();
  tenantRecords.forEach((record) => {
    const employee = employeeSummary.get(record.employeeId) || {
      id: record.employeeId,
      name: record.employeeName,
      department: '—',
      present: 0,
      late: 0,
      absent: 0,
    };
    if (record.status === 'Present' || record.status === 'Remote') employee.present += 1;
    if (record.status === 'Late') employee.late += 1;
    if (record.status === 'Absent') employee.absent += 1;
    employeeSummary.set(record.employeeId, employee);
  });
  const employeeData = Array.from(employeeSummary.values());

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
        
        {isLoading && <div className="py-4 text-center text-muted-foreground">Loading attendance records…</div>}
        {loadError && <div role="alert" className="py-3 text-sm text-destructive">{loadError}</div>}

        {selectedView === 'daily' && (
          dailyAttendance ? (
            <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500">Date</div>
                  <div className="font-medium">{format(new Date(`${dailyAttendance.date}T00:00:00`), 'MMMM d, yyyy')}</div>
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
                  <div className="font-medium">{dailyAttendance.totalHours} {dailyAttendance.totalHours === '—' ? '' : 'hrs'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-slate-500">Location</div>
                  <div className="font-medium">{dailyAttendance.location}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">No attendance record exists for this date.</div>
          )
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
                {weeklyData.length ? weeklyData.map((record) => (
                  <TableRow key={record.date}>
                    <TableCell>
                      <div className="font-medium">{format(new Date(`${record.date}T00:00:00`), 'EEE, MMM d')}</div>
                    </TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.totalHours}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.location}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No attendance records exist for this period.
                    </TableCell>
                  </TableRow>
                )}
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
                    {employeeData.length ? employeeData.map((employee) => (
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
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                          No attendance records exist for this period.
                        </TableCell>
                      </TableRow>
                    )}
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
