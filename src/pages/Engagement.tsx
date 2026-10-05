
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Trophy, Calendar, MessageSquare, BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Engagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Engagement Dashboard',
      description: 'View overall engagement metrics and insights',
      icon: BarChart3,
      path: '/engagement/dashboard',
      color: 'bg-blue-500'
    },
    {
      title: 'Surveys & Feedback',
      description: 'Create and manage employee surveys',
      icon: MessageSquare,
      path: '/engagement/surveys',
      color: 'bg-green-500'
    },
    {
      title: 'Recognition & Rewards',
      description: 'Recognize and celebrate achievements',
      icon: Trophy,
      path: '/engagement/recognition',
      color: 'bg-yellow-500'
    },
    {
      title: 'Social Feed',
      description: 'Company announcements and social interactions',
      icon: Users,
      path: '/engagement/social',
      color: 'bg-purple-500'
    },
    {
      title: 'Events & Activities',
      description: 'Organize and participate in company events',
      icon: Calendar,
      path: '/engagement/events',
      color: 'bg-red-500'
    },
    {
      title: 'Communities',
      description: 'Join interest groups and communities',
      icon: Heart,
      path: '/engagement/communities',
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Engagement</h1>
          <p className="text-gray-600 mt-2">
            Foster a motivated, productive, and connected workforce
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/engagement/dashboard')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            View Dashboard
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Score</p>
                <p className="text-2xl font-bold text-green-600">8.2/10</p>
              </div>
              <Heart className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Surveys</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recognitions</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card key={feature.path} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(feature.path)}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Explore Feature
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest engagement activities across your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium">Sarah Johnson received "Team Player" recognition</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">Q4 Pulse Survey launched</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium">Team Building Event scheduled for next Friday</p>
                <p className="text-sm text-gray-600">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Engagement;
