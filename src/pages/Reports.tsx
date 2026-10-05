
import { useAuth } from "@/context/AuthContext";
import ReportsModule from "@/components/reports/ReportsModule";
import { Card } from "@/components/ui/card";

const Reports = () => {
  const { user } = useAuth();
  
  // Only allow access to authorized roles
  if (!user || !['admin', 'hr', 'manager'].includes(user.role)) {
    return (
      <Card className="p-6">
        <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to access attendance reports.
        </p>
      </Card>
    );
  }
  
  return <ReportsModule />;
};

export default Reports;
