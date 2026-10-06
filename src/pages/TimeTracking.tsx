
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeLogList from "@/components/time-tracking/TimeLogList";
import TimeLogCalendar from "@/components/time-tracking/TimeLogCalendar";
import TimesheetCreator from "@/components/time-tracking/TimesheetCreator";
import TimeTracker from "@/components/time-tracking/TimeTracker";
import ProjectDashboard from "@/components/time-tracking/ProjectDashboard";
import TimeLogImport from "@/components/time-tracking/TimeLogImport";
import { TimeApprovalDashboard } from "@/components/time-tracking/TimeApprovalDashboard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, FileInput, Download, Calendar as CalendarIcon, List, CheckCircle, Clock, BarChart3, Users, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { downloadTextFile, readDemoData, toCsv } from "@/lib/demoStore";

const TimeTracking = () => {
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [activeTab, setActiveTab] = useState("tracker");
  
  const handleExport = (format: string) => {
    const timesheets = readDemoData<any[]>('timesheets', []);
    const logs = readDemoData<any[]>('time-logs', []);
    const rows = timesheets.length
      ? timesheets
      : logs.map((log) => ({
          id: log.id,
          date: log.date,
          project: log.project,
          task: log.task,
          hours: log.hours,
          billable: log.billable,
        }));
    downloadTextFile(`ddreamhr-time-export.${format}`, toCsv(rows), 'text/csv;charset=utf-8');
    toast({
      title: "Export complete",
      description: `${rows.length} time record(s) downloaded.`,
    });
  };

  const isManager = hasRole(['admin', 'hr', 'manager']);
  const canCreateProjects = hasRole(['admin', 'hr', 'manager']);

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Time Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Track time, manage projects, and monitor productivity
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-primary hover:bg-primary-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Log Time</span>
                <span className="sm:hidden">Log</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <TimeTracker />
            </SheetContent>
          </Sheet>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <FileInput className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Import</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <TimeLogImport />
            </SheetContent>
          </Sheet>
          
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10" 
            onClick={() => handleExport("csv")}
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards for Mobile/Tablet */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Today's Hours</p>
                <p className="text-2xl font-bold">6h 45m</p>
              </div>
              <Clock className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Projects</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Building className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Active Tasks</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <List className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Team Members</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Users className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="tracker" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Time Tracker</span>
            <span className="sm:hidden">Track</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Time Logs</span>
            <span className="sm:hidden">Logs</span>
          </TabsTrigger>
          <TabsTrigger value="timesheets" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Timesheets</span>
            <span className="sm:hidden">Sheets</span>
          </TabsTrigger>
          {isManager && (
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Approvals</span>
              <span className="sm:hidden">Review</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="tracker" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Active Time Tracking
                    {canCreateProjects && (
                      <span className="ml-auto text-sm text-muted-foreground font-normal">
                        Manage projects & tasks available
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-2xl mx-auto">
                    <TimeTracker />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Today's Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Hours Tracked</span>
                      <span className="font-medium text-lg">6h 45m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Projects</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tasks</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Billable Hours</span>
                      <span className="font-medium text-green-600">5h 30m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/reports')}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleExport('csv')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Timesheet
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('timesheets')}>
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Weekly Overview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-lg font-semibold">Time Logs</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={view === "list" ? "default" : "ghost"} 
                    size="sm" 
                    className="h-8"
                    onClick={() => setView("list")}
                  >
                    <List className="h-4 w-4 mr-1" />
                    List
                  </Button>
                  <Button 
                    variant={view === "calendar" ? "default" : "ghost"} 
                    size="sm" 
                    className="h-8"
                    onClick={() => setView("calendar")}
                  >
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Calendar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {view === "list" && <TimeLogList />}
              {view === "calendar" && <TimeLogCalendar />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timesheets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Timesheet Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <TimesheetCreator />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Project Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectDashboard />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {isManager && (
          <TabsContent value="approvals" className="space-y-6">
            <TimeApprovalDashboard />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default TimeTracking;
