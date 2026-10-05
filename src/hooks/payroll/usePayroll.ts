
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PayrollPeriod {
  id: string;
  period_name: string;
  start_date: string;
  end_date: string;
  pay_date: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  total_employees?: number;
  total_amount?: number;
  is_off_cycle?: boolean;
}

export interface PayrollRecord {
  id: string;
  employee: {
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    position: string;
  };
  basic_salary: number;
  gross_salary: number;
  total_allowances: number;
  total_deductions: number;
  net_salary: number;
  working_days: number;
  actual_days_worked: number;
  leave_days: number;
  overtime_hours: number;
  overtime_amount: number;
  payment_status: 'pending' | 'processed' | 'failed' | 'cancelled';
}

export interface SalaryProfile {
  id: string;
  employee_id: string;
  employee: {
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    position: string;
  };
  basic_salary: number;
  currency: string;
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
  allowances: Array<{
    id: string;
    name: string;
    allowance_type: string;
    amount: number;
    is_taxable: boolean;
    is_active: boolean;
  }>;
  deductions: Array<{
    id: string;
    name: string;
    deduction_type: string;
    amount?: number;
    percentage?: number;
    is_mandatory: boolean;
    is_active: boolean;
  }>;
}

export interface PayrollSummary {
  totalEmployees: number;
  paidEmployees: number;
  unpaidEmployees: number;
  totalPayrollCost: number;
  completedPeriods: number;
  inProgressPeriods: number;
  notStartedPeriods: number;
}

export const usePayroll = () => {
  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [salaryProfiles, setSalaryProfiles] = useState<SalaryProfile[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<PayrollSummary>({
    totalEmployees: 0,
    paidEmployees: 0,
    unpaidEmployees: 0,
    totalPayrollCost: 0,
    completedPeriods: 0,
    inProgressPeriods: 0,
    notStartedPeriods: 0
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch payroll periods
  const fetchPayrollPeriods = async () => {
    try {
      const { data, error } = await supabase
        .from('payroll_periods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayrollPeriods(data || []);
    } catch (error: any) {
      console.error('Error fetching payroll periods:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payroll periods",
        variant: "destructive",
      });
    }
  };

  // Fetch salary profiles
  const fetchSalaryProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_salary_profiles')
        .select(`
          id,
          employee_id,
          basic_salary,
          currency,
          effective_from,
          effective_to,
          is_active,
          employees!inner (
            first_name,
            last_name,
            email,
            department,
            position
          ),
          salary_allowances (
            id,
            name,
            allowance_type,
            amount,
            is_taxable,
            is_active
          ),
          salary_deductions (
            id,
            name,
            deduction_type,
            amount,
            percentage,
            is_mandatory,
            is_active
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      
      const formattedProfiles = (data || []).map(profile => ({
        id: profile.id,
        employee_id: profile.employee_id,
        employee: profile.employees as any,
        basic_salary: profile.basic_salary,
        currency: profile.currency,
        effective_from: profile.effective_from,
        effective_to: profile.effective_to,
        is_active: profile.is_active,
        allowances: (profile.salary_allowances || []).map((allowance: any) => ({
          id: allowance.id,
          name: allowance.name,
          allowance_type: allowance.allowance_type,
          amount: allowance.amount,
          is_taxable: allowance.is_taxable,
          is_active: allowance.is_active
        })),
        deductions: (profile.salary_deductions || []).map((deduction: any) => ({
          id: deduction.id,
          name: deduction.name,
          deduction_type: deduction.deduction_type,
          amount: deduction.amount,
          percentage: deduction.percentage,
          is_mandatory: deduction.is_mandatory,
          is_active: deduction.is_active
        }))
      }));

      setSalaryProfiles(formattedProfiles);
    } catch (error: any) {
      console.error('Error fetching salary profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch salary profiles",
        variant: "destructive",
      });
    }
  };

  // Fetch payroll records for a specific period
  const fetchPayrollRecords = async (periodId: string) => {
    try {
      const { data, error } = await supabase
        .from('payroll_records')
        .select(`
          id,
          basic_salary,
          gross_salary,
          total_allowances,
          total_deductions,
          net_salary,
          working_days,
          actual_days_worked,
          leave_days,
          overtime_hours,
          overtime_amount,
          payment_status,
          employees!inner (
            first_name,
            last_name,
            email,
            department,
            position
          )
        `)
        .eq('payroll_period_id', periodId);

      if (error) throw error;
      
      const formattedRecords = (data || []).map(record => ({
        id: record.id,
        employee: record.employees as any,
        basic_salary: record.basic_salary,
        gross_salary: record.gross_salary,
        total_allowances: record.total_allowances,
        total_deductions: record.total_deductions,
        net_salary: record.net_salary,
        working_days: record.working_days,
        actual_days_worked: record.actual_days_worked,
        leave_days: record.leave_days || 0,
        overtime_hours: record.overtime_hours || 0,
        overtime_amount: record.overtime_amount || 0,
        payment_status: record.payment_status
      }));

      setPayrollRecords(formattedRecords);
    } catch (error: any) {
      console.error('Error fetching payroll records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payroll records",
        variant: "destructive",
      });
    }
  };

  // Calculate payroll summary
  const calculatePayrollSummary = async () => {
    try {
      // Get total employees
      const { count: totalEmployees } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get payroll periods summary
      const { data: periods } = await supabase
        .from('payroll_periods')
        .select('status, total_amount, total_employees');

      const completedPeriods = periods?.filter(p => p.status === 'completed').length || 0;
      const inProgressPeriods = periods?.filter(p => p.status === 'in_progress').length || 0;
      const notStartedPeriods = periods?.filter(p => p.status === 'not_started').length || 0;

      // Get recent payroll records for payment status
      const { data: recentRecords } = await supabase
        .from('payroll_records')
        .select('payment_status')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

      const paidEmployees = recentRecords?.filter(r => r.payment_status === 'processed').length || 0;
      const unpaidEmployees = recentRecords?.filter(r => r.payment_status === 'pending').length || 0;

      // Calculate total payroll cost
      const totalPayrollCost = periods?.reduce((sum, period) => sum + (period.total_amount || 0), 0) || 0;

      setPayrollSummary({
        totalEmployees: totalEmployees || 0,
        paidEmployees,
        unpaidEmployees,
        totalPayrollCost,
        completedPeriods,
        inProgressPeriods,
        notStartedPeriods
      });
    } catch (error: any) {
      console.error('Error calculating payroll summary:', error);
    }
  };

  // Create new payroll period
  const createPayrollPeriod = async (periodData: Omit<PayrollPeriod, 'id'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payroll_periods')
        .insert([periodData])
        .select()
        .single();

      if (error) throw error;

      await fetchPayrollPeriods();
      toast({
        title: "Success",
        description: "Payroll period created successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating payroll period:', error);
      toast({
        title: "Error",
        description: "Failed to create payroll period",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Process payroll for a period
  const processPayroll = async (periodId: string) => {
    setLoading(true);
    try {
      // Update period status to in_progress
      await supabase
        .from('payroll_periods')
        .update({ status: 'in_progress' })
        .eq('id', periodId);

      // Here you would implement the actual payroll calculation logic
      // For now, we'll simulate the process
      
      toast({
        title: "Success",
        description: "Payroll processing started",
      });

      await fetchPayrollPeriods();
    } catch (error: any) {
      console.error('Error processing payroll:', error);
      toast({
        title: "Error",
        description: "Failed to process payroll",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update salary profile
  const updateSalaryProfile = async (profileId: string, updates: Partial<SalaryProfile>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('employee_salary_profiles')
        .update(updates)
        .eq('id', profileId);

      if (error) throw error;

      await fetchSalaryProfiles();
      toast({
        title: "Success",
        description: "Salary profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating salary profile:', error);
      toast({
        title: "Error",
        description: "Failed to update salary profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollPeriods();
    fetchSalaryProfiles();
    calculatePayrollSummary();
  }, []);

  return {
    payrollPeriods,
    payrollRecords,
    salaryProfiles,
    payrollSummary,
    loading,
    fetchPayrollPeriods,
    fetchPayrollRecords,
    fetchSalaryProfiles,
    createPayrollPeriod,
    processPayroll,
    updateSalaryProfile,
    calculatePayrollSummary
  };
};
