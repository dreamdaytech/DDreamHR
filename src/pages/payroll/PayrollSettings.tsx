
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Calendar,
  DollarSign,
  Users,
  Shield,
  Bell,
  Save
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const PayrollSettings = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // General Settings
    defaultCurrency: 'SLL',
    payrollFrequency: 'monthly',
    payDay: 5,
    autopilotEnabled: false,
    
    // Tax Settings
    incomeTaxRate: 15,
    nassitRate: 5,
    
    // Benefits Settings
    healthInsurance: 150000,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    managerNotifications: true,
    
    // Security Settings
    requireApproval: true,
    multipleApprovers: false,
    auditLog: true
  });

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Payroll settings saved successfully",
    });
  };

  const handleSettingChange = (key: keyof typeof settings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll Settings</h1>
          <p className="text-muted-foreground">Configure payroll processing and policies</p>
        </div>
        <Button onClick={handleSave} className="bg-[#e86625] hover:bg-[#d55b1f]">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Select 
                value={settings.defaultCurrency} 
                onValueChange={(value) => handleSettingChange('defaultCurrency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SLL">Sierra Leone Leone (SLL)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="frequency">Payroll Frequency</Label>
              <Select 
                value={settings.payrollFrequency} 
                onValueChange={(value) => handleSettingChange('payrollFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payDay">Default Pay Day (Day of Month)</Label>
              <Input
                id="payDay"
                type="number"
                min="1"
                max="31"
                value={settings.payDay}
                onChange={(e) => handleSettingChange('payDay', parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Autopilot Mode</Label>
                <p className="text-sm text-muted-foreground">Automatically process payroll</p>
              </div>
              <Switch
                checked={settings.autopilotEnabled}
                onCheckedChange={(checked) => handleSettingChange('autopilotEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tax & Deduction Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="incomeTax">Income Tax Rate (%)</Label>
              <Input
                id="incomeTax"
                type="number"
                step="0.1"
                value={settings.incomeTaxRate}
                onChange={(e) => handleSettingChange('incomeTaxRate', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="nassit">NASSIT Rate (%)</Label>
              <Input
                id="nassit"
                type="number"
                step="0.1"
                value={settings.nassitRate}
                onChange={(e) => handleSettingChange('nassitRate', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="healthInsurance">Default Health Insurance (SLL)</Label>
              <Input
                id="healthInsurance"
                type="number"
                value={settings.healthInsurance}
                onChange={(e) => handleSettingChange('healthInsurance', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Payroll Schedule</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Monthly Payroll</span>
                  <span className="text-sm text-muted-foreground">5th of every month</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Bonus Payroll</span>
                  <span className="text-sm text-muted-foreground">End of year</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Configure Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send payroll updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send payroll updates via SMS</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Manager Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify managers of payroll status</p>
              </div>
              <Switch
                checked={settings.managerNotifications}
                onCheckedChange={(checked) => handleSettingChange('managerNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Approval</Label>
                <p className="text-sm text-muted-foreground">Payroll must be approved before processing</p>
              </div>
              <Switch
                checked={settings.requireApproval}
                onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Multiple Approvers</Label>
                <p className="text-sm text-muted-foreground">Require multiple people to approve</p>
              </div>
              <Switch
                checked={settings.multipleApprovers}
                onCheckedChange={(checked) => handleSettingChange('multipleApprovers', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Track all payroll changes</p>
              </div>
              <Switch
                checked={settings.auditLog}
                onCheckedChange={(checked) => handleSettingChange('auditLog', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Approvers
            </Button>
            
            <Button variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Tax Settings
            </Button>
            
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Holiday Calendar
            </Button>
            
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Notification Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollSettings;
