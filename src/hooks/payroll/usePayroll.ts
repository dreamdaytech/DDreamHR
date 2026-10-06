import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isDemoSession, readDemoData, writeDemoData } from '@/lib/demoStore';
import { getTenantContext } from '@/hooks/useTenantContext';

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

const seedProfiles: SalaryProfile[] = [
  {
    id: 'SAL-001',
    employee_id: 'EMP-001',
    employee: { first_name: 'Aminata', last_name: 'Kamara', email: 'aminata@example.com', department: 'Finance', position: 'Senior Finance Analyst' },
    basic_salary: 10000,
    currency: 'SLE',
    effective_from: '2026-10-01',
    is_active: true,
    allowances: [{ id: 'A-1', name: 'Transport', allowance_type: 'fixed', amount: 750, is_taxable: false, is_active: true }],
    deductions: [{ id: 'D-1', name: 'Pension', deduction_type: 'percentage', percentage: 5, is_mandatory: true, is_active: true }],
  },
  {
    id: 'SAL-002',
    employee_id: 'EMP-002',
    employee: { first_name: 'Joseph', last_name: 'Conteh', email: 'joseph@example.com', department: 'Operations', position: 'Operations Manager' },
    basic_salary: 12500,
    currency: 'SLE',
    effective_from: '2026-01-01',
    is_active: true,
    allowances: [{ id: 'A-2', name: 'Communication', allowance_type: 'fixed', amount: 500, is_taxable: false, is_active: true }],
    deductions: [{ id: 'D-2', name: 'Pension', deduction_type: 'percentage', percentage: 5, is_mandatory: true, is_active: true }],
  },
  {
    id: 'SAL-003',
    employee_id: 'EMP-003',
    employee: { first_name: 'Hawa', last_name: 'Koroma', email: 'hawa@example.com', department: 'People', position: 'HR Officer' },
    basic_salary: 8500,
    currency: 'SLE',
    effective_from: '2026-03-01',
    is_active: true,
    allowances: [],
    deductions: [{ id: 'D-3', name: 'Pension', deduction_type: 'percentage', percentage: 5, is_mandatory: true, is_active: true }],
  },
];

const seedPeriods: PayrollPeriod[] = [
  { id: 'PAY-SEP-2026', period_name: 'September 2026', start_date: '2026-09-01', end_date: '2026-09-30', pay_date: '2026-09-30', status: 'completed', total_employees: 3, total_amount: 30637.5, is_off_cycle: false },
];

const buildDemoRecords = (profiles: SalaryProfile[]): PayrollRecord[] =>
  profiles.map((profile) => {
    const allowances = profile.allowances.filter((item) => item.is_active).reduce((sum, item) => sum + item.amount, 0);
    const deductions = profile.deductions.filter((item) => item.is_active).reduce((sum, item) => {
      if (typeof item.amount === 'number') return sum + item.amount;
      if (typeof item.percentage === 'number') return sum + (profile.basic_salary * item.percentage) / 100;
      return sum;
    }, 0);
    const gross = profile.basic_salary + allowances;
    return {
      id: `REC-${profile.employee_id}`,
      employee: profile.employee,
      basic_salary: profile.basic_salary,
      gross_salary: gross,
      total_allowances: allowances,
      total_deductions: deductions,
      net_salary: gross - deductions,
      working_days: 22,
      actual_days_worked: 22,
      leave_days: 0,
      overtime_hours: 0,
      overtime_amount: 0,
      payment_status: 'processed' as const,
    };
  });

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
    notStartedPeriods: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const demo = isDemoSession();

  const fetchPayrollPeriods = async () => {
    if (demo) {
      setPayrollPeriods(readDemoData<PayrollPeriod[]>('payroll-periods', seedPeriods));
      return;
    }
    try {
      const context = await getTenantContext();
      if (!context?.businessId) return;
      const { data, error } = await supabase
        .from('payroll_periods')
        .select('*')
        .eq('business_id', context.businessId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPayrollPeriods(data || []);
    } catch (error) {
      console.error('Error fetching payroll periods:', error);
      toast({ title: 'Error', description: 'Failed to fetch payroll periods', variant: 'destructive' });
    }
  };

  const fetchSalaryProfiles = async () => {
    if (demo) {
      setSalaryProfiles(readDemoData<SalaryProfile[]>('salary-profiles', seedProfiles));
      return;
    }
    try {
      const context = await getTenantContext();
      if (!context?.businessId) return;
      const { data, error } = await supabase
        .from('employee_salary_profiles')
        .select(`
          id, employee_id, basic_salary, currency, effective_from, effective_to, is_active,
          employees!inner (first_name, last_name, email, department, position),
          salary_allowances (id, name, allowance_type, amount, is_taxable, is_active),
          salary_deductions (id, name, deduction_type, amount, percentage, is_mandatory, is_active)
        `)
        .eq('business_id', context.businessId)
        .eq('is_active', true);
      if (error) throw error;
      setSalaryProfiles((data || []).map((profile) => ({
        id: profile.id,
        employee_id: profile.employee_id,
        employee: profile.employees as any,
        basic_salary: profile.basic_salary,
        currency: profile.currency,
        effective_from: profile.effective_from,
        effective_to: profile.effective_to,
        is_active: profile.is_active,
        allowances: profile.salary_allowances || [],
        deductions: profile.salary_deductions || [],
      })));
    } catch (error) {
      console.error('Error fetching salary profiles:', error);
      toast({ title: 'Error', description: 'Failed to fetch salary profiles', variant: 'destructive' });
    }
  };

  const fetchPayrollRecords = async (periodId: string) => {
    if (demo) {
      const profiles = readDemoData<SalaryProfile[]>('salary-profiles', seedProfiles);
      const records = readDemoData<PayrollRecord[]>(`payroll-records:${periodId}`, buildDemoRecords(profiles));
      setPayrollRecords(records);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('payroll_records')
        .select(`
          id, basic_salary, gross_salary, total_allowances, total_deductions, net_salary,
          working_days, actual_days_worked, leave_days, overtime_hours, overtime_amount, payment_status,
          employees!inner (first_name, last_name, email, department, position)
        `)
        .eq('payroll_period_id', periodId);
      if (error) throw error;
      setPayrollRecords((data || []).map((record) => ({
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
        payment_status: record.payment_status,
      })));
    } catch (error) {
      console.error('Error fetching payroll records:', error);
      toast({ title: 'Error', description: 'Failed to fetch payroll records', variant: 'destructive' });
    }
  };

  const calculatePayrollSummary = async () => {
    if (demo) {
      const profiles = readDemoData<SalaryProfile[]>('salary-profiles', seedProfiles);
      const periods = readDemoData<PayrollPeriod[]>('payroll-periods', seedPeriods);
      const records = buildDemoRecords(profiles);
      setPayrollSummary({
        totalEmployees: profiles.length,
        paidEmployees: records.filter((record) => record.payment_status === 'processed').length,
        unpaidEmployees: records.filter((record) => record.payment_status === 'pending').length,
        totalPayrollCost: periods.reduce((sum, period) => sum + (period.total_amount || 0), 0),
        completedPeriods: periods.filter((period) => period.status === 'completed').length,
        inProgressPeriods: periods.filter((period) => period.status === 'in_progress').length,
        notStartedPeriods: periods.filter((period) => period.status === 'not_started').length,
      });
      return;
    }
    try {
      const context = await getTenantContext();
      if (!context?.businessId) return;
      const { count: totalEmployees } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', context.businessId)
        .eq('status', 'active');
      const { data: periods } = await supabase
        .from('payroll_periods')
        .select('id,status,total_amount,total_employees')
        .eq('business_id', context.businessId);
      const periodIds = (periods || []).map((period) => period.id);
      const { data: recentRecords } = periodIds.length
        ? await supabase
            .from('payroll_records')
            .select('payment_status')
            .in('payroll_period_id', periodIds)
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        : { data: [] as Array<{ payment_status: string }> };
      setPayrollSummary({
        totalEmployees: totalEmployees || 0,
        paidEmployees: recentRecords?.filter((record) => record.payment_status === 'processed').length || 0,
        unpaidEmployees: recentRecords?.filter((record) => record.payment_status === 'pending').length || 0,
        totalPayrollCost: periods?.reduce((sum, period) => sum + (period.total_amount || 0), 0) || 0,
        completedPeriods: periods?.filter((period) => period.status === 'completed').length || 0,
        inProgressPeriods: periods?.filter((period) => period.status === 'in_progress').length || 0,
        notStartedPeriods: periods?.filter((period) => period.status === 'not_started').length || 0,
      });
    } catch (error) {
      console.error('Error calculating payroll summary:', error);
    }
  };

  const createPayrollPeriod = async (periodData: Omit<PayrollPeriod, 'id'>) => {
    setLoading(true);
    try {
      if (demo) {
        const profiles = readDemoData<SalaryProfile[]>('salary-profiles', seedProfiles);
        const periods = readDemoData<PayrollPeriod[]>('payroll-periods', seedPeriods);
        const records = buildDemoRecords(profiles);
        const created: PayrollPeriod = {
          ...periodData,
          id: `PAY-${Date.now()}`,
          total_employees: profiles.length,
          total_amount: records.reduce((sum, record) => sum + record.net_salary, 0),
        };
        const next = [created, ...periods];
        writeDemoData('payroll-periods', next);
        writeDemoData(`payroll-records:${created.id}`, records.map((record) => ({ ...record, payment_status: 'pending' })));
        setPayrollPeriods(next);
        toast({ title: 'Success', description: 'Payroll period created in the demo workspace' });
        return created;
      }

      const context = await getTenantContext();
      if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

      const { data, error } = await supabase
        .from('payroll_periods')
        .insert([{ ...periodData, business_id: context.businessId }])
        .select()
        .single();
      if (error) throw error;
      await fetchPayrollPeriods();
      toast({ title: 'Success', description: 'Payroll period created successfully' });
      return data;
    } catch (error) {
      console.error('Error creating payroll period:', error);
      toast({ title: 'Error', description: 'Failed to create payroll period', variant: 'destructive' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const processPayroll = async (periodId: string) => {
    setLoading(true);
    try {
      if (demo) {
        const periods = readDemoData<PayrollPeriod[]>('payroll-periods', seedPeriods);
        const next = periods.map((period) => period.id === periodId ? { ...period, status: 'completed' as const } : period);
        const records = readDemoData<PayrollRecord[]>(`payroll-records:${periodId}`, buildDemoRecords(readDemoData<SalaryProfile[]>('salary-profiles', seedProfiles)));
        writeDemoData('payroll-periods', next);
        writeDemoData(`payroll-records:${periodId}`, records.map((record) => ({ ...record, payment_status: 'processed' as const })));
        setPayrollPeriods(next);
        setPayrollRecords(records.map((record) => ({ ...record, payment_status: 'processed' as const })));
        await calculatePayrollSummary();
        toast({ title: 'Payroll processed', description: 'Demo payroll completed and records were updated.' });
        return;
      }

      const { data, error } = await (supabase as any).rpc('process_payroll_period', {
        target_period_id: periodId,
      });
      if (error) throw error;

      await Promise.all([
        fetchPayrollPeriods(),
        fetchPayrollRecords(periodId),
        calculatePayrollSummary(),
      ]);
      toast({
        title: 'Payroll processed',
        description: `${data?.employees ?? 0} employee payroll record(s) completed successfully.`,
      });
    } catch (error) {
      console.error('Error processing payroll:', error);
      toast({ title: 'Error', description: 'Failed to process payroll', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateSalaryProfile = async (profileId: string, updates: Partial<SalaryProfile>) => {
    setLoading(true);
    try {
      if (demo) {
        const profiles = readDemoData<SalaryProfile[]>('salary-profiles', seedProfiles);
        const next = profiles.map((profile) => profile.id === profileId ? { ...profile, ...updates } : profile);
        writeDemoData('salary-profiles', next);
        setSalaryProfiles(next);
        toast({ title: 'Success', description: 'Salary profile updated in the demo workspace' });
        return;
      }

      const context = await getTenantContext();
      if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

      const allowedUpdates = {
        basic_salary: updates.basic_salary,
        currency: updates.currency,
        effective_from: updates.effective_from,
        effective_to: updates.effective_to,
        is_active: updates.is_active,
      };
      const { error } = await supabase
        .from('employee_salary_profiles')
        .update(allowedUpdates)
        .eq('business_id', context.businessId)
        .eq('id', profileId);
      if (error) throw error;
      await fetchSalaryProfiles();
      toast({ title: 'Success', description: 'Salary profile updated successfully' });
    } catch (error) {
      console.error('Error updating salary profile:', error);
      toast({ title: 'Error', description: 'Failed to update salary profile', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createSalaryProfile = async (input: {
    employee_id: string;
    basic_salary: number;
    currency?: string;
    effective_from?: string;
  }) => {
    setLoading(true);
    try {
      if (demo) {
        throw new Error('Use an existing seeded profile in demo mode.');
      }

      const context = await getTenantContext();
      if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

      const { data, error } = await supabase
        .from('employee_salary_profiles')
        .insert({
          business_id: context.businessId,
          employee_id: input.employee_id,
          basic_salary: input.basic_salary,
          currency: input.currency || 'SLE',
          effective_from: input.effective_from || new Date().toISOString().slice(0, 10),
          is_active: true,
          created_by: context.userId,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchSalaryProfiles();
      toast({ title: 'Salary profile created', description: 'Compensation is now available for payroll.' });
      return data;
    } catch (error) {
      toast({
        title: 'Could not create salary profile',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
      throw error;
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
    createSalaryProfile,
    updateSalaryProfile,
    calculatePayrollSummary,
  };
};
