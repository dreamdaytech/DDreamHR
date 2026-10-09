import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportExportOptions } from '../ReportExportOptions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Colors } from '@/lib/chart-colors';
import { Badge } from '@/components/ui/badge';
import {
  calculateHoursBreakdown,
  generateMockAttendanceForMultipleEmployees
} from '@/utils/attendance';

interface OvertimeReportProps {
  startDate: Date;
  endDate: Date;
  department: string;
  location: string;
  employee: string;
  userRole?: string;
}

interface OvertimeData {
  employeeId: string;
  employeeName: string;
  date: string;
  overtimeHours: number;
  startTime: string;
  endTime: string;
  approvalStatus: 'Approved' | 'Pending' | 'Rejected';
}

export const OvertimeReport: React.FC<OvertimeReportProps> = ({
  startDate,
  endDate,
  department,
  location,
  employee,
  userRole
}) => {
  const [overtimeData, setOvertimeData] = useState<OvertimeData[]>([]);
  const [aggregatedData, setAggregatedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'hr' && userRole !== 'manager') return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock attendance data for the date range
        const records = generateMockAttendanceForMultipleEmployees(startDate, endDate, 5);
        
        // Filter by employee if needed
        let filteredRecords = records;
        if (employee !== 'all') {
          filteredRecords = filteredRecords.filter(r => r.employeeId === employee);
        }
        
        // Calculate hours breakdown to get overtime
        const hoursBreakdown = calculateHoursBreakdown(filteredRecords);
        
        // Filter only records with overtime
        const overtimeRecords = hoursBreakdown.filter(record => record.overtimeHours > 0);
        
        // Convert to overtime data format
        const overtime: OvertimeData[] = overtimeRecords.map(record => {
          // Calculate start and end times based on check-in and overtime
          const attendanceRecord = filteredRecords.find(r => 
            r.employeeId === record.employeeId && r.date === record.date
          )!;
          
          const [startHour, startMin] = (attendanceRecord?.checkIn || '09:00').split(':').map(Number);
          const regularEndHour = startHour + 8;
          const regularEndMin = startMin;
          
          const overtimeStart = `${regularEndHour.toString().padStart(2, '0')}:${regularEndMin.toString().padStart(2, '0')}`;
          
          // Generate a random approval status but ensure it's one of the valid types
          const randomValue = Math.random();
          let approvalStatus: 'Approved' | 'Pending' | 'Rejected';
          if (randomValue > 0.3) {
            approvalStatus = 'Approved';
          } else if (randomValue > 0.5) {
            approvalStatus = 'Pending';
          } else {
            approvalStatus = 'Rejected';
          }
          
          return {
            employeeId: record.employeeId,
            employeeName: record.employeeName,
            date: record.date,
            overtimeHours: record.overtimeHours,
            startTime: overtimeStart,
            endTime: attendanceRecord?.checkOut || '17:00',
            approvalStatus
          };
        });
        
        setOvertimeData(overtime);
        
        // Aggregate by employee for chart display
        const employeeMap = new Map<string, { 
          employeeId: string;
          employeeName: string;
          totalOvertimeHours: number;
          approvedHours: number;
          pendingHours: number;
        }>();
        
        overtime.forEach(record => {
          if (!employeeMap.has(record.employeeId)) {
            employeeMap.set(record.employeeId, {
              employeeId: record.employeeId,
              employeeName: record.employeeName,
              totalOvertimeHours: 0,
              approvedHours: 0,
              pendingHours: 0
            });
          }
          
          const empData = employeeMap.get(record.employeeId)!;
          empData.totalOvertimeHours += record.overtimeHours;
          
          if (record.approvalStatus === 'Approved') {
            empData.approvedHours += record.overtimeHours;
          } else if (record.approvalStatus === 'Pending') {
            empData.pendingHours += record.overtimeHours;
          }
        });
        
        setAggregatedData(Array.from(employeeMap.values()));
      } catch (error) {
        console.error('Error fetching overtime data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, department, location, employee]);

  // Check if user has proper access
  if (userRole !== 'admin' && userRole !== 'hr' && userRole !== 'manager') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Overtime Report</CardTitle>
          <CardDescription>Access denied</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            You don't have permission to access overtime data.
          </div>
        </CardContent>
      </Card>
    );
  }



  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Overtime Details</CardTitle>
          <CardDescription>
            Overtime hours worked by employees from {format(startDate, 'MMM dd, yyyy')} to {format(endDate, 'MMM dd, yyyy')}
          </CardDescription>
        </div>
        <ReportExportOptions 
          reportTitle="Overtime Report" 
          data={overtimeData}
        />
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-48"></div>
            <div className="h-80 bg-muted rounded"></div>
          </div>
        ) : overtimeData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No overtime data available for the selected criteria
          </div>
        ) : (
          <>
            <div className="mb-8">
              <ChartContainer config={{ approvedHours: {}, pendingHours: {} }} className="h-80">
                <BarChart
                  data={aggregatedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="employeeName" />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload }) => (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                        formatter={(value, name) => (
                          <div className="flex justify-between gap-2">
                            <span className="font-medium">
                              {name === 'approvedHours' ? 'Approved Hours' : 'Pending Hours'}:
                            </span>
                            <span>{value} hours</span>
                          </div>
                        )}
                      />
                    )}
                  />
                  <Legend />
                  <Bar 
                    dataKey="approvedHours" 
                    name="Approved Hours" 
                    fill={Colors.success.theme.light} 
                  />
                  <Bar 
                    dataKey="pendingHours" 
                    name="Pending Hours" 
                    fill={Colors.warning.theme.light} 
                  />
                </BarChart>
              </ChartContainer>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead className="text-right">Overtime Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overtimeData.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.startTime}</TableCell>
                      <TableCell>{record.endTime}</TableCell>
                      <TableCell className="text-right">{record.overtimeHours.toFixed(2)}</TableCell>
                      <TableCell>
                        {record.approvalStatus === 'Approved' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Approved
                          </Badge>
                        ) : record.approvalStatus === 'Pending' ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Pending
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Rejected
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              <p><strong>Note:</strong> Overtime is calculated as hours worked beyond the standard 8-hour workday.</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
