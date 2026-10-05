
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

interface CheckInOutButtonsProps {
  isCheckedIn: boolean;
  isOnBreak: boolean;
  isChecking: boolean;
  handleCheckIn: () => void;
  handleCheckOut: () => void;
  hasLocationSelected?: boolean;
}

export const CheckInOutButtons = ({
  isCheckedIn,
  isOnBreak,
  isChecking,
  handleCheckIn,
  handleCheckOut,
  hasLocationSelected = true
}: CheckInOutButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button 
        variant="default" 
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleCheckIn} 
        disabled={isCheckedIn || isChecking || !hasLocationSelected}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Check In
      </Button>
      
      <Button 
        variant="outline" 
        className="flex-1"
        onClick={handleCheckOut}
        disabled={!isCheckedIn || isOnBreak || isChecking}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Check Out
      </Button>
    </div>
  );
};
