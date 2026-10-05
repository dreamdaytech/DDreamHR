
import { Button } from '@/components/ui/button';
import { Clock, Timer, FileText } from 'lucide-react';
import { BreakDialog } from './BreakDialog';
import { BreakRecord } from '@/types/attendance';

interface BreakButtonsProps {
  isCheckedIn: boolean;
  isOnBreak: boolean;
  isChecking: boolean;
  handleEndBreak: () => void;
  handleStartBreak: (type: BreakRecord['type'], isPaid: boolean) => Promise<boolean>;
}

export const BreakButtons = ({
  isCheckedIn,
  isOnBreak,
  isChecking,
  handleEndBreak,
  handleStartBreak
}: BreakButtonsProps) => {
  return (
    <div className="border-t border-slate-200 my-4 pt-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <BreakDialog 
          isCheckedIn={isCheckedIn}
          isOnBreak={isOnBreak}
          isChecking={isChecking}
          onStartBreak={handleStartBreak}
        />
        
        <Button 
          variant="outline" 
          className="flex-1 border-green-200 bg-green-50 hover:bg-green-100"
          onClick={handleEndBreak}
          disabled={!isOnBreak || isChecking}
        >
          <Clock className="mr-2 h-4 w-4 text-green-600" />
          End Break
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1 border-purple-200 bg-purple-50 hover:bg-purple-100"
        >
          <FileText className="mr-2 h-4 w-4 text-purple-600" />
          Request Regularization
        </Button>
      </div>
    </div>
  );
};
