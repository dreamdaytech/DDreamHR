
import { 
  Clock, 
  Calendar, 
  Users, 
  BarChart3, 
  FileText, 
  Shield, 
  Settings,
  CreditCard,
  Building2,
  Workflow,
  Bell,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export interface MenuItem {
  id: string;
  title: string;
  icon: any;
  route: string;
  iconColor: string;
  hasSubmenu?: boolean;
}

// Primary menu items (main features)
export const primaryMenuItems: MenuItem[] = [
  {
    id: 'time-tracking',
    title: 'Time Tracking',
    icon: Clock,
    route: '/time-tracking',
    iconColor: 'bg-blue-500',
  },
  {
    id: 'leave-tracking',
    title: 'Leave Tracking',
    icon: Calendar,
    route: '/leave-tracking',
    iconColor: 'bg-green-500',
  },
  {
    id: 'hr-lifecycle',
    title: 'HR Lifecycle',
    icon: Users,
    route: '/hr-lifecycle',
    iconColor: 'bg-purple-500',
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    icon: BarChart3,
    route: '/reports',
    iconColor: 'bg-orange-500',
  },
  {
    id: 'documents',
    title: 'Documents',
    icon: FileText,
    route: '/documents',
    iconColor: 'bg-indigo-500',
  }
];

// Secondary menu items (settings and utilities)
export const secondaryMenuItems: MenuItem[] = [
  {
    id: 'general-settings',
    title: 'General Settings',
    icon: Settings,
    route: '/settings',
    iconColor: 'bg-gray-600',
  },
  {
    id: 'user-management',
    title: 'User Management',
    icon: Shield,
    route: '/employees',
    iconColor: 'bg-red-500',
  },
  {
    id: 'company-profile',
    title: 'Company Profile',
    icon: Building2,
    route: '/settings',
    iconColor: 'bg-teal-500',
  },
  {
    id: 'workflows',
    title: 'Workflows',
    icon: Workflow,
    route: '/settings',
    iconColor: 'bg-pink-500',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    route: '/settings',
    iconColor: 'bg-yellow-500',
  },
  {
    id: 'help-center',
    title: 'Help Center',
    icon: HelpCircle,
    route: '/help',
    iconColor: 'bg-cyan-500',
  }
];
