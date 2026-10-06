
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { BreakRecord } from '@/types/attendance';
import { isDemoSession, writeDemoData } from '@/lib/demoStore';

export function useBreakService(
  user: any,
  todayAttendance: any,
  isCheckedIn: boolean,
  isOnBreak: boolean,
  currentBreak: BreakRecord | null,
  setBreakRecords: React.Dispatch<React.SetStateAction<BreakRecord[]>>,
  setCurrentBreak: React.Dispatch<React.SetStateAction<BreakRecord | null>>
) {
  const { toast } = useToast();

  // Start break function
  const startBreak = async (type: BreakRecord['type'], isPaid: boolean): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to start a break",
        variant: "destructive",
      });
      return false;
    }
    
    if (!isCheckedIn) {
      toast({
        title: "Not checked in",
        description: "You need to check in first",
        variant: "destructive",
      });
      return false;
    }
    
    if (isOnBreak) {
      toast({
        title: "Already on break",
        description: "You are already on a break",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      
      if (todayAttendance) {
        // Create break record
        const newBreak: BreakRecord = {
          id: `break-${Date.now()}`,
          attendanceId: todayAttendance.id,
          startTime: currentTime,
          endTime: null,
          type,
          isPaid,
          notes: null
        };
        
        // In a real app, this would be an API call
        // For now, we'll just update the state
        setBreakRecords(prev => {
          const next = [...prev, newBreak];
          if (isDemoSession()) writeDemoData('attendance-breaks', next);
          return next;
        });
        setCurrentBreak(newBreak);
        
        toast({
          title: "Break started",
          description: `Time: ${currentTime}, Type: ${type}`,
        });
        
        return true;
      } else {
        toast({
          title: "No active attendance record",
          description: "Cannot start a break without an active record",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Start break error:', error);
      toast({
        title: "Failed to start break",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // End break function
  const endBreak = async (breakId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to end a break",
        variant: "destructive",
      });
      return false;
    }
    
    if (!isOnBreak) {
      toast({
        title: "Not on break",
        description: "You need to start a break first",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      
      // Update break record
      const updatedBreak: BreakRecord = {
        ...currentBreak!,
        endTime: currentTime
      };
      
      // In a real app, this would be an API call
      // For now, we'll just update the state
      setBreakRecords(prev => {
        const next = prev.map(record => record.id === breakId ? updatedBreak : record);
        if (isDemoSession()) writeDemoData('attendance-breaks', next);
        return next;
      });
      setCurrentBreak(null);
      
      toast({
        title: "Break ended",
        description: `Time: ${currentTime}`,
      });
      
      return true;
    } catch (error) {
      console.error('End break error:', error);
      toast({
        title: "Failed to end break",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    startBreak,
    endBreak
  };
}
