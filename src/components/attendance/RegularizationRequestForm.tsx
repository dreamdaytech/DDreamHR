
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { CalendarIcon, FileText } from 'lucide-react';
import { useAttendance } from '@/context/AttendanceContext';
import { cn } from '@/lib/utils';

const DEFAULT_REQUEST_TYPE = 'checkin';

export const RegularizationRequestForm = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [requestType, setRequestType] = useState<string>(DEFAULT_REQUEST_TYPE);
  const [requestedTime, setRequestedTime] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { submitRegularizationRequest } = useAttendance();
  
  const handleSubmit = async () => {
    // Ensure requestType is not empty before submitting
    if (!requestType || requestType.trim() === '') {
      console.error('Request type is empty, cannot submit');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await submitRegularizationRequest({
        date: format(date, 'yyyy-MM-dd'),
        requestType: requestType as 'Check-In' | 'Check-Out' | 'Full Day' | 'Break',
        requestedTime: requestType === 'fullday' ? null : requestedTime,
        reason,
        attendanceId: null // In a real app, you'd fetch the correct attendance ID
      });
      
      if (success) {
        setOpen(false);
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setDate(new Date());
    setRequestType(DEFAULT_REQUEST_TYPE);
    setRequestedTime('');
    setReason('');
  };

  const handleRequestTypeChange = (value: string) => {
    // Ensure we never set an empty string
    if (value && value.trim() !== '') {
      setRequestType(value);
    } else {
      console.warn('Attempted to set empty request type, keeping current value');
    }
  };

  // Ensure requestType is never empty
  const safeRequestType = requestType || DEFAULT_REQUEST_TYPE;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-purple-200 bg-purple-50 hover:bg-purple-100">
          <FileText className="mr-2 h-4 w-4 text-purple-600" />
          Request Regularization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Attendance Regularization Request</DialogTitle>
          <DialogDescription>
            Submit a request to regularize missed or incorrect attendance records.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="request-type" className="text-right">
              Request Type
            </Label>
            <Select value={safeRequestType} onValueChange={handleRequestTypeChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkin">Check-In</SelectItem>
                <SelectItem value="checkout">Check-Out</SelectItem>
                <SelectItem value="fullday">Full Day</SelectItem>
                <SelectItem value="break">Break</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {safeRequestType !== 'fullday' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                placeholder="Enter time"
                className="col-span-3"
                value={requestedTime}
                onChange={(e) => setRequestedTime(e.target.value)}
              />
            </div>
          )}
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="reason" className="text-right pt-2">
              Reason
            </Label>
            <Textarea
              id="reason"
              placeholder="Please explain the reason for this regularization request"
              className="col-span-3"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            resetForm();
            setOpen(false);
          }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !reason || !safeRequestType}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
