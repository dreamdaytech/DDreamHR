
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AttendancePolicy {
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
  lateArrivalTolerance: number;
  enableRemoteCheckIn: boolean;
  checkInFrequency: 'daily' | 'weekly' | 'shift';
  enableBreakTracking: boolean;
  missedCheckInNotifications: boolean;
  lateArrivalNotifications: boolean;
  autoCheckOutTime: string;
  halfDayHours: number;
  fullDayHours: number;
  overtimeThreshold: number;
}

export const PolicySettings: React.FC = () => {
  const { toast } = useToast();
  const [policy, setPolicy] = useState<AttendancePolicy>({
    defaultCheckInTime: '09:00',
    defaultCheckOutTime: '17:00',
    lateArrivalTolerance: 15,
    enableRemoteCheckIn: true,
    checkInFrequency: 'daily',
    enableBreakTracking: true,
    missedCheckInNotifications: true,
    lateArrivalNotifications: true,
    autoCheckOutTime: '19:00',
    halfDayHours: 4,
    fullDayHours: 8,
    overtimeThreshold: 8
  });

  const handleSavePolicy = () => {
    // In a real app, this would be an API call to save the policy
    toast({
      title: "Settings Saved",
      description: "Attendance policy has been updated successfully"
    });
  };

  const updatePolicy = (field: keyof AttendancePolicy, value: any) => {
    setPolicy(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
          <CardDescription>
            Set default check-in and check-out times for employees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInTime">Default Check-In Time</Label>
              <Input
                id="checkInTime"
                type="time"
                value={policy.defaultCheckInTime}
                onChange={(e) => updatePolicy('defaultCheckInTime', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOutTime">Default Check-Out Time</Label>
              <Input
                id="checkOutTime"
                type="time"
                value={policy.defaultCheckOutTime}
                onChange={(e) => updatePolicy('defaultCheckOutTime', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="autoCheckOut">Auto Check-Out Time</Label>
            <Input
              id="autoCheckOut"
              type="time"
              value={policy.autoCheckOutTime}
              onChange={(e) => updatePolicy('autoCheckOutTime', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Automatically check out employees if they forget to check out
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Rules</CardTitle>
          <CardDescription>
            Configure attendance policies and tolerances
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lateTolerance">Late Arrival Tolerance (minutes)</Label>
            <Input
              id="lateTolerance"
              type="number"
              min="0"
              max="60"
              value={policy.lateArrivalTolerance}
              onChange={(e) => updatePolicy('lateArrivalTolerance', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              Grace period before marking arrival as late
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkInFrequency">Check-In Frequency</Label>
            <Select
              value={policy.checkInFrequency || 'daily'}
              onValueChange={(value: 'daily' | 'weekly' | 'shift') => 
                updatePolicy('checkInFrequency', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="shift">By Shift</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="halfDay">Half Day Hours</Label>
              <Input
                id="halfDay"
                type="number"
                min="1"
                max="12"
                value={policy.halfDayHours}
                onChange={(e) => updatePolicy('halfDayHours', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullDay">Full Day Hours</Label>
              <Input
                id="fullDay"
                type="number"
                min="1"
                max="24"
                value={policy.fullDayHours}
                onChange={(e) => updatePolicy('fullDayHours', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overtime">Overtime Threshold</Label>
              <Input
                id="overtime"
                type="number"
                min="1"
                max="24"
                value={policy.overtimeThreshold}
                onChange={(e) => updatePolicy('overtimeThreshold', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Settings</CardTitle>
          <CardDescription>
            Enable or disable attendance features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Remote Check-In</Label>
              <p className="text-sm text-muted-foreground">
                Allow employees to check in from remote locations
              </p>
            </div>
            <Switch
              checked={policy.enableRemoteCheckIn}
              onCheckedChange={(checked) => updatePolicy('enableRemoteCheckIn', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Break Tracking</Label>
              <p className="text-sm text-muted-foreground">
                Enable employees to log break times
              </p>
            </div>
            <Switch
              checked={policy.enableBreakTracking}
              onCheckedChange={(checked) => updatePolicy('enableBreakTracking', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Missed Check-In Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Notify when employees miss check-in
              </p>
            </div>
            <Switch
              checked={policy.missedCheckInNotifications}
              onCheckedChange={(checked) => updatePolicy('missedCheckInNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Late Arrival Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Notify when employees arrive late
              </p>
            </div>
            <Switch
              checked={policy.lateArrivalNotifications}
              onCheckedChange={(checked) => updatePolicy('lateArrivalNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSavePolicy}>
          Save Policy Settings
        </Button>
      </div>
    </div>
  );
};
