
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/hooks/useSettings';
import { Building2, Globe, Clock, Database, Save } from 'lucide-react';

export const SystemConfigurationSettings: React.FC = () => {
  const {
    getSystemSetting,
    saveSystemSetting,
    isSaving,
    hasAdminAccess,
  } = useSettings();

  const [companySettings, setCompanySettings] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyWebsite: '',
    companyLogo: '',
    timezone: 'UTC',
    dateFormat: 'DD/MM/YYYY',
    currency: 'USD',
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    twoFactorEnabled: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });

  // Load existing settings
  useEffect(() => {
    const loadSettings = () => {
      const company = getSystemSetting('company_info');
      if (company) {
        setCompanySettings(prev => ({ ...prev, ...company }));
      }

      const system = getSystemSetting('system_config');
      if (system) {
        setSystemSettings(prev => ({ ...prev, ...system }));
      }
    };

    loadSettings();
  }, [getSystemSetting]);

  const handleSaveCompanySettings = async () => {
    try {
      const success = await saveSystemSetting(
        'company_info',
        companySettings,
        'company',
        'Company information and branding settings'
      );
      
      if (success) {
        console.log('Company settings saved successfully');
      }
    } catch (error) {
      console.error('Failed to save company settings:', error);
    }
  };

  const handleSaveSystemSettings = async () => {
    try {
      const success = await saveSystemSetting(
        'system_config',
        systemSettings,
        'system',
        'System security and behavior settings'
      );
      
      if (success) {
        console.log('System settings saved successfully');
      }
    } catch (error) {
      console.error('Failed to save system settings:', error);
    }
  };

  if (!hasAdminAccess) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            Only administrators can access system configuration settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companySettings.companyName}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={companySettings.companyEmail}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, companyEmail: e.target.value }))}
                placeholder="contact@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyPhone">Company Phone</Label>
              <Input
                id="companyPhone"
                value={companySettings.companyPhone}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, companyPhone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input
                id="companyWebsite"
                value={companySettings.companyWebsite}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, companyWebsite: e.target.value }))}
                placeholder="https://company.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="companyAddress">Company Address</Label>
            <Input
              id="companyAddress"
              value={companySettings.companyAddress}
              onChange={(e) => setCompanySettings(prev => ({ ...prev, companyAddress: e.target.value }))}
              placeholder="123 Main St, City, Country"
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="timezone">Default Timezone</Label>
              <Select
                value={companySettings.timezone}
                onValueChange={(value) => setCompanySettings(prev => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select
                value={companySettings.dateFormat}
                onValueChange={(value) => setCompanySettings(prev => ({ ...prev, dateFormat: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={companySettings.currency}
                onValueChange={(value) => setCompanySettings(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSaveCompanySettings} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Company Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable to put the system in maintenance mode
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={systemSettings.maintenanceMode}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="registrationEnabled">User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to register accounts
                </p>
              </div>
              <Switch
                id="registrationEnabled"
                checked={systemSettings.registrationEnabled}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, registrationEnabled: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailVerificationRequired">Email Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require email verification for new accounts
                </p>
              </div>
              <Switch
                id="emailVerificationRequired"
                checked={systemSettings.emailVerificationRequired}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, emailVerificationRequired: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Enable 2FA for enhanced security
                </p>
              </div>
              <Switch
                id="twoFactorEnabled"
                checked={systemSettings.twoFactorEnabled}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={systemSettings.sessionTimeout}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 30 }))}
                min="5"
                max="480"
              />
            </div>
            <div>
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={systemSettings.maxLoginAttempts}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) || 5 }))}
                min="1"
                max="10"
              />
            </div>
          </div>

          <Button onClick={handleSaveSystemSettings} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save System Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
