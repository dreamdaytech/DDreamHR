
import React, { useState } from 'react';
import { usePayroll } from '@/hooks/payroll/usePayroll';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Play, Save, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

type PayrollPreviewRow = {
  employee_id: string; employee_name: string; department: string; position: string;
  basic_salary: number; total_allowances: number; total_deductions: number;
  gross_salary: number; net_salary: number; working_days: number; actual_days_worked: number;
  leave_days: number; overtime_hours: number; overtime_amount: number;
};

const RunPayroll = () => {
  const { createPayrollPeriod, processPayroll, loading, salaryProfiles } = usePayroll();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [periodData, setPeriodData] = useState({
    period_name: '',
    start_date: '',
    end_date: '',
    pay_date: '',
    status: 'not_started' as const,
    total_employees: 0,
    total_amount: 0,
    is_off_cycle: false
  });

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<PayrollPreviewRow[]>([]);
  const [step, setStep] = useState(1); // 1: Setup, 2: Preview, 3: Process

  const handleInputChange = <K extends keyof typeof periodData>(field: K, value: (typeof periodData)[K]) => {
    setPeriodData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePreview = () => {
    if (!periodData.period_name || !periodData.start_date || !periodData.end_date || !periodData.pay_date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Calculate preview data based on salary profiles
    const preview = salaryProfiles.map(profile => {
      const totalAllowances = profile.allowances.reduce((sum, allowance) => {
        if (!allowance.is_active) return sum;
        return sum + (allowance.allowance_type === 'fixed' ? allowance.amount : 
                     (profile.basic_salary * allowance.amount / 100));
      }, 0);

      const totalDeductions = profile.deductions.reduce((sum, deduction) => {
        if (!deduction.is_active) return sum;
        if (deduction.deduction_type === 'fixed') {
          return sum + (deduction.amount || 0);
        } else {
          return sum + (profile.basic_salary * (deduction.percentage || 0) / 100);
        }
      }, 0);

      const grossSalary = profile.basic_salary + totalAllowances;
      const netSalary = grossSalary - totalDeductions;

      return {
        employee_id: profile.employee_id,
        employee_name: `${profile.employee.first_name} ${profile.employee.last_name}`,
        department: profile.employee.department,
        position: profile.employee.position,
        basic_salary: profile.basic_salary,
        total_allowances: totalAllowances,
        total_deductions: totalDeductions,
        gross_salary: grossSalary,
        net_salary: netSalary,
        working_days: 22, // Default working days
        actual_days_worked: 22,
        leave_days: 0,
        overtime_hours: 0,
        overtime_amount: 0
      };
    });

    setPreviewData(preview);
    setPeriodData(prev => ({
      ...prev,
      total_employees: preview.length,
      total_amount: preview.reduce((sum, emp) => sum + emp.net_salary, 0)
    }));
    setStep(2);
  };

  const handleCreateAndProcess = async () => {
    try {
      const period = await createPayrollPeriod(periodData);
      await processPayroll(period.id);
      
      toast({
        title: "Success",
        description: "Payroll has been created and processing started",
      });
      
      // Reset form
      setPeriodData({
        period_name: '',
        start_date: '',
        end_date: '',
        pay_date: '',
        status: 'not_started' as const,
        total_employees: 0,
        total_amount: 0,
        is_off_cycle: false
      });
      setStep(1);
      setPreviewData([]);
    } catch (error) {
      console.error('Error creating payroll:', error);
    }
  };

  const saveDraft = async () => {
    try {
      await createPayrollPeriod({
        ...periodData,
        status: 'not_started'
      });
      
      toast({
        title: "Draft Saved",
        description: "Payroll period saved as draft",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Run Payroll</h1>
          <p className="text-muted-foreground">Create and process a new payroll period</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Setup Period', icon: CalendarDays },
              { step: 2, title: 'Preview & Verify', icon: Users },
              { step: 3, title: 'Process Payroll', icon: DollarSign }
            ].map(({ step: stepNum, title, icon: Icon }) => (
              <div key={stepNum} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= stepNum ? 'bg-[#e86625] text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 font-medium ${step >= stepNum ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {title}
                </span>
                {stepNum < 3 && <div className="w-16 h-0.5 bg-muted mx-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Setup Period */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Payroll Period Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div>
                <Label htmlFor="period_name">Period Name *</Label>
                <Input
                  id="period_name"
                  placeholder="e.g., January 2024 Payroll"
                  value={periodData.period_name}
                  onChange={(e) => handleInputChange('period_name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="pay_date">Pay Date *</Label>
                <Input
                  id="pay_date"
                  type="date"
                  value={periodData.pay_date}
                  onChange={(e) => handleInputChange('pay_date', e.target.value)}
                />
              </div>
            </div>

            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div>
                <Label htmlFor="start_date">Period Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={periodData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="end_date">Period End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={periodData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={saveDraft} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={generatePreview} disabled={loading} className="bg-[#e86625] hover:bg-[#d55b1f]">
                Generate Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Preview */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review the payroll calculations before processing
              </p>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{periodData.total_employees}</div>
                  <div className="text-sm text-muted-foreground">Employees</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">SLL {periodData.total_amount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {new Date(periodData.start_date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Start Date</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {new Date(periodData.pay_date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Pay Date</div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <h4 className="font-medium">Employee Breakdown</h4>
                {previewData.slice(0, 5).map((emp, index) => (
                  <div key={emp.employee_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{emp.employee_name}</p>
                      <p className="text-sm text-muted-foreground">{emp.department} • {emp.position}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">SLL {emp.net_salary.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Net Pay</p>
                    </div>
                  </div>
                ))}
                {previewData.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{previewData.length - 5} more employees
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back to Setup
                </Button>
                <div className="space-x-3">
                  <Button variant="outline" onClick={saveDraft} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button onClick={handleCreateAndProcess} disabled={loading} className="bg-[#e86625] hover:bg-[#d55b1f]">
                    <Play className="h-4 w-4 mr-2" />
                    Process Payroll
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RunPayroll;
