
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  UserPlus,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Target,
  Edit,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Onboarding = () => {
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [newWorkflowDialogOpen, setNewWorkflowDialogOpen] = useState(false);

  // Mock data
  const onboardingEmployees = [
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'Software Engineer',
      department: 'Engineering',
      startDate: '2024-02-15',
      status: 'active',
      progress: 75,
      buddy: 'Alex Chen',
      manager: 'David Kim',
      location: 'Remote',
      workflowType: 'engineering',
      tasks: [
        { id: '1', title: 'IT Setup Complete', assignee: 'IT Team', completed: true, dueDate: '2024-02-15' },
        { id: '2', title: 'Office Tour', assignee: 'Buddy', completed: true, dueDate: '2024-02-16' },
        { id: '3', title: 'Team Introduction', assignee: 'Manager', completed: true, dueDate: '2024-02-16' },
        { id: '4', title: 'Project Assignment', assignee: 'Manager', completed: false, dueDate: '2024-02-20' },
        { id: '5', title: 'First Week Review', assignee: 'HR', completed: false, dueDate: '2024-02-22' }
      ]
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'Product Manager',
      department: 'Product',
      startDate: '2024-02-20',
      status: 'scheduled',
      progress: 25,
      buddy: 'Lisa Wang',
      manager: 'Jennifer Lee',
      location: 'Office',
      workflowType: 'management',
      tasks: [
        { id: '1', title: 'Welcome Email', assignee: 'HR', completed: true, dueDate: '2024-02-19' },
        { id: '2', title: 'IT Setup', assignee: 'IT Team', completed: false, dueDate: '2024-02-20' },
        { id: '3', title: 'Department Overview', assignee: 'Manager', completed: false, dueDate: '2024-02-21' },
        { id: '4', title: 'Strategy Session', assignee: 'Manager', completed: false, dueDate: '2024-02-23' }
      ]
    }
  ];

  const onboardingWorkflows = [
    {
      id: '1',
      name: 'Engineering Onboarding',
      description: 'Comprehensive workflow for software engineers',
      duration: '2 weeks',
      taskCount: 12,
      roles: ['Software Engineer', 'Senior Engineer', 'Tech Lead']
    },
    {
      id: '2',
      name: 'Management Onboarding',
      description: 'Leadership-focused onboarding process',
      duration: '3 weeks',
      taskCount: 15,
      roles: ['Manager', 'Director', 'VP']
    },
    {
      id: '3',
      name: 'Remote Employee Onboarding',
      description: 'Specialized workflow for remote workers',
      duration: '10 days',
      taskCount: 10,
      roles: ['All Remote Positions']
    }
  ];

  const handleStatusUpdate = (employeeId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Employee onboarding status updated to ${newStatus}`,
    });
  };

  const handleTaskComplete = (employeeId: string, taskId: string) => {
    toast({
      title: "Task Completed",
      description: "Onboarding task marked as complete",
    });
  };

  const handleAssignBuddy = (employeeId: string, buddyName: string) => {
    toast({
      title: "Buddy Assigned",
      description: `${buddyName} has been assigned as onboarding buddy`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationIcon = (location: string) => {
    return location === 'Remote' ? '🏠' : '🏢';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Onboarding Management</h1>
          <p className="text-muted-foreground">
            Guide new employees through structured onboarding workflows
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
          <Dialog open={newWorkflowDialogOpen} onOpenChange={setNewWorkflowDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Onboarding Workflow</DialogTitle>
                <DialogDescription>
                  Design a custom onboarding workflow for specific roles or departments
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="workflowName" className="text-right">Name</Label>
                  <Input id="workflowName" className="col-span-3" placeholder="Workflow name" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">Department</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">Duration</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1week">1 Week</SelectItem>
                      <SelectItem value="2weeks">2 Weeks</SelectItem>
                      <SelectItem value="3weeks">3 Weeks</SelectItem>
                      <SelectItem value="1month">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewWorkflowDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setNewWorkflowDialogOpen(false);
                  toast({
                    title: "Workflow Created",
                    description: "New onboarding workflow has been created",
                  });
                }}>
                  Create Workflow
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Onboarding</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {onboardingEmployees.map((employee) => (
              <Card key={employee.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {employee.name}
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span>{employee.position} • {employee.department}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Started {new Date(employee.startDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {getLocationIcon(employee.location)} {employee.location}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Onboarding Progress</span>
                      <span>{employee.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${employee.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        <strong>Manager:</strong> {employee.manager}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        <strong>Buddy:</strong> {employee.buddy}
                      </span>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Onboarding Tasks</h4>
                    <div className="space-y-2">
                      {employee.tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleTaskComplete(employee.id, task.id)}
                              className="rounded border-gray-300"
                            />
                            <div>
                              <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                {task.title}
                              </span>
                              <div className="text-xs text-gray-500">
                                Assigned to: {task.assignee}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            {task.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4">
            {onboardingWorkflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{workflow.name}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Duration: {workflow.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Tasks: {workflow.taskCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Roles: {workflow.roles.join(', ')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Active Onboarding</p>
                    <p className="text-2xl font-bold text-blue-700">12</p>
                  </div>
                  <UserPlus className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Completed This Month</p>
                    <p className="text-2xl font-bold text-green-700">8</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Avg. Completion</p>
                    <p className="text-2xl font-bold text-yellow-700">14 days</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Satisfaction Rate</p>
                    <p className="text-2xl font-bold text-purple-700">94%</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Team Management</CardTitle>
              <CardDescription>Manage buddies, mentors, and team assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Available Buddies</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Alex Chen</span>
                          <Badge>Engineering</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Lisa Wang</span>
                          <Badge>Product</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>John Smith</span>
                          <Badge>Marketing</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Active Assignments</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          Alex Chen → Sarah Johnson
                        </div>
                        <div className="text-sm">
                          Lisa Wang → Michael Chen
                        </div>
                        <div className="text-sm">
                          John Smith → Emma Davis
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Onboarding;
