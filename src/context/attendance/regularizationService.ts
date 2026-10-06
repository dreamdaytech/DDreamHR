import { useToast } from '@/hooks/use-toast';
import { AttendanceRecord, RegularizationRequest } from '@/types/attendance';
import { calculateTotalHours } from '@/utils/attendanceUtils';
import { isDemoSession, writeDemoData } from '@/lib/demoStore';
import { createRegularizationRequest, decideRegularizationRequest } from '@/services/tenantAttendance';

export function useRegularizationService(
  user: any,
  attendanceSettings: any,
  attendanceRecords: AttendanceRecord[],
  regularizationRequests: RegularizationRequest[],
  setRegularizationRequests: React.Dispatch<React.SetStateAction<RegularizationRequest[]>>,
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>,
  setTodayAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord | null>>,
  todayAttendance: AttendanceRecord | null,
) {
  const { toast } = useToast();

  const submitRegularizationRequest = async (
    request: Omit<RegularizationRequest, 'id' | 'employeeId' | 'employeeName' | 'status' | 'requestedAt' | 'approvedBy' | 'approvedAt'>,
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit a request',
        variant: 'destructive',
      });
      return false;
    }

    try {
      let newRequest: RegularizationRequest;

      if (isDemoSession()) {
        newRequest = {
          id: `req-${Date.now()}`,
          employeeId: user.id,
          employeeName: user.name,
          ...request,
          status: 'Pending',
          requestedAt: new Date().toISOString(),
          approvedBy: null,
          approvedAt: null,
        };
      } else {
        newRequest = {
          ...(await createRegularizationRequest(request)),
          employeeName: user.name,
        };
      }

      setRegularizationRequests((prev) => {
        const next = [newRequest, ...prev.filter((item) => item.id !== newRequest.id)];
        if (isDemoSession()) writeDemoData('attendance-regularization', next);
        return next;
      });

      toast({
        title: 'Request submitted',
        description: 'Your regularization request has been submitted for approval',
      });
      return true;
    } catch (error) {
      console.error('Regularization request error:', error);
      toast({
        title: 'Request submission failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  const applyApprovedRequestLocally = (request: RegularizationRequest) => {
    if (!request.attendanceId) return;

    const attendanceRecord = attendanceRecords.find((item) => item.id === request.attendanceId);
    if (!attendanceRecord) return;

    const updatedAttendance: AttendanceRecord = {
      ...attendanceRecord,
      isRegularized: true,
    };

    if (request.requestType === 'Check-In' && request.requestedTime) {
      updatedAttendance.checkIn = request.requestedTime;
    } else if (request.requestType === 'Check-Out' && request.requestedTime) {
      updatedAttendance.checkOut = request.requestedTime;
      if (updatedAttendance.checkIn && updatedAttendance.checkOut) {
        updatedAttendance.totalHours = calculateTotalHours(updatedAttendance.checkIn, updatedAttendance.checkOut);
      }
    } else if (request.requestType === 'Full Day') {
      updatedAttendance.status = 'Present';
      updatedAttendance.checkIn = attendanceSettings.workingHoursStart;
      updatedAttendance.checkOut = attendanceSettings.workingHoursEnd;
      updatedAttendance.totalHours = calculateTotalHours(
        attendanceSettings.workingHoursStart,
        attendanceSettings.workingHoursEnd,
      );
    }

    setAttendanceRecords((prev) => prev.map((item) => (
      item.id === request.attendanceId ? updatedAttendance : item
    )));

    if (todayAttendance?.id === request.attendanceId) {
      setTodayAttendance(updatedAttendance);
    }
  };

  const approveRegularizationRequest = async (requestId: string): Promise<boolean> => {
    if (!user || !['admin', 'hr'].includes(user.role)) {
      toast({
        title: 'Permission denied',
        description: "You don't have permission to approve requests",
        variant: 'destructive',
      });
      return false;
    }

    const request = regularizationRequests.find((item) => item.id === requestId);
    if (!request || request.status !== 'Pending') {
      toast({
        title: 'Request unavailable',
        description: 'Only pending requests can be approved.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      let updatedRequest: RegularizationRequest;
      if (isDemoSession()) {
        updatedRequest = {
          ...request,
          status: 'Approved',
          approvedBy: user.id,
          approvedAt: new Date().toISOString(),
        };
      } else {
        updatedRequest = {
          ...(await decideRegularizationRequest(requestId, 'Approved', attendanceSettings)),
          employeeName: request.employeeName,
        };
      }

      setRegularizationRequests((prev) => {
        const next = prev.map((item) => item.id === requestId ? updatedRequest : item);
        if (isDemoSession()) writeDemoData('attendance-regularization', next);
        return next;
      });
      applyApprovedRequestLocally(request);

      toast({
        title: 'Request approved',
        description: 'The regularization request has been approved',
      });
      return true;
    } catch (error) {
      console.error('Approve request error:', error);
      toast({
        title: 'Approval failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  const rejectRegularizationRequest = async (requestId: string): Promise<boolean> => {
    if (!user || !['admin', 'hr'].includes(user.role)) {
      toast({
        title: 'Permission denied',
        description: "You don't have permission to reject requests",
        variant: 'destructive',
      });
      return false;
    }

    const request = regularizationRequests.find((item) => item.id === requestId);
    if (!request || request.status !== 'Pending') return false;

    try {
      let updatedRequest: RegularizationRequest;
      if (isDemoSession()) {
        updatedRequest = {
          ...request,
          status: 'Rejected',
          approvedBy: user.id,
          approvedAt: new Date().toISOString(),
        };
      } else {
        updatedRequest = {
          ...(await decideRegularizationRequest(requestId, 'Rejected', attendanceSettings)),
          employeeName: request.employeeName,
        };
      }

      setRegularizationRequests((prev) => {
        const next = prev.map((item) => item.id === requestId ? updatedRequest : item);
        if (isDemoSession()) writeDemoData('attendance-regularization', next);
        return next;
      });

      toast({
        title: 'Request rejected',
        description: 'The regularization request has been rejected',
      });
      return true;
    } catch (error) {
      console.error('Reject request error:', error);
      toast({
        title: 'Rejection failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    submitRegularizationRequest,
    approveRegularizationRequest,
    rejectRegularizationRequest,
  };
}
