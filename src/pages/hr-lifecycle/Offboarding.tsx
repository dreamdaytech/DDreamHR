
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  UserX,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  CreditCard,
  Monitor,
  Key,
  MessageCircle,
  Download,
  Edit,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Offboarding = () => {
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [newOffboardingDialogOpen, setNewOffboardingDialogOpen] = useState(false);
  const [exitInterviewDialogOpen, setExitInterviewDialogOpen] = useState(false);

  // Mock data
  const offboardingEmployees = [
    {
      id: '1',
      name: 'John Martinez',
      position: 'Senior Developer',
      department: 'Engineering',
      lastWorkingDay: '2024-03-15',
      reason: 'resignation',
      status: 'in_progress',
      progress: 65,
      manager: 'David Kim',
      requestedBy: 'John Martinez',
      requestDate: '2024-02-28',
      tasks: [
        { id: '1', title: 'Exit Interview Scheduled', assignee: 'HR', completed: true, department: 'HR' },
        { id: '2', title: 'Equipment Return', assignee: 'IT', completed: false, department: 'IT' },
        { id: '3', title: 'Access Revocation', assignee: 'IT', completed: false, department: 'IT' },
        { id: '4', title: 'Final Payroll Processing', assignee: 'Finance', completed: false, department: 'Finance' },
        { id: '5', title: 'Knowledge Transfer', assignee: 'Manager', completed: true, department: 'Engineering' },
        { id: '6', title: 'Project Handover', assignee: 'Manager', completed: false, department: 'Engineering' }
      ],
      feedback: {
        submitted: true,
        rating: 4,
        comments: 'Great experience, moving for better opportunities'
      }
    },
    {
      id: '2',
      name: 'Lisa Wang',
      position: 'Product Manager',
      department: 'Product',
      lastWorkingDay: '2024-03-20',
      reason: 'layoff',
      status: 'scheduled',
      progress: 25,
      manager: 'Jennifer Lee',
      requestedBy: 'HR Team',
      requestDate: '2024-03-01',
      tasks: [
        { id: '1', title: 'Severance Package Prepared', assignee: 'HR', completed: true, department: 'HR' },
        { id: '2', title: 'COBRA Information Sent', assignee: 'HR', completed: false, department: 'HR' },
        { id: '3', title: 'Equipment Collection Scheduled', assignee: 'IT', completed: false, department: 'IT' },
        { id: '4', title: 'Final Documentation', assignee: 'HR', completed: false, department: 'HR' }
      ],
      feedback: {
        submitted: false,
        rating: null,
        comments: null
      }
    }
  ];

  const offboardingTemplates = [
    {
      id: '1',
      name: 'Standard Resignation',
      description: 'Standard checklist for voluntary resignations',
      taskCount: 12,
      departments: ['HR', 'IT', 'Finance', 'Manager'],
      estimatedDays: 10
    },
    {
      id: '2',
      name: 'Executive Departure',
      description: 'Comprehensive checklist for executive departures',
      taskCount: 18,
      departments: ['HR', 'IT', 'Finance', 'Legal', 'Board'],
      estimatedDays: 14
    },
    {
      id: '3',
      name: 'Layoff Process',
      description: 'Sensitive handling for layoffs and restructuring',
      taskCount: 15,
      departments: ['HR', 'IT', 'Finance', 'Legal'],
      estimatedDays: 7
    }
  ];

  const handleStatusUpdate = (employeeId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Offboarding status updated to ${newStatus}`,
    });
  };

  const handleTaskComplete = (employeeId: string, taskId: string) => {
    toast({
      title: "Task Completed",
      description: "Offboarding task marked as complete",
    });
  };

  const handleInitiateOffboarding = () => {
    setNewOffboardingDialogOpen(false);
    toast({
      title: "Offboarding Initiated",
      description: "Employee offboarding process has been started",
    });
  };

  const handleExitInterview = () => {
    setExitInterviewDialogOpen(false);
    toast({
      title: "Exit Interview Scheduled",
      description: "Exit interview has been scheduled and invitation sent",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'resignation':
        return 'bg-blue-100 text-blue-800';
      case 'layoff':
        return 'bg-red-100 text-red-800';
      case 'retirement':
        return 'bg-purple-100 text-purple-800';
      case 'termination':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'HR':
        return <User className="h-4 w-4" />;
      case 'IT':
        return <Monitor className="h-4 w-4" />;
      case 'Finance':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Offboarding Management</h1>
          <p className="text-muted-foreground">
            Manage employee departures with structured workflows and progress tracking
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Dialog open={newOffboardingDialogOpen} onOpenChange={setNewOffboardingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Initiate Offboarding
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Initiate Employee Offboarding</DialogTitle>
                <DialogDescription>
                  Start the offboarding process for an employee departure
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee" className="text-right">Employee</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp1">Sarah Johnson - Software Engineer</SelectItem>
                      <SelectItem value="emp2">Michael Chen - Product Manager</SelectItem>
                      <SelectItem value="emp3">Emma Davis - Designer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">Reason</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resignation">Resignation</SelectItem>
                      <SelectItem value="layoff">Layoff</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="termination">Termination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastDay" className="text-right">Last Working Day</Label>
                  <Input id="lastDay" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="template" className="text-right">Template</Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Resignation</SelectItem>
                      <SelectItem value="executive">Executive Departure</SelectItem>
                      <SelectItem value="layoff">Layoff Process</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes or special instructions"
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewOffboardingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInitiateOffboarding}>
                  Start Offboarding
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Offboarding</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="feedback">Exit Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {offboardingEmployees.map((employee) => (
              <Card key={employee.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {employee.name}
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getReasonColor(employee.reason)}>
                          {employee.reason}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span>{employee.position} • {employee.department}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Last day: {new Date(employee.lastWorkingDay).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Dialog open={exitInterviewDialogOpen} onOpenChange={setExitInterviewDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Exit Interview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Schedule Exit Interview</DialogTitle>
                            <DialogDescription>
                              Schedule an exit interview with {employee.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="interviewDate" className="text-right">Date</Label>
                              <Input id="interviewDate" type="date" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="interviewTime" className="text-right">Time</Label>
                              <Input id="interviewTime" type="time" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="interviewer" className="text-right">Interviewer</Label>
                              <Select>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select interviewer" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hr1">Sarah Johnson - HR Manager</SelectItem>
                                  <SelectItem value="hr2">Michael Chen - HR Director</SelectItem>
                                  <SelectItem value="manager">Direct Manager</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="location" className="text-right">Location</Label>
                              <Select>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="office">Office - Conference Room A</SelectItem>
                                  <SelectItem value="zoom">Virtual - Zoom Meeting</SelectItem>
                                  <SelectItem value="phone">Phone Call</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setExitInterviewDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleExitInterview}>
                              Schedule Interview
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Offboarding Progress</span>
                      <span>{employee.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${employee.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tasks by Department */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Offboarding Tasks</h4>
                    {['HR', 'IT', 'Finance', 'Engineering'].map(dept => {
                      const deptTasks = employee.tasks.filter(task => task.department === dept);
                      if (deptTasks.length === 0) return null;
                      
                      return (
                        <div key={dept} className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getDepartmentIcon(dept)}
                            <h5 className="text-sm font-medium text-gray-700">{dept}</h5>
                          </div>
                          <div className="pl-6 space-y-1">
                            {deptTasks.map((task) => (
                              <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleTaskComplete(employee.id, task.id)}
                                    className="rounded border-gray-300"
                                  />
                                  <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                    {task.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">{task.assignee}</span>
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
                      );
                    })}
                  </div>

                  {/* Employee Feedback */}
                  {employee.feedback.submitted && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h5 className="text-sm font-medium text-blue-900 mb-1">Exit Feedback Submitted</h5>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-blue-700">Rating:</span>
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <span key={star} className={`text-sm ${star <= (employee.feedback.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-blue-700">{employee.feedback.comments}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Offboarding Templates</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
          
          <div className="grid gap-4">
            {offboardingTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
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
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Tasks: {template.taskCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Duration: ~{template.estimatedDays} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Departments: {template.departments.join(', ')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Active Offboarding</p>
                    <p className="text-2xl font-bold text-red-700">5</p>
                  </div>
                  <UserX className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">This Month</p>
                    <p className="text-2xl font-bold text-blue-700">8</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Completed</p>
                    <p className="text-2xl font-bold text-green-700">23</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Avg. Duration</p>
                    <p className="text-2xl font-bold text-yellow-700">12 days</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exit Feedback & Analytics</CardTitle>
              <CardDescription>Insights from employee exit interviews and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-purple-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Average Satisfaction Rating</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-purple-700">4.2</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className={`text-lg ${star <= 4 ? 'text-yellow-500' : 'text-gray-300'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-purple-600 mt-1">Based on 23 responses</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Top Departure Reasons</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Better Opportunity</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Career Growth</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Compensation</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Other</span>
                        <span className="font-medium">10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Offboarding;
