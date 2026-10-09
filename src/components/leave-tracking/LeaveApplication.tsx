
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isDemoSession, readDemoData, writeDemoData } from '@/lib/demoStore';
import { submitLeaveRequest } from '@/services/tenantLeave';

// Import new components
import { LeaveTypeSelector } from './components/LeaveTypeSelector';
import { DateSelector } from './components/DateSelector';
import { LeaveSummary } from './components/LeaveSummary';
import { FileUpload } from './components/FileUpload';
import { leaveTypes } from './data/leaveTypes';
import { calculateLeaveDays, validateLeaveForm } from './utils/leaveCalculations';

export const LeaveApplication = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    halfDay: false,
    reason: '',
    documents: [] as File[]
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLeaveForm(formData.leaveType, formData.startDate, formData.reason)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const selectedType = leaveTypes.find((type) => type.value === formData.leaveType);

      if (isDemoSession()) {
        const request = {
          id: Date.now(),
          employee: user?.name || 'Demo Employee',
          employeeName: user?.name || 'Demo Employee',
          employeeId: user?.id || 'demo-employee',
          type: selectedType?.label || formData.leaveType,
          startDate: formData.startDate!.toISOString().split('T')[0],
          endDate: (formData.endDate || formData.startDate)!.toISOString().split('T')[0],
          days: calculateLeaveDays(formData.startDate, formData.endDate, formData.halfDay),
          status: 'pending',
          appliedDate: new Date().toISOString().split('T')[0],
          approvedBy: null,
          reason: formData.reason,
          documents: formData.documents.map((file) => file.name),
          currentBalance: selectedType?.balance ?? 15,
          afterLeaveBalance: Math.max(0, (selectedType?.balance ?? 15) - calculateLeaveDays(formData.startDate, formData.endDate, formData.halfDay)),
          timeline: [{ date: new Date().toISOString().split('T')[0], action: 'Request Submitted', by: user?.name || 'You' }],
        };
        const existing = readDemoData<unknown[]>('leave-requests', []);
        writeDemoData('leave-requests', [request, ...existing]);
      } else {
        await submitLeaveRequest({
          leaveType: formData.leaveType,
          startDate: formData.startDate!,
          endDate: formData.endDate,
          halfDay: formData.halfDay,
          reason: formData.reason,
          documents: formData.documents,
        });
      }

      toast({
        title: "Leave Request Submitted",
        description: "Your leave request is now visible in Leave History and manager approvals.",
      });
    } catch (error) {
      toast({
        title: "Could not submit leave request",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Reset form
    setFormData({
      leaveType: '',
      startDate: undefined,
      endDate: undefined,
      halfDay: false,
      reason: '',
      documents: []
    });
  };

  const selectedLeaveType = leaveTypes.find(type => type.value === formData.leaveType);
  const totalDays = calculateLeaveDays(formData.startDate, formData.endDate, formData.halfDay);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Apply for Leave
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <LeaveTypeSelector
            value={formData.leaveType}
            onChange={(value) => setFormData(prev => ({ ...prev, leaveType: value }))}
            leaveTypes={leaveTypes}
          />

          <DateSelector
            startDate={formData.startDate}
            endDate={formData.endDate}
            onStartDateChange={(date) => setFormData(prev => ({ ...prev, startDate: date, endDate: date || prev.endDate }))}
            onEndDateChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
            isMobile={isMobile}
          />

          {/* Half Day Toggle */}
          {formData.startDate && formData.endDate && formData.startDate.getTime() === formData.endDate.getTime() && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="half-day"
                checked={formData.halfDay}
                onChange={(e) => setFormData(prev => ({ ...prev, halfDay: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="half-day">Half Day</Label>
            </div>
          )}

          <LeaveSummary
            totalDays={totalDays}
            selectedLeaveType={selectedLeaveType}
          />

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your leave request..."
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={4}
            />
          </div>

          <FileUpload
            documents={formData.documents}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
          />

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            size={isMobile ? "lg" : "default"}
            disabled={!validateLeaveForm(formData.leaveType, formData.startDate, formData.reason)}
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Leave Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
