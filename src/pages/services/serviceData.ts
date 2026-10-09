
import {
  Users,
  Calendar,
  Clock,
  FileText,
  UserPlus,
  Heart,
  Megaphone,
  FileSpreadsheet,
  CalendarDays,
  UserCheck,
  Briefcase,
  BookOpen,
  UserX,
  type LucideIcon,
} from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  route: string;
  roles: string[];
}

export const getServiceItems = (userRole?: string): ServiceItem[] => [
  {
    id: 'employee-directory',
    title: 'Employee Directory',
    description: 'View and manage employee information',
    icon: Users,
    iconColor: 'bg-blue-500',
    route: '/employees',
    roles: ['admin', 'hr']
  },
  {
    id: 'hr-lifecycle',
    title: 'HR Lifecycle',
    description: 'Manage employee journey from hire to retire',
    icon: UserCheck,
    iconColor: 'bg-indigo-500',
    route: '/hr-lifecycle',
    roles: ['admin', 'hr', 'manager', 'employee']
  },
  {
    id: 'preboarding',
    title: 'Preboarding',
    description: 'Prepare new hires before their start date',
    icon: BookOpen,
    iconColor: 'bg-purple-500',
    route: '/hr-lifecycle/preboarding',
    roles: ['admin', 'hr']
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    description: 'Guide new employees through their first days',
    icon: UserPlus,
    iconColor: 'bg-green-500',
    route: '/hr-lifecycle/onboarding',
    roles: ['admin', 'hr', 'manager']
  },
  {
    id: 'employee-portal',
    title: 'Employee Portal',
    description: 'Self-service portal for new employees',
    icon: Briefcase,
    iconColor: 'bg-teal-500',
    route: '/hr-lifecycle/portal',
    roles: ['admin', 'hr', 'manager', 'employee']
  },
  {
    id: 'offboarding',
    title: 'Offboarding',
    description: 'Manage employee departures and transitions',
    icon: UserX,
    iconColor: 'bg-red-500',
    route: '/hr-lifecycle/offboarding',
    roles: ['admin', 'hr', 'manager']
  },
  {
    id: 'leave-tracking',
    title: 'Leave Tracking',
    description: 'Manage leave requests and balances',
    icon: CalendarDays,
    iconColor: 'bg-emerald-500',
    route: '/leave-tracking',
    roles: ['admin', 'hr', 'manager', 'employee']
  },
  {
    id: 'attendance',
    title: 'Attendance',
    description: 'Track daily attendance and work hours',
    icon: Calendar,
    iconColor: 'bg-purple-500',
    route: '/attendance',
    roles: ['admin', 'hr', 'manager', 'employee']
  },
  {
    id: 'time-tracker',
    title: 'Time Tracker',
    description: 'Monitor project time and productivity',
    icon: Clock,
    iconColor: 'bg-teal-500',
    route: '/time-tracking',
    roles: ['admin', 'hr', 'manager', 'employee']
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Access and manage important files',
    icon: FileText,
    iconColor: 'bg-orange-500',
    route: '/documents',
    roles: ['admin', 'hr', 'manager', 'employee']
  },
  {
    id: 'employee-engagement',
    title: 'Employee Engagement',
    description: 'Boost team morale and satisfaction',
    icon: Heart,
    iconColor: 'bg-pink-500',
    route: '/engagement',
    roles: ['admin', 'hr', 'manager', 'employee']
  }
].filter(service => 
  !userRole || service.roles.includes(userRole)
);
