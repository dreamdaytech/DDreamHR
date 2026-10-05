
import { cn } from '@/lib/utils';
import { AttendanceRecord } from '@/types/attendance';

interface AttendanceStatusProps {
  isCheckedIn: boolean;
  isOnBreak: boolean;
  todayAttendance: AttendanceRecord | null;
}

export const AttendanceStatus = ({ 
  isCheckedIn, 
  isOnBreak,
  todayAttendance 
}: AttendanceStatusProps) => {
  return (
    <div className="grid gap-4 mb-4">
      <div className="bg-white p-3 rounded-lg border border-blue-200">
        <div className="text-sm font-medium text-slate-500">Status</div>
        <div className="flex items-center mt-1">
          <div className={cn(
            "h-3 w-3 rounded-full mr-2",
            isCheckedIn ? "bg-green-500" : "bg-gray-300"
          )} />
          <span className="font-medium">
            {isCheckedIn 
              ? isOnBreak 
                ? 'On Break' 
                : 'Checked In' 
              : 'Not Checked In'}
          </span>
        </div>
      </div>
      
      {todayAttendance && (
        <div className="bg-white p-3 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-slate-500">Today's Record</div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <div className="text-xs text-slate-500">Check In</div>
              <div className="font-medium">{todayAttendance.checkIn || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Check Out</div>
              <div className="font-medium">{todayAttendance.checkOut || '-'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
