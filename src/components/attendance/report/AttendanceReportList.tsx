
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { format, parseISO } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, MessageSquare } from 'lucide-react';
import { AttendanceReportSubmission, ReviewStatus } from '@/types/attendance';
import { getStatusBadgeColor } from '@/utils/reportUtils';

interface AttendanceReportListProps {
  reports: AttendanceReportSubmission[];
  onViewReport: (report: AttendanceReportSubmission) => void;
}

export const AttendanceReportList: React.FC<AttendanceReportListProps> = ({
  reports,
  onViewReport,
}) => {
  const { user } = useAuth();
  const isAdminOrHR = user && ['admin', 'hr'].includes(user.role);
  
  // Get color class for status badge
  const getStatusClass = (status: ReviewStatus) => {
    return getStatusBadgeColor(status);
  };

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No attendance reports found.</p>
            {!isAdminOrHR && (
              <p className="mt-2 text-sm text-muted-foreground">
                Submit your first attendance report to get started.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        reports.map((report) => (
          <Card key={report.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <CardTitle className="text-lg">
                    {report.reportType} Report
                    <Badge className="ml-2" variant="outline">
                      {report.recordIds.length} {report.recordIds.length === 1 ? 'day' : 'days'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {isAdminOrHR ? (
                      <>Submitted by {report.employeeName}</>
                    ) : (
                      <>For {format(parseISO(report.startDate), 'MMM d, yyyy')}{' '}
                      {report.reportType !== 'Daily' && (
                        <>- {format(parseISO(report.endDate), 'MMM d, yyyy')}</>
                      )}</>
                    )}
                  </CardDescription>
                </div>
                <Badge className={cn("ml-auto", getStatusClass(report.status))}>
                  {report.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Period:</span>
                  {format(parseISO(report.startDate), 'MMM d')} - {format(parseISO(report.endDate), 'MMM d, yyyy')}
                </div>
                
                <div className="flex items-center">
                  <FileText className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Attachments:</span>
                  {report.attachments.length}
                </div>
                
                <div className="flex items-center">
                  <MessageSquare className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Comments:</span>
                  {report.feedback.length}
                </div>
              </div>
              
              {report.notes && (
                <div className="mt-2 text-sm">
                  <p className="text-muted-foreground font-medium">Notes:</p>
                  <p className="line-clamp-2">{report.notes}</p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between items-center border-t bg-muted/50 pt-3">
              <div className="text-xs text-muted-foreground">
                Submitted on {format(parseISO(report.submittedAt), 'MMM d, yyyy h:mm a')}
              </div>
              <Button size="sm" onClick={() => onViewReport(report)}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

// Helper for className concatenation
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
