
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, Copy, Plus } from 'lucide-react';

interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  questions: number;
  estimatedTime: string;
  usage: number;
  tags: string[];
}

const SurveyTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const templates: SurveyTemplate[] = [
    {
      id: '1',
      name: 'Employee Satisfaction Survey',
      description: 'Comprehensive survey to measure overall employee satisfaction and engagement levels.',
      category: 'Satisfaction',
      questions: 25,
      estimatedTime: '8-10 mins',
      usage: 89,
      tags: ['satisfaction', 'engagement', 'annual']
    },
    {
      id: '2',
      name: 'Pulse Survey - Weekly Check-in',
      description: 'Quick weekly pulse check to monitor team morale and immediate concerns.',
      category: 'Pulse',
      questions: 5,
      estimatedTime: '2-3 mins',
      usage: 156,
      tags: ['pulse', 'weekly', 'morale']
    },
    {
      id: '3',
      name: '360 Feedback Survey',
      description: 'Multi-rater feedback survey for comprehensive performance evaluation.',
      category: 'Performance',
      questions: 40,
      estimatedTime: '15-20 mins',
      usage: 34,
      tags: ['360', 'feedback', 'performance']
    },
    {
      id: '4',
      name: 'Exit Interview Survey',
      description: 'Structured exit interview to gather insights from departing employees.',
      category: 'Exit',
      questions: 18,
      estimatedTime: '10-12 mins',
      usage: 23,
      tags: ['exit', 'interview', 'retention']
    },
    {
      id: '5',
      name: 'Training Effectiveness Survey',
      description: 'Evaluate the effectiveness and impact of training programs.',
      category: 'Training',
      questions: 12,
      estimatedTime: '5-7 mins',
      usage: 67,
      tags: ['training', 'effectiveness', 'learning']
    },
    {
      id: '6',
      name: 'Onboarding Experience Survey',
      description: 'Assess new hire onboarding experience and identify improvement areas.',
      category: 'Onboarding',
      questions: 15,
      estimatedTime: '6-8 mins',
      usage: 45,
      tags: ['onboarding', 'new hire', 'experience']
    }
  ];

  const categories = ['All', 'Satisfaction', 'Pulse', 'Performance', 'Exit', 'Training', 'Onboarding'];

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
          <h2 className="text-2xl font-bold text-gray-900">Survey Templates</h2>
          <p className="text-gray-600">Choose from pre-built survey templates or create your own</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Template
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
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
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Questions:</span>
                  <p className="font-semibold">{template.questions}</p>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p className="font-semibold">{template.estimatedTime}</p>
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
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm">
                    <Copy className="w-4 h-4 mr-1" />
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SurveyTemplates;
