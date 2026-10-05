
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Plus, MessageSquare, Calendar, Lock, Globe } from 'lucide-react';
import CommunityTemplates from '@/components/engagement/templates/CommunityTemplates';

const Communities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const communities = [
    {
      id: 1,
      name: 'Tech Talk & Innovation',
      description: 'Discuss latest technologies, share insights, and explore innovative solutions.',
      category: 'Technology',
      memberCount: 45,
      postsThisWeek: 12,
      upcomingEvents: 2,
      isPrivate: false,
      isJoined: true,
      admin: 'Sarah Johnson'
    },
    {
      id: 2,
      name: 'Wellness Warriors',
      description: 'Supporting each other in health, fitness, and mental wellness journeys.',
      category: 'Health & Wellness',
      memberCount: 38,
      postsThisWeek: 8,
      upcomingEvents: 1,
      isPrivate: false,
      isJoined: true,
      admin: 'Dr. Lisa Rodriguez'
    },
    {
      id: 3,
      name: 'Book Club',
      description: 'Monthly book discussions covering business, personal development, and fiction.',
      category: 'Learning & Development',
      memberCount: 22,
      postsThisWeek: 5,
      upcomingEvents: 1,
      isPrivate: false,
      isJoined: false,
      admin: 'Emma Wilson'
    },
    {
      id: 4,
      name: 'Photography Enthusiasts',
      description: 'Share your photography, get feedback, and learn new techniques.',
      category: 'Hobbies & Interests',
      memberCount: 31,
      postsThisWeek: 15,
      upcomingEvents: 0,
      isPrivate: false,
      isJoined: true,
      admin: 'Mike Chen'
    },
    {
      id: 5,
      name: 'Leadership Circle',
      description: 'Exclusive community for managers and team leads to share best practices.',
      category: 'Leadership',
      memberCount: 18,
      postsThisWeek: 6,
      upcomingEvents: 1,
      isPrivate: true,
      isJoined: false,
      admin: 'David Kim'
    },
    {
      id: 6,
      name: 'New Hire Network',
      description: 'Connect with fellow new hires and get support during your onboarding journey.',
      category: 'Onboarding',
      memberCount: 12,
      postsThisWeek: 9,
      upcomingEvents: 2,
      isPrivate: false,
      isJoined: false,
      admin: 'HR Team'
    }
  ];

  const categories = ['All', 'Technology', 'Health & Wellness', 'Learning & Development', 'Hobbies & Interests', 'Leadership', 'Onboarding'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || community.category === selectedCategory;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'my-communities' && community.isJoined) ||
                      (activeTab === 'public' && !community.isPrivate) ||
                      (activeTab === 'private' && community.isPrivate);
    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
          <p className="text-gray-600 mt-2">
            Join communities of interest and connect with like-minded colleagues
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Community
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Communities</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Communities</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Globe className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Posts This Week</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Communities</TabsTrigger>
          <TabsTrigger value="my-communities">My Communities</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="private">Private</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <CommunityTemplates />
        </TabsContent>

        <TabsContent value={activeTab === 'templates' ? 'all' : activeTab} className="space-y-4 mt-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{community.name}</CardTitle>
                        {community.isPrivate ? (
                          <Lock className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Globe className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {community.category}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{community.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">{community.memberCount}</span>
                      </div>
                      <p className="text-xs text-gray-600">Members</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">{community.postsThisWeek}</span>
                      </div>
                      <p className="text-xs text-gray-600">Posts</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">{community.upcomingEvents}</span>
                      </div>
                      <p className="text-xs text-gray-600">Events</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-gray-600">
                      Admin: {community.admin}
                    </span>
                    {community.isJoined ? (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">Leave</Button>
                      </div>
                    ) : (
                      <Button size="sm">
                        {community.isPrivate ? 'Request to Join' : 'Join'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No communities found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communities;
