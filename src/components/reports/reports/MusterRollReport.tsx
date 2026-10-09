import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportExportOptions } from '../ReportExportOptions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, eachDayOfInterval, isWeekend } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { generateMockAttendanceForMultipleEmployees } from '@/utils/attendance';

interface MusterRollReportProps {
  startDate: Date;
  endDate: Date;
  department: string;
  location: string;
  employee: string;
  userRole?: string;
}

interface MusterRecord {
  employeeId: string;
  employeeName: string;
  records: Array<{
    date: string;
    status: string;
    checkIn: string | null;
    checkOut: string | null;
  }>;
}

export const MusterRollReport: React.FC<MusterRollReportProps> = ({
  startDate,
  endDate,
  department,
  location,
  employee,
  userRole
}) => {
  const [musterData, setMusterData] = useState<MusterRecord[]>([]);
  const [dateRange, setDateRange] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'hr') return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate date range for columns
        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const formattedDays = days.map(day => format(day, 'yyyy-MM-dd'));
        setDateRange(formattedDays);
        
        // Generate mock attendance data for the date range
        const employeeCount = 5;
        const records = generateMockAttendanceForMultipleEmployees(startDate, endDate, employeeCount);
        
        // Filter by employee if needed
        let filteredRecords = records;
        if (employee !== 'all') {
          filteredRecords = filteredRecords.filter(r => r.employeeId === employee);
        }
        
        // Organize data by employee
        const employeeMap = new Map<string, MusterRecord>();
        
        const allEmployeeIds = Array.from({ length: employeeCount }, (_, i) => String(i + 1));
        const employeeIdsToDisplay = employee === 'all' ? allEmployeeIds : [employee];

        employeeIdsToDisplay.forEach(empId => {
            employeeMap.set(empId, {
                employeeId: empId,
                employeeName: `Employee ${empId}`, // Placeholder name
                records: formattedDays.map(date => ({
                    date,
                    status: 'Absent', // Default status
                    checkIn: null,
                    checkOut: null
                }))
            });
        });
        
        // Fill in actual data
        filteredRecords.forEach(record => {
          if (!employeeMap.has(record.employeeId)) {
            return;
          }
          
          const empMuster = employeeMap.get(record.employeeId)!;
          const dayIndex = empMuster.records.findIndex(day => day.date === record.date);
          
          if (dayIndex !== -1) {
            empMuster.records[dayIndex] = {
              date: record.date,
              status: record.status,
              checkIn: record.checkIn,
              checkOut: record.checkOut
            };
            
            // Also update employee name in case it's real data
            empMuster.employeeName = record.employeeName;
          }
        });
        
        setMusterData(Array.from(employeeMap.values()));
      } catch (error) {
        console.error('Error fetching muster roll data:', error);
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
          <CardTitle>Muster Roll Report</CardTitle>
          <CardDescription>Access denied</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            You don't have permission to access muster roll data.
          </div>
        </CardContent>
      </Card>
    );
  }



  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return <span className="w-full block text-center text-green-600">P</span>;
      case 'Late':
        return <span className="w-full block text-center text-amber-600">L</span>;
      case 'Absent':
        return <span className="w-full block text-center text-red-600">A</span>;
      case 'Remote':
        return <span className="w-full block text-center text-blue-600">R</span>;
      default:
        return <span className="w-full block text-center">-</span>;
    }
  };

  // Prepare export data
  const exportData = musterData.flatMap(employee => {
    return employee.records.map(record => ({
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      date: record.date,
      status: record.status,
      checkIn: record.checkIn || '',
      checkOut: record.checkOut || ''
    }));
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Muster Roll</CardTitle>
          <CardDescription>
            Official attendance record from {format(startDate, 'MMM dd, yyyy')} to {format(endDate, 'MMM dd, yyyy')}
          </CardDescription>
        </div>
        <ReportExportOptions 
          reportTitle="Muster Roll Report" 
          data={exportData}
        />
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-48"></div>
            <div className="h-80 bg-muted rounded"></div>
          </div>
        ) : musterData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No muster data available for the selected criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                        Employee
                      </th>
                      {dateRange.map(date => {
                        const day = new Date(date);
                        const isWeekendDay = isWeekend(day);
                        return (
                          <th 
                            key={date} 
                            scope="col" 
                            className={`py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-10 ${
                              isWeekendDay ? 'bg-gray-100' : ''
                            }`}
                          >
                            <div>{format(new Date(date), 'd')}</div>
                            <div>{format(new Date(date), 'E')}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {musterData.map(employee => (
                      <tr key={employee.employeeId}>
                        <td className="py-2 px-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                          {employee.employeeName}
                        </td>
                        {employee.records.map((record, index) => {
                          const day = new Date(record.date);
                          const isWeekendDay = isWeekend(day);
                          return (
                            <td 
                              key={index} 
                              className={`py-2 px-1 text-sm text-gray-500 text-center ${
                                isWeekendDay ? 'bg-gray-50' : ''
                              }`}
                              title={`${record.date}: ${record.status}${record.checkIn ? ` (In: ${record.checkIn})` : ''}${record.checkOut ? ` (Out: ${record.checkOut})` : ''}`}
                            >
                              {getStatusBadge(record.status)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div><span className="text-green-600 font-bold">P</span> - Present</div>
          <div><span className="text-amber-600 font-bold">L</span> - Late</div>
          <div><span className="text-red-600 font-bold">A</span> - Absent</div>
          <div><span className="text-blue-600 font-bold">R</span> - Remote</div>
        </div>
      </CardContent>
    </Card>
  );
};
