
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageSquare, Share2, Plus, Image, Calendar, Trophy, Users, Pin } from 'lucide-react';

const SocialFeed = () => {
  const [newPost, setNewPost] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const posts = [
    {
      id: 1,
      author: 'Sarah Johnson',
      role: 'Engineering Manager',
      time: '2 hours ago',
      type: 'announcement',
      content: 'Excited to announce that our Q4 product release is ahead of schedule! Amazing work from the entire engineering team. 🚀',
      likes: 24,
      comments: 8,
      shares: 3,
      isPinned: true
    },
    {
      id: 2,
      author: 'Mike Chen',
      role: 'Marketing Director',
      time: '4 hours ago',
      type: 'celebration',
      content: 'Congratulations to Emma Rodriguez on her 5-year work anniversary! Her dedication to client success has been incredible to witness.',
      likes: 45,
      comments: 12,
      shares: 5,
      isPinned: false
    },
    {
      id: 3,
      author: 'Lisa Rodriguez',
      role: 'Sales Lead',
      time: '6 hours ago',
      type: 'achievement',
      content: 'Just closed our biggest deal of the quarter! Thank you to everyone who supported this 6-month effort. Team work makes the dream work! 💪',
      likes: 38,
      comments: 15,
      shares: 7,
      isPinned: false
    },
    {
      id: 4,
      author: 'David Kim',
      role: 'HR Manager',
      time: '1 day ago',
      type: 'announcement',
      content: 'Reminder: Our wellness week starts Monday! Sign up for yoga sessions, mental health workshops, and team building activities.',
      likes: 18,
      comments: 6,
      shares: 12,
      isPinned: false
    }
  ];

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'celebration': return 'bg-purple-100 text-purple-800';
      case 'achievement': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Pin className="w-4 h-4" />;
      case 'celebration': return <Calendar className="w-4 h-4" />;
      case 'achievement': return <Trophy className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const filteredPosts = activeFilter === 'all' ? posts : posts.filter(post => post.type === activeFilter);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Feed</h1>
          <p className="text-gray-600 mt-2">
            Stay connected with company updates and team achievements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Create Post */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share an update</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's happening at work today?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Image className="w-4 h-4 mr-2" />
                    Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Event
                  </Button>
                </div>
                <Button disabled={!newPost.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filter Tabs */}
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="announcement">Announcements</TabsTrigger>
              <TabsTrigger value="celebration">Celebrations</TabsTrigger>
              <TabsTrigger value="achievement">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value={activeFilter} className="space-y-4 mt-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className={post.isPinned ? 'border-blue-200 bg-blue-50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold">{post.author}</p>
                            {post.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                          </div>
                          <p className="text-sm text-gray-600">{post.role}</p>
                          <p className="text-xs text-gray-500">{post.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getPostTypeColor(post.type)}>
                        {getPostTypeIcon(post.type)}
                        <span className="ml-1 capitalize">{post.type}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-800">{post.content}</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                          <Share2 className="w-4 h-4 mr-1" />
                          {post.shares}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Posts</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="font-semibold">89</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Celebrations</span>
                <span className="font-semibold">3</span>
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trending</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary">#Q4Release</Badge>
              <Badge variant="secondary">#TeamBuilding</Badge>
              <Badge variant="secondary">#WorkAnniversary</Badge>
              <Badge variant="secondary">#WellnessWeek</Badge>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Team Building Event</p>
                <p className="text-xs text-gray-600">Tomorrow, 2:00 PM</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Wellness Workshop</p>
                <p className="text-xs text-gray-600">Friday, 10:00 AM</p>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                View All Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;
