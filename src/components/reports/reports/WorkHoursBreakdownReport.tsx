
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportExportOptions } from '../ReportExportOptions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Colors } from '@/lib/chart-colors';
import {
  calculateHoursBreakdown,
  HoursBreakdown,
  generateMockAttendanceForMultipleEmployees
} from '@/utils/attendance';

interface WorkHoursBreakdownReportProps {
  startDate: Date;
  endDate: Date;
  department: string;
  location: string;
  employee: string;
  userRole?: string;
}

export const WorkHoursBreakdownReport: React.FC<WorkHoursBreakdownReportProps> = ({
  startDate,
  endDate,
  department,
  location,
  employee,
}) => {
  const [hoursData, setHoursData] = useState<HoursBreakdown[]>([]);
  const [aggregatedData, setAggregatedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        
        // Calculate hours breakdown
        const hoursBreakdown = calculateHoursBreakdown(filteredRecords);
        setHoursData(hoursBreakdown);
        
        // Aggregate by employee for chart display
        const employeeMap = new Map<string, { 
          employeeId: string;
          employeeName: string;
          regularHours: number;
          overtimeHours: number;
          totalHours: number;
        }>();
        
        hoursBreakdown.forEach(record => {
          if (!employeeMap.has(record.employeeId)) {
            employeeMap.set(record.employeeId, {
              employeeId: record.employeeId,
              employeeName: record.employeeName,
              regularHours: 0,
              overtimeHours: 0,
              totalHours: 0
            });
          }
          
          const empData = employeeMap.get(record.employeeId)!;
          empData.regularHours += record.regularHours;
          empData.overtimeHours += record.overtimeHours;
          empData.totalHours += record.totalHours;
        });
        
        setAggregatedData(Array.from(employeeMap.values()));
      } catch (error) {
        console.error('Error fetching hours breakdown data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, department, location, employee]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Working Hours Breakdown</CardTitle>
          <CardDescription>
            Analysis of regular and overtime hours for selected period
          </CardDescription>
        </div>
        <ReportExportOptions 
          reportTitle="Working Hours Breakdown" 
          data={hoursData}
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
            <div className="mb-8">
              <ChartContainer config={{ regularHours: {}, overtimeHours: {} }} className="h-80">
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
                              {name === 'regularHours' ? 'Regular Hours' : 'Overtime Hours'}:
                            </span>
                            <span>{value} hours</span>
                          </div>
                        )}
                      />
                    )}
                  />
                  <Legend />
                  <Bar 
                    dataKey="regularHours" 
                    name="Regular Hours" 
                    stackId="a" 
                    fill={Colors.primary.theme.light} 
                  />
                  <Bar 
                    dataKey="overtimeHours" 
                    name="Overtime Hours" 
                    stackId="a" 
                    fill={Colors.secondary.theme.light} 
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
                    <TableHead className="text-right">Regular Hours</TableHead>
                    <TableHead className="text-right">Overtime Hours</TableHead>
                    <TableHead className="text-right">Total Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hoursData.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell className="text-right">{record.regularHours.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{record.overtimeHours.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">{record.totalHours.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              <p><strong>Note:</strong> Regular hours capped at 8 hours per day, anything above is counted as overtime.</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
