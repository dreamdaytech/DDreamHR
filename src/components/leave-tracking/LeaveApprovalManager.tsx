
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { isDemoSession, readDemoData, writeDemoData } from '@/lib/demoStore';
import { decideLeaveRequest, listPendingLeaveRequests } from '@/services/tenantLeave';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Calendar,
  Clock,
  Eye
} from 'lucide-react';

type LeaveTimelineItem = { date: string; action: string; by: string; comment?: string };
type LeaveApprovalRequest = {
  id: string | number; employee?: string; employeeName?: string; employeeId: string; type: string;
  startDate: string; endDate: string; days: number; reason: string; appliedDate: string;
  currentBalance: number; afterLeaveBalance: number; documents: string[]; status?: string;
  timeline?: LeaveTimelineItem[]; approvedBy?: string;
};

export const LeaveApprovalManager = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedRequest, setSelectedRequest] = useState<LeaveApprovalRequest | null>(null);
  const [comments, setComments] = useState('');

  const seedPendingRequests = [
    {
      id: 1,
      employee: 'Sarah Johnson',
      employeeId: 'EMP001',
      type: 'Annual Leave',
      startDate: '2024-12-28',
      endDate: '2024-12-30',
      days: 3,
      reason: 'Family vacation during year-end holidays',
      appliedDate: '2024-12-10',
      currentBalance: 12,
      afterLeaveBalance: 9,
      documents: ['medical-certificate.pdf']
    },
    {
      id: 2,
      employee: 'Mike Chen',
      employeeId: 'EMP002',
      type: 'Sick Leave',
      startDate: '2024-12-20',
      endDate: '2024-12-21',
      days: 2,
      reason: 'Doctor advised rest due to flu symptoms',
      appliedDate: '2024-12-19',
      currentBalance: 8,
      afterLeaveBalance: 6,
      documents: []
    },
    {
      id: 3,
      employee: 'Emma Davis',
      employeeId: 'EMP003',
      type: 'Personal Leave',
      startDate: '2024-12-22',
      endDate: '2024-12-22',
      days: 1,
      reason: 'Important personal appointment that cannot be rescheduled',
      appliedDate: '2024-12-15',
      currentBalance: 3,
      afterLeaveBalance: 2,
      documents: []
    }
  ];

  const [pendingRequests, setPendingRequests] = useState<LeaveApprovalRequest[]>(() => {
    if (!isDemoSession()) return [];
    const stored = readDemoData<LeaveApprovalRequest[]>('leave-requests', []).filter((request) => request.status === 'pending');
    return stored.length ? stored : seedPendingRequests.map((request) => ({ ...request, status: 'pending' }));
  });

  const refreshPendingRequests = async () => {
    if (isDemoSession()) {
      const stored = readDemoData<LeaveApprovalRequest[]>('leave-requests', []).filter((request) => request.status === 'pending');
      setPendingRequests(stored.length ? stored : seedPendingRequests.map((request) => ({ ...request, status: 'pending' })));
      return;
    }

    try {
      setPendingRequests(await listPendingLeaveRequests());
    } catch (error) {
      toast({
        title: 'Could not load leave approvals',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    void refreshPendingRequests();
  }, []);

  const handleApproval = async (requestId: string | number, action: 'approve' | 'reject') => {
    const request = pendingRequests.find((item) => String(item.id) === String(requestId));
    if (!request) return;

    try {
      if (isDemoSession()) {
        const nextStatus = action === 'approve' ? 'approved' : 'rejected';
        const stored = readDemoData<LeaveApprovalRequest[]>('leave-requests', []);
        const source = stored.length ? stored : pendingRequests;
        const updated = source.map((item) =>
          String(item.id) === String(requestId)
            ? {
                ...item,
                status: nextStatus,
                approvedBy: 'Demo Approver',
                timeline: [
                  ...(item.timeline || []),
                  {
                    date: new Date().toISOString().split('T')[0],
                    action: action === 'approve' ? 'Approved' : 'Rejected',
                    by: 'Demo Approver',
                    comment: comments || undefined,
                  },
                ],
              }
            : item,
        );
        writeDemoData('leave-requests', updated);
      } else {
        await decideLeaveRequest(String(requestId), action, comments);
      }

      await refreshPendingRequests();

      toast({
        title: `Leave Request ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `${request.employee || request.employeeName}'s leave request has been ${action}d.`,
        variant: action === 'approve' ? 'default' : 'destructive'
      });

      setComments('');
    } catch (error) {
      toast({
        title: 'Could not update leave request',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pending Approvals ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-4">
                {/* Employee Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{request.employee}</h3>
                    <p className="text-sm text-muted-foreground">{request.employeeId}</p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    {request.type}
                  </Badge>
                </div>

                {/* Leave Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Dates:</span>
                    <p className="font-medium">
                      {request.startDate}
                      {request.endDate !== request.startDate && ` - ${request.endDate}`}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium">{request.days} day{request.days > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Balance Impact */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Balance:</span>
                    <span className="font-medium">{request.currentBalance} days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>After Leave:</span>
                    <span className="font-medium">{request.afterLeaveBalance} days</span>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <span className="text-sm text-muted-foreground">Reason:</span>
                  <p className="text-sm mt-1">{request.reason}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproval(request.id, 'approve')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleApproval(request.id, 'reject')}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Add Comment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Comment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Add your comments here..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => handleApproval(request.id, 'approve')}
                        >
                          Approve with Comment
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                          onClick={() => handleApproval(request.id, 'reject')}
                        >
                          Reject with Comment
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending leave requests</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Leave Approvals ({pendingRequests.length} pending)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {pendingRequests.map((request) => (
          <div key={request.id} className="border rounded-lg p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{request.employee}</h3>
                  <p className="text-sm text-muted-foreground">{request.employeeId}</p>
                </div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  {request.type}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Applied: {request.appliedDate}
              </div>
            </div>

            {/* Leave Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Leave Dates</span>
                </div>
                <p className="text-sm">
                  {request.startDate}
                  {request.endDate !== request.startDate && ` - ${request.endDate}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {request.days} day{request.days > 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Balance Impact</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Current:</span>
                    <span>{request.currentBalance} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>After leave:</span>
                    <span className={request.afterLeaveBalance < 0 ? 'text-red-600' : ''}>
                      {request.afterLeaveBalance} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-medium">Documents</span>
                {request.documents.length > 0 ? (
                  <div className="space-y-1">
                    {request.documents.map((doc, index) => (
                      <Button key={index} variant="outline" size="sm" className="w-full text-xs">
                        <Eye className="mr-2 h-3 w-3" />
                        {doc}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No documents attached</p>
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <span className="font-medium">Reason for Leave</span>
              <p className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg">
                {request.reason}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleApproval(request.id, 'approve')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              
              <Button 
                variant="destructive"
                onClick={() => handleApproval(request.id, 'reject')}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Comment & Decide
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Comment for {request.employee}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add your comments here..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproval(request.id, 'approve')}
                      >
                        Approve with Comment
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => handleApproval(request.id, 'reject')}
                      >
                        Reject with Comment
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}

        {pendingRequests.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
            <p>All leave requests have been processed.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
