
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Shield, Save } from 'lucide-react';

export const LeavePolicySettings: React.FC = () => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState({
    defaultAnnualLeave: 25,
    defaultSickLeave: 10,
    defaultPersonalLeave: 5,
    carryForwardEnabled: true,
    maxCarryForwardDays: 5,
    halfDayEnabled: true,
    minimumHalfDayHours: 4,
    advanceNoticeRequired: true,
    defaultNoticePeriodDays: 1,
    weekendExcluded: true,
    holidayExcluded: true,
    probationPeriodRestriction: true,
    probationPeriodMonths: 3
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "Policy Settings Saved",
      description: "Leave policy settings have been updated successfully."
    });
  };

  const handlePolicyChange = (key: string, value: any) => {
    setPolicies(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Leave Policy Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Entitlements */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Default Leave Entitlements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annualLeave">Annual Leave (Days/Year)</Label>
              <Input
                id="annualLeave"
                type="number"
                value={policies.defaultAnnualLeave}
                onChange={(e) => handlePolicyChange('defaultAnnualLeave', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sickLeave">Sick Leave (Days/Year)</Label>
              <Input
                id="sickLeave"
                type="number"
                value={policies.defaultSickLeave}
                onChange={(e) => handlePolicyChange('defaultSickLeave', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalLeave">Personal Leave (Days/Year)</Label>
              <Input
                id="personalLeave"
                type="number"
                value={policies.defaultPersonalLeave}
                onChange={(e) => handlePolicyChange('defaultPersonalLeave', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Carry Forward Rules */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Carry Forward Rules</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="carryForward"
                checked={policies.carryForwardEnabled}
                onCheckedChange={(checked) => handlePolicyChange('carryForwardEnabled', checked)}
              />
              <Label htmlFor="carryForward">Enable leave carryover to next year</Label>
            </div>
            
            {policies.carryForwardEnabled && (
              <div className="space-y-2">
                <Label htmlFor="maxCarryForward">Maximum carry forward days</Label>
                <Input
                  id="maxCarryForward"
                  type="number"
                  value={policies.maxCarryForwardDays}
                  onChange={(e) => handlePolicyChange('maxCarryForwardDays', parseInt(e.target.value) || 0)}
                  className="max-w-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Half Day Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Half Day Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="halfDay"
                checked={policies.halfDayEnabled}
                onCheckedChange={(checked) => handlePolicyChange('halfDayEnabled', checked)}
              />
              <Label htmlFor="halfDay">Enable half-day leave options</Label>
            </div>
            
            {policies.halfDayEnabled && (
              <div className="space-y-2">
                <Label htmlFor="halfDayHours">Minimum hours for half-day</Label>
                <Input
                  id="halfDayHours"
                  type="number"
                  value={policies.minimumHalfDayHours}
                  onChange={(e) => handlePolicyChange('minimumHalfDayHours', parseInt(e.target.value) || 0)}
                  className="max-w-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Notice Period */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notice Period</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="advanceNotice"
                checked={policies.advanceNoticeRequired}
                onCheckedChange={(checked) => handlePolicyChange('advanceNoticeRequired', checked)}
              />
              <Label htmlFor="advanceNotice">Require advance notice for leave applications</Label>
            </div>
            
            {policies.advanceNoticeRequired && (
              <div className="space-y-2">
                <Label htmlFor="noticePeriod">Default notice period (days)</Label>
                <Input
                  id="noticePeriod"
                  type="number"
                  value={policies.defaultNoticePeriodDays}
                  onChange={(e) => handlePolicyChange('defaultNoticePeriodDays', parseInt(e.target.value) || 0)}
                  className="max-w-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Calendar Exclusions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Calendar Exclusions</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="weekendExcluded"
                checked={policies.weekendExcluded}
                onCheckedChange={(checked) => handlePolicyChange('weekendExcluded', checked)}
              />
              <Label htmlFor="weekendExcluded">Exclude weekends from leave calculations</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="holidayExcluded"
                checked={policies.holidayExcluded}
                onCheckedChange={(checked) => handlePolicyChange('holidayExcluded', checked)}
              />
              <Label htmlFor="holidayExcluded">Exclude public holidays from leave calculations</Label>
            </div>
          </div>
        </div>

        {/* Probation Period */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Probation Period Rules</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="probationRestriction"
                checked={policies.probationPeriodRestriction}
                onCheckedChange={(checked) => handlePolicyChange('probationPeriodRestriction', checked)}
              />
              <Label htmlFor="probationRestriction">Restrict leave during probation period</Label>
            </div>
            
            {policies.probationPeriodRestriction && (
              <div className="space-y-2">
                <Label htmlFor="probationMonths">Probation period (months)</Label>
                <Input
                  id="probationMonths"
                  type="number"
                  value={policies.probationPeriodMonths}
                  onChange={(e) => handlePolicyChange('probationPeriodMonths', parseInt(e.target.value) || 0)}
                  className="max-w-sm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Policy Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
