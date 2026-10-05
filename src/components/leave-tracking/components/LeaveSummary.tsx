
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { LeaveType } from '../data/leaveTypes';

interface LeaveSummaryProps {
  totalDays: number;
  selectedLeaveType: LeaveType | undefined;
}

export const LeaveSummary: React.FC<LeaveSummaryProps> = ({
  totalDays,
  selectedLeaveType
}) => {
  if (totalDays === 0) return null;

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-blue-600" />
        <span className="font-medium">
          Total Leave Days: {totalDays} {totalDays === 1 ? 'day' : 'days'}
        </span>
      </div>
      {selectedLeaveType && totalDays > selectedLeaveType.balance && (
        <div className="flex items-center gap-2 mt-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            Insufficient balance. You need {totalDays - selectedLeaveType.balance} more days.
          </span>
        </div>
      )}
    </div>
  );
};
