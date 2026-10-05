
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportExportOptions } from '../ReportExportOptions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getDeviationData, DeviationRecord } from '@/utils/attendance';
import { supabase } from '@/integrations/supabase/client';
import { AttendanceRecord, AttendanceStatus } from '@/types/attendance';

interface CheckInDeviationReportProps {
  startDate: Date;
  endDate: Date;
  department: string;
  location: string;
  employee: string;
  userRole?: string;
}

export const CheckInDeviationReport: React.FC<CheckInDeviationReportProps> = ({
  startDate,
  endDate,
  department,
  location,
  employee,
}) => {
  const { data: deviationData, isLoading } = useQuery({
    queryKey: ['checkInDeviationReport', startDate, endDate, employee],
    queryFn: async () => {
      let attendanceQuery = supabase
        .from('attendance_records')
        .select('*')
        .gte('check_in', startDate.toISOString())
        .lte('check_in', endDate.toISOString());

      if (employee !== 'all') {
        attendanceQuery = attendanceQuery.eq('employee_id', employee);
      }
      
      const { data: records, error: recordsError } = await attendanceQuery;
      if (recordsError) throw recordsError;
      if (!records) return [];

      const userIds = [...new Set(records.map(r => r.employee_id))];
      if (userIds.length === 0) return [];

      const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', userIds);
      if (profilesError) throw profilesError;

      const profilesMap = new Map(profiles.map(p => [p.user_id, `${p.first_name || ''} ${p.last_name || ''}`.trim()]));

      const formattedRecords: AttendanceRecord[] = records.map(r => ({
          id: r.id,
          employeeId: r.employee_id,
          employeeName: profilesMap.get(r.employee_id) || `Employee ${r.employee_id}`,
          date: new Date(r.check_in!).toISOString().split('T')[0],
          checkIn: r.check_in,
          checkOut: r.check_out,
          totalHours: r.total_hours,
          status: r.status as AttendanceStatus,
          location: '',
          ipAddress: null,
          device: null,
          notes: null,
          isRegularized: false
      }));

      const workingHoursStart = '09:00';
      const workingHoursEnd = '17:00';
      return getDeviationData(formattedRecords, workingHoursStart, workingHoursEnd);
    },
    initialData: [],
    enabled: !!startDate && !!endDate,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Check-In/Out Deviation Report</CardTitle>
          <CardDescription>
            Employees who arrived early or late compared to scheduled times
          </CardDescription>
        </div>
        <ReportExportOptions 
          reportTitle="Check-In Deviation Report" 
          data={deviationData}
        />
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-48"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        ) : deviationData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No deviation data found for the selected criteria
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Scheduled Time</TableHead>
                <TableHead>Actual Time</TableHead>
                <TableHead>Deviation</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deviationData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{record.employeeName}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.scheduledTime}</TableCell>
                  <TableCell>{record.actualTime}</TableCell>
                  <TableCell>{record.deviationMinutes} mins</TableCell>
                  <TableCell>
                    {record.isEarly ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                        Early
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">
                        Late
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p><strong>Note:</strong> Only showing deviations greater than 5 minutes</p>
          <p>Scheduled working hours: 09:00 AM to 05:00 PM</p>
        </div>
      </CardContent>
    </Card>
  );
};
