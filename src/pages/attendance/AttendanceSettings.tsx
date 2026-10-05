
import { useAuth } from "@/context/AuthContext";
import { AttendanceSettingsPanel } from "@/components/attendance/settings/AttendanceSettingsPanel";
import { Card } from "@/components/ui/card";

const AttendanceSettings = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Card className="p-6">
        <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You must be logged in to access attendance settings.
        </p>
      </Card>
    );
  }

  const isAdminOrHR = user && ['admin', 'hr'].includes(user.role);

  if (!isAdminOrHR) {
    return (
      <Card className="p-6">
        <h1 className="text-xl font-semibold mb-2">Access Restricted</h1>
        <p className="text-muted-foreground">
          Only Admin and HR users can access attendance settings.
        </p>
      </Card>
    );
  }

  return <AttendanceSettingsPanel />;
};

export default AttendanceSettings;
