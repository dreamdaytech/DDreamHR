
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Clock,
  FileText,
  Users,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  ExternalLink,
  Play,
  User,
  Building,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const EmployeePortal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  // Mock data for employee onboarding
  const employeeData = {
    name: user?.name || 'New Employee',
    position: 'Software Engineer',
    department: 'Engineering',
    startDate: '2024-02-15',
    employeeId: 'EMP-2024-001',
    manager: 'David Kim',
    buddy: 'Alex Chen',
    workLocation: 'Remote',
    progress: 68
  };

  const onboardingTasks = [
    {
      id: '1',
      title: 'Complete I-9 Form',
      description: 'Submit required employment verification documents',
      completed: true,
      dueDate: '2024-02-16',
      priority: 'high',
      category: 'HR Documents'
    },
    {
      id: '2',
      title: 'Set up Development Environment',
      description: 'Install required software and access development tools',
      completed: true,
      dueDate: '2024-02-17',
      priority: 'high',
      category: 'IT Setup'
    },
    {
      id: '3',
      title: 'Attend Team Introduction Meeting',
      description: 'Meet your team members and learn about ongoing projects',
      completed: true,
      dueDate: '2024-02-18',
      priority: 'medium',
      category: 'Team Integration'
    },
    {
      id: '4',
      title: 'Complete Security Training',
      description: 'Mandatory cybersecurity awareness training',
      completed: false,
      dueDate: '2024-02-22',
      priority: 'high',
      category: 'Training'
    },
    {
      id: '5',
      title: 'Submit Emergency Contact Information',
      description: 'Provide emergency contact details for HR records',
      completed: false,
      dueDate: '2024-02-23',
      priority: 'medium',
      category: 'HR Documents'
    },
    {
      id: '6',
      title: 'Schedule First Project Assignment',
      description: 'Meet with your manager to discuss your first project',
      completed: false,
      dueDate: '2024-02-25',
      priority: 'medium',
      category: 'Project Assignment'
    }
  ];

  const teamMembers = [
    {
      id: '1',
      name: 'David Kim',
      role: 'Engineering Manager',
      email: 'david.kim@company.com',
      phone: '+1 (555) 123-4567',
      avatar: '👨‍💼',
      isManager: true
    },
    {
      id: '2',
      name: 'Alex Chen',
      role: 'Senior Software Engineer (Buddy)',
      email: 'alex.chen@company.com',
      phone: '+1 (555) 234-5678',
      avatar: '👨‍💻',
      isBuddy: true
    },
    {
      id: '3',
      name: 'Sarah Martinez',
      role: 'Software Engineer',
      email: 'sarah.martinez@company.com',
      phone: '+1 (555) 345-6789',
      avatar: '👩‍💻'
    },
    {
      id: '4',
      name: 'Mike Johnson',
      role: 'Senior Software Engineer',
      email: 'mike.johnson@company.com',
      phone: '+1 (555) 456-7890',
      avatar: '👨‍💻'
    }
  ];

  const documents = [
    {
      id: '1',
      name: 'Employee Handbook',
      description: 'Complete guide to company policies and procedures',
      type: 'PDF',
      size: '2.4 MB',
      category: 'Policies',
      url: '#'
    },
    {
      id: '2',
      name: 'Engineering Onboarding Guide',
      description: 'Technical setup and development best practices',
      type: 'PDF',
      size: '1.8 MB',
      category: 'Technical',
      url: '#'
    },
    {
      id: '3',
      name: 'Benefits Overview',
      description: 'Comprehensive overview of employee benefits',
      type: 'PDF',
      size: '1.2 MB',
      category: 'Benefits',
      url: '#'
    },
    {
      id: '4',
      name: 'Company Org Chart',
      description: 'Visual representation of company structure',
      type: 'PDF',
      size: '0.8 MB',
      category: 'Organization',
      url: '#'
    },
    {
      id: '5',
      name: 'Code of Conduct',
      description: 'Expected standards of behavior and ethics',
      type: 'PDF',
      size: '1.0 MB',
      category: 'Policies',
      url: '#'
    }
  ];

  const companyResources = [
    {
      id: '1',
      title: 'Welcome Video from CEO',
      description: 'Personal welcome message and company vision',
      type: 'video',
      duration: '5 min',
      thumbnail: '🎥'
    },
    {
      id: '2',
      title: 'Company Culture Overview',
      description: 'Learn about our values, mission, and culture',
      type: 'presentation',
      duration: '10 min',
      thumbnail: '📊'
    },
    {
      id: '3',
      title: 'Product Demo',
      description: 'Introduction to our main products and services',
      type: 'video',
      duration: '15 min',
      thumbnail: '💻'
    },
    {
      id: '4',
      title: 'Virtual Office Tour',
      description: 'Explore our office spaces and facilities',
      type: 'virtual_tour',
      duration: '8 min',
      thumbnail: '🏢'
    }
  ];

  const handleTaskComplete = (taskId: string) => {
    toast({
      title: "Task Completed",
      description: "Great job! Your progress has been updated.",
    });
  };

  const handleDocumentDownload = (documentName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${documentName}...`,
    });
  };

  const handleContactPerson = (name: string, method: string) => {
    toast({
      title: "Contact Information",
      description: `Opening ${method} for ${name}`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const completedTasks = onboardingTasks.filter(task => task.completed).length;
  const totalTasks = onboardingTasks.length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {employeeData.name}! 👋</h1>
                <p className="text-gray-600">
                  {employeeData.position} • {employeeData.department} • Started {new Date(employeeData.startDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Onboarding Progress</p>
                  <p className="text-lg font-semibold">{progressPercentage}% Complete</p>
                </div>
                <div className="w-16 h-16">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-gray-300"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercentage / 100)}`}
                      className="text-blue-600 transition-all duration-300"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="tasks" className="text-xs sm:text-sm">My Tasks</TabsTrigger>
            <TabsTrigger value="team" className="text-xs sm:text-sm">Team</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs sm:text-sm">Documents</TabsTrigger>
            <TabsTrigger value="company" className="text-xs sm:text-sm">Company</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Progress Overview */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Your Onboarding Journey</h3>
                    <p className="text-blue-700">You've completed {completedTasks} out of {totalTasks} tasks</p>
                  </div>
                  <div className="w-full md:w-64">
                    <Progress value={progressPercentage} className="h-3" />
                    <p className="text-sm text-blue-600 mt-1">{progressPercentage}% Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks List */}
            <div className="space-y-4">
              {onboardingTasks.map((task) => (
                <Card key={task.id} className={`transition-all duration-200 hover:shadow-md ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => !task.completed && handleTaskComplete(task.id)}
                          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            task.completed 
                              ? 'bg-green-600 border-green-600 text-white' 
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                          disabled={task.completed}
                        >
                          {task.completed && <CheckCircle className="w-3 h-3" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </h4>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge variant="outline">
                              {task.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            {task.completed && (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!task.completed && (
                        <Button 
                          size="sm" 
                          onClick={() => handleTaskComplete(task.id)}
                          className="shrink-0"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Team
                </CardTitle>
                <CardDescription>
                  Get to know your team members and key contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className={`${member.isManager ? 'bg-blue-50 border-blue-200' : member.isBuddy ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{member.avatar}</div>
                            <div>
                              <h4 className="font-medium flex items-center gap-2">
                                {member.name}
                                {member.isManager && <Badge className="bg-blue-100 text-blue-800">Manager</Badge>}
                                {member.isBuddy && <Badge className="bg-green-100 text-green-800">Buddy</Badge>}
                              </h4>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleContactPerson(member.name, 'email')}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleContactPerson(member.name, 'phone')}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          <p>📧 {member.email}</p>
                          <p>📞 {member.phone}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Center
                </CardTitle>
                <CardDescription>
                  Access important documents and resources for your role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{doc.name}</h4>
                              <p className="text-sm text-gray-600">{doc.description}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-gray-500">{doc.type} • {doc.size}</span>
                                <Badge variant="outline">{doc.category}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDocumentDownload(doc.name)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Introduction
                </CardTitle>
                <CardDescription>
                  Learn about our company culture, values, and mission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {companyResources.map((resource) => (
                    <Card key={resource.id} className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{resource.thumbnail}</div>
                            <div>
                              <h4 className="font-medium">{resource.title}</h4>
                              <p className="text-sm text-gray-600">{resource.description}</p>
                              <span className="text-xs text-gray-500">{resource.duration}</span>
                            </div>
                          </div>
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Play className="h-4 w-4 mr-1" />
                            {resource.type === 'video' ? 'Watch' : 'View'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-blue-700">500+</p>
                  <p className="text-sm text-blue-600">Employees</p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-green-700">15+</p>
                  <p className="text-sm text-green-600">Countries</p>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-purple-700">10</p>
                  <p className="text-sm text-purple-600">Years</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeePortal;
