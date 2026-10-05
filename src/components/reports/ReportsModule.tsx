
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from './ReportFilters';
import { DailyAttendanceReport } from './reports/DailyAttendanceReport';
import { CheckInDeviationReport } from './reports/CheckInDeviationReport';
import { EmployeeMonthlyReport } from './reports/EmployeeMonthlyReport';
import { WorkHoursBreakdownReport } from './reports/WorkHoursBreakdownReport';
import { PayrollAttendanceReport } from './reports/PayrollAttendanceReport';
import { MusterRollReport } from './reports/MusterRollReport';
import { OvertimeReport } from './reports/OvertimeReport';

import { format, subDays } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

const ReportsModule: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';
  const isManager = user?.role === 'manager';
  
  // Default to last 30 days
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [department, setDepartment] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [employee, setEmployee] = useState<string>('all');
  
  // Handle filter changes
  const handleFilterChange = (
    newStartDate: Date, 
    newEndDate: Date,
    newDepartment: string,
    newLocation: string,
    newEmployee: string
  ) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setDepartment(newDepartment);
    setLocation(newLocation);
    setEmployee(newEmployee);
  };

  // Common props for all reports
  const reportProps = {
    startDate,
    endDate,
    department,
    location,
    employee,
    userRole: user?.role,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Reports</h1>
          <p className="text-muted-foreground">
            Generate and analyze detailed attendance reports
          </p>
        </div>
      </div>

      <ReportFilters 
        startDate={startDate}
        endDate={endDate}
        department={department}
        location={location}
        employee={employee}
        onFilterChange={handleFilterChange}
      />

      <Tabs defaultValue="daily-attendance" className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="daily-attendance">Daily Attendance</TabsTrigger>
          <TabsTrigger value="check-in-deviation">Early/Late Check-In</TabsTrigger>
          <TabsTrigger value="monthly-status">Monthly Status</TabsTrigger>
          <TabsTrigger value="hours-breakdown">Hours Breakdown</TabsTrigger>
          {(isAdmin || isHR) && <TabsTrigger value="payroll">Payroll Data</TabsTrigger>}
          {(isAdmin || isHR) && <TabsTrigger value="muster-roll">Muster Roll</TabsTrigger>}
          {(isAdmin || isHR || isManager) && <TabsTrigger value="overtime">Overtime Details</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="daily-attendance">
          <DailyAttendanceReport {...reportProps} />
        </TabsContent>
        
        <TabsContent value="check-in-deviation">
          <CheckInDeviationReport {...reportProps} />
        </TabsContent>
        
        <TabsContent value="monthly-status">
          <EmployeeMonthlyReport {...reportProps} />
        </TabsContent>
        
        <TabsContent value="hours-breakdown">
          <WorkHoursBreakdownReport {...reportProps} />
        </TabsContent>
        
        <TabsContent value="payroll">
          <PayrollAttendanceReport {...reportProps} />
        </TabsContent>
        
        <TabsContent value="muster-roll">
          <MusterRollReport {...reportProps} />
        </TabsContent>
        
        <TabsContent value="overtime">
          <OvertimeReport {...reportProps} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsModule;
