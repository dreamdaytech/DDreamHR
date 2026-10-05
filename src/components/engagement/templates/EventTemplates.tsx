
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Users, Clock, MapPin, Video, Coffee, Gamepad2, GraduationCap } from 'lucide-react';

interface EventTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  duration: string;
  capacity: string;
  isVirtual: boolean;
  tags: string[];
  usage: number;
}

const EventTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const templates: EventTemplate[] = [
    {
      id: '1',
      name: 'All-Hands Meeting',
      description: 'Company-wide meeting for updates, announcements, and Q&A sessions.',
      category: 'Meeting',
      icon: <Users className="w-5 h-5" />,
      duration: '1-2 hours',
      capacity: 'Unlimited',
      isVirtual: true,
      tags: ['company-wide', 'updates', 'announcements'],
      usage: 89
    },
    {
      id: '2',
      name: 'Team Building Escape Room',
      description: 'Interactive team building activity to strengthen collaboration.',
      category: 'Team Building',
      icon: <Gamepad2 className="w-5 h-5" />,
      duration: '2-3 hours',
      capacity: '10-20 people',
      isVirtual: false,
      tags: ['team building', 'collaboration', 'fun'],
      usage: 156
    },
    {
      id: '3',
      name: 'Lunch & Learn Session',
      description: 'Informal learning session over lunch with guest speakers.',
      category: 'Training',
      icon: <GraduationCap className="w-5 h-5" />,
      duration: '1 hour',
      capacity: '20-50 people',
      isVirtual: false,
      tags: ['learning', 'lunch', 'speakers'],
      usage: 234
    },
    {
      id: '4',
      name: 'Coffee Chat Network',
      description: 'Informal networking session to build cross-team relationships.',
      category: 'Social',
      icon: <Coffee className="w-5 h-5" />,
      duration: '30-45 mins',
      capacity: '5-15 people',
      isVirtual: false,
      tags: ['networking', 'informal', 'relationships'],
      usage: 178
    },
    {
      id: '5',
      name: 'Virtual Town Hall',
      description: 'Online company meeting for remote and hybrid teams.',
      category: 'Meeting',
      icon: <Video className="w-5 h-5" />,
      duration: '1 hour',
      capacity: 'Unlimited',
      isVirtual: true,
      tags: ['virtual', 'town hall', 'remote'],
      usage: 124
    },
    {
      id: '6',
      name: 'Wellness Workshop',
      description: 'Health and wellness session focusing on employee well-being.',
      category: 'Wellness',
      icon: <MapPin className="w-5 h-5" />,
      duration: '45 mins - 1 hour',
      capacity: '15-30 people',
      isVirtual: false,
      tags: ['wellness', 'health', 'well-being'],
      usage: 67
    }
  ];

  const categories = ['All', 'Meeting', 'Team Building', 'Training', 'Social', 'Wellness'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Templates</h2>
          <p className="text-gray-600">Choose from event templates to create engaging activities</p>
        </div>
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          Create Custom Event
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search event templates..."
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

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {template.icon}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{template.category}</Badge>
                      {template.isVirtual ? (
                        <Badge variant="secondary">Virtual</Badge>
                      ) : (
                        <Badge variant="secondary">In-Person</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p className="font-semibold">{template.duration}</p>
                </div>
                <div>
                  <span className="text-gray-600">Capacity:</span>
                  <p className="font-semibold">{template.capacity}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-gray-600">
                  Used {template.usage} times
                </span>
                <Button size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventTemplates;
