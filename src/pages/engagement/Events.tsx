
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, Clock, Plus, Video, Filter } from 'lucide-react';
import EventTemplates from '@/components/engagement/templates/EventTemplates';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const events = [
    {
      id: 1,
      title: 'Q1 All-Hands Meeting',
      description: 'Quarterly company update covering goals, achievements, and upcoming initiatives.',
      type: 'meeting',
      startDate: '2024-02-15',
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      location: 'Main Conference Room',
      isVirtual: false,
      organizer: 'Sarah Johnson',
      maxParticipants: 50,
      registeredCount: 42,
      registrationRequired: true,
      status: 'published'
    },
    {
      id: 2,
      title: 'Team Building Escape Room',
      description: 'Fun team building activity to strengthen collaboration and problem-solving skills.',
      type: 'team_building',
      startDate: '2024-02-18',
      startTime: '2:00 PM',
      endTime: '5:00 PM',
      location: 'Escape Quest Downtown',
      isVirtual: false,
      organizer: 'Mike Chen',
      maxParticipants: 20,
      registeredCount: 18,
      registrationRequired: true,
      status: 'published'
    },
    {
      id: 3,
      title: 'Mental Health & Wellness Workshop',
      description: 'Interactive session on stress management and maintaining work-life balance.',
      type: 'training',
      startDate: '2024-02-20',
      startTime: '1:00 PM',
      endTime: '2:30 PM',
      location: 'Virtual Meeting Room',
      isVirtual: true,
      organizer: 'Dr. Lisa Rodriguez',
      maxParticipants: null,
      registeredCount: 67,
      registrationRequired: true,
      status: 'published'
    },
    {
      id: 4,
      title: 'Friday Happy Hour',
      description: 'Weekly social gathering to unwind and connect with colleagues.',
      type: 'social',
      startDate: '2024-02-16',
      startTime: '5:00 PM',
      endTime: '7:00 PM',
      location: 'Office Lounge',
      isVirtual: false,
      organizer: 'David Kim',
      maxParticipants: null,
      registeredCount: 34,
      registrationRequired: false,
      status: 'published'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'team_building': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-yellow-100 text-yellow-800';
      case 'celebration': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events & Activities</h1>
          <p className="text-gray-600 mt-2">
            Discover and participate in company events and team activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold">161</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="my-events">My Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <EventTemplates />
        </TabsContent>

        <TabsContent value={activeTab === 'templates' ? 'upcoming' : activeTab} className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={getEventTypeColor(event.type)}>
                      {event.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{event.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {event.isVirtual ? (
                        <>
                          <Video className="w-4 h-4 text-gray-500" />
                          <span>Virtual</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{event.location}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>
                        {event.registeredCount} registered
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-gray-600">
                      Organized by {event.organizer}
                    </span>
                    {event.registrationRequired ? (
                      <Button size="sm">Register</Button>
                    ) : (
                      <Button variant="outline" size="sm">View Details</Button>
                    )}
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

export default Events;
