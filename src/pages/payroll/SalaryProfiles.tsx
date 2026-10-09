
import React, { useEffect, useState } from 'react';
import { usePayroll, type SalaryProfile } from '@/hooks/payroll/usePayroll';
import { listTenantEmployees } from '@/services/tenantPeople';
import { isDemoSession, readDemoData } from '@/lib/demoStore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Plus, 
  Edit, 
  DollarSign, 
  Search,
  Filter,
  Download,
  Trash2
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type SalaryEmployeeOption = {
  id: string | number; name?: string; first_name?: string; last_name?: string; email?: string;
  department?: string; position?: string; employeeId?: string; employee_id?: string;
};

const SalaryProfiles = () => {
  const { salaryProfiles, loading, createSalaryProfile, updateSalaryProfile } = usePayroll();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [editingProfile, setEditingProfile] = useState<SalaryProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<SalaryEmployeeOption[]>([]);
  const [newProfile, setNewProfile] = useState({
    employee_id: '',
    basic_salary: '',
    currency: 'SLE',
    effective_from: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        if (isDemoSession()) {
          setEmployees(readDemoData<SalaryEmployeeOption[]>('employees', []));
        } else {
          setEmployees(await listTenantEmployees());
        }
      } catch (error) {
        console.error('Failed to load employees for payroll', error);
      }
    };
    void loadEmployees();
  }, []);

  const departments = Array.from(new Set(salaryProfiles.map(profile => profile.employee.department)));

  const filteredProfiles = salaryProfiles.filter(profile => {
    const matchesSearch = 
      profile.employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || profile.employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleEditProfile = (profile: SalaryProfile) => {
    setEditingProfile({ ...profile });
    setIsDialogOpen(true);
  };

  const availableEmployees = employees.filter((employee) =>
    !salaryProfiles.some((profile) => String(profile.employee_id) === String(employee.id))
  );

  const handleCreateProfile = async () => {
    const salary = Number(newProfile.basic_salary);
    if (!newProfile.employee_id || !Number.isFinite(salary) || salary <= 0) {
      toast({
        title: 'Employee and salary required',
        description: 'Select an employee and enter a valid basic salary.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createSalaryProfile({
        employee_id: newProfile.employee_id,
        basic_salary: salary,
        currency: newProfile.currency,
        effective_from: newProfile.effective_from,
      });
      setNewProfile({
        employee_id: '',
        basic_salary: '',
        currency: 'SLE',
        effective_from: new Date().toISOString().slice(0, 10),
      });
      setIsAddDialogOpen(false);
    } catch {
      // The payroll hook already displays the error.
    }
  };

  const handleSaveProfile = async () => {
    if (!editingProfile) return;
    await updateSalaryProfile(editingProfile.id, {
      basic_salary: Number(editingProfile.basic_salary),
      currency: editingProfile.currency,
      effective_from: editingProfile.effective_from,
      effective_to: editingProfile.effective_to || undefined,
      is_active: Boolean(editingProfile.is_active),
    });
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading salary profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Salary Profiles</h1>
          <p className="text-muted-foreground">Manage employee salary profiles and compensation</p>
        </div>
        <Button className="bg-[#e86625] hover:bg-[#d55b1f]" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Profile
        </Button>
      </div>

      {/* Summary Cards */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salaryProfiles.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              SLL {salaryProfiles.length > 0 ? 
                Math.round(salaryProfiles.reduce((sum, p) => sum + p.basic_salary, 0) / salaryProfiles.length).toLocaleString() 
                : 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compensation</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              SLL {salaryProfiles.reduce((sum, p) => sum + p.basic_salary, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
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

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Salary Profiles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Salary Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-4">
              {filteredProfiles.map((profile) => {
                const totalAllowances = profile.allowances.reduce((sum, a) => sum + a.amount, 0);
                const totalDeductions = profile.deductions.reduce((sum, d) => sum + (d.amount || 0), 0);
                
                return (
                  <div key={profile.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {profile.employee.first_name} {profile.employee.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{profile.employee.position}</p>
                      </div>
                      <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                        {profile.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Basic Salary</p>
                        <p className="font-medium">SLL {profile.basic_salary.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Department</p>
                        <p className="font-medium">{profile.employee.department}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Allowances</p>
                        <p className="font-medium">SLL {totalAllowances.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deductions</p>
                        <p className="font-medium">SLL {totalDeductions.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleEditProfile(profile)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Allowances</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => {
                  const totalAllowances = profile.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
                  const totalDeductions = profile.deductions.reduce((sum, deduction) => sum + (deduction.amount || 0), 0);
                  
                  return (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {profile.employee.first_name} {profile.employee.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">{profile.employee.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{profile.employee.department}</TableCell>
                      <TableCell>{profile.employee.position}</TableCell>
                      <TableCell>SLL {profile.basic_salary.toLocaleString()}</TableCell>
                      <TableCell>SLL {totalAllowances.toLocaleString()}</TableCell>
                      <TableCell>SLL {totalDeductions.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                          {profile.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProfile(profile)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Salary Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Employee</Label>
              <Select value={newProfile.employee_id} onValueChange={(value) => setNewProfile({ ...newProfile, employee_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {availableEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={String(employee.id)}>
                      {employee.name || `${employee.first_name || ''} ${employee.last_name || ''}`.trim()} · {employee.department || 'General'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableEmployees.length === 0 && (
                <p className="mt-2 text-sm text-muted-foreground">All currently loaded employees already have salary profiles.</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Basic Salary</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProfile.basic_salary}
                  onChange={(e) => setNewProfile({ ...newProfile, basic_salary: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Input
                  value={newProfile.currency}
                  onChange={(e) => setNewProfile({ ...newProfile, currency: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div>
              <Label>Effective From</Label>
              <Input
                type="date"
                value={newProfile.effective_from}
                onChange={(e) => setNewProfile({ ...newProfile, effective_from: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateProfile} disabled={loading || !availableEmployees.length}>
                {loading ? 'Creating…' : 'Create Profile'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Salary Profile</DialogTitle>
          </DialogHeader>
          {editingProfile && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Employee Name</Label>
                  <Input 
                    value={`${editingProfile.employee.first_name} ${editingProfile.employee.last_name}`}
                    disabled
                  />
                </div>
                <div>
                  <Label>Basic Salary</Label>
                  <Input 
                    type="number"
                    value={editingProfile.basic_salary}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      basic_salary: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Allowances</h4>
                <div className="space-y-3">
                  {editingProfile.allowances.map((allowance, index: number) => (
                    <div key={allowance.id} className="grid grid-cols-4 gap-3 items-center">
                      <Input placeholder="Allowance name" value={allowance.name} readOnly />
                      <Select value={allowance.allowance_type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        type="number" 
                        placeholder="Amount" 
                        value={allowance.amount}
                      />
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Allowance
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Deductions</h4>
                <div className="space-y-3">
                  {editingProfile.deductions.map((deduction, index: number) => (
                    <div key={deduction.id} className="grid grid-cols-4 gap-3 items-center">
                      <Input placeholder="Deduction name" value={deduction.name} readOnly />
                      <Select value={deduction.deduction_type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        type="number" 
                        placeholder="Amount/Percentage" 
                        value={deduction.amount || deduction.percentage || 0}
                      />
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deduction
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Label>Currency</Label>
                  <Input
                    value={editingProfile.currency}
                    onChange={(e) => setEditingProfile({ ...editingProfile, currency: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <Label>Effective From</Label>
                  <Input
                    type="date"
                    value={editingProfile.effective_from || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, effective_from: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Effective To</Label>
                  <Input
                    type="date"
                    value={editingProfile.effective_to || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, effective_to: e.target.value || undefined })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#e86625] hover:bg-[#d55b1f]" onClick={handleSaveProfile} disabled={loading}>
                  {loading ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalaryProfiles;
