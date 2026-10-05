
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

const fetchDashboardMetrics = async (): Promise<SuperAdminDashboardMetrics> => {
  const { data, error } = await supabase.rpc('get_super_admin_dashboard_metrics');
  if (error) throw new Error(error.message);
  return data as unknown as SuperAdminDashboardMetrics;
};

const fetchBusinessGrowthData = async () => {
  const { data, error } = await supabase.rpc('get_business_growth_data');
  if (error) throw new Error(error.message);
  return data;
};

const fetchRevenueData = async () => {
  const { data, error } = await supabase.rpc('get_revenue_data');
  if (error) throw new Error(error.message);
  return data;
};

const fetchRecentActivities = async () => {
    const { data, error } = await supabase.rpc('get_recent_super_admin_activities');
    if (error) {
        console.error('Error fetching recent activities:', error);
        throw new Error(error.message);
    }
    return data;
};

export const useSuperAdminDashboard = () => {
  const { data: metrics, isLoading: isLoadingMetrics, error: errorMetrics } = useQuery({
    queryKey: ['superAdminDashboardMetrics'],
    queryFn: fetchDashboardMetrics,
  });

  const { data: growthData, isLoading: isLoadingGrowth, error: errorGrowth } = useQuery({
    queryKey: ['superAdminBusinessGrowth'],
    queryFn: fetchBusinessGrowthData,
  });

  const { data: revenueData, isLoading: isLoadingRevenue, error: errorRevenue } = useQuery({
    queryKey: ['superAdminRevenueData'],
    queryFn: fetchRevenueData,
  });

  const { data: activities, isLoading: isLoadingActivities, error: errorActivities } = useQuery({
    queryKey: ['superAdminRecentActivities'],
    queryFn: fetchRecentActivities,
    refetchInterval: 60000, // Refetch activities every minute
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
