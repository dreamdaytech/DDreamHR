
import React from 'react';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReportFiltersProps {
  startDate: Date;
  endDate: Date;
  department: string;
  location: string;
  employee: string;
  onFilterChange: (
    startDate: Date, 
    endDate: Date, 
    department: string,
    location: string,
    employee: string
  ) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  startDate,
  endDate,
  department,
  location,
  employee,
  onFilterChange,
}) => {
  // Mock data for filters
  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'eng', name: 'Engineering' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'fin', name: 'Finance' },
    { id: 'mkt', name: 'Marketing' }
  ];
  
  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'hq', name: 'Headquarters' },
    { id: 'remote', name: 'Remote' },
    { id: 'branch1', name: 'Branch Office 1' },
    { id: 'branch2', name: 'Branch Office 2' }
  ];
  
  const employees = [
    { id: 'all', name: 'All Employees' },
    { id: '1', name: 'John Admin' },
    { id: '2', name: 'Jane HR' },
    { id: '3', name: 'Sam Employee' },
    { id: '4', name: 'Alex Manager' }
  ];

  return (
    <Card className="border-border/40">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal w-[180px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(startDate, 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && onFilterChange(date, endDate, department, location, employee)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <span className="hidden sm:block">to</span>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal w-[180px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(endDate, 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && onFilterChange(startDate, date, department, location, employee)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select 
              value={department || 'all'} 
              onValueChange={(value) => onFilterChange(startDate, endDate, value, location, employee)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select 
              value={location || 'all'} 
              onValueChange={(value) => onFilterChange(startDate, endDate, department, value, employee)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select 
              value={employee || 'all'} 
              onValueChange={(value) => onFilterChange(startDate, endDate, department, location, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
