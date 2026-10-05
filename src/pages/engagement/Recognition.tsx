
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Award, Trophy, Plus, TrendingUp, Users, Calendar } from 'lucide-react';
import RecognitionTemplates from '@/components/engagement/templates/RecognitionTemplates';

const Recognition = () => {
  const [activeTab, setActiveTab] = useState('recent');

  const recognitions = [
    {
      id: 1,
      title: 'Outstanding Performance',
      recipient: 'Sarah Johnson',
      recognizer: 'Mike Chen',
      message: 'Sarah has consistently delivered exceptional results this quarter, going above and beyond to help the team succeed.',
      type: 'performance',
      points: 100,
      date: '2024-02-14',
      isPublic: true,
      likes: 12,
      comments: 5
    },
    {
      id: 2,
      title: 'Team Player',
      recipient: 'David Kim',
      recognizer: 'Lisa Rodriguez',
      message: 'David always steps up to help colleagues and maintains a positive attitude that lifts the entire team.',
      type: 'teamwork',
      points: 75,
      date: '2024-02-13',
      isPublic: true,
      likes: 8,
      comments: 3
    },
    {
      id: 3,
      title: 'Innovation Award',
      recipient: 'Emma Wilson',
      recognizer: 'Sarah Johnson',
      message: 'Emma\'s creative solution to our workflow challenges has improved efficiency by 30%.',
      type: 'innovation',
      points: 150,
      date: '2024-02-12',
      isPublic: true,
      likes: 15,
      comments: 7
    },
    {
      id: 4,
      title: 'Customer Champion',
      recipient: 'Alex Thompson',
      recognizer: 'Mike Chen',
      message: 'Alex received outstanding feedback from three different clients this week.',
      type: 'service',
      points: 125,
      date: '2024-02-11',
      isPublic: true,
      likes: 10,
      comments: 4
    }
  ];

  const leaderboard = [
    { name: 'Sarah Johnson', points: 450, recognitions: 8, rank: 1 },
    { name: 'David Kim', points: 380, recognitions: 6, rank: 2 },
    { name: 'Emma Wilson', points: 320, recognitions: 5, rank: 3 },
    { name: 'Alex Thompson', points: 290, recognitions: 4, rank: 4 },
    { name: 'Lisa Rodriguez', points: 260, recognitions: 4, rank: 5 }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <Star className="w-4 h-4" />;
      case 'teamwork': return <Users className="w-4 h-4" />;
      case 'innovation': return <Trophy className="w-4 h-4" />;
      case 'service': return <Award className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'teamwork': return 'bg-green-100 text-green-800';
      case 'innovation': return 'bg-purple-100 text-purple-800';
      case 'service': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recognition & Rewards</h1>
          <p className="text-gray-600 mt-2">
            Recognize achievements and celebrate team success
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Give Recognition
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Recognitions</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Points Awarded</p>
                <p className="text-2xl font-bold">2,480</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Participation Rate</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="recent">Recent Recognition</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <RecognitionTemplates />
        </TabsContent>

        <TabsContent value="recent" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-6">
            {recognitions.map((recognition) => (
              <Card key={recognition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(recognition.type)}`}>
                        {getTypeIcon(recognition.type)}
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{recognition.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{recognition.recognizer} recognized {recognition.recipient}</span>
                          <Badge variant="secondary">{recognition.points} points</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{recognition.date}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{recognition.message}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{recognition.recipient.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{recognition.recipient}</p>
                        <p className="text-sm text-gray-600">Recipient</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>❤️ {recognition.likes}</span>
                      <span>💬 {recognition.comments}</span>
                      <Button variant="outline" size="sm">
                        <Star className="w-4 h-4 mr-1" />
                        Celebrate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top 3 Podium */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recognition Leaderboard</CardTitle>
                  <CardDescription>Top performers this quarter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((person, index) => (
                      <div key={person.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {person.rank}
                          </div>
                          <Avatar>
                            <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{person.name}</p>
                            <p className="text-sm text-gray-600">{person.recognitions} recognitions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">{person.points}</p>
                          <p className="text-sm text-gray-600">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recognition Categories */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recognition Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-blue-500" />
                      <span>Performance</span>
                    </div>
                    <span className="font-semibold">42%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <span>Teamwork</span>
                    </div>
                    <span className="font-semibold">28%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-purple-500" />
                      <span>Innovation</span>
                    </div>
                    <span className="font-semibold">18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span>Service</span>
                    </div>
                    <span className="font-semibold">12%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Award className="w-4 h-4 mr-2" />
                    Nominate Colleague
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Trophy className="w-4 h-4 mr-2" />
                    View My Recognitions
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Browse All Awards
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recognition;
