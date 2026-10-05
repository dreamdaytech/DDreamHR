
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AttendanceReportSubmission } from '@/types/attendance';

interface AttendanceReportFormProps {
  onSubmit: (reportData: Omit<AttendanceReportSubmission, 'id' | 'submittedAt' | 'status' | 'feedback' | 'reviewedBy' | 'reviewedAt'>) => void;
}

export const AttendanceReportForm: React.FC<AttendanceReportFormProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  // Form state
  const [reportType, setReportType] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Update end date when report type changes
  React.useEffect(() => {
    const newEndDate = new Date(startDate);
    if (reportType === 'Weekly') {
      newEndDate.setDate(startDate.getDate() + 6);
    } else if (reportType === 'Monthly') {
      newEndDate.setMonth(startDate.getMonth() + 1);
      newEndDate.setDate(newEndDate.getDate() - 1); // Last day of month
    }
    setEndDate(newEndDate);
  }, [reportType, startDate]);
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments([...attachments, ...fileArray]);
    }
  };
  
  // Remove an attachment
  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit a report",
          variant: "destructive",
        });
        return;
      }
      
      // In a real app, this would handle actual file uploads
      const mockAttachments = attachments.map((file, index) => ({
        id: `attachment-${Date.now()}-${index}`,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        url: URL.createObjectURL(file) // In a real app, this would be a server URL
      }));
      
      // Mock record IDs - in a real app this would be fetched from the backend
      const mockRecordIds = [`att-mock-${user.id}-${format(startDate, 'yyyy-MM-dd')}`];
      
      const reportData = {
        employeeId: user.id,
        employeeName: user.name,
        reportType,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        notes: notes || null,
        attachments: mockAttachments,
        recordIds: mockRecordIds,
      };
      
      onSubmit(reportData);
      
      toast({
        title: "Report submitted",
        description: "Your attendance report has been submitted successfully",
      });
      
      // Reset form and close dialog
      setReportType('Daily');
      setStartDate(new Date());
      setEndDate(new Date());
      setNotes('');
      setAttachments([]);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission failed",
        description: "An error occurred while submitting your report",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Submit Attendance Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit Attendance Report</DialogTitle>
            <DialogDescription>
              Submit your attendance details for review by HR. Provide any necessary explanations
              or documentation for any irregularities.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Report Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportType" className="text-right">
                Report Type
              </Label>
              <Select
                value={reportType}
                onValueChange={(value: 'Daily' | 'Weekly' | 'Monthly') => setReportType(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Start Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarUI
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* End Date - shown but disabled for weekly/monthly */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                        reportType !== 'Daily' && "bg-muted"
                      )}
                      disabled={reportType !== 'Daily'}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    {reportType === 'Daily' ? (
                      <CalendarUI
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        initialFocus
                        disabled={(date) => date > new Date() || date < startDate}
                      />
                    ) : (
                      <div className="p-3">
                        <p className="text-sm text-muted-foreground">
                          End date is automatically calculated for {reportType.toLowerCase()} reports.
                        </p>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Notes */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information or explanations"
                className="col-span-3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
            
            {/* Attachments */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="attachments" className="text-right pt-2">
                Attachments
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected files:</p>
                    <ul className="text-sm space-y-1">
                      {attachments.map((file, index) => (
                        <li key={index} className="flex items-center justify-between border rounded p-2">
                          <span className="truncate max-w-[300px]">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeAttachment(index)}
                            className="h-6 w-6 p-0 rounded-full"
                          >
                            &times;
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
