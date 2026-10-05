import {
  Users,
  Calendar,
  FileText,
  Clock,
  BarChart3,
  Settings,
  CheckSquare,
  Folder,
  Home,
  Shield,
  ChartBar,
  UserPlus,
  Layers,
  Target,
  FileCheck,
  BarChart2,
  CalendarDays,
  UserCheck,
  UserX,
  BookOpen,
  Briefcase,
  DollarSign,
  CreditCard,
  Receipt,
  TrendingUp,
  Archive,
  Heart
} from 'lucide-react';
import { NavigationItem } from './types';

export const getNavigationItems = (userRole?: string): NavigationItem[] => {
  // Super Admin specific navigation
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
          {
            name: 'All Businesses',
            path: '/super-admin/businesses',
            roles: ['super_admin'] as const
          },
          {
            name: 'Business Analytics',
            path: '/super-admin/businesses/analytics',
            roles: ['super_admin'] as const
          },
          {
            name: 'Subscription Management',
            path: '/super-admin/businesses/subscriptions',
            roles: ['super_admin'] as const
          }
        ]
      },
      {
        name: 'User Management',
        icon: Users,
        path: '/super-admin/users',
        roles: ['super_admin'] as const,
        children: [
          {
            name: 'All Users',
            path: '/super-admin/users',
            roles: ['super_admin'] as const
          },
          {
            name: 'User Analytics',
            path: '/super-admin/users/analytics',
            roles: ['super_admin'] as const
          },
          {
            name: 'Activity Logs',
            path: '/super-admin/users/activity',
            roles: ['super_admin'] as const
          }
        ]
      },
      {
        name: 'System Administration',
        icon: Settings,
        path: '/super-admin/system',
        roles: ['super_admin'] as const,
        children: [
          {
            name: 'Platform Settings',
            path: '/super-admin/system/settings',
            roles: ['super_admin'] as const
          },
          {
            name: 'Feature Toggles',
            path: '/super-admin/system/features',
            roles: ['super_admin'] as const
          },
          {
            name: 'System Health',
            path: '/super-admin/system/health',
            roles: ['super_admin'] as const
          }
        ]
      },
      {
        name: 'Analytics & Reports',
        icon: BarChart3,
        path: '/super-admin/analytics',
        roles: ['super_admin'] as const,
        children: [
          {
            name: 'Platform Analytics',
            path: '/super-admin/analytics/platform',
            roles: ['super_admin'] as const
          },
          {
            name: 'Revenue Reports',
            path: '/super-admin/analytics/revenue',
            roles: ['super_admin'] as const
          },
          {
            name: 'Usage Statistics',
            path: '/super-admin/analytics/usage',
            roles: ['super_admin'] as const
          }
        ]
      },
      {
        name: 'Communication',
        icon: UserCheck,
        path: '/super-admin/communication',
        roles: ['super_admin'] as const,
        children: [
          {
            name: 'Announcements',
            path: '/super-admin/communication/announcements',
            roles: ['super_admin'] as const
          },
          {
            name: 'Support Tickets',
            path: '/super-admin/communication/support',
            roles: ['super_admin'] as const
          }
        ]
      }
    ];
  }

  // Regular navigation for other roles
  return [
    { 
      name: 'Dashboard', 
      icon: Home, 
      path: userRole === 'admin' ? '/admin/dashboard' : 
            userRole === 'hr' ? '/hr/dashboard' : '/employee/dashboard',
      roles: ['admin', 'hr', 'manager', 'employee'] as const
    },
    { 
      name: 'Employee Directory', 
      icon: Users, 
      path: '/employees',
      roles: ['admin', 'hr'] as const
    },
    { 
      name: 'Attendance', 
      icon: Calendar, 
      path: '/attendance',
      roles: ['admin', 'hr', 'manager', 'employee'] as const,
      children: [
        {
          name: 'Dashboard',
          path: '/attendance/dashboard',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Attendance Log',
          path: '/attendance/log',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Reports',
          path: '/attendance/reports',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Settings',
          path: '/attendance/settings',
          roles: ['admin', 'hr'] as const
        }
      ]
    },
    {
      name: 'Leave Tracking',
      icon: CalendarDays,
      path: '/leave-tracking',
      roles: ['admin', 'hr', 'manager', 'employee'] as const,
      children: [
        {
          name: 'Leave Settings',
          path: '/leave-tracking/settings',
          roles: ['admin', 'hr'] as const
        }
      ]
    },
    {
      name: 'Time Tracking',
      icon: Clock,
      path: '/time-tracking',
      roles: ['admin', 'hr', 'manager', 'employee'] as const
    },
    {
      name: 'Engagement',
      icon: Heart,
      path: '/engagement',
      roles: ['admin', 'hr', 'manager', 'employee'] as const,
      children: [
        {
          name: 'Dashboard',
          path: '/engagement/dashboard',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Surveys',
          path: '/engagement/surveys',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Recognition',
          path: '/engagement/recognition',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Social Feed',
          path: '/engagement/social',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Events',
          path: '/engagement/events',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Communities',
          path: '/engagement/communities',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Analytics',
          path: '/engagement/analytics',
          roles: ['admin', 'hr', 'manager'] as const
        }
      ]
    },
    {
      name: 'Payroll',
      icon: DollarSign,
      path: '/payroll',
      roles: ['admin', 'hr'] as const,
      children: [
        {
          name: 'Dashboard',
          path: '/payroll/dashboard',
          roles: ['admin', 'hr'] as const
        },
        {
          name: 'Run Payroll',
          path: '/payroll/run',
          roles: ['admin', 'hr'] as const
        },
        {
          name: 'Salary Profiles',
          path: '/payroll/salary-profiles',
          roles: ['admin', 'hr'] as const
        },
        {
          name: 'Payslips',
          path: '/payroll/payslips',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Reports',
          path: '/payroll/reports',
          roles: ['admin', 'hr'] as const
        },
        {
          name: 'Settings',
          path: '/payroll/settings',
          roles: ['admin', 'hr'] as const
        }
      ]
    },
    {
      name: 'HR Lifecycle',
      icon: UserCheck,
      path: '/hr-lifecycle',
      roles: ['admin', 'hr', 'manager', 'employee'] as const,
      children: [
        {
          name: 'Preboarding',
          path: '/hr-lifecycle/preboarding',
          roles: ['admin', 'hr'] as const
        },
        {
          name: 'Onboarding',
          path: '/hr-lifecycle/onboarding',
          roles: ['admin', 'hr', 'manager'] as const
        },
        {
          name: 'Employee Portal',
          path: '/hr-lifecycle/portal',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Offboarding',
          path: '/hr-lifecycle/offboarding',
          roles: ['admin', 'hr', 'manager'] as const
        }
      ]
    },
    {
      name: 'Performance',
      icon: Target,
      path: '/performance',
      roles: ['admin', 'hr', 'manager'] as const,
      children: [
        {
          name: 'Goals & OKRs',
          path: '/performance/goals',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Evaluations',
          path: '/performance/evaluations',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Skill Matrix',
          path: '/performance/skills',
          roles: ['admin', 'hr', 'manager'] as const
        },
      ]
    },
    { 
      name: 'Reports', 
      icon: ChartBar, 
      path: '/reports',
      roles: ['admin', 'hr', 'manager', 'employee'] as const
    },
    { 
      name: 'Documents', 
      icon: FileText, 
      path: '/documents',
      roles: ['admin', 'hr', 'manager', 'employee'] as const
    },
    {
      name: 'Onboarding',
      icon: UserPlus,
      path: '/onboarding',
      roles: ['admin', 'hr'] as const,
      children: [
        {
          name: 'Candidates',
          path: '/onboarding/candidates',
          roles: ['admin', 'hr'] as const
        },
        {
          name: 'Employees',
          path: '/onboarding/employees',
          roles: ['admin', 'hr'] as const
        }
      ]
    },
    {
      name: 'My Data',
      icon: Layers,
      path: '/my-data',
      roles: ['admin', 'hr', 'manager', 'employee'] as const,
      children: [
        {
          name: 'Attendance Logs',
          path: '/my-data/attendance',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Time Logs',
          path: '/my-data/time-logs',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        },
        {
          name: 'Performance',
          path: '/my-data/performance',
          roles: ['admin', 'hr', 'manager', 'employee'] as const
        }
      ]
    },
    { 
      name: 'HR Workflows', 
      icon: FileCheck, 
      path: '/workflows',
      roles: ['admin', 'hr'] as const
    },
    { 
      name: 'Admin', 
      icon: Shield, 
      path: '/admin/dashboard',
      roles: ['admin'] as const
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/settings',
      roles: ['admin', 'hr'] as const
    },
  ];
};
