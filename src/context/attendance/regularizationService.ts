
import { useToast } from '@/hooks/use-toast';
import { AttendanceRecord, RegularizationRequest } from '@/types/attendance';
import { calculateTotalHours } from '@/utils/attendanceUtils';
import { isDemoSession, writeDemoData } from '@/lib/demoStore';

export function useRegularizationService(
  user: any,
  attendanceSettings: any,
  attendanceRecords: AttendanceRecord[],
  regularizationRequests: RegularizationRequest[],
  setRegularizationRequests: React.Dispatch<React.SetStateAction<RegularizationRequest[]>>,
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>,
  setTodayAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord | null>>,
  todayAttendance: AttendanceRecord | null
) {
  const { toast } = useToast();
  
  // Submit regularization request
  const submitRegularizationRequest = async (request: Omit<RegularizationRequest, 'id' | 'employeeId' | 'employeeName' | 'status' | 'requestedAt' | 'approvedBy' | 'approvedAt'>): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a request",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const now = new Date();
      
      // Create request
      const newRequest: RegularizationRequest = {
        id: `req-${Date.now()}`,
        employeeId: user.id,
        employeeName: user.name,
        ...request,
        status: 'Pending',
        requestedAt: now.toISOString(),
        approvedBy: null,
        approvedAt: null
      };
      
      // In a real app, this would be an API call
      // For now, we'll just update the state
      setRegularizationRequests(prev => {
        const next = [...prev, newRequest];
        if (isDemoSession()) writeDemoData('attendance-regularization', next);
        return next;
      });
      
      toast({
        title: "Request submitted",
        description: "Your regularization request has been submitted for approval",
      });
      
      return true;
    } catch (error) {
      console.error('Regularization request error:', error);
      toast({
        title: "Request submission failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Approve regularization request
  const approveRegularizationRequest = async (requestId: string): Promise<boolean> => {
    if (!user || !['admin', 'hr'].includes(user.role)) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to approve requests",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const request = regularizationRequests.find(r => r.id === requestId);
      
      if (!request) {
        toast({
          title: "Request not found",
          description: "The specified request could not be found",
          variant: "destructive",
        });
        return false;
      }
      
      if (request.status !== 'Pending') {
        toast({
          title: "Invalid status",
          description: "Only pending requests can be approved",
          variant: "destructive",
        });
        return false;
      }
      
      const now = new Date();
      
      // Update request
      const updatedRequest: RegularizationRequest = {
        ...request,
        status: 'Approved',
        approvedBy: user.id,
        approvedAt: now.toISOString()
      };
      
      // In a real app, this would be an API call
      // For now, we'll just update the state
      setRegularizationRequests(prev => {
        const next = prev.map(r => r.id === requestId ? updatedRequest : r);
        if (isDemoSession()) writeDemoData('attendance-regularization', next);
        return next;
      });
      
      // If the request is for a specific attendance record, update that too
      if (request.attendanceId) {
        const attendanceRecord = attendanceRecords.find(a => a.id === request.attendanceId);
        
        if (attendanceRecord) {
          let updatedAttendance: AttendanceRecord = {
            ...attendanceRecord,
            isRegularized: true
          };
          
          // Update the specific field that was regularized
          if (request.requestType === 'Check-In' && request.requestedTime) {
            updatedAttendance.checkIn = request.requestedTime;
          } else if (request.requestType === 'Check-Out' && request.requestedTime) {
            updatedAttendance.checkOut = request.requestedTime;
            
            // Recalculate total hours
            if (updatedAttendance.checkIn && updatedAttendance.checkOut) {
              updatedAttendance.totalHours = calculateTotalHours(
                updatedAttendance.checkIn,
                updatedAttendance.checkOut
              );
            }
          } else if (request.requestType === 'Full Day') {
            updatedAttendance.status = 'Present';
            updatedAttendance.checkIn = attendanceSettings.workingHoursStart;
            updatedAttendance.checkOut = attendanceSettings.workingHoursEnd;
            
            // Calculate total hours from working hours
            updatedAttendance.totalHours = calculateTotalHours(
              attendanceSettings.workingHoursStart,
              attendanceSettings.workingHoursEnd
            );
          }
          
          setAttendanceRecords(prev => prev.map(a => 
            a.id === request.attendanceId ? updatedAttendance : a
          ));
          
          if (todayAttendance?.id === request.attendanceId) {
            setTodayAttendance(updatedAttendance);
          }
        }
      }
      
      toast({
        title: "Request approved",
        description: "The regularization request has been approved",
      });
      
      return true;
    } catch (error) {
      console.error('Approve request error:', error);
      toast({
        title: "Approval failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Reject regularization request
  const rejectRegularizationRequest = async (requestId: string): Promise<boolean> => {
    if (!user || !['admin', 'hr'].includes(user.role)) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to reject requests",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const request = regularizationRequests.find(r => r.id === requestId);
      
      if (!request) {
        toast({
          title: "Request not found",
          description: "The specified request could not be found",
          variant: "destructive",
        });
        return false;
      }
      
      if (request.status !== 'Pending') {
        toast({
          title: "Invalid status",
          description: "Only pending requests can be rejected",
          variant: "destructive",
        });
        return false;
      }
      
      // Update request
      const updatedRequest: RegularizationRequest = {
        ...request,
        status: 'Rejected',
        approvedBy: user.id,
        approvedAt: new Date().toISOString()
      };
      
      // In a real app, this would be an API call
      // For now, we'll just update the state
      setRegularizationRequests(prev => {
        const next = prev.map(r => r.id === requestId ? updatedRequest : r);
        if (isDemoSession()) writeDemoData('attendance-regularization', next);
        return next;
      });
      
      toast({
        title: "Request rejected",
        description: "The regularization request has been rejected",
      });
      
      return true;
    } catch (error) {
      console.error('Reject request error:', error);
      toast({
        title: "Rejection failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    submitRegularizationRequest,
    approveRegularizationRequest,
    rejectRegularizationRequest
  };
}
