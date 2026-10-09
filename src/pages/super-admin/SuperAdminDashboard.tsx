import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Shield
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useSuperAdminDashboard } from '@/hooks/useSuperAdminDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';

const SuperAdminDashboard = () => {
  const { metrics, growthData, revenueData, activities, isLoading, error } = useSuperAdminDashboard();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'business_registered':
        return <Building2 className="w-4 h-4" />;
      case 'subscription_upgraded':
        return <TrendingUp className="w-4 h-4" />;
      case 'system_alert':
        return <AlertTriangle className="w-4 h-4" />;
      case 'payment_failed':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-5 w-48 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3 w-28 mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
             <Skeleton className="h-[350px] w-full" />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Dashboard Data</AlertTitle>
          <AlertDescription>
            There was an issue retrieving the dashboard data. Please try again later.
            <pre className="mt-2 whitespace-pre-wrap text-xs font-mono bg-red-900/10 p-2 rounded-md">
              {error.message}
            </pre>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const platformMetrics = metrics || {
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalUsers: 0,
    activeUsers: 0,
    monthlyRevenue: 0,
    growthRate: 0,
  };

  const systemHealth = metrics?.systemHealth || {
    uptime: 0,
    responseTime: 0,
    apiCalls: 0,
    errorRate: 0,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            <Shield className="w-3 h-3 mr-1" />
            Super Admin
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              Across the platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics.activeBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              {platformMetrics.totalBusinesses > 0 ? 
                `${Math.round((platformMetrics.activeBusinesses / platformMetrics.totalBusinesses) * 100)}% active rate` : 'N/A'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all businesses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {platformMetrics.totalUsers > 0 ?
                `${Math.round((platformMetrics.activeUsers / platformMetrics.totalUsers) * 100)}% activity rate` : 'N/A'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${platformMetrics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{platformMetrics.growthRate}% growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              Uptime this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Growth</CardTitle>
                <CardDescription>Businesses and users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={growthData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="businesses" stroke="#8884d8" strokeWidth={2} name="Businesses" />
                    <Line type="monotone" dataKey="users" stroke="#82ca9d" strokeWidth={2} name="Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly recurring revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Subscription Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Trial</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Basic</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Professional</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Enterprise</span>
                    <span className="text-sm font-medium">7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Industries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Technology</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Healthcare</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Retail</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Finance</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Sierra Leone</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ghana</span>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Nigeria</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Kenya</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Attendance</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Payroll</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Time Tracking</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Engagement</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>Latest events across all businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(activities && activities.length > 0) ? activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className={`${getStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(activity.activity_timestamp), { addSuffix: true })}</p>
                    </div>
                    <Badge variant={
                      activity.status === 'success' ? 'default' :
                      activity.status === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {activity.status}
                    </Badge>
                  </div>
                )) : <p>No recent activity.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">System Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{systemHealth.uptime}%</div>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemHealth.responseTime}ms</div>
                <p className="text-xs text-gray-500">Average response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">API Calls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemHealth.apiCalls.toLocaleString()}</div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{systemHealth.errorRate}%</div>
                <p className="text-xs text-gray-500">24h average</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
