
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LeaveType } from '../data/leaveTypes';

interface LeaveTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  leaveTypes: LeaveType[];
}

export const LeaveTypeSelector: React.FC<LeaveTypeSelectorProps> = ({
  value,
  onChange,
  leaveTypes
}) => {
  const selectedLeaveType = leaveTypes.find(type => type.value === value);

  return (
    <div className="space-y-2">
      <Label htmlFor="leave-type">Leave Type *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select leave type" />
        </SelectTrigger>
        <SelectContent>
          {leaveTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex items-center justify-between w-full">
                <span>{type.label}</span>
                <Badge variant="secondary" className="ml-2">
                  {type.balance} days
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedLeaveType && (
        <p className="text-sm text-muted-foreground">
          Available balance: {selectedLeaveType.balance} days
        </p>
      )}
    </div>
  );
};
