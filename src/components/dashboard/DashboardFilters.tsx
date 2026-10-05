
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Calendar,
  Filter,
  Users,
  Building 
} from 'lucide-react';

interface DashboardFiltersProps {
  selectedRole?: string;
  selectedDepartment?: string;
  selectedDateRange?: string;
  onRoleChange: (role: string) => void;
  onDepartmentChange: (department: string) => void;
  onDateRangeChange: (range: string) => void;
  availableRoles: string[];
  availableDepartments: string[];
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  selectedRole,
  selectedDepartment,
  selectedDateRange,
  onRoleChange,
  onDepartmentChange,
  onDateRangeChange,
  availableRoles,
  availableDepartments
}) => {
  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const activeFiltersCount = [selectedRole, selectedDepartment, selectedDateRange].filter(Boolean).length;

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {activeFiltersCount} active
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={selectedRole} onValueChange={onRoleChange}>
          <SelectTrigger className="w-32">
            <Users className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {availableRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-40">
            <Building className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {availableDepartments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-36">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              onRoleChange('');
              onDepartmentChange('');
              onDateRangeChange('');
            }}
            className="text-gray-500"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};
