
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Users, BookOpen, Code, Coffee, Dumbbell, Music, Camera, Globe, Lock } from 'lucide-react';

interface CommunityTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  memberRange: string;
  activityLevel: string;
  isPrivate: boolean;
  tags: string[];
  usage: number;
}

const CommunityTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const templates: CommunityTemplate[] = [
    {
      id: '1',
      name: 'Tech Innovation Hub',
      description: 'Community for developers and tech enthusiasts to share knowledge and innovations.',
      category: 'Technology',
      icon: <Code className="w-5 h-5" />,
      memberRange: '20-100',
      activityLevel: 'High',
      isPrivate: false,
      tags: ['technology', 'development', 'innovation'],
      usage: 134
    },
    {
      id: '2',
      name: 'Book Lovers Circle',
      description: 'Monthly book club for personal and professional development reading.',
      category: 'Learning',
      icon: <BookOpen className="w-5 h-5" />,
      memberRange: '10-30',
      activityLevel: 'Medium',
      isPrivate: false,
      tags: ['books', 'learning', 'development'],
      usage: 89
    },
    {
      id: '3',
      name: 'Fitness & Wellness Group',
      description: 'Community focused on health, fitness challenges, and wellness activities.',
      category: 'Health & Wellness',
      icon: <Dumbbell className="w-5 h-5" />,
      memberRange: '15-50',
      activityLevel: 'High',
      isPrivate: false,
      tags: ['fitness', 'wellness', 'health'],
      usage: 156
    },
    {
      id: '4',
      name: 'Coffee & Culture',
      description: 'Informal community for casual conversations and cultural exchanges.',
      category: 'Social',
      icon: <Coffee className="w-5 h-5" />,
      memberRange: '5-25',
      activityLevel: 'Medium',
      isPrivate: false,
      tags: ['social', 'culture', 'conversations'],
      usage: 234
    },
    {
      id: '5',
      name: 'Photography Collective',
      description: 'Share photography work, tips, and organize photo walks and challenges.',
      category: 'Hobbies',
      icon: <Camera className="w-5 h-5" />,
      memberRange: '10-40',
      activityLevel: 'Medium',
      isPrivate: false,
      tags: ['photography', 'creative', 'hobbies'],
      usage: 67
    },
    {
      id: '6',
      name: 'Leadership Forum',
      description: 'Private community for managers and leaders to share best practices.',
      category: 'Leadership',
      icon: <Users className="w-5 h-5" />,
      memberRange: '5-20',
      activityLevel: 'Low',
      isPrivate: true,
      tags: ['leadership', 'management', 'private'],
      usage: 45
    }
  ];

  const categories = ['All', 'Technology', 'Learning', 'Health & Wellness', 'Social', 'Hobbies', 'Leadership'];

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
          <h2 className="text-2xl font-bold text-gray-900">Community Templates</h2>
          <p className="text-gray-600">Choose from community templates to build engagement groups</p>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Create Custom Community
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search community templates..."
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
                      {template.isPrivate ? (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="w-3 h-3 mr-1" />
                          Private
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
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
                  <span className="text-gray-600">Members:</span>
                  <p className="font-semibold">{template.memberRange}</p>
                </div>
                <div>
                  <span className="text-gray-600">Activity:</span>
                  <p className="font-semibold">{template.activityLevel}</p>
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
                  <Users className="w-4 h-4 mr-1" />
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

export default CommunityTemplates;
