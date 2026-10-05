
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp,
  Activity,
  Globe,
  Clock,
  AlertTriangle
} from 'lucide-react';

const PlatformAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const overviewStats = {
    totalUsers: 1247,
    totalBusinesses: 156,
    monthlyRevenue: 45230,
    activeUsers: 1089,
    growthRate: 12.5,
    churnRate: 2.1
  };

  const userGrowthData = [
    { month: 'Jan', users: 850, businesses: 120 },
    { month: 'Feb', users: 920, businesses: 125 },
    { month: 'Mar', users: 1050, businesses: 135 },
    { month: 'Apr', users: 1150, businesses: 142 },
    { month: 'May', users: 1200, businesses: 150 },
    { month: 'Jun', users: 1247, businesses: 156 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 32000, arr: 384000 },
    { month: 'Feb', revenue: 35000, arr: 420000 },
    { month: 'Mar', revenue: 38000, arr: 456000 },
    { month: 'Apr', revenue: 41000, arr: 492000 },
    { month: 'May', revenue: 43000, arr: 516000 },
    { month: 'Jun', revenue: 45230, arr: 542760 }
  ];

  const regionData = [
    { name: 'Sierra Leone', value: 45, color: '#3B82F6' },
    { name: 'Ghana', value: 25, color: '#10B981' },
    { name: 'Nigeria', value: 20, color: '#F59E0B' },
    { name: 'Kenya', value: 7, color: '#EF4444' },
    { name: 'Others', value: 3, color: '#8B5CF6' }
  ];

  const planDistribution = [
    { name: 'Trial', value: 35, color: '#6B7280' },
    { name: 'Basic', value: 25, color: '#F59E0B' },
    { name: 'Professional', value: 30, color: '#3B82F6' },
    { name: 'Enterprise', value: 10, color: '#10B981' }
  ];

  const activityData = [
    { time: '00:00', logins: 12, checkins: 8 },
    { time: '04:00', logins: 5, checkins: 2 },
    { time: '08:00', logins: 145, checkins: 320 },
    { time: '12:00', logins: 89, checkins: 180 },
    { time: '16:00', logins: 67, checkins: 120 },
    { time: '20:00', logins: 34, checkins: 45 }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600">Monitor platform performance and user engagement</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{overviewStats.growthRate}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">+12 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${overviewStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((overviewStats.activeUsers / overviewStats.totalUsers) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.growthRate}%</div>
            <p className="text-xs text-muted-foreground">Monthly user growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.churnRate}%</div>
            <p className="text-xs text-muted-foreground">Monthly churn rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User & Business Growth</CardTitle>
            <CardDescription>Monthly growth trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="businesses" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Monthly revenue and ARR</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>Users by country</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}%`}
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription>Business plan distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={planDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity Pattern</CardTitle>
          <CardDescription>User logins and check-ins throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="logins" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
              <Area type="monotone" dataKey="checkins" stackId="1" stroke="#10B981" fill="#10B981" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Performing Business</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold">TechCorp Ltd</div>
            <div className="text-sm text-muted-foreground">245 active users</div>
            <Badge className="mt-1 bg-green-100 text-green-800">Enterprise Plan</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Average Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold">4h 32m</div>
            <div className="text-sm text-muted-foreground">+12% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Feature Adoption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold">Attendance: 94%</div>
            <div className="text-sm text-muted-foreground">Leave: 78%, Payroll: 65%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold">23 Open</div>
            <div className="text-sm text-muted-foreground">Average resolution: 2.4h</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
