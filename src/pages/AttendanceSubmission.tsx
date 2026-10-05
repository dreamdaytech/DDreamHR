
import { useAuth } from "@/context/AuthContext";
import { AttendanceReportModule } from "@/components/attendance/report/AttendanceReportModule";
import { Card } from "@/components/ui/card";

const AttendanceSubmission = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Card className="p-6">
        <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You must be logged in to access attendance report submission.
        </p>
      </Card>
    );
  }
  
  return <AttendanceReportModule />;
};

export default AttendanceSubmission;
