
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Filter
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const PayrollReports = () => {
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState('2024-03');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedReport, setSelectedReport] = useState('summary');

  const reportTypes = [
    { value: 'summary', label: 'Payroll Summary', icon: BarChart3 },
    { value: 'departmental', label: 'Departmental Analysis', icon: Users },
    { value: 'tax', label: 'Tax Report', icon: FileText },
    { value: 'benefits', label: 'Benefits Report', icon: TrendingUp },
    { value: 'deductions', label: 'Deductions Report', icon: DollarSign },
    { value: 'overtime', label: 'Overtime Report', icon: Calendar }
  ];

  const sampleData = {
    summary: {
      totalPayroll: 45000000,
      totalEmployees: 5,
      avgSalary: 9000000,
      totalDeductions: 8950000,
      totalAllowances: 11600000
    },
    departmental: [
      { department: 'IT', employees: 1, totalPay: 8400000, avgPay: 8400000 },
      { department: 'HR', employees: 1, totalPay: 12810000, avgPay: 12810000 },
      { department: 'Sales', employees: 1, totalPay: 5360000, avgPay: 5360000 },
      { department: 'Marketing', employees: 1, totalPay: 6960000, avgPay: 6960000 },
      { department: 'Finance', employees: 1, totalPay: 9050000, avgPay: 9050000 }
    ]
  };

  const handleExport = (format: string) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll Reports</h1>
          <p className="text-muted-foreground">Generate and view payroll analytics and reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardContent className="p-6">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(report => (
                    <SelectItem key={report.value} value={report.value}>
                      {report.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-03">March 2024</SelectItem>
                  <SelectItem value="2024-02">February 2024</SelectItem>
                  <SelectItem value="2024-01">January 2024</SelectItem>
                  <SelectItem value="2023-12">December 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full bg-[#e86625] hover:bg-[#d55b1f]">
                <Filter className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary Cards */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-5'}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SLL {sampleData.summary.totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.summary.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Salary</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SLL {sampleData.summary.avgSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per employee</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allowances</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">SLL {sampleData.summary.totalAllowances.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total allowances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deductions</CardTitle>
            <BarChart3 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">SLL {sampleData.summary.totalDeductions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total deductions</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Content */}
      {selectedReport === 'departmental' && (
        <Card>
          <CardHeader>
            <CardTitle>Departmental Payroll Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleData.departmental.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{dept.department}</h4>
                    <p className="text-sm text-muted-foreground">{dept.employees} employees</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">SLL {dept.totalPay.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Avg: SLL {dept.avgPay.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedReport === 'summary' && (
        <Card>
          <CardHeader>
            <CardTitle>Payroll Summary Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Gross Payroll</h4>
                  <p className="text-2xl font-bold">SLL {(sampleData.summary.totalPayroll + sampleData.summary.totalDeductions).toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Net Payroll</h4>
                  <p className="text-2xl font-bold">SLL {sampleData.summary.totalPayroll.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Breakdown by Component</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Basic Salaries</span>
                    <span className="font-medium">SLL 42,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Allowances</span>
                    <span className="font-medium text-green-600">+SLL {sampleData.summary.totalAllowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deductions</span>
                    <span className="font-medium text-red-600">-SLL {sampleData.summary.totalDeductions.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Net Total</span>
                    <span>SLL {sampleData.summary.totalPayroll.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Button 
                  key={report.value}
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setSelectedReport(report.value)}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{report.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollReports;
