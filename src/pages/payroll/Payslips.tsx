
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Mail,
  Search,
  Filter,
  Calendar,
  Users
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Payslip {
  id: string;
  employee: {
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    position: string;
  };
  payroll_record: {
    basic_salary: number;
    gross_salary: number;
    net_salary: number;
    total_allowances: number;
    total_deductions: number;
    payroll_period: {
      period_name: string;
      pay_date: string;
    };
  };
  generated_at: string;
  emailed_at?: string;
  downloaded_at?: string;
}

const Payslips = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const fetchPayslips = async () => {
    try {
      const { data, error } = await supabase
        .from('payslips')
        .select(`
          id,
          generated_at,
          emailed_at,
          downloaded_at,
          employees!inner (
            first_name,
            last_name,
            email,
            department,
            position
          ),
          payroll_records!inner (
            basic_salary,
            gross_salary,
            net_salary,
            total_allowances,
            total_deductions,
            payroll_periods!inner (
              period_name,
              pay_date
            )
          )
        `)
        .order('generated_at', { ascending: false });

      if (error) throw error;

      const formattedPayslips = (data || []).map(payslip => ({
        id: payslip.id,
        employee: payslip.employees as any,
        payroll_record: {
          ...payslip.payroll_records,
          payroll_period: payslip.payroll_records.payroll_periods
        } as any,
        generated_at: payslip.generated_at,
        emailed_at: payslip.emailed_at,
        downloaded_at: payslip.downloaded_at
      }));

      setPayslips(formattedPayslips);
    } catch (error: any) {
      console.error('Error fetching payslips:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payslips",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, []);

  const handleDownload = async (payslipId: string) => {
    try {
      // Update downloaded_at timestamp
      await supabase
        .from('payslips')
        .update({ downloaded_at: new Date().toISOString() })
        .eq('id', payslipId);

      toast({
        title: "Success",
        description: "Payslip downloaded successfully",
      });

      fetchPayslips();
    } catch (error: any) {
      console.error('Error downloading payslip:', error);
      toast({
        title: "Error",
        description: "Failed to download payslip",
        variant: "destructive",
      });
    }
  };

  const handleEmail = async (payslipId: string) => {
    try {
      // Update emailed_at timestamp
      await supabase
        .from('payslips')
        .update({ emailed_at: new Date().toISOString() })
        .eq('id', payslipId);

      toast({
        title: "Success",
        description: "Payslip emailed successfully",
      });

      fetchPayslips();
    } catch (error: any) {
      console.error('Error emailing payslip:', error);
      toast({
        title: "Error",
        description: "Failed to email payslip",
        variant: "destructive",
      });
    }
  };

  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = 
      payslip.employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payslip.employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payslip.employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || payslip.employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(payslips.map(p => p.employee.department)));
  const periods = Array.from(new Set(payslips.map(p => p.payroll_record.payroll_period.period_name)));

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading payslips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payslips</h1>
          <p className="text-muted-foreground">View and manage employee payslips</p>
        </div>
        <Button className="bg-[#e86625] hover:bg-[#d55b1f]">
          <Mail className="h-4 w-4 mr-2" />
          Email All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payslips</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payslips.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloaded</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {payslips.filter(p => p.downloaded_at).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emailed</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {payslips.filter(p => p.emailed_at).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-row items-center'}`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className={isMobile ? 'w-full' : 'w-48'}>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payslips Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payslips</CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-4">
              {filteredPayslips.map((payslip) => (
                <div key={payslip.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {payslip.employee.first_name} {payslip.employee.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{payslip.employee.department}</p>
                    </div>
                    <Badge variant="outline">
                      {payslip.payroll_record.payroll_period.period_name}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Net Salary</p>
                      <p className="font-medium">SLL {payslip.payroll_record.net_salary.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pay Date</p>
                      <p className="font-medium">
                        {new Date(payslip.payroll_record.payroll_period.pay_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDownload(payslip.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEmail(payslip.id)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Pay Date</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {payslip.employee.first_name} {payslip.employee.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">{payslip.employee.department}</div>
                      </div>
                    </TableCell>
                    <TableCell>{payslip.payroll_record.payroll_period.period_name}</TableCell>
                    <TableCell>
                      {new Date(payslip.payroll_record.payroll_period.pay_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>SLL {payslip.payroll_record.net_salary.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {payslip.downloaded_at && (
                          <Badge variant="secondary" className="text-xs">Downloaded</Badge>
                        )}
                        {payslip.emailed_at && (
                          <Badge variant="secondary" className="text-xs">Emailed</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(payslip.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEmail(payslip.id)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payslips;
