import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Search, Filter, Download, Clock, Calendar, User, Eye, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TimeLogDetailView } from "./TimeLogDetailView";

interface TimeLog {
  id: string;
  employeeName: string;
  department: string;
  project: string;
  task: string;
  date: string;
  hours: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedTo: string;
  description: string;
  billable: boolean;
}

export const TimeApprovalDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [selectedLog, setSelectedLog] = useState<TimeLog | null>(null);
  const [reviewComments, setReviewComments] = useState("");
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'status-details' | 'detailed-review'>('dashboard');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([
    {
      id: "1",
      employeeName: "John Smith",
      department: "Development",
      project: "Website Redesign",
      task: "Frontend Development",
      date: "2024-01-29",
      hours: 8,
      status: "pending",
      submittedTo: "Manager",
      description: "Implemented responsive navigation",
      billable: true
    },
    {
      id: "2",
      employeeName: "Sarah Johnson",
      department: "Marketing",
      project: "Q1 Campaign",
      task: "Content Creation",
      date: "2024-01-29",
      hours: 6.5,
      status: "pending",
      submittedTo: "HR",
      description: "Created blog posts and social media content",
      billable: true
    },
    {
      id: "3",
      employeeName: "Mike Chen",
      department: "Development",
      project: "Mobile App",
      task: "Backend API",
      date: "2024-01-28",
      hours: 7,
      status: "approved",
      submittedTo: "Team Lead",
      description: "Developed user authentication endpoints",
      billable: true
    },
    {
      id: "4",
      employeeName: "Emily Davis",
      department: "HR",
      project: "Internal Portal",
      task: "Documentation",
      date: "2024-01-28",
      hours: 4,
      status: "rejected",
      submittedTo: "Admin",
      description: "Updated employee handbook",
      billable: false
    },
    {
      id: "5",
      employeeName: "Alex Thompson",
      department: "Development",
      project: "Website Redesign",
      task: "Backend Integration",
      date: "2024-01-30",
      hours: 6,
      status: "pending",
      submittedTo: "Manager",
      description: "Database optimization and API integration",
      billable: true
    }
  ]);

  const departments = ["All", "Development", "Marketing", "HR", "Sales", "Finance"];
  const statuses = ["All", "pending", "approved", "rejected"];

  const filteredLogs = timeLogs.filter(log => {
    const matchesSearch = log.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.task.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || log.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesDate = !filterDate || log.date === filterDate;
    const matchesSelectedStatus = !selectedStatus || log.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesDate && matchesSelectedStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (logId: string) => {
    setTimeLogs(prev => prev.map(log => 
      log.id === logId ? { ...log, status: 'approved' as const } : log
    ));
    
    toast({
      title: "Time Log Approved",
      description: "The time log has been approved successfully.",
    });
  };

  const handleReject = (logId: string, comments: string) => {
    setTimeLogs(prev => prev.map(log => 
      log.id === logId ? { ...log, status: 'rejected' as const } : log
    ));
    
    setShowReviewDialog(false);
    setReviewComments("");
    setSelectedLog(null);
    
    toast({
      title: "Time Log Rejected",
      description: "The time log has been rejected with feedback.",
    });
  };

  const openRejectDialog = (log: TimeLog) => {
    setSelectedLog(log);
    setShowReviewDialog(true);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Time logs are being exported to CSV...",
    });
  };

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status);
    setViewMode('status-details');
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setSelectedStatus('');
    setShowDetailView(false);
  };

  const handleDetailedReview = () => {
    setViewMode('detailed-review');
  };

  const pendingCount = timeLogs.filter(log => log.status === 'pending').length;
  const approvedCount = timeLogs.filter(log => log.status === 'approved').length;
  const rejectedCount = timeLogs.filter(log => log.status === 'rejected').length;
  const totalHours = timeLogs.reduce((sum, log) => sum + log.hours, 0);

  if (viewMode === 'detailed-review') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold">Detailed Time Log Review</h2>
        </div>
        <TimeLogDetailView timeLogs={timeLogs} onBack={handleBackToDashboard} />
      </div>
    );
  }

  if (viewMode === 'status-details') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold">
            {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Time Logs
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Time Logs - {selectedStatus.toUpperCase()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Project/Task</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Billable</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {log.employeeName}
                        </div>
                      </TableCell>
                      <TableCell>{log.department}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.project}</div>
                          <div className="text-sm text-muted-foreground">{log.task}</div>
                        </div>
                      </TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.hours}h</TableCell>
                      <TableCell>
                        <Badge variant={log.billable ? "default" : "secondary"}>
                          {log.billable ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {log.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(log.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openRejectDialog(log)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards - Made Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatusClick('pending')}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatusClick('approved')}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatusClick('rejected')}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <X className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-blue-600">{totalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button onClick={handleDetailedReview} variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Detailed Review
        </Button>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search employee, project, task..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Time Log Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Project/Task</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Billable</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {log.employeeName}
                      </div>
                    </TableCell>
                    <TableCell>{log.department}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.project}</div>
                        <div className="text-sm text-muted-foreground">{log.task}</div>
                      </div>
                    </TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.hours}h</TableCell>
                    <TableCell>
                      <Badge variant={log.billable ? "default" : "secondary"}>
                        {log.billable ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {log.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(log.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openRejectDialog(log)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Time Log</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedLog && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedLog.employeeName}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedLog.project} - {selectedLog.task} ({selectedLog.hours}h)
                </p>
                <p className="text-sm mt-2">{selectedLog.description}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={3}
                required
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => selectedLog && handleReject(selectedLog.id, reviewComments)}
                disabled={!reviewComments.trim()}
              >
                Reject with Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
