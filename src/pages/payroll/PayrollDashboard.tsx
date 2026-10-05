
import React from 'react';
import { usePayroll } from '@/hooks/payroll/usePayroll';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  Play,
  FileText,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const PayrollDashboard = () => {
  const { payrollPeriods, payrollSummary, loading } = usePayroll();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const upcomingPayDates = payrollPeriods
    .filter(period => new Date(period.pay_date) > new Date())
    .sort((a, b) => new Date(a.pay_date).getTime() - new Date(b.pay_date).getTime())
    .slice(0, 3);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'not_started':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading payroll dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll Dashboard</h1>
          <p className="text-muted-foreground">Manage payroll and employee compensation</p>
        </div>
        <Button onClick={() => navigate('/payroll/run')} className="bg-[#e86625] hover:bg-[#d55b1f]">
          <Play className="h-4 w-4 mr-2" />
          Run Payroll
        </Button>
      </div>

      {/* Summary Cards */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollSummary.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Employees</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{payrollSummary.paidEmployees}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Employees</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{payrollSummary.unpaidEmployees}</div>
            <p className="text-xs text-muted-foreground">Pending payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SLL {payrollSummary.totalPayrollCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {/* Payroll Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Payroll Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <Badge variant="default">{payrollSummary.completedPeriods}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <Badge variant="secondary">{payrollSummary.inProgressPeriods}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Not Started</span>
              <Badge variant="outline">{payrollSummary.notStartedPeriods}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Pay Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Pay Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingPayDates.length > 0 ? (
              upcomingPayDates.map((period) => (
                <div key={period.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{period.period_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(period.pay_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(period.status)}>
                    {period.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No upcoming pay dates</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/payroll/run')}
            >
              <Play className="h-6 w-6" />
              <span className="text-sm">Run Payroll</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/payroll/salary-profiles')}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Salary Profiles</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/payroll/payslips')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Payslips</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/payroll/reports')}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Payroll Periods */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payroll Periods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payrollPeriods.slice(0, 5).map((period) => (
              <div key={period.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div>
                  <p className="font-medium">{period.period_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusBadgeVariant(period.status)} className="mb-1">
                    {period.status.replace('_', ' ')}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {period.total_employees} employees
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollDashboard;
