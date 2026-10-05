
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, Users, Clock, Send, Eye, Edit } from 'lucide-react';
import SurveyTemplates from '@/components/engagement/templates/SurveyTemplates';

const Surveys = () => {
  const [activeTab, setActiveTab] = useState('active');

  const surveys = [
    {
      id: 1,
      title: 'Q1 Employee Satisfaction Survey',
      description: 'Quarterly survey to measure overall employee satisfaction and engagement.',
      status: 'active',
      type: 'satisfaction',
      responses: 89,
      totalEmployees: 156,
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      completionRate: 57,
      isAnonymous: true
    },
    {
      id: 2,
      title: 'Weekly Pulse Check',
      description: 'Quick weekly pulse survey to monitor team morale.',
      status: 'active',
      type: 'pulse',
      responses: 134,
      totalEmployees: 156,
      startDate: '2024-02-12',
      endDate: '2024-02-16',
      completionRate: 86,
      isAnonymous: false
    },
    {
      id: 3,
      title: 'Training Effectiveness Assessment',
      description: 'Evaluate the effectiveness of recent training programs.',
      status: 'draft',
      type: 'training',
      responses: 0,
      totalEmployees: 156,
      startDate: '2024-02-20',
      endDate: '2024-02-27',
      completionRate: 0,
      isAnonymous: true
    },
    {
      id: 4,
      title: 'Year-End Engagement Survey',
      description: 'Comprehensive annual engagement and culture assessment.',
      status: 'completed',
      type: 'engagement',
      responses: 142,
      totalEmployees: 148,
      startDate: '2023-12-01',
      endDate: '2023-12-15',
      completionRate: 96,
      isAnonymous: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSurveys = activeTab === 'all' ? surveys : surveys.filter(survey => survey.status === activeTab);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surveys & Feedback</h1>
          <p className="text-gray-600 mt-2">
            Create, manage, and analyze employee surveys and feedback
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Survey
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Surveys</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Send className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold">365</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Completion Rate</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Response Time</p>
                <p className="text-2xl font-bold">4.2m</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Surveys</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <SurveyTemplates />
        </TabsContent>

        <TabsContent value={activeTab === 'templates' ? 'active' : activeTab} className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-6">
            {filteredSurveys.map((survey) => (
              <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{survey.title}</CardTitle>
                        <Badge variant="outline" className={getStatusColor(survey.status)}>
                          {survey.status}
                        </Badge>
                        {survey.isAnonymous && (
                          <Badge variant="secondary">Anonymous</Badge>
                        )}
                      </div>
                      <CardDescription>{survey.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Responses:</span>
                      <p className="font-semibold">{survey.responses} / {survey.totalEmployees}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Completion Rate:</span>
                      <p className="font-semibold">{survey.completionRate}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Start Date:</span>
                      <p className="font-semibold">{survey.startDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">End Date:</span>
                      <p className="font-semibold">{survey.endDate}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{survey.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${survey.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Badge variant="outline" className="capitalize">
                      {survey.type} Survey
                    </Badge>
                    <div className="flex space-x-2">
                      {survey.status === 'active' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Results
                          </Button>
                          <Button variant="outline" size="sm">
                            <Send className="w-4 h-4 mr-1" />
                            Send Reminder
                          </Button>
                        </>
                      )}
                      {survey.status === 'draft' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm">
                            <Send className="w-4 h-4 mr-1" />
                            Launch
                          </Button>
                        </>
                      )}
                      {survey.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          View Analytics
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Surveys;
