
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  Settings,
  Clock,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

const Attendance = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return (
      <Card className="p-6">
        <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You must be logged in to access attendance records.
        </p>
      </Card>
    );
  }

  const isAdminOrHR = user && ['admin', 'hr'].includes(user.role);
  
  const navigationItems = [
    {
      title: "Dashboard",
      description: "Check-in/out and daily overview",
      icon: LayoutDashboard,
      path: "/attendance/dashboard",
      color: "bg-blue-500"
    },
    {
      title: "Attendance Log", 
      description: "View attendance history and records",
      icon: Calendar,
      path: "/attendance/log",
      color: "bg-green-500"
    },
    {
      title: "Reports",
      description: "Generate attendance reports and analytics", 
      icon: BarChart3,
      path: "/attendance/reports",
      color: "bg-purple-500"
    }
  ];

  if (isAdminOrHR) {
    navigationItems.push({
      title: "Settings",
      description: "Configure attendance policies and locations",
      icon: Settings, 
      path: "/attendance/settings",
      color: "bg-gray-500"
    });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">
            Manage your attendance, view reports, and track working hours
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Card className={cn(
              "h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer",
              "border-2 hover:border-primary/20"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", item.color)}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Access Section */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/attendance/submissions">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Report Submissions
            </Button>
          </Link>
          <Link to="/attendance/dashboard">
            <Button className="gap-2">
              <Clock className="h-4 w-4" />
              Check In/Out
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
