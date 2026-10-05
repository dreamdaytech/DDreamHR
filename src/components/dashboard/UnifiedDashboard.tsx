import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAttendance } from '@/context/AttendanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { CheckInSection } from './CheckInSection';
import { Clock, Calendar, Users, FileText, CheckCircle, BarChart3, Bell, UserCheck, Timer, ClipboardList, Star } from 'lucide-react';
import { format } from 'date-fns';

interface QuickActionProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  onClick?: () => void;
  badge?: string;
  subtitle?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  time: string;
}

interface ModuleCard {
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  stats: string;
}

const QuickActionCard: React.FC<QuickActionProps> = ({ title, value, icon: Icon, onClick, badge, subtitle }) => (
  <Card className="cursor-pointer border-border bg-card text-card-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md" onClick={onClick}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
          </div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-full bg-muted p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isCheckedIn, isOnBreak, todayAttendance } = useAttendance();
  const navigate = useNavigate();

  const isManager = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager';
  const canManagePeople = user?.role === 'admin' || user?.role === 'hr';

  const notifications: NotificationItem[] = isManager
    ? [
        { id: '1', title: 'Leave Request', message: 'A team member submitted a leave request', type: 'info', time: '2 hours ago' },
        { id: '2', title: 'Timesheet Review', message: 'Weekly timesheets are ready for review', type: 'warning', time: '1 day ago' },
      ]
    : [
        { id: '1', title: 'Timesheet Due', message: 'Your weekly timesheet is due tomorrow', type: 'warning', time: '1 day ago' },
        { id: '2', title: 'Document Reminder', message: 'Review your latest employee documents', type: 'info', time: '2 days ago' },
      ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getAttendanceStatus = () => {
    if (isOnBreak) return { status: 'On Break', className: 'text-amber-500' };
    if (!isCheckedIn) return { status: 'Not checked in', className: 'text-red-500' };
    const checkInTime = todayAttendance?.checkIn;
    if (checkInTime) {
      const workingHours = Math.floor((Date.now() - new Date(`${todayAttendance.date}T${checkInTime}`).getTime()) / (1000 * 60 * 60));
      return { status: `Working for ${workingHours}h`, className: 'text-emerald-500' };
    }
    return { status: 'Checked in', className: 'text-emerald-500' };
  };

  const attendanceStatus = getAttendanceStatus();

  const quickActions: QuickActionProps[] = [
    { title: 'Hours Today', value: todayAttendance?.totalHours || '0h', icon: Timer, onClick: () => navigate('/attendance'), subtitle: attendanceStatus.status },
    { title: 'Leave Balance', value: '15', icon: Calendar, onClick: () => navigate('/leave-tracking'), subtitle: 'days remaining' },
    { title: isManager ? 'Needs Attention' : 'Timesheet', value: isManager ? '7' : 'Due', icon: ClipboardList, onClick: () => navigate(isManager ? '/approvals' : '/time-tracking'), badge: isManager ? '2 urgent' : undefined, subtitle: isManager ? 'pending actions' : 'weekly submission' },
    isManager
      ? { title: 'Team Attendance', value: '98%', icon: Users, onClick: () => navigate('/attendance'), subtitle: 'attendance rate' }
      : { title: 'My Documents', value: 'View', icon: FileText, onClick: () => navigate('/documents'), subtitle: 'employee records' },
  ];

  const moduleCards: ModuleCard[] = [
    { title: 'Attendance', description: 'Check in, review attendance, and manage exceptions', icon: Clock, route: '/attendance', stats: attendanceStatus.status },
    { title: 'Timesheets', description: 'Log hours and submit your work records', icon: ClipboardList, route: '/time-tracking', stats: 'Weekly' },
    { title: 'Leave', description: 'Request and track time off', icon: Calendar, route: '/leave-tracking', stats: '15 days left' },
    { title: 'Analytics', description: 'View workforce insights and reports', icon: BarChart3, route: '/reports', stats: 'Updated daily' },
  ];

  if (canManagePeople) moduleCards.splice(3, 0, { title: 'People', description: 'Manage employees and lifecycle activity', icon: Users, route: '/employees', stats: 'Employee records' });
  if (isManager) moduleCards.push({ title: 'Inbox', description: 'Review approvals and pending actions', icon: CheckCircle, route: '/approvals', stats: '3 pending' });

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-foreground">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{getGreeting()}, {user?.name?.split(' ')[0]}!</h1>
          <p className="mt-1 text-muted-foreground">{format(new Date(), 'EEEE, MMMM d, yyyy • hh:mm a')}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="capitalize border-primary text-primary">{user?.role}</Badge>
            <span className={`text-sm font-medium ${attendanceStatus.className}`}>• {attendanceStatus.status}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{notifications.length}</span>}
        </Button>
      </div>

      <CheckInSection />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quickActions.map((action) => <QuickActionCard key={action.title} {...action} />)}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {moduleCards.map((module) => (
          <Card key={module.title} className="cursor-pointer border-border bg-card text-card-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md" onClick={() => navigate(module.route)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-lg bg-muted p-3"><module.icon className="h-6 w-6 text-primary" /></div>
                <Badge variant="secondary" className="text-xs">{module.stats}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardTitle className="mb-2 text-lg text-foreground">{module.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="flex items-center gap-2 text-foreground"><Star className="h-5 w-5 text-amber-500" />Today's Highlights</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3"><UserCheck className="h-5 w-5 text-emerald-500" /><div><p className="font-medium text-foreground">Attendance</p><p className="text-sm text-muted-foreground">{attendanceStatus.status}</p></div></div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3"><Timer className="h-5 w-5 text-secondary" /><div><p className="font-medium text-foreground">Hours Today</p><p className="text-sm text-muted-foreground">{todayAttendance?.totalHours || '0h'} recorded</p></div></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="flex items-center gap-2 text-foreground"><Bell className="h-5 w-5 text-secondary" />Recent Notifications</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3">
                  <div className={`mt-2 h-2 w-2 rounded-full ${notification.type === 'warning' ? 'bg-amber-500' : 'bg-secondary'}`} />
                  <div className="flex-1"><p className="font-medium text-foreground">{notification.title}</p><p className="text-sm text-muted-foreground">{notification.message}</p><p className="mt-1 text-xs text-muted-foreground">{notification.time}</p></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
