
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  Clock,
  FileText,
  User,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react';

interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: {
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    status: string;
    appliedDate: string;
    approvedBy: string | null;
    reason: string;
    documents?: string[];
    timeline?: Array<{
      date: string;
      action: string;
      by: string;
      comment?: string;
    }>;
  } | null;
}

export const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  isOpen,
  onClose,
  leaveRequest
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  // Don't render the dialog content if leaveRequest is null
  if (!leaveRequest) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center text-muted-foreground">
            No leave request data available.
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Leave Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Leave Type</h3>
                <p className="font-medium">{leaveRequest.type}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Duration</h3>
                <p className="font-medium">{leaveRequest.days} day{leaveRequest.days > 1 ? 's' : ''}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                <Badge className={`${getStatusColor(leaveRequest.status)} flex items-center gap-1 w-fit`}>
                  {getStatusIcon(leaveRequest.status)}
                  {leaveRequest.status}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Start Date</h3>
                <p className="font-medium">{leaveRequest.startDate}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">End Date</h3>
                <p className="font-medium">{leaveRequest.endDate}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Applied Date</h3>
                <p className="font-medium">{leaveRequest.appliedDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reason */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Reason</h3>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{leaveRequest.reason}</p>
          </div>

          {/* Supporting Documents */}
          {leaveRequest.documents && leaveRequest.documents.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Supporting Documents</h3>
                <div className="space-y-2">
                  {leaveRequest.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Approval Timeline */}
          {leaveRequest.timeline && leaveRequest.timeline.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">Approval Timeline</h3>
                <div className="space-y-3">
                  {leaveRequest.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{event.action}</span>
                          <span className="text-xs text-muted-foreground">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{event.by}</span>
                        </div>
                        {event.comment && (
                          <p className="text-sm text-muted-foreground">{event.comment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Approved By */}
          {leaveRequest.approvedBy && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Approved By</h3>
                <p className="font-medium">{leaveRequest.approvedBy}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
