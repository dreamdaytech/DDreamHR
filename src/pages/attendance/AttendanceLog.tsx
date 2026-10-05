
import { useAuth } from "@/context/AuthContext";
import { AttendanceSummary } from "@/components/attendance/AttendanceSummary";
import { Card } from "@/components/ui/card";

const AttendanceLog = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Card className="p-6">
        <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You must be logged in to access attendance logs.
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Log</h1>
        <p className="text-muted-foreground">
          View your attendance history and detailed records
        </p>
      </div>

      <AttendanceSummary userRole={getAttendanceRole() as 'admin' | 'hr' | 'manager' | 'employee'} />
    </div>
  );
};

export default AttendanceLog;
