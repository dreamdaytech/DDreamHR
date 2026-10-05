
import { format } from 'date-fns';
import { AttendanceReportSubmission, FeedbackComment, ReviewStatus } from '@/types/attendance';

// Add feedback to a report
export const addFeedbackComment = (
  report: AttendanceReportSubmission,
  userId: string,
  userName: string,
  userRole: 'admin' | 'hr' | 'manager' | 'employee',
  comment: string,
  parentCommentId: string | null = null
): AttendanceReportSubmission => {
  const newFeedback: FeedbackComment = {
    id: `feedback-${Date.now()}-${report.feedback.length}`,
    userId,
    userName,
    userRole,
    comment,
    createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    parentCommentId
  };
  
  return {
    ...report,
    feedback: [...report.feedback, newFeedback]
  };
};

// Update report status
export const updateReportStatus = (
  report: AttendanceReportSubmission,
  newStatus: ReviewStatus,
  reviewerId: string
): AttendanceReportSubmission => {
  return {
    ...report,
    status: newStatus,
    reviewedBy: reviewerId,
    reviewedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
  };
};

// Helper to get status badge color
export const getStatusBadgeColor = (status: ReviewStatus): string => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Rejected':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'NeedsClarification':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Pending':
    default:
      return 'bg-blue-100 text-blue-800 border-blue-300';
  }
};
