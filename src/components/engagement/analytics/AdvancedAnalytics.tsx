import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Users, Award, Download, Calendar, Filter, Plus } from 'lucide-react';

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('last-30-days');
  const [department, setDepartment] = useState('all');

  const reportTemplates = [
    {
      id: 1,
      name: 'Engagement Trends Report',
      description: 'Track engagement levels over time with detailed breakdowns',
      category: 'Trends',
      frequency: 'Weekly/Monthly',
      metrics: ['Survey Responses', 'Recognition Given', 'Event Participation'],
      lastGenerated: '2024-02-14'
    },
    {
      id: 2,
      name: 'Department Comparison',
      description: 'Compare engagement metrics across different departments',
      category: 'Comparison',
      frequency: 'Monthly',
      metrics: ['Satisfaction Scores', 'Participation Rates', 'Recognition Received'],
      lastGenerated: '2024-02-01'
    },
    {
      id: 3,
      name: 'Recognition Analysis',
      description: 'Detailed analysis of recognition patterns and impact',
      category: 'Recognition',
      frequency: 'Quarterly',
      metrics: ['Recognition Frequency', 'Points Distribution', 'Category Breakdown'],
      lastGenerated: '2024-01-15'
    },
    {
      id: 4,
      name: 'Event ROI Report',
      description: 'Measure the return on investment for engagement events',
      category: 'Events',
      frequency: 'After Events',
      metrics: ['Attendance Rates', 'Feedback Scores', 'Follow-up Engagement'],
      lastGenerated: '2024-02-10'
    }
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Recognition Program Success',
      description: 'Recognition participation increased by 45% this quarter, with the highest growth in the Engineering department.',
      impact: 'High',
      recommendation: 'Expand recognition templates to other departments'
    },
    {
      type: 'warning',
      title: 'Survey Response Decline',
      description: 'Survey completion rates dropped by 12% in the last month, particularly in remote teams.',
      impact: 'Medium',
      recommendation: 'Implement mobile-friendly surveys and reminder campaigns'
    },
    {
      type: 'neutral',
      title: 'Event Attendance Stable',
      description: 'Event participation remains consistent at 78%, with virtual events showing higher engagement.',
      impact: 'Low',
      recommendation: 'Maintain current event strategy with focus on virtual options'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Deep insights and custom reporting for engagement data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Custom Filter
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 days</SelectItem>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-90-days">Last 90 days</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="insights">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="reports">Report Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* Key Insights */}
          <div className="grid grid-cols-1 gap-4">
            {insights.map((insight, index) => (
              <Card key={index} className={`border-l-4 ${
                insight.type === 'positive' ? 'border-l-green-500' :
                insight.type === 'warning' ? 'border-l-yellow-500' :
                'border-l-blue-500'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={
                          insight.type === 'positive' ? 'default' :
                          insight.type === 'warning' ? 'destructive' :
                          'secondary'
                        }>
                          {insight.impact} Impact
                        </Badge>
                        <Badge variant="outline">
                          {insight.type === 'positive' ? 'Opportunity' :
                           insight.type === 'warning' ? 'Action Needed' :
                           'Monitor'}
                        </Badge>
                      </div>
                    </div>
                    <TrendingUp className={`w-5 h-5 ${
                      insight.type === 'positive' ? 'text-green-500' :
                      insight.type === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{insight.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Recommendation:</p>
                    <p className="text-sm text-gray-700">{insight.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Report Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Frequency:</span>
                      <p className="font-semibold">{template.frequency}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Generated:</span>
                      <p className="font-semibold">{template.lastGenerated}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Key Metrics:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.metrics.map((metric) => (
                        <Badge key={metric} variant="secondary" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          {/* Custom Report Builder */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Build your own custom analytics reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Report Builder</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop metrics, apply filters, and create custom visualizations
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Start Building Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
