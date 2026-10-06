import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isDemoSession } from '@/lib/demoStore';
import { getDemoBusinesses, getDemoPlatformUsers } from '@/lib/demoPlatformData';

export interface SystemHealth {
  uptime: number;
  responseTime: number;
  apiCalls: number;
  errorRate: number;
}

export interface SuperAdminDashboardMetrics {
  totalBusinesses: number;
  activeBusinesses: number;
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  growthRate: number;
  systemHealth: SystemHealth;
}

const demoMetrics = (): SuperAdminDashboardMetrics => {
  const businesses = getDemoBusinesses();
  const users = getDemoPlatformUsers();
  return {
    totalBusinesses: businesses.length,
    activeBusinesses: businesses.filter((business) => business.status === 'active').length,
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.status === 'active').length,
    monthlyRevenue: businesses.reduce((sum, business) => sum + business.monthlyRevenue, 0),
    growthRate: 8.4,
    systemHealth: { uptime: 99.98, responseTime: 182, apiCalls: 48216, errorRate: 0.12 },
  };
};

const demoGrowth = [
  { month: 'May', businesses: 18, users: 340 },
  { month: 'Jun', businesses: 22, users: 410 },
  { month: 'Jul', businesses: 27, users: 505 },
  { month: 'Aug', businesses: 31, users: 612 },
  { month: 'Sep', businesses: 36, users: 720 },
  { month: 'Oct', businesses: 41, users: 815 },
];

const demoRevenue = [
  { month: 'May', revenue: 3900 },
  { month: 'Jun', revenue: 4300 },
  { month: 'Jul', revenue: 4700 },
  { month: 'Aug', revenue: 5150 },
  { month: 'Sep', revenue: 5900 },
  { month: 'Oct', revenue: 6550 },
];

const demoActivities = [
  { id: 'ACT-1', type: 'business_registered', status: 'success', description: 'Salone Creative Studio started a trial.', activity_timestamp: '2026-10-06T07:40:00Z' },
  { id: 'ACT-2', type: 'subscription_upgraded', status: 'success', description: 'West Africa Logistics upgraded to Professional.', activity_timestamp: '2026-10-05T15:10:00Z' },
  { id: 'ACT-3', type: 'system_alert', status: 'warning', description: 'API latency briefly exceeded the target threshold.', activity_timestamp: '2026-10-05T10:20:00Z' },
];

const fetchDashboardMetrics = async (): Promise<SuperAdminDashboardMetrics> => {
  if (isDemoSession()) return demoMetrics();
  const { data, error } = await supabase.rpc('get_super_admin_dashboard_metrics');
  if (error) throw new Error(error.message);
  return data as unknown as SuperAdminDashboardMetrics;
};

const fetchBusinessGrowthData = async () => {
  if (isDemoSession()) return demoGrowth;
  const { data, error } = await supabase.rpc('get_business_growth_data');
  if (error) throw new Error(error.message);
  return data;
};

const fetchRevenueData = async () => {
  if (isDemoSession()) return demoRevenue;
  const { data, error } = await supabase.rpc('get_revenue_data');
  if (error) throw new Error(error.message);
  return data;
};

const fetchRecentActivities = async () => {
  if (isDemoSession()) return demoActivities;
  const { data, error } = await supabase.rpc('get_recent_super_admin_activities');
  if (error) throw new Error(error.message);
  return data;
};

export const useSuperAdminDashboard = () => {
  const demo = isDemoSession();
  const { data: metrics, isLoading: isLoadingMetrics, error: errorMetrics } = useQuery({
    queryKey: ['superAdminDashboardMetrics', demo],
    queryFn: fetchDashboardMetrics,
  });
  const { data: growthData, isLoading: isLoadingGrowth, error: errorGrowth } = useQuery({
    queryKey: ['superAdminBusinessGrowth', demo],
    queryFn: fetchBusinessGrowthData,
  });
  const { data: revenueData, isLoading: isLoadingRevenue, error: errorRevenue } = useQuery({
    queryKey: ['superAdminRevenueData', demo],
    queryFn: fetchRevenueData,
  });
  const { data: activities, isLoading: isLoadingActivities, error: errorActivities } = useQuery({
    queryKey: ['superAdminRecentActivities', demo],
    queryFn: fetchRecentActivities,
    refetchInterval: demo ? false : 60000,
  });

  return {
    metrics,
    growthData,
    revenueData,
    activities,
    isLoading: isLoadingMetrics || isLoadingGrowth || isLoadingRevenue || isLoadingActivities,
    error: errorMetrics || errorGrowth || errorRevenue || errorActivities,
  };
};
