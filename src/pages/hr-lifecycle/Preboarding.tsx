
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
  BookOpen,
  Plus,
  Eye,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
  Mail,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Preboarding = () => {
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [newCandidateDialogOpen, setNewCandidateDialogOpen] = useState(false);

  // Mock data
  const preboardingCandidates = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      position: 'Software Engineer',
      department: 'Engineering',
      startDate: '2024-02-15',
      status: 'pending',
      progress: 60,
      tasks: [
        { id: '1', title: 'Welcome Email Sent', completed: true },
        { id: '2', title: 'Contract Signed', completed: true },
        { id: '3', title: 'Handbook Delivered', completed: false },
        { id: '4', title: 'Team Introduction Video', completed: false },
        { id: '5', title: 'IT Setup Request', completed: false }
      ],
      documents: [
        { id: '1', name: 'Employment Contract', status: 'signed' },
        { id: '2', name: 'Employee Handbook', status: 'sent' },
        { id: '3', name: 'Welcome Packet', status: 'pending' }
      ]
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      position: 'Product Manager',
      department: 'Product',
      startDate: '2024-02-20',
      status: 'in_progress',
      progress: 85,
      tasks: [
        { id: '1', title: 'Welcome Email Sent', completed: true },
        { id: '2', title: 'Contract Signed', completed: true },
        { id: '3', title: 'Handbook Delivered', completed: true },
        { id: '4', title: 'Team Introduction Video', completed: true },
        { id: '5', title: 'IT Setup Request', completed: false }
      ],
      documents: [
        { id: '1', name: 'Employment Contract', status: 'signed' },
        { id: '2', name: 'Employee Handbook', status: 'delivered' },
        { id: '3', name: 'Welcome Packet', status: 'sent' }
      ]
    }
  ];

  const welcomePacketTemplates = [
    {
      id: '1',
      name: 'Engineering Welcome Pack',
      description: 'Welcome package for software engineers',
      items: ['Employee Handbook', 'Team Introduction Video', 'Development Setup Guide', 'Company Values Presentation']
    },
    {
      id: '2',
      name: 'Management Welcome Pack',
      description: 'Welcome package for management roles',
      items: ['Employee Handbook', 'Leadership Resources', 'Team Directory', 'Strategy Overview']
    }
  ];

  const handleStatusUpdate = (candidateId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Candidate status updated to ${newStatus}`,
    });
  };

  const handleTaskToggle = (candidateId: string, taskId: string) => {
    toast({
      title: "Task Updated",
      description: "Task completion status updated",
    });
  };

  const handleSendWelcomePacket = (candidateId: string) => {
    toast({
      title: "Welcome Packet Sent",
      description: "Welcome packet has been sent to the candidate",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'sent':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Preboarding Management</h1>
          <p className="text-muted-foreground">
            Prepare new hires before their start date with automated workflows
          </p>
        </div>
        
        <Dialog open={newCandidateDialogOpen} onOpenChange={setNewCandidateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Hire
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Hire to Preboarding</DialogTitle>
              <DialogDescription>
                Enter the details of the new hire to start the preboarding process
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" className="col-span-3" placeholder="Full name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" className="col-span-3" placeholder="email@company.com" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">Position</Label>
                <Input id="position" className="col-span-3" placeholder="Job title" />
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
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Start Date</Label>
                <Input id="startDate" type="date" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewCandidateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setNewCandidateDialogOpen(false);
                toast({
                  title: "New Hire Added",
                  description: "Preboarding process has been initiated",
                });
              }}>
                Start Preboarding
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="candidates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="templates">Welcome Packets</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="candidates" className="space-y-4">
          <div className="grid gap-4">
            {preboardingCandidates.map((candidate) => (
              <Card key={candidate.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {candidate.name}
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status.replace('_', ' ')}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {candidate.position} • {candidate.department} • Starts {new Date(candidate.startDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(candidate.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleSendWelcomePacket(candidate.id)}>
                        <Send className="h-4 w-4 mr-1" />
                        Send Packet
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{candidate.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${candidate.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Preboarding Tasks</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {candidate.tasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskToggle(candidate.id, task.id)}
                            className="rounded border-gray-300"
                          />
                          <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </span>
                          {task.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {candidate.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          {getDocumentStatusIcon(doc.status)}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Welcome Packet Templates</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
          
          <div className="grid gap-4">
            {welcomePacketTemplates.map((template) => (
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
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Included Items:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {template.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
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
                    <p className="text-sm font-medium text-blue-600">Total Candidates</p>
                    <p className="text-2xl font-bold text-blue-700">24</p>
                  </div>
                  <User className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">8</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Completed</p>
                    <p className="text-2xl font-bold text-green-700">14</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-700">2</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Preboarding;
