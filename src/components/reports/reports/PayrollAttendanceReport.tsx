import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportExportOptions } from '../ReportExportOptions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, differenceInCalendarDays } from 'date-fns';
import {
  calculatePayrollData,
  PayrollRecord,
  generateMockAttendanceForMultipleEmployees
} from '@/utils/attendance';

interface PayrollAttendanceReportProps {
  startDate: Date;
  endDate: Date;
  department: string;
  location: string;
  employee: string;
  userRole?: string;
}

export const PayrollAttendanceReport: React.FC<PayrollAttendanceReportProps> = ({
  startDate,
  endDate,
  department,
  location,
  employee,
  userRole
}) => {
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'hr') return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock attendance data for the date range
        const records = generateMockAttendanceForMultipleEmployees(startDate, endDate, 10);
        
        // Filter by employee if needed
        let filteredRecords = records;
        if (employee !== 'all') {
          filteredRecords = filteredRecords.filter(r => r.employeeId === employee);
        }
        
        // Calculate payroll data
        const payrollRecords = calculatePayrollData(filteredRecords, startDate, endDate);
        setPayrollData(payrollRecords);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, department, location, employee, userRole]);

  // Check if user has proper access
  if (userRole !== 'admin' && userRole !== 'hr') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payroll Attendance Report</CardTitle>
          <CardDescription>Access denied</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            You don't have permission to access payroll data.
          </div>
        </CardContent>
      </Card>
    );
  }



  // Calculate total days in date range including weekends
  const totalDaysInPeriod = differenceInCalendarDays(endDate, startDate) + 1;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Payroll Attendance Report</CardTitle>
          <CardDescription>
            Attendance data formatted for payroll processing from {format(startDate, 'MMM dd, yyyy')} to {format(endDate, 'MMM dd, yyyy')}
          </CardDescription>
        </div>
        <ReportExportOptions 
          reportTitle="Payroll Attendance Report" 
          data={payrollData}
        />
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-48"></div>
            <div className="h-80 bg-muted rounded"></div>
          </div>
        ) : payrollData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No payroll data available for the selected criteria
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead className="text-right">Payable Days</TableHead>
                  <TableHead className="text-right">Working Days</TableHead>
                  <TableHead className="text-right">Paid Leave</TableHead>
                  <TableHead className="text-right">Unpaid Leave</TableHead>
                  <TableHead className="text-right">Total Hours</TableHead>
                  <TableHead className="text-right">Overtime Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.map((record) => (
                  <TableRow key={record.employeeId}>
                    <TableCell>{record.employeeId}</TableCell>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell className="text-right">{record.payableDays}</TableCell>
                    <TableCell className="text-right">{record.workingDays}</TableCell>
                    <TableCell className="text-right">{record.paidLeave}</TableCell>
                    <TableCell className="text-right">{record.unpaidLeave}</TableCell>
                    <TableCell className="text-right">{record.totalWorkingHours.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{record.overtimeHours.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p><strong>Period Summary:</strong> {totalDaysInPeriod} total days in selected period</p>
          <p><strong>Note:</strong> Payable days include present days and paid leave. Overtime is calculated for hours worked beyond 8 hours per day.</p>
        </div>
      </CardContent>
    </Card>
  );
};
