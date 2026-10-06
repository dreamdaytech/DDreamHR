
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  PlusCircle,
  Download,
  Upload,
  Filter,
  Eye,
  Settings,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import EmployeeForm from '@/components/employees/EmployeeForm';
import EmployeeFilter from '@/components/employees/EmployeeFilter';
import EmployeeSettings from '@/components/employees/EmployeeSettings';
import { downloadTextFile, isDemoSession, readDemoData, toCsv, writeDemoData } from '@/lib/demoStore';
import { createTenantEmployee, listTenantEmployees } from '@/services/tenantPeople';

type Employee = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  status: 'Active' | 'Inactive' | 'Onboarding' | 'On Leave' | 'Probation' | 'Terminated';
  imageUrl?: string;
  joiningDate: string;
};

type StatusFilter = 'All' | 'Active' | 'Inactive' | 'Onboarding' | 'On Leave' | 'Probation' | 'Terminated';

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock employee data matching the reference design
  const seedEmployees: Employee[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@dreamdayhr.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      status: 'Active',
      imageUrl: '/placeholder.svg',
      joiningDate: '2020-03-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@dreamdayhr.com',
      phone: '+1 (555) 987-6543',
      department: 'Marketing',
      position: 'Marketing Manager',
      location: 'New York, NY',
      status: 'Active',
      imageUrl: '/placeholder.svg',
      joiningDate: '2019-08-20'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@dreamdayhr.com',
      phone: '+1 (555) 456-7890',
      department: 'Finance',
      position: 'Financial Analyst',
      location: 'Chicago, IL',
      status: 'Active',
      imageUrl: '/placeholder.svg',
      joiningDate: '2021-01-10'
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@dreamdayhr.com',
      phone: '+1 (555) 234-5678',
      department: 'Product',
      position: 'Product Manager',
      location: 'Austin, TX',
      status: 'Onboarding',
      imageUrl: '/placeholder.svg',
      joiningDate: '2024-11-01'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@dreamdayhr.com',
      phone: '+1 (555) 345-6789',
      department: 'Engineering',
      position: 'Engineering Director',
      location: 'Seattle, WA',
      status: 'Active',
      imageUrl: '/placeholder.svg',
      joiningDate: '2018-05-12'
    },
    {
      id: 6,
      name: 'Olivia Taylor',
      email: 'olivia.taylor@dreamdayhr.com',
      phone: '+1 (555) 567-8901',
      department: 'Customer Support',
      position: 'Support Specialist',
      location: 'Remote',
      status: 'On Leave',
      imageUrl: '/placeholder.svg',
      joiningDate: '2022-03-25'
    },
    {
      id: 7,
      name: 'James Brown',
      email: 'james.brown@dreamdayhr.com',
      phone: '+1 (555) 678-9012',
      department: 'Sales',
      position: 'Sales Representative',
      location: 'Miami, FL',
      status: 'Active',
      imageUrl: '/placeholder.svg',
      joiningDate: '2023-07-08'
    },
    {
      id: 8,
      name: 'Sophia Garcia',
      email: 'sophia.garcia@dreamdayhr.com',
      phone: '+1 (555) 789-0123',
      department: 'Human Resources',
      position: 'HR Specialist',
      location: 'Los Angeles, CA',
      status: 'Probation',
      imageUrl: '/placeholder.svg',
      joiningDate: '2024-09-15'
    },
  ];

  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (!isDemoSession()) return [];
    const stored = readDemoData<Employee[]>('employees', []);
    if (stored.length) return stored;
    writeDemoData('employees', seedEmployees);
    return seedEmployees;
  });

  const refreshEmployees = async () => {
    if (isDemoSession()) {
      setEmployees(readDemoData<Employee[]>('employees', seedEmployees));
      return;
    }

    try {
      const rows = await listTenantEmployees();
      setEmployees(rows as Employee[]);
    } catch (error) {
      toast({
        title: 'Could not load employees',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    void refreshEmployees();
  }, []);

  const statusFilters: StatusFilter[] = ['All', 'Active', 'Inactive', 'Onboarding', 'On Leave', 'Probation', 'Terminated'];

  const departments = ['Engineering', 'Marketing', 'Finance', 'Product', 'Sales', 'Customer Support', 'Human Resources'];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleViewEmployee = (id: string | number) => {
    navigate(`/employees/${id}`);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,text/csv';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const rows = text.split(/\\r?\\n/).filter(Boolean);
        if (rows.length < 2) throw new Error('CSV has no employee rows');
        const headers = rows[0].split(',').map((header) => header.trim().replace(/^"|"$/g, ''));
        const imported = rows.slice(1).map((row, index) => {
          const values = row.split(',').map((value) => value.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          const record = Object.fromEntries(headers.map((header, i) => [header, values[i] || '']));
          return {
            id: Number(record.id) || Date.now() + index,
            name: record.name || `Imported Employee ${index + 1}`,
            email: record.email || '',
            phone: record.phone || '',
            department: record.department || 'Unassigned',
            position: record.position || 'Employee',
            location: record.location || 'Remote',
            status: (record.status || 'Active') as Employee['status'],
            imageUrl: '/placeholder.svg',
            joiningDate: record.joiningDate || new Date().toISOString().split('T')[0],
          } satisfies Employee;
        });
        if (isDemoSession()) {
          const next = [...imported, ...employees];
          setEmployees(next);
          writeDemoData('employees', next);
        } else {
          for (const [index, employee] of imported.entries()) {
            const [firstName, ...lastNameParts] = employee.name.trim().split(/\s+/);
            await createTenantEmployee({
              employeeId: `CSV-${Date.now()}-${index + 1}`,
              firstName: firstName || 'Employee',
              lastName: lastNameParts.join(' ') || 'User',
              email: employee.email,
              department: employee.department,
              location: employee.location || 'Remote',
              designation: employee.position,
              role: 'employee',
              employmentType: 'Full-time',
              status: employee.status,
              sourceOfHire: 'CSV Import',
              dateOfJoining: employee.joiningDate,
              workPhone: employee.phone,
            });
          }
          await refreshEmployees();
        }
        toast({ title: 'Import complete', description: `${imported.length} employee record(s) imported.` });
      } catch (error) {
        toast({ title: 'Import failed', description: error instanceof Error ? error.message : 'Could not read CSV file.', variant: 'destructive' });
      }
    };
    input.click();
  };

  const handleExport = () => {
    const csv = toCsv(employees.map(({ imageUrl, ...employee }) => employee));
    downloadTextFile('ddreamhr-employees.csv', csv, 'text/csv;charset=utf-8');
    toast({ title: 'Export complete', description: `${employees.length} employee record(s) downloaded.` });
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'On Leave':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Probation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Onboarding':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'Engineering': 'border-t-green-500',
      'Marketing': 'border-t-blue-500',
      'Finance': 'border-t-purple-500',
      'Product': 'border-t-orange-500',
      'Sales': 'border-t-red-500',
      'Customer Support': 'border-t-teal-500',
      'Human Resources': 'border-t-pink-500',
    };
    return colors[department as keyof typeof colors] || 'border-t-gray-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-gray">Employee Directory</h1>
          <p className="text-muted-foreground">Manage your employees and their information.</p>
        </div>
        <Button onClick={() => setShowEmployeeForm(true)} className="w-full sm:w-auto bg-primary hover:bg-secondary active:bg-secondary">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-gray" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="pl-10 focus:ring-secondary focus:border-secondary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Department Filter Select */}
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px] focus:ring-secondary">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hover:bg-secondary hover:text-white active:bg-secondary">
                <Upload className="mr-2 h-4 w-4" /> Import/Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleImport} className="hover:bg-secondary hover:text-white">
                <Upload className="mr-2 h-4 w-4" /> Import CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport} className="hover:bg-secondary hover:text-white">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" onClick={() => setShowFilterPanel(true)} className="hover:bg-secondary hover:text-white active:bg-secondary">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setShowSettings(true)} className="hover:bg-secondary hover:text-white active:bg-secondary">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className={`text-xs ${
              statusFilter === status 
                ? "bg-primary hover:bg-secondary active:bg-secondary" 
                : "hover:bg-secondary hover:text-white active:bg-secondary"
            }`}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card 
            key={employee.id} 
            className={`hover:shadow-lg hover:border-secondary transition-all duration-200 cursor-pointer border-t-4 ${getDepartmentColor(employee.department)} transform hover:scale-105 active:scale-95`}
            onClick={() => handleViewEmployee(employee.id)}
          >
            <CardContent className="p-6">
              {/* Employee Header */}
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={employee.imageUrl} alt={employee.name} />
                  <AvatarFallback className="text-lg font-semibold bg-secondary-50 text-secondary-700">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate text-brand-gray">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{employee.position}</p>
                  <Badge 
                    variant="outline" 
                    className={`mt-2 text-xs ${getStatusColor(employee.status)}`}
                  >
                    {employee.status}
                  </Badge>
                </div>
              </div>

              {/* Employee Details */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className={`w-3 h-3 rounded-full mr-2 ${employee.department === 'Engineering' ? 'bg-green-500' : 
                    employee.department === 'Marketing' ? 'bg-blue-500' :
                    employee.department === 'Finance' ? 'bg-purple-500' :
                    employee.department === 'Product' ? 'bg-orange-500' :
                    employee.department === 'Sales' ? 'bg-red-500' :
                    employee.department === 'Customer Support' ? 'bg-teal-500' :
                    employee.department === 'Human Resources' ? 'bg-pink-500' : 'bg-gray-500'}`}></div>
                  <span>{employee.department}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{employee.email}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{employee.location}</span>
                </div>
              </div>

              {/* View Profile Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4 hover:bg-secondary hover:text-white active:bg-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewEmployee(employee.id);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No employees found matching your criteria</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Employee Form Dialog */}
      {showEmployeeForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-center items-start overflow-y-auto pt-10">
          <div className="w-full max-w-4xl mx-auto p-4">
            <div className="bg-background rounded-lg shadow-lg border">
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-brand-gray">Add Employee</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowEmployeeForm(false)}
                    className="hover:bg-secondary hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
                <EmployeeForm
                  onSaved={() => {
                    setShowEmployeeForm(false);
                    void refreshEmployees();
                  }}
                  onCancel={() => setShowEmployeeForm(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      <EmployeeFilter
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        onApplyFilters={() => {
          toast({
            title: "Filters applied",
            description: "Employee directory has been filtered"
          });
        }}
      />

      {/* Settings Panel */}
      <EmployeeSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default EmployeeDirectory;
