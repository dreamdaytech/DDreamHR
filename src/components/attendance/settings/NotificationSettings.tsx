
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, MessageSquare } from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  missedCheckInDelay: number;
  lateArrivalThreshold: number;
  managerNotifications: boolean;
  hrNotifications: boolean;
  dailyReportTime: string;
  weeklyReportDay: string;
  monthlyReportDate: number;
}

export const NotificationSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    missedCheckInDelay: 30,
    lateArrivalThreshold: 15,
    managerNotifications: true,
    hrNotifications: true,
    dailyReportTime: '18:00',
    weeklyReportDay: 'friday',
    monthlyReportDate: 1
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Notification settings have been updated successfully"
    });
  };

  const updateSetting = <K extends keyof NotificationSettings>(field: K, value: NotificationSettings[K]) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Channels
          </CardTitle>
          <CardDescription>
            Configure how notifications are delivered
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications via email
                </p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications via SMS
                </p>
              </div>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send browser push notifications
                </p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Attendance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Alerts</CardTitle>
          <CardDescription>
            Configure when to send attendance-related notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="missedCheckIn">Missed Check-In Alert (minutes)</Label>
              <Input
                id="missedCheckIn"
                type="number"
                min="5"
                max="120"
                value={settings.missedCheckInDelay}
                onChange={(e) => updateSetting('missedCheckInDelay', parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Send alert if employee hasn't checked in after this time
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lateThreshold">Late Arrival Alert (minutes)</Label>
              <Input
                id="lateThreshold"
                type="number"
                min="1"
                max="60"
                value={settings.lateArrivalThreshold}
                onChange={(e) => updateSetting('lateArrivalThreshold', parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Send alert when employee is late by this amount
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Manager Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Notify managers about their team's attendance issues
                </p>
              </div>
              <Switch
                checked={settings.managerNotifications}
                onCheckedChange={(checked) => updateSetting('managerNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>HR Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Notify HR about all attendance issues
                </p>
              </div>
              <Switch
                checked={settings.hrNotifications}
                onCheckedChange={(checked) => updateSetting('hrNotifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Reports</CardTitle>
          <CardDescription>
            Schedule automatic attendance report delivery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dailyReport">Daily Report Time</Label>
            <Input
              id="dailyReport"
              type="time"
              value={settings.dailyReportTime}
              onChange={(e) => updateSetting('dailyReportTime', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Time to send daily attendance summary
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weeklyReport">Weekly Report Day</Label>
            <Select
              value={settings.weeklyReportDay || 'friday'}
              onValueChange={(value) => updateSetting('weeklyReportDay', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyReport">Monthly Report Date</Label>
            <Input
              id="monthlyReport"
              type="number"
              min="1"
              max="28"
              value={settings.monthlyReportDate}
              onChange={(e) => updateSetting('monthlyReportDate', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              Day of month to send monthly report
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
};
