import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { AttendanceCheckInOut } from './AttendanceCheckInOut';
import { AttendanceCalendar } from './AttendanceCalendar';
import { AttendanceStats } from './AttendanceStats';
import { AttendanceSummary } from './AttendanceSummary';
import { AttendanceSettingsPanel } from './settings/AttendanceSettingsPanel';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  ClipboardCheck,
  Settings,
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const AttendanceTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  // Use user.role to determine permissions and views
  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';
  const isManager = user?.role === 'manager';
  const isSuperAdmin = user?.role === 'super_admin';
  const isAdminView = isAdmin || isHR || isSuperAdmin;

  // Generate summary stats
  const summary = {
    present: 98,
    late: 5,
    absent: 3,
    remote: 12,
    total: 118,
  };

  // Map user role to attendance component expected role
  const getAttendanceRole = () => {
    if (user?.role === 'super_admin') return 'admin'; // Super admin gets admin privileges for attendance
    return user?.role || 'employee';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">
            Track, manage and regularize attendance records
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/attendance/submissions">
            <Button variant="outline">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Report Submissions
            </Button>
          </Link>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">{format(new Date(), 'EEEE, MMMM d, yyyy')}</div>
            <div className="font-semibold">{format(new Date(), 'hh:mm a')}</div>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards - Only show for admin/HR/super_admin */}
      {isAdminView && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-800">Present</p>
                <p className="text-2xl font-bold text-green-900">{summary.present}</p>
                <p className="text-sm text-green-700">{Math.round((summary.present / summary.total) * 100)}%</p>
              </div>
              <div className="p-3 rounded-full bg-green-200">
                <Users className="h-5 w-5 text-green-700" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-yellow-800">Late</p>
                <p className="text-2xl font-bold text-yellow-900">{summary.late}</p>
                <p className="text-sm text-yellow-700">{Math.round((summary.late / summary.total) * 100)}%</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-200">
                <Clock className="h-5 w-5 text-yellow-700" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-red-800">Absent</p>
                <p className="text-2xl font-bold text-red-900">{summary.absent}</p>
                <p className="text-sm text-red-700">{Math.round((summary.absent / summary.total) * 100)}%</p>
              </div>
              <div className="p-3 rounded-full bg-red-200">
                <Users className="h-5 w-5 text-red-700" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-800">Remote</p>
                <p className="text-2xl font-bold text-blue-900">{summary.remote}</p>
                <p className="text-sm text-blue-700">{Math.round((summary.remote / summary.total) * 100)}%</p>
              </div>
              <div className="p-3 rounded-full bg-blue-200">
                <MapPin className="h-5 w-5 text-blue-700" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-purple-800">Regularization</p>
                <p className="text-2xl font-bold text-purple-900">7</p>
                <p className="text-sm text-purple-700">Pending requests</p>
              </div>
              <div className="p-3 rounded-full bg-purple-200">
                <FileText className="h-5 w-5 text-purple-700" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Log</TabsTrigger>
          {isAdminView && <TabsTrigger value="reports">Reports</TabsTrigger>}
          {isAdminView && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6 mt-6">
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
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-6">
          <AttendanceSummary userRole={getAttendanceRole() as 'admin' | 'hr' | 'manager' | 'employee'} />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>
                Generate and view detailed attendance reports
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
              <p className="text-muted-foreground mb-4">Access detailed attendance reports and analysis</p>
              <div className="flex gap-4">
                <Link to="/reports">
                  <Button>
                    View Analytics Reports
                  </Button>
                </Link>
                <Link to="/attendance/submissions">
                  <Button variant="outline">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Manage Report Submissions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <AttendanceSettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceTracker;
