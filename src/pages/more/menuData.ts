import {
  Clock,
  Calendar,
  Users,
  BarChart3,
  FileText,
  Shield,
  Settings,
  Building2,
  Workflow,
  Bell,
  type LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  title: string;
  icon: LucideIcon;
  route: string;
  iconColor: string;
  roles: Array<'admin' | 'hr' | 'manager' | 'employee'>;
  hasSubmenu?: boolean;
}

const regularRoles = ['admin', 'hr', 'manager', 'employee'];
const managerRoles = ['admin', 'hr', 'manager'];
const adminHrRoles = ['admin', 'hr'];

export const primaryMenuItems: MenuItem[] = [
  { id: 'time-tracking', title: 'Time Tracking', icon: Clock, route: '/time-tracking', iconColor: 'bg-blue-500', roles: regularRoles },
  { id: 'leave-tracking', title: 'Leave Tracking', icon: Calendar, route: '/leave-tracking', iconColor: 'bg-green-500', roles: regularRoles },
  { id: 'hr-lifecycle', title: 'HR Lifecycle', icon: Users, route: '/hr-lifecycle', iconColor: 'bg-purple-500', roles: regularRoles },
  { id: 'reports', title: 'Reports & Analytics', icon: BarChart3, route: '/reports', iconColor: 'bg-orange-500', roles: managerRoles },
  { id: 'documents', title: 'Documents', icon: FileText, route: '/documents', iconColor: 'bg-indigo-500', roles: regularRoles },
];

export const secondaryMenuItems: MenuItem[] = [
  { id: 'general-settings', title: 'General Settings', icon: Settings, route: '/settings', iconColor: 'bg-gray-600', roles: adminHrRoles },
  { id: 'user-management', title: 'User Management', icon: Shield, route: '/employees?view=directory', iconColor: 'bg-red-500', roles: adminHrRoles },
  { id: 'company-profile', title: 'Company Profile', icon: Building2, route: '/settings', iconColor: 'bg-teal-500', roles: adminHrRoles },
  { id: 'workflows', title: 'Workflows', icon: Workflow, route: '/settings', iconColor: 'bg-pink-500', roles: adminHrRoles },
  { id: 'notifications', title: 'Notifications', icon: Bell, route: '/settings', iconColor: 'bg-yellow-500', roles: adminHrRoles },
];
