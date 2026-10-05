
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarIcon, Clock, Send, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Timesheet {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedTo: string;
  totalHours: number;
  comments?: string;
}

const TimesheetCreator = () => {
  const { toast } = useToast();
  const [timesheetType, setTimesheetType] = useState<string>("weekly");
  const [submissionTarget, setSubmissionTarget] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  
  const [timesheets, setTimesheets] = useState<Timesheet[]>([
    {
      id: "1",
      period: "Weekly",
      startDate: "2024-01-15",
      endDate: "2024-01-21",
      status: "approved",
      submittedTo: "Manager",
      totalHours: 40,
    },
    {
      id: "2",
      period: "Weekly",
      startDate: "2024-01-22",
      endDate: "2024-01-28",
      status: "submitted",
      submittedTo: "HR",
      totalHours: 38.5,
    },
    {
      id: "3",
      period: "Daily",
      startDate: "2024-01-29",
      endDate: "2024-01-29",
      status: "rejected",
      submittedTo: "Team Lead",
      totalHours: 6,
      comments: "Missing project details for afternoon tasks"
    }
  ]);

  const submissionTargets = [
    { value: "manager", label: "Manager" },
    { value: "hr", label: "HR Department" },
    { value: "admin", label: "Admin" },
    { value: "team-lead", label: "Team Lead" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateTimesheet = () => {
    if (!submissionTarget) {
      toast({
        title: "Submission Target Required",
        description: "Please select who to submit the timesheet to.",
        variant: "destructive",
      });
      return;
    }

    const newTimesheet: Timesheet = {
      id: Date.now().toString(),
      period: timesheetType.charAt(0).toUpperCase() + timesheetType.slice(1),
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      submittedTo: submissionTargets.find(t => t.value === submissionTarget)?.label || '',
      totalHours: 0,
      comments
    };

    setTimesheets(prev => [newTimesheet, ...prev]);
    setShowSubmissionDialog(false);
    setComments("");
    setSubmissionTarget("");

    toast({
      title: "Timesheet Created",
      description: `A new ${timesheetType} timesheet has been created as draft.`,
    });
  };

  const handleSubmitTimesheet = (timesheetId: string) => {
    setTimesheets(prev => prev.map(ts => 
      ts.id === timesheetId 
        ? { ...ts, status: 'submitted' }
        : ts
    ));

    toast({
      title: "Timesheet Submitted",
      description: "Your timesheet has been submitted for approval.",
    });
  };

  const handleResubmitTimesheet = (timesheetId: string) => {
    setTimesheets(prev => prev.map(ts => 
      ts.id === timesheetId 
        ? { ...ts, status: 'submitted', comments: undefined }
        : ts
    ));

    toast({
      title: "Timesheet Resubmitted",
      description: "Your timesheet has been resubmitted for approval.",
    });
  };

  return (
    <div className="space-y-4">
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogTrigger asChild>
          <Button className="w-full bg-primary hover:bg-primary-700 text-white">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Create New Timesheet
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Timesheet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Timesheet Type</Label>
              <Select value={timesheetType} onValueChange={setTimesheetType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timesheet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Submit To</Label>
              <Select value={submissionTarget} onValueChange={setSubmissionTarget}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select submission target" />
                </SelectTrigger>
                <SelectContent>
                  {submissionTargets.map(target => (
                    <SelectItem key={target.value} value={target.value}>
                      {target.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Comments (Optional)</Label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>

            <Button onClick={handleCreateTimesheet} className="w-full">
              Create Timesheet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Timesheets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timesheets.map((timesheet) => (
              <div key={timesheet.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(timesheet.status)}>
                      {timesheet.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium">{timesheet.period}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {timesheet.totalHours}h
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  {timesheet.startDate} to {timesheet.endDate} • To: {timesheet.submittedTo}
                </div>

                {timesheet.comments && (
                  <div className="text-sm text-red-600 mb-2 p-2 bg-red-50 rounded">
                    <strong>Rejection Reason:</strong> {timesheet.comments}
                  </div>
                )}

                <div className="flex gap-2">
                  {timesheet.status === 'draft' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleSubmitTimesheet(timesheet.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Submit
                    </Button>
                  )}
                  
                  {timesheet.status === 'rejected' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleResubmitTimesheet(timesheet.id)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Resubmit
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p className="mt-2">
          Create {timesheetType} timesheets for approval workflow. 
          Track submission status and receive feedback from approvers.
        </p>
      </div>
    </div>
  );
};

export default TimesheetCreator;
