import {
  Users,
  Calendar,
  FileText,
  Clock,
  BarChart3,
  Settings,
  Home,
  UserCheck,
  Briefcase,
  DollarSign,
  Heart,
  Inbox
} from 'lucide-react';
import { NavigationItem } from './types';

type UserRole = NavigationItem['roles'][number];

const regularRoles = ['admin', 'hr', 'manager', 'employee'] as const;
const peopleRoles = ['admin', 'hr'] as const;
const managerRoles = ['admin', 'hr', 'manager'] as const;
const adminHrRoles = ['admin', 'hr'] as const;

export const getNavigationItems = (userRole?: UserRole): NavigationItem[] => {
  if (userRole === 'super_admin') {
    return [
      {
        name: 'Super Admin Dashboard',
        icon: Home,
        path: '/super-admin/dashboard',
        roles: ['super_admin'] as const
      },
      {
        name: 'Business Management',
        icon: Briefcase,
        path: '/super-admin/businesses',
        roles: ['super_admin'] as const,
        children: [
          { name: 'All Businesses', path: '/super-admin/businesses', roles: ['super_admin'] as const },
          { name: 'Business Analytics', path: '/super-admin/businesses/analytics', roles: ['super_admin'] as const },
          { name: 'Subscription Management', path: '/super-admin/businesses/subscriptions', roles: ['super_admin'] as const }
        ]
      },
      {
        name: 'User Management',
        icon: Users,
        path: '/super-admin/users',
        roles: ['super_admin'] as const,
        children: [
          { name: 'All Users', path: '/super-admin/users', roles: ['super_admin'] as const },
          { name: 'User Analytics', path: '/super-admin/users/analytics', roles: ['super_admin'] as const },
          { name: 'Activity Logs', path: '/super-admin/users/activity', roles: ['super_admin'] as const }
        ]
      },
      {
        name: 'System Administration',
        icon: Settings,
        path: '/super-admin/system/settings',
        roles: ['super_admin'] as const,
        children: [
          { name: 'Platform Settings', path: '/super-admin/system/settings', roles: ['super_admin'] as const },
          { name: 'Feature Toggles', path: '/super-admin/system/features', roles: ['super_admin'] as const },
          { name: 'System Health', path: '/super-admin/system/health', roles: ['super_admin'] as const }
        ]
      },
      {
        name: 'Analytics & Reports',
        icon: BarChart3,
        path: '/super-admin/analytics/platform',
        roles: ['super_admin'] as const,
        children: [
          { name: 'Platform Analytics', path: '/super-admin/analytics/platform', roles: ['super_admin'] as const },
          { name: 'Revenue Reports', path: '/super-admin/analytics/revenue', roles: ['super_admin'] as const },
          { name: 'Usage Statistics', path: '/super-admin/analytics/usage', roles: ['super_admin'] as const }
        ]
      },
      {
        name: 'Communication',
        icon: UserCheck,
        path: '/super-admin/communication/announcements',
        roles: ['super_admin'] as const,
        children: [
          { name: 'Announcements', path: '/super-admin/communication/announcements', roles: ['super_admin'] as const },
          { name: 'Support Tickets', path: '/super-admin/communication/support', roles: ['super_admin'] as const }
        ]
      }
    ];
  }

  const items: NavigationItem[] = [
    {
      name: 'Home',
      icon: Home,
      path: '/dashboard',
      roles: regularRoles
    }
  ];

  if (managerRoles.some((role) => role === userRole)) {
    items.push({
      name: 'Inbox',
      icon: Inbox,
      path: '/approvals',
      roles: managerRoles
    });
  }

  if (peopleRoles.some((role) => role === userRole)) {
    items.push({
      name: 'People',
      icon: Users,
      path: '/employees',
      roles: peopleRoles,
      children: [
        { name: 'Overview', path: '/employees', roles: peopleRoles },
        { name: 'Employees', path: '/employees?view=directory', roles: peopleRoles },
        { name: 'New Hires', path: '/employees?view=new-hires', roles: peopleRoles },
        { name: 'Staff Invitations', path: '/employees/invitations', roles: peopleRoles },
        { name: 'Employee Changes', path: '/employees?view=changes', roles: peopleRoles },
        { name: 'Offboarding', path: '/employees?view=offboarding', roles: peopleRoles },
        { name: 'Former Employees', path: '/employees?view=former', roles: peopleRoles }
      ]
    });
  } else if (userRole === 'manager') {
    items.push({
      name: 'People',
      icon: Users,
      path: '/hr-lifecycle/onboarding',
      roles: ['manager'] as const,
      children: [
        { name: 'Onboarding', path: '/hr-lifecycle/onboarding', roles: ['manager'] as const },
        { name: 'Offboarding', path: '/hr-lifecycle/offboarding', roles: ['manager'] as const }
      ]
    });
  }

  items.push(
    {
      name: 'Time & Attendance',
      icon: Clock,
      path: '/attendance',
      roles: regularRoles,
      children: [
        { name: 'Attendance', path: '/attendance', roles: regularRoles },
        { name: 'Attendance Log', path: '/attendance/log', roles: regularRoles },
        { name: 'Timesheets', path: '/time-tracking', roles: regularRoles },
        { name: 'Attendance Reports', path: '/attendance/reports', roles: regularRoles }
      ]
    },
    {
      name: 'Leave',
      icon: Calendar,
      path: '/leave-tracking',
      roles: regularRoles
    }
  );

  if (adminHrRoles.some((role) => role === userRole)) {
    items.push({
      name: 'Payroll',
      icon: DollarSign,
      path: '/payroll',
      roles: adminHrRoles,
      children: [
        { name: 'Overview', path: '/payroll', roles: adminHrRoles },
        { name: 'Payroll Runs', path: '/payroll/run', roles: adminHrRoles },
        { name: 'Compensation', path: '/payroll/salary-profiles', roles: adminHrRoles },
        { name: 'Payslips', path: '/payroll/payslips', roles: regularRoles },
        { name: 'Reports', path: '/payroll/reports', roles: adminHrRoles }
      ]
    });
  } else {
    items.push({
      name: 'Payslips',
      icon: DollarSign,
      path: '/payroll/payslips',
      roles: ['manager', 'employee'] as const
    });
  }

  items.push(
    {
      name: 'Engagement',
      icon: Heart,
      path: '/engagement',
      roles: regularRoles,
      children: [
        { name: 'Surveys', path: '/engagement/surveys', roles: regularRoles },
        { name: 'Recognition', path: '/engagement/recognition', roles: regularRoles },
        { name: 'Events', path: '/engagement/events', roles: regularRoles }
      ]
    },
    {
      name: 'Documents',
      icon: FileText,
      path: '/documents',
      roles: regularRoles
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      path: '/reports',
      roles: managerRoles
    }
  );

  if (adminHrRoles.some((role) => role === userRole)) {
    items.push({
      name: 'Settings',
      icon: Settings,
      path: '/settings',
      roles: adminHrRoles,
      children: [
        { name: 'General', path: '/settings', roles: adminHrRoles },
        { name: 'Attendance', path: '/attendance/settings', roles: adminHrRoles },
        { name: 'Leave', path: '/leave-tracking/settings', roles: adminHrRoles },
        { name: 'Payroll', path: '/payroll/settings', roles: adminHrRoles }
      ]
    });
  }

  return items;
};
