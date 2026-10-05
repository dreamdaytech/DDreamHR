
import { useAuth } from "@/context/AuthContext";
import { AttendanceCheckInOut } from "@/components/attendance/AttendanceCheckInOut";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { AttendanceCalendar } from "@/components/attendance/AttendanceCalendar";
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';

const AttendanceDashboard = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Card className="p-6">
        <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You must be logged in to access attendance dashboard.
        </p>
      </Card>
    );
  }

  // Map user role to attendance component expected role
  const getAttendanceRole = () => {
    if (user?.role === 'super_admin') return 'admin'; // Super admin gets admin privileges for attendance
    return user?.role || 'employee';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Dashboard</h1>
          <p className="text-muted-foreground">
            Track your daily attendance and working hours
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">{format(new Date(), 'EEEE, MMMM d, yyyy')}</div>
          <div className="font-semibold">{format(new Date(), 'hh:mm a')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Check In/Out */}
        <div className="lg:col-span-1">
          <AttendanceCheckInOut />
        </div>
        
        {/* Right column - Calendar & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <AttendanceStats userRole={getAttendanceRole() as 'admin' | 'hr' | 'manager' | 'employee'} />
          <AttendanceCalendar />
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
