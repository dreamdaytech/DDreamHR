
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, MessageSquare, Trophy, Calendar } from 'lucide-react';

const EngagementDashboard = () => {
  // Mock data for charts
  const engagementTrends = [
    { month: 'Jan', score: 7.2 },
    { month: 'Feb', score: 7.5 },
    { month: 'Mar', score: 7.8 },
    { month: 'Apr', score: 8.1 },
    { month: 'May', score: 8.0 },
    { month: 'Jun', score: 8.2 },
  ];

  const departmentEngagement = [
    { department: 'Engineering', score: 8.5 },
    { department: 'Sales', score: 7.8 },
    { department: 'Marketing', score: 8.2 },
    { department: 'HR', score: 8.9 },
    { department: 'Finance', score: 7.5 },
  ];

  const surveyParticipation = [
    { name: 'Completed', value: 78, color: '#22c55e' },
    { name: 'In Progress', value: 12, color: '#f59e0b' },
    { name: 'Not Started', value: 10, color: '#ef4444' },
  ];

  const metrics = [
    {
      title: 'Overall Engagement Score',
      value: '8.2',
      change: '+0.3',
      trend: 'up',
      description: 'vs last month',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Survey Participation',
      value: '78%',
      change: '+5%',
      trend: 'up',
      description: 'completion rate',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      title: 'Recognition Activities',
      value: '156',
      change: '+12',
      trend: 'up',
      description: 'this month',
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      title: 'Event Participation',
      value: '89%',
      change: '-2%',
      trend: 'down',
      description: 'attendance rate',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Engagement Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track and analyze employee engagement metrics
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendIcon className="w-4 h-4 mr-1" />
                        {metric.change}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                  </div>
                  <IconComponent className={`w-8 h-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Engagement Score Trends</CardTitle>
            <CardDescription>Monthly engagement score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[6, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#e86625" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Department Engagement</CardTitle>
            <CardDescription>Engagement scores by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="score" fill="#29a2d4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Survey Participation */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Participation</CardTitle>
            <CardDescription>Current survey completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={surveyParticipation}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {surveyParticipation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Employees with highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Sarah Johnson', department: 'Engineering', score: 9.5 },
                { name: 'Mike Chen', department: 'Marketing', score: 9.2 },
                { name: 'Lisa Rodriguez', department: 'Sales', score: 9.0 },
                { name: 'David Kim', department: 'HR', score: 8.8 },
                { name: 'Emma Wilson', department: 'Finance', score: 8.7 },
              ].map((employee, index) => (
                <div key={employee.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-600">{employee.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{employee.score}</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Goals</CardTitle>
            <CardDescription>Progress towards engagement targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Engagement Score</span>
                  <span className="text-sm text-gray-600">8.2/9.0</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Survey Participation</span>
                  <span className="text-sm text-gray-600">78%/85%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Recognition Activity</span>
                  <span className="text-sm text-gray-600">156/200</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Event Participation</span>
                  <span className="text-sm text-gray-600">89%/90%</span>
                </div>
                <Progress value={99} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EngagementDashboard;
