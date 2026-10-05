
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Globe, Save } from 'lucide-react';

export const GeneralLeaveSettings: React.FC = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    leaveTrackingEnabled: true,
    employeeCancelEnabled: true,
    managerOverrideEnabled: true,
    publicHolidaysEnabled: true,
    selectedCountry: 'US',
    weekendPolicy: 'exclude',
    leaveCalendarVisibility: 'team',
    employeeViewTeamLeave: false,
    showLeaveDaysInCalendar: true,
    requireDocuments: false,
    maxFileSize: 5,
    allowedFileTypes: 'pdf,doc,docx,jpg,png'
  });

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'IN', label: 'India' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' }
  ];

  const handleSave = () => {
    toast({
      title: "General Settings Saved",
      description: "General leave settings have been updated successfully."
    });
  };

  const handleSettingChange = (key: string, value: any) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          General Leave Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Control */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">System Control</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="leaveTracking"
                checked={generalSettings.leaveTrackingEnabled}
                onCheckedChange={(checked) => handleSettingChange('leaveTrackingEnabled', checked)}
              />
              <Label htmlFor="leaveTracking">Enable leave tracking globally</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="employeeCancel"
                checked={generalSettings.employeeCancelEnabled}
                onCheckedChange={(checked) => handleSettingChange('employeeCancelEnabled', checked)}
              />
              <Label htmlFor="employeeCancel">Allow employees to cancel submitted leave requests</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="managerOverride"
                checked={generalSettings.managerOverrideEnabled}
                onCheckedChange={(checked) => handleSettingChange('managerOverrideEnabled', checked)}
              />
              <Label htmlFor="managerOverride">Allow managers to override leave policies</Label>
            </div>
          </div>
        </div>

        {/* Holiday Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Holiday Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="publicHolidays"
                checked={generalSettings.publicHolidaysEnabled}
                onCheckedChange={(checked) => handleSettingChange('publicHolidaysEnabled', checked)}
              />
              <Label htmlFor="publicHolidays">Automatically exclude public holidays</Label>
            </div>
            
            {generalSettings.publicHolidaysEnabled && (
              <div className="space-y-2">
                <Label htmlFor="country">Country for public holidays</Label>
                <Select 
                  value={generalSettings.selectedCountry} 
                  onValueChange={(value) => handleSettingChange('selectedCountry', value)}
                >
                  <SelectTrigger className="max-w-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="weekendPolicy">Weekend Policy</Label>
              <Select 
                value={generalSettings.weekendPolicy} 
                onValueChange={(value) => handleSettingChange('weekendPolicy', value)}
              >
                <SelectTrigger className="max-w-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exclude">Exclude weekends from leave calculations</SelectItem>
                  <SelectItem value="include">Include weekends in leave calculations</SelectItem>
                  <SelectItem value="conditional">Include only working weekends</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Calendar & Visibility */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Calendar & Visibility</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="calendarVisibility">Leave calendar visibility</Label>
              <Select 
                value={generalSettings.leaveCalendarVisibility} 
                onValueChange={(value) => handleSettingChange('leaveCalendarVisibility', value)}
              >
                <SelectTrigger className="max-w-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal only</SelectItem>
                  <SelectItem value="team">Team level</SelectItem>
                  <SelectItem value="department">Department level</SelectItem>
                  <SelectItem value="company">Company wide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="employeeViewTeam"
                checked={generalSettings.employeeViewTeamLeave}
                onCheckedChange={(checked) => handleSettingChange('employeeViewTeamLeave', checked)}
              />
              <Label htmlFor="employeeViewTeam">Allow employees to view team leave schedules</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="showLeaveDays"
                checked={generalSettings.showLeaveDaysInCalendar}
                onCheckedChange={(checked) => handleSettingChange('showLeaveDaysInCalendar', checked)}
              />
              <Label htmlFor="showLeaveDays">Show leave days remaining in calendar view</Label>
            </div>
          </div>
        </div>

        {/* Document Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Document Requirements</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="requireDocs"
                checked={generalSettings.requireDocuments}
                onCheckedChange={(checked) => handleSettingChange('requireDocuments', checked)}
              />
              <Label htmlFor="requireDocs">Require supporting documents for certain leave types</Label>
            </div>
            
            {generalSettings.requireDocuments && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Maximum file size (MB)</Label>
                  <Select 
                    value={generalSettings.maxFileSize.toString()} 
                    onValueChange={(value) => handleSettingChange('maxFileSize', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 MB</SelectItem>
                      <SelectItem value="5">5 MB</SelectItem>
                      <SelectItem value="10">10 MB</SelectItem>
                      <SelectItem value="25">25 MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fileTypes">Allowed file types</Label>
                  <Select 
                    value={generalSettings.allowedFileTypes} 
                    onValueChange={(value) => handleSettingChange('allowedFileTypes', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf,doc,docx">Documents only</SelectItem>
                      <SelectItem value="pdf,doc,docx,jpg,png">Documents + Images</SelectItem>
                      <SelectItem value="pdf,doc,docx,jpg,png,gif,mp4">All common formats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save General Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
