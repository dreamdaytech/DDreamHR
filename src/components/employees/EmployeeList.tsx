
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  PlusCircle,
  MoreHorizontal,
  Download,
  Upload,
  Filter,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  SortAsc,
  SortDesc,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import EmployeeForm from '@/components/employees/EmployeeForm';
import EmployeeFilter, { type EmployeeFilterValues } from '@/components/employees/EmployeeFilter';
import DepartmentForm from '@/components/employees/DepartmentForm';

type Employee = {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Terminated' | 'Probation' | 'Notice Period';
  imageUrl?: string;
};

type Department = {
  id: number;
  name: string;
  mailAlias?: string;
  addedBy: string;
  addedTime: string;
  modifiedBy: string;
  modifiedTime: string;
};

type SortField = 'name' | 'email' | 'department' | 'position' | 'status';
type SortOrder = 'asc' | 'desc';

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock employee data
  const employees: Employee[] = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      department: 'Engineering',
      position: 'Senior Developer',
      status: 'Active',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      status: 'Active',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      department: 'Sales',
      position: 'Sales Representative',
      status: 'On Leave',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      department: 'HR',
      position: 'HR Manager',
      status: 'Active',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      department: 'Finance',
      position: 'Financial Analyst',
      status: 'Inactive',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 6,
      name: 'Jennifer Davis',
      email: 'jennifer.davis@example.com',
      department: 'IT',
      position: 'IT Support',
      status: 'Active',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 7,
      name: 'David Miller',
      email: 'david.miller@example.com',
      department: 'Engineering',
      position: 'Software Engineer',
      status: 'Notice Period',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 8,
      name: 'Lisa Wilson',
      email: 'lisa.wilson@example.com',
      department: 'Marketing',
      position: 'Content Strategist',
      status: 'Probation',
      imageUrl: '/placeholder.svg'
    },
  ];

  const departments: Department[] = [
    {
      id: 1,
      name: 'IT',
      mailAlias: 'it@company.com',
      addedBy: 'Admin',
      addedTime: '2023-05-15 09:30 AM',
      modifiedBy: 'Admin',
      modifiedTime: '2023-05-15 09:30 AM'
    },
    {
      id: 2,
      name: 'HR',
      mailAlias: 'hr@company.com',
      addedBy: 'Admin',
      addedTime: '2023-05-15 09:30 AM',
      modifiedBy: 'Admin',
      modifiedTime: '2023-05-15 09:30 AM'
    },
    {
      id: 3,
      name: 'Marketing',
      mailAlias: 'marketing@company.com',
      addedBy: 'Admin',
      addedTime: '2023-05-15 09:30 AM',
      modifiedBy: 'Admin',
      modifiedTime: '2023-05-15 09:30 AM'
    },
    {
      id: 4,
      name: 'Finance',
      mailAlias: 'finance@company.com',
      addedBy: 'Admin',
      addedTime: '2023-05-15 09:30 AM',
      modifiedBy: 'Admin',
      modifiedTime: '2023-05-15 09:30 AM'
    },
  ];

  // Sort employees
  const sortEmployees = (a: Employee, b: Employee) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortField === 'department') {
      comparison = a.department.localeCompare(b.department);
    } else if (sortField === 'position') {
      comparison = a.position.localeCompare(b.position);
    } else if (sortField === 'status') {
      comparison = a.status.localeCompare(b.status);
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  };

  const filteredEmployees = employees
    .filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(sortEmployees);

  const handleViewEmployee = (id: number) => {
    navigate(`/employees/${id}`);
  };

  const handleImport = () => {
    toast({
      title: "Import started",
      description: "Your employee data is being processed"
    });
  };

  const handleExport = () => {
    toast({
      title: "Export complete",
      description: "Your employee data has been exported"
    });
  };

  const handleAddDepartment = (data: { name: string, mailAlias?: string }) => {
    toast({
      title: "Department added",
      description: `Department "${data.name}" has been added successfully`
    });
    setShowDepartmentForm(false);
  };

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Terminated':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Probation':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Notice Period':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleFilterApply = (filters: EmployeeFilterValues) => {
    toast({
      title: "Filters applied",
      description: "Employee list has been filtered according to your criteria"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Employee Management</h1>
        <Button onClick={() => setShowEmployeeForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Import/Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleImport}>
                <Upload className="mr-2 h-4 w-4" /> Import
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" onClick={() => setShowFilterPanel(true)}>
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEmployeeForm(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDepartmentForm(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Department
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>
                <div className="flex items-center">
                  Employee
                  {sortField === 'name' && (
                    sortOrder === 'asc' ? 
                    <SortAsc className="ml-2 h-4 w-4" /> : 
                    <SortDesc className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('department')}>
                <div className="flex items-center">
                  Department
                  {sortField === 'department' && (
                    sortOrder === 'asc' ? 
                    <SortAsc className="ml-2 h-4 w-4" /> : 
                    <SortDesc className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('position')}>
                <div className="flex items-center">
                  Position
                  {sortField === 'position' && (
                    sortOrder === 'asc' ? 
                    <SortAsc className="ml-2 h-4 w-4" /> : 
                    <SortDesc className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('status')}>
                <div className="flex items-center">
                  Status
                  {sortField === 'status' && (
                    sortOrder === 'asc' ? 
                    <SortAsc className="ml-2 h-4 w-4" /> : 
                    <SortDesc className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={employee.imageUrl} alt={employee.name} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewEmployee(employee.id)}>
                          <Eye className="mr-2 h-4 w-4" /> View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Feature coming soon" })}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => toast({ title: "Feature coming soon" })}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No employees found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Employee Form Dialog */}
      {showEmployeeForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-center items-start overflow-y-auto pt-10">
          <div className="w-full max-w-4xl mx-auto p-4">
            <div className="bg-background rounded-lg shadow-lg border">
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Add Employee</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowEmployeeForm(false)}
                  >
                    ✕
                  </Button>
                </div>
                <EmployeeForm />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Department Form */}
      <DepartmentForm 
        isOpen={showDepartmentForm}
        onClose={() => setShowDepartmentForm(false)}
        onSubmit={handleAddDepartment}
      />

      {/* Filter Panel */}
      <EmployeeFilter
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        onApplyFilters={handleFilterApply}
      />
    </div>
  );
};

export default EmployeeList;
