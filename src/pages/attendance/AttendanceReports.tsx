
import { useAuth } from "@/context/AuthContext";
import { AttendanceReportModule } from "@/components/attendance/report/AttendanceReportModule";
import ReportsModule from "@/components/reports/ReportsModule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ClipboardCheck, BarChart3 } from "lucide-react";

const AttendanceReports = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Card className="p-6">
        <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You must be logged in to access attendance reports.
        </p>
      </Card>
    );
  }

  const isAdminOrHR = user && ['admin', 'hr', 'manager'].includes(user.role);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Reports</h1>
          <p className="text-muted-foreground">
            Generate and view detailed attendance reports and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/attendance/submissions">
            <Button variant="outline">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Report Submissions
            </Button>
          </Link>
        </div>
      </div>

      {isAdminOrHR ? (
        <ReportsModule />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Employee Report Access</CardTitle>
            <CardDescription>
              Access your personal attendance reports and submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-muted-foreground mb-4">Submit and track your attendance reports</p>
            <div className="flex gap-4">
              <Link to="/attendance/submissions">
                <Button>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  My Report Submissions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceReports;
