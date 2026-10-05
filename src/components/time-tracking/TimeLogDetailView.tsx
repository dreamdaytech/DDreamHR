
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Search, Filter, Calendar, User, Building, Clock, BarChart3, Download, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface TimeLogDetailViewProps {
  timeLogs: TimeLog[];
  onBack: () => void;
}

export const TimeLogDetailView: React.FC<TimeLogDetailViewProps> = ({ timeLogs, onBack }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterTask, setFilterTask] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [displayMode, setDisplayMode] = useState<"summary" | "detailed">("detailed");

  // Get unique values for filters
  const uniqueUsers = [...new Set(timeLogs.map(log => log.employeeName))];
  const uniqueProjects = [...new Set(timeLogs.map(log => log.project))];
  const uniqueTasks = [...new Set(timeLogs.map(log => log.task))];
  const uniqueDepartments = [...new Set(timeLogs.map(log => log.department))];

  // Filter logs
  const filteredLogs = timeLogs.filter(log => {
    const matchesSearch = 
      log.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = filterUser === "all" || log.employeeName === filterUser;
    const matchesProject = filterProject === "all" || log.project === filterProject;
    const matchesTask = filterTask === "all" || log.task === filterTask;
    const matchesDepartment = filterDepartment === "all" || log.department === filterDepartment;
    
    // Simple date range filter (you can enhance this)
    const matchesDateRange = !dateRange || log.date >= dateRange;
    
    return matchesSearch && matchesUser && matchesProject && matchesTask && 
           matchesDepartment && matchesDateRange;
  });

  // Sort logs with proper type handling
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let aValue: string | number | boolean = a[sortBy as keyof TimeLog];
    let bValue: string | number | boolean = b[sortBy as keyof TimeLog];
    
    // Handle different data types for sorting
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      // Convert boolean to number for comparison
      aValue = aValue ? 1 : 0;
      bValue = bValue ? 1 : 0;
    } else if (sortBy === "hours") {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else {
      // Ensure we're comparing strings
      aValue = String(aValue);
      bValue = String(bValue);
    }
    
    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Calculate summary data
  const summaryData = {
    totalHours: filteredLogs.reduce((sum, log) => sum + log.hours, 0),
    billableHours: filteredLogs.filter(log => log.billable).reduce((sum, log) => sum + log.hours, 0),
    totalEntries: filteredLogs.length,
    avgHoursPerDay: filteredLogs.length > 0 ? (filteredLogs.reduce((sum, log) => sum + log.hours, 0) / filteredLogs.length).toFixed(2) : 0
  };

  // Group by project for summary view
  const projectSummary = filteredLogs.reduce((acc, log) => {
    if (!acc[log.project]) {
      acc[log.project] = {
        totalHours: 0,
        billableHours: 0,
        entries: 0,
        tasks: new Set()
      };
    }
    acc[log.project].totalHours += log.hours;
    if (log.billable) acc[log.project].billableHours += log.hours;
    acc[log.project].entries += 1;
    acc[log.project].tasks.add(log.task);
    return acc;
  }, {} as Record<string, { totalHours: number; billableHours: number; entries: number; tasks: Set<string> }>);

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Detailed time logs are being exported to CSV...",
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-blue-600">{summaryData.totalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Billable Hours</p>
                <p className="text-2xl font-bold text-green-600">{summaryData.billableHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold text-purple-600">{summaryData.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Hours/Entry</p>
                <p className="text-2xl font-bold text-orange-600">{summaryData.avgHoursPerDay}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant={displayMode === "summary" ? "default" : "outline"}
            onClick={() => setDisplayMode("summary")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Summary
          </Button>
          <Button 
            variant={displayMode === "detailed" ? "default" : "outline"}
            onClick={() => setDisplayMode("detailed")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Detailed
          </Button>
        </div>
        
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>User</Label>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {uniqueProjects.map(project => (
                    <SelectItem key={project} value={project}>{project}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Task</Label>
              <Select value={filterTask} onValueChange={setFilterTask}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  {uniqueTasks.map(task => (
                    <SelectItem key={task} value={task}>{task}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input
                type="date"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Content */}
      {displayMode === "summary" ? (
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Billable Hours</TableHead>
                    <TableHead>Entries</TableHead>
                    <TableHead>Tasks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(projectSummary).map(([project, data]) => (
                    <TableRow key={project}>
                      <TableCell className="font-medium">{project}</TableCell>
                      <TableCell>{data.totalHours}h</TableCell>
                      <TableCell>{data.billableHours}h</TableCell>
                      <TableCell>{data.entries}</TableCell>
                      <TableCell>{data.tasks.size}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Time Logs ({sortedLogs.length} entries)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("employeeName")}
                    >
                      <div className="flex items-center gap-2">
                        Employee
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("department")}
                    >
                      <div className="flex items-center gap-2">
                        Department
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("project")}
                    >
                      <div className="flex items-center gap-2">
                        Project
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("task")}
                    >
                      <div className="flex items-center gap-2">
                        Task
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("hours")}
                    >
                      <div className="flex items-center gap-2">
                        Hours
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Billable</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {log.employeeName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {log.department}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{log.project}</TableCell>
                      <TableCell>{log.task}</TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell className="font-mono">{log.hours}h</TableCell>
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
                      <TableCell className="max-w-xs truncate" title={log.description}>
                        {log.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
