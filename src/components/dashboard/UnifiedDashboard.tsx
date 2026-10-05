
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAttendance } from '@/context/AttendanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CheckInSection } from './CheckInSection';
import {
  Clock,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart3,
  MapPin,
  Bell,
  Play,
  Pause,
  UserCheck,
  Building,
  Timer,
  ClipboardList,
  TrendingUp,
  Star
} from 'lucide-react';
import { format } from 'date-fns';

interface QuickActionProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
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

const QuickActionCard: React.FC<QuickActionProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  onClick,
  badge,
  subtitle
}) => (
  <Card 
    className={`${bgColor} border-0 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
    onClick={onClick}
  >
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-sm font-medium ${color}`}>{title}</h3>
            {badge && (
              <Badge variant="secondary" className="text-xs bg-white/20 text-gray-700">
                {badge}
              </Badge>
            )}
          </div>
          <p className={`text-2xl font-bold ${color.replace('text-', 'text-').replace('-600', '-900')}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs ${color.replace('-600', '-700')} mt-1`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColor.replace('bg-', 'bg-').replace('-50', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isCheckedIn, isOnBreak, todayAttendance } = useAttendance();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Role-based permissions
  const isManager = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager';
  const isHR = user?.role === 'hr';
  const isAdmin = user?.role === 'admin';

  // Mock data - in real app, this would come from APIs
  const [notifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Leave Request',
      message: 'John Doe submitted a leave request',
      type: 'info',
      time: '2 hours ago'
    },
    {
      id: '2',
      title: 'Timesheet Due',
      message: 'Weekly timesheet submission due tomorrow',
      type: 'warning',
      time: '1 day ago'
    }
  ]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getCurrentTime = () => {
    return format(new Date(), 'EEEE, MMMM d, yyyy • hh:mm a');
  };

  const getAttendanceStatus = () => {
    if (isOnBreak) return { status: 'On Break', color: 'text-yellow-600' };
    if (!isCheckedIn) return { status: 'Not checked in', color: 'text-red-600' };
    
    const checkInTime = todayAttendance?.checkIn;
    if (checkInTime) {
      const workingHours = Math.floor((Date.now() - new Date(`${todayAttendance.date}T${checkInTime}`).getTime()) / (1000 * 60 * 60));
      return { 
        status: `Working for ${workingHours}h`, 
        color: 'text-green-600' 
      };
    }
    return { status: 'Checked in', color: 'text-green-600' };
  };

  const attendanceStatus = getAttendanceStatus();

  const quickActions = [
    {
      title: 'Hours Today',
      value: todayAttendance?.totalHours || '0h',
      icon: Timer,
      color: 'text-secondary-700',
      bgColor: 'bg-secondary-50',
      onClick: () => navigate('/time-tracking'),
      subtitle: attendanceStatus.status
    },
    {
      title: 'Leave Balance',
      value: '15',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => navigate('/leave-tracking'),
      subtitle: 'days remaining'
    },
    {
      title: 'Pending Tasks',
      value: '7',
      icon: ClipboardList,
      color: 'text-primary-700',
      bgColor: 'bg-primary-50',
      onClick: () => navigate('/time-tracking'),
      badge: '2 urgent'
    },
    {
      title: 'Team Status',
      value: isManager ? '98%' : '24',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => navigate(isManager ? '/attendance' : '/employees'),
      subtitle: isManager ? 'attendance rate' : 'team members'
    }
  ];

  const moduleCards = [
    {
      title: 'Time Tracking',
      description: 'Log hours and manage projects',
      icon: Clock,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      route: '/time-tracking',
      stats: '6.5h today'
    },
    {
      title: 'Leave Management',
      description: 'Request and track leave',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/leave-tracking',
      stats: '15 days left'
    },
    {
      title: 'Employee Directory',
      description: 'View team information',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/employees',
      stats: '124 employees'
    },
    {
      title: 'Reports & Analytics',
      description: 'View insights and reports',
      icon: BarChart3,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      route: '/reports',
      stats: 'Updated daily'
    }
  ];

  if (isManager) {
    moduleCards.push({
      title: 'Approvals',
      description: 'Review pending requests',
      icon: CheckCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      route: '/approvals',
      stats: '3 pending'
    });
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-brand-gray">
            {getGreeting()}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">{getCurrentTime()}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="capitalize border-primary text-primary">
              {user?.role}
            </Badge>
            <span className={`text-sm font-medium ${attendanceStatus.color}`}>
              • {attendanceStatus.status}
            </span>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="relative border-primary text-primary hover:bg-primary-50">
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Priority Check-In Section */}
      <CheckInSection />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>

      {/* Main Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moduleCards.map((module, index) => (
          <Card 
            key={index}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 border-0 shadow-md"
            onClick={() => navigate(module.route)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${module.bgColor}`}>
                  <module.icon className={`h-6 w-6 ${module.color}`} />
                </div>
                <Badge variant="secondary" className="text-xs bg-gray-100 text-brand-gray">
                  {module.stats}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardTitle className="text-lg mb-2 text-brand-gray">{module.title}</CardTitle>
              <p className="text-gray-600 text-sm">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-gray">
              <Star className="h-5 w-5 text-yellow-500" />
              Today's Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Perfect Attendance</p>
                  <p className="text-sm text-green-700">7 days in a row!</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                <Timer className="h-5 w-5 text-secondary-600" />
                <div>
                  <p className="font-medium text-secondary-900">Project Milestone</p>
                  <p className="text-sm text-secondary-700">Website redesign 80% complete</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-gray">
              <Bell className="h-5 w-5 text-secondary-500" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'warning' ? 'bg-yellow-500' : 'bg-secondary-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-brand-gray">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
