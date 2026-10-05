import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportExportOptions } from '../ReportExportOptions';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Colors } from '@/lib/chart-colors';
import { format } from 'date-fns';
import { getMockDailyAttendanceSummary, AttendanceSummary } from '@/utils/attendance';

interface DailyAttendanceReportProps {
  startDate: Date;
  endDate: Date;
  department: string;
  location: string;
  employee: string;
  userRole?: string;
}

export const DailyAttendanceReport: React.FC<DailyAttendanceReportProps> = ({
  startDate,
  endDate,
  department,
  location,
  employee,
}) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get attendance data for the selected date
        const data = getMockDailyAttendanceSummary(startDate);
        setAttendanceData(data);
      } catch (error) {
        console.error('Error fetching daily attendance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, department, location, employee]);

  const formatForChart = (data: AttendanceSummary | null) => {
    if (!data) return [];
    
    return [
      { name: 'Present', value: data.present, fill: Colors.success.theme.light },
      { name: 'Late', value: data.late, fill: Colors.warning.theme.light },
      { name: 'Absent', value: data.absent, fill: Colors.error.theme.light },
      { name: 'Remote', value: data.remote, fill: Colors.info.theme.light }
    ];
  };

  const chartData = formatForChart(attendanceData);
  
  const exportData = attendanceData ? [
    {
      date: format(startDate, 'yyyy-MM-dd'),
      present: attendanceData.present,
      late: attendanceData.late,
      absent: attendanceData.absent,
      remote: attendanceData.remote,
      total: attendanceData.total
    }
  ] : [];

  const COLORS = [
    Colors.success.theme.light, // Present - Green
    Colors.warning.theme.light, // Late - Yellow
    Colors.error.theme.light,   // Absent - Red
    Colors.info.theme.light     // Remote - Blue
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Daily Attendance Status</CardTitle>
          <CardDescription>
            Visual representation of attendance for {format(startDate, 'MMMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-40 w-40 rounded-full bg-muted"></div>
            <div className="mt-4 h-4 bg-muted rounded w-48"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Daily Attendance Status</CardTitle>
          <CardDescription>
            Visual representation of attendance for {format(startDate, 'MMMM d, yyyy')}
          </CardDescription>
        </div>
        <ReportExportOptions 
          reportTitle="Daily Attendance Report" 
          data={exportData}
        />
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer config={{ present: {}, late: {}, absent: {}, remote: {} }} className="h-80">
          <PieChart>
            <ChartTooltip
              content={({ active, payload }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  formatter={(value, name) => (
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">{name}:</span>
                      <span>{value} employees ({attendanceData ? Math.round((Number(value) / attendanceData.total) * 100) : 0}%)</span>
                    </div>
                  )}
                />
              )}
            />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-2xl font-bold text-green-700">{attendanceData?.present}</div>
            <div className="text-sm text-green-600">Present</div>
            <div className="text-xs text-green-500 mt-1">
              {attendanceData ? ((attendanceData.present / attendanceData.total) * 100).toFixed(1) : 0}% of total
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <div className="text-2xl font-bold text-yellow-700">{attendanceData?.late}</div>
            <div className="text-sm text-yellow-600">Late</div>
            <div className="text-xs text-yellow-500 mt-1">
              {attendanceData ? ((attendanceData.late / attendanceData.total) * 100).toFixed(1) : 0}% of total
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="text-2xl font-bold text-red-700">{attendanceData?.absent}</div>
            <div className="text-sm text-red-600">Absent</div>
            <div className="text-xs text-red-500 mt-1">
              {attendanceData ? ((attendanceData.absent / attendanceData.total) * 100).toFixed(1) : 0}% of total
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-700">{attendanceData?.remote}</div>
            <div className="text-sm text-blue-600">Remote</div>
            <div className="text-xs text-blue-500 mt-1">
              {attendanceData ? ((attendanceData.remote / attendanceData.total) * 100).toFixed(1) : 0}% of total
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
