
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Star, Award, Trophy, Heart, Zap, Target } from 'lucide-react';

interface RecognitionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  points: number;
  frequency: string;
  tags: string[];
  usage: number;
}

const RecognitionTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const templates: RecognitionTemplate[] = [
    {
      id: '1',
      name: 'Outstanding Performance',
      description: 'Recognize exceptional work performance and achievement of goals.',
      category: 'Performance',
      icon: <Star className="w-5 h-5" />,
      points: 100,
      frequency: 'Monthly',
      tags: ['performance', 'achievement', 'goals'],
      usage: 234
    },
    {
      id: '2',
      name: 'Team Player',
      description: 'Acknowledge exceptional collaboration and team spirit.',
      category: 'Teamwork',
      icon: <Heart className="w-5 h-5" />,
      points: 75,
      frequency: 'Weekly',
      tags: ['teamwork', 'collaboration', 'support'],
      usage: 189
    },
    {
      id: '3',
      name: 'Innovation Award',
      description: 'Celebrate creative thinking and innovative solutions.',
      category: 'Innovation',
      icon: <Zap className="w-5 h-5" />,
      points: 150,
      frequency: 'Quarterly',
      tags: ['innovation', 'creativity', 'solutions'],
      usage: 67
    },
    {
      id: '4',
      name: 'Customer Champion',
      description: 'Honor exceptional customer service and client satisfaction.',
      category: 'Service',
      icon: <Award className="w-5 h-5" />,
      points: 125,
      frequency: 'Monthly',
      tags: ['customer', 'service', 'satisfaction'],
      usage: 156
    },
    {
      id: '5',
      name: 'Goal Crusher',
      description: 'Recognize exceeding targets and achieving significant milestones.',
      category: 'Achievement',
      icon: <Target className="w-5 h-5" />,
      points: 200,
      frequency: 'Quarterly',
      tags: ['goals', 'targets', 'milestones'],
      usage: 98
    },
    {
      id: '6',
      name: 'Leadership Excellence',
      description: 'Acknowledge outstanding leadership and mentoring abilities.',
      category: 'Leadership',
      icon: <Trophy className="w-5 h-5" />,
      points: 175,
      frequency: 'Quarterly',
      tags: ['leadership', 'mentoring', 'guidance'],
      usage: 45
    }
  ];

  const categories = ['All', 'Performance', 'Teamwork', 'Innovation', 'Service', 'Achievement', 'Leadership'];

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
          <h2 className="text-2xl font-bold text-gray-900">Recognition Templates</h2>
          <p className="text-gray-600">Choose from recognition templates to celebrate achievements</p>
        </div>
        <Button>
          <Star className="w-4 h-4 mr-2" />
          Create Custom Recognition
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search recognition templates..."
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
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                </div>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Points:</span>
                  <p className="font-semibold text-primary">{template.points}</p>
                </div>
                <div>
                  <span className="text-gray-600">Frequency:</span>
                  <p className="font-semibold">{template.frequency}</p>
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
                  <Award className="w-4 h-4 mr-1" />
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

export default RecognitionTemplates;
