import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Award, BarChart3, Download, Calendar, Target } from 'lucide-react';
import AdvancedAnalytics from '@/components/engagement/analytics/AdvancedAnalytics';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const overviewMetrics = [
    {
      title: 'Overall Engagement Score',
      value: '78%',
      change: '+5.2%',
      trend: 'up',
      description: 'Composite score based on all engagement activities'
    },
    {
      title: 'Survey Participation',
      value: '84%',
      change: '+2.1%',
      trend: 'up',
      description: 'Average response rate across all surveys'
    },
    {
      title: 'Recognition Activity',
      value: '156',
      change: '+12.5%',
      trend: 'up',
      description: 'Total recognitions given this month'
    },
    {
      title: 'Event Attendance',
      value: '67%',
      change: '-1.8%',
      trend: 'down',
      description: 'Average attendance rate for company events'
    }
  ];

  const departmentData = [
    { name: 'Engineering', score: 82, participation: 89, recognitions: 45 },
    { name: 'Marketing', score: 79, participation: 85, recognitions: 38 },
    { name: 'Sales', score: 76, participation: 82, recognitions: 42 },
    { name: 'HR', score: 88, participation: 94, recognitions: 31 },
    { name: 'Finance', score: 74, participation: 78, recognitions: 28 }
  ];

  const engagementTrends = [
    { month: 'Oct', satisfaction: 72, recognition: 134, events: 8 },
    { month: 'Nov', satisfaction: 75, recognition: 145, events: 12 },
    { month: 'Dec', satisfaction: 78, recognition: 156, events: 15 },
    { month: 'Jan', satisfaction: 80, recognition: 167, events: 18 },
    { month: 'Feb', satisfaction: 78, recognition: 178, events: 14 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Engagement Analytics</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into employee engagement and participation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Dashboard
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{metric.value}</p>
                      <div className={`flex items-center text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`w-4 h-4 mr-1 ${
                          metric.trend === 'down' ? 'rotate-180' : ''
                        }`} />
                        {metric.change} from last month
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      index === 0 ? 'bg-blue-100 text-blue-600' :
                      index === 1 ? 'bg-green-100 text-green-600' :
                      index === 2 ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {index === 0 && <Target className="w-6 h-6" />}
                      {index === 1 && <BarChart3 className="w-6 h-6" />}
                      {index === 2 && <Award className="w-6 h-6" />}
                      {index === 3 && <Users className="w-6 h-6" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Score Breakdown</CardTitle>
                <CardDescription>Components contributing to overall score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Survey Responses</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                      <span className="text-sm font-bold">84%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Recognition Activity</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                      <span className="text-sm font-bold">76%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Event Participation</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                      <span className="text-sm font-bold">67%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Community Engagement</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                      <span className="text-sm font-bold">72%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Most engaged teams this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.slice(0, 3).map((dept, index) => (
                    <div key={dept.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{dept.name}</p>
                          <p className="text-sm text-gray-600">{dept.recognitions} recognitions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{dept.score}%</p>
                        <p className="text-sm text-gray-600">engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Trends (Last 5 Months)</CardTitle>
              <CardDescription>Track engagement metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Placeholder for chart - would be replaced with actual chart component */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Engagement trends chart would appear here</p>
                    <p className="text-sm text-gray-400">Integration with charting library needed</p>
                  </div>
                </div>
                
                {/* Data Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">+3.2%</p>
                    <p className="text-sm text-gray-600">Satisfaction Growth</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">+33%</p>
                    <p className="text-sm text-gray-600">Recognition Increase</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">+75%</p>
                    <p className="text-sm text-gray-600">Event Participation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Comparison</CardTitle>
              <CardDescription>Engagement metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{dept.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary">{dept.score}%</span>
                        <span className="text-sm text-gray-600">overall score</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Survey Participation:</span>
                        <p className="font-semibold">{dept.participation}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Recognitions:</span>
                        <p className="font-semibold">{dept.recognitions}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Trend:</span>
                        <p className="font-semibold text-green-600">↑ Improving</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <AdvancedAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
