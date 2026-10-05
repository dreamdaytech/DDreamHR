
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
    <div className="mb-4 grid gap-4">
      <div className="rounded-lg border border-border bg-muted/35 p-3 text-foreground">
        <div className="text-sm font-medium text-muted-foreground">Status</div>
        <div className="mt-1 flex items-center">
          <div className={cn(
            "mr-2 h-3 w-3 rounded-full",
            isCheckedIn ? "bg-green-500" : "bg-muted-foreground/50"
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
        <div className="rounded-lg border border-border bg-muted/35 p-3 text-foreground">
          <div className="text-sm font-medium text-muted-foreground">Today's Record</div>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-muted-foreground">Check In</div>
              <div className="font-medium">{todayAttendance.checkIn || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Check Out</div>
              <div className="font-medium">{todayAttendance.checkOut || '-'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
