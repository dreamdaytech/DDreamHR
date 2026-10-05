
import React, { useState } from 'react';
import { usePayroll } from '@/hooks/payroll/usePayroll';
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

const SalaryProfiles = () => {
  const { salaryProfiles, loading } = usePayroll();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const departments = Array.from(new Set(salaryProfiles.map(profile => profile.employee.department)));

  const filteredProfiles = salaryProfiles.filter(profile => {
    const matchesSearch = 
      profile.employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || profile.employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleEditProfile = (profile: any) => {
    setEditingProfile(profile);
    setIsDialogOpen(true);
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
        <Button className="bg-[#e86625] hover:bg-[#d55b1f]">
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
                  {editingProfile.allowances.map((allowance: any, index: number) => (
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
                  {editingProfile.deductions.map((deduction: any, index: number) => (
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

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#e86625] hover:bg-[#d55b1f]">
                  Save Changes
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
