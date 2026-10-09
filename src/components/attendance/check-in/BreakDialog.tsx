
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Timer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BreakRecord } from '@/types/attendance';

interface BreakDialogProps {
  isCheckedIn: boolean;
  isOnBreak: boolean;
  isChecking: boolean;
  onStartBreak: (type: BreakRecord['type'], isPaid: boolean) => Promise<boolean>;
}

export const BreakDialog = ({
  isCheckedIn,
  isOnBreak,
  isChecking,
  onStartBreak
}: BreakDialogProps) => {
  const [openBreakDialog, setOpenBreakDialog] = useState(false);
  const [breakType, setBreakType] = useState<'Lunch' | 'Personal' | 'Medical' | 'Other'>('Lunch');
  const [isPaidBreak, setIsPaidBreak] = useState(true);

  const handleStartBreak = async () => {
    await onStartBreak(breakType, isPaidBreak);
    setOpenBreakDialog(false);
  };

  return (
    <Dialog open={openBreakDialog} onOpenChange={setOpenBreakDialog}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex-1 border-amber-200 bg-amber-50 hover:bg-amber-100"
          disabled={!isCheckedIn || isOnBreak || isChecking}
        >
          <Timer className="mr-2 h-4 w-4 text-amber-600" />
          Start Break
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a Break</DialogTitle>
          <DialogDescription>
            Please select the break type and whether it's paid.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="break-type" className="text-right">
              Type
            </Label>
            <Select value={breakType} onValueChange={(value: BreakRecord['type']) => setBreakType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select break type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paid-break" className="text-right">
              Paid
            </Label>
            <Select
              value={isPaidBreak ? "yes" : "no"}
              onValueChange={(value) => setIsPaidBreak(value === "yes")}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Is this a paid break?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenBreakDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleStartBreak} disabled={isChecking}>
            Start Break
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
