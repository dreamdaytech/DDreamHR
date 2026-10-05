import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AttendanceReportSubmission, 
  ReviewStatus, 
  FeedbackComment,
  AttachmentFile
} from '@/types/attendance';
import { addFeedbackComment, updateReportStatus, getStatusBadgeColor } from '@/utils/reportUtils';

interface AttendanceReportDetailProps {
  report: AttendanceReportSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateReport: (updatedReport: AttendanceReportSubmission) => void;
}

export const AttendanceReportDetail: React.FC<AttendanceReportDetailProps> = ({
  report,
  open,
  onOpenChange,
  onUpdateReport,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ReviewStatus | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  
  // Map user role to attendance component expected role
  const getAttendanceRole = (): 'admin' | 'hr' | 'manager' | 'employee' => {
    if (user?.role === 'super_admin') return 'admin'; // Super admin gets admin privileges for attendance
    return (user?.role as 'admin' | 'hr' | 'manager' | 'employee') || 'employee';
  };
  
  const isAdminOrHR = user && ['admin', 'hr', 'super_admin'].includes(user.role);
  const isOwnReport = user && report && user.id === report.employeeId;
  const canReview = isAdminOrHR && report && report.status !== 'Approved';
  
  if (!report) return null;
  
  const handleAddComment = () => {
    if (!user || !comment.trim()) return;
    
    const updatedReport = addFeedbackComment(
      report,
      user.id,
      user.name,
      getAttendanceRole(),
      comment,
      replyTo
    );
    
    onUpdateReport(updatedReport);
    setComment('');
    setReplyTo(null);
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the report",
    });
  };
  
  const handleUpdateStatus = () => {
    if (!user || !newStatus || !isAdminOrHR) return;
    
    const updatedReport = updateReportStatus(
      report,
      newStatus,
      user.id
    );
    
    onUpdateReport(updatedReport);
    
    toast({
      title: `Report ${newStatus.toLowerCase()}`,
      description: `The report has been marked as ${newStatus.toLowerCase()}`,
    });
  };
  
  const getStatusIcon = (status: ReviewStatus) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'NeedsClarification':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'Pending':
      default:
        return <Calendar className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Organize comments into threads
  const commentThreads: FeedbackComment[][] = [];
  const rootComments = report.feedback.filter(c => !c.parentCommentId);
  
  rootComments.forEach(rootComment => {
    const thread = [rootComment];
    const replies = report.feedback.filter(c => c.parentCommentId === rootComment.id);
    thread.push(...replies);
    commentThreads.push(thread);
  });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              {report.reportType} Attendance Report
              <Badge className="ml-2" variant="outline">
                {report.recordIds.length} {report.recordIds.length === 1 ? 'day' : 'days'}
              </Badge>
            </div>
            <Badge className={getStatusBadgeColor(report.status)}>
              {report.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {isAdminOrHR ? (
              <>Submitted by {report.employeeName}</>
            ) : (
              <>For period: {format(parseISO(report.startDate), 'MMM d, yyyy')} - {format(parseISO(report.endDate), 'MMM d, yyyy')}</>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="discussion">
              Discussion
              {report.feedback.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {report.feedback.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="attachments">
              Attachments
              {report.attachments.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {report.attachments.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="max-h-[400px] pr-4">
            <TabsContent value="details" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Report Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Period:</div>
                  <div>{format(parseISO(report.startDate), 'MMM d, yyyy')} - {format(parseISO(report.endDate), 'MMM d, yyyy')}</div>
                  
                  <div className="font-medium">Submitted on:</div>
                  <div>{format(parseISO(report.submittedAt), 'MMM d, yyyy h:mm a')}</div>
                  
                  <div className="font-medium">Status:</div>
                  <div className="flex items-center">
                    {getStatusIcon(report.status)} <span className="ml-1">{report.status}</span>
                  </div>
                  
                  {report.reviewedAt && (
                    <>
                      <div className="font-medium">Reviewed on:</div>
                      <div>{format(parseISO(report.reviewedAt), 'MMM d, yyyy h:mm a')}</div>
                    </>
                  )}
                </div>
              </div>
              
              {report.notes && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Notes</h3>
                  <div className="text-sm border rounded p-3 bg-muted/50">
                    {report.notes}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Covered Days</h3>
                <div className="text-sm border rounded p-3 bg-muted/50 max-h-32 overflow-y-auto">
                  <ul className="list-disc pl-5 space-y-1">
                    {report.recordIds.map((recordId) => {
                      // Extract the date from the ID (this is a mock implementation)
                      const dateMatch = recordId.match(/(\d{4}-\d{2}-\d{2})$/);
                      const dateStr = dateMatch ? dateMatch[1] : recordId;
                      
                      try {
                        return (
                          <li key={recordId}>
                            {format(parseISO(dateStr), 'EEEE, MMMM d, yyyy')}
                          </li>
                        );
                      } catch (e) {
                        return <li key={recordId}>{recordId}</li>;
                      }
                    })}
                  </ul>
                </div>
              </div>
              
              {canReview && (
                <div className="border rounded p-4 bg-muted/30 space-y-3">
                  <h3 className="font-medium">Review Actions</h3>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={newStatus || ''}
                      onValueChange={(value: ReviewStatus | '') => 
                        setNewStatus(value as ReviewStatus || null)
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Select status</SelectItem>
                        <SelectItem value="Approved">Approve</SelectItem>
                        <SelectItem value="Rejected">Reject</SelectItem>
                        <SelectItem value="NeedsClarification">Request Clarification</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleUpdateStatus} 
                      disabled={!newStatus}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="discussion" className="space-y-4">
              {commentThreads.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No comments yet. Add the first comment below.
                </div>
              ) : (
                <div className="space-y-4">
                  {commentThreads.map((thread, index) => (
                    <div key={index} className="space-y-3">
                      {thread.map((comment, commentIndex) => (
                        <div 
                          key={comment.id} 
                          className={cn(
                            "border rounded p-3",
                            commentIndex > 0 ? "ml-6 border-l-4" : ""
                          )}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium flex items-center">
                              {comment.userName}
                              <Badge variant="outline" className="ml-2 text-xs">
                                {comment.userRole}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(parseISO(comment.createdAt), 'MMM d, h:mm a')}
                            </div>
                          </div>
                          <p className="text-sm mb-2">{comment.comment}</p>
                          {(user && commentIndex === 0) && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="text-xs p-0 h-auto" 
                              onClick={() => setReplyTo(comment.id)}
                            >
                              Reply
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">
                    {replyTo ? 'Reply to Comment' : 'Add Comment'}
                  </h3>
                  {replyTo && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setReplyTo(null)}
                    >
                      Cancel Reply
                    </Button>
                  )}
                </div>
                <Textarea 
                  placeholder="Enter your comment..." 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddComment}
                    disabled={!comment.trim()}
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="attachments">
              {report.attachments.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No attachments for this report.
                </div>
              ) : (
                <div className="space-y-2">
                  {report.attachments.map((attachment: AttachmentFile) => (
                    <div 
                      key={attachment.id} 
                      className="border rounded flex items-center justify-between p-3"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <div className="font-medium">{attachment.fileName}</div>
                          <div className="text-xs text-muted-foreground">
                            {(attachment.fileSize / 1024).toFixed(1)} KB • 
                            Uploaded {format(parseISO(attachment.uploadedAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Helper for className concatenation
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
