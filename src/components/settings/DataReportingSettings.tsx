
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, Calendar, Save, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DataReportingSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    defaultExportFormat: 'pdf',
    dataRetentionPeriod: '7years',
    autoExportEnabled: false,
    scheduledReportsEnabled: true,
    anonymizeData: false
  });

  const [reportTypes] = useState([
    { id: 'attendance_daily', name: 'Daily Attendance Report', enabled: true, schedule: 'daily' },
    { id: 'attendance_monthly', name: 'Monthly Attendance Summary', enabled: true, schedule: 'monthly' },
    { id: 'leave_summary', name: 'Leave Summary Report', enabled: true, schedule: 'weekly' },
    { id: 'payroll_data', name: 'Payroll Data Export', enabled: false, schedule: 'monthly' },
    { id: 'performance_metrics', name: 'Performance Metrics', enabled: false, schedule: 'quarterly' }
  ]);

  const [scheduledReports] = useState([
    { name: 'Weekly Team Report', format: 'PDF', schedule: 'Every Monday 9:00 AM', recipients: ['hr@company.com'] },
    { name: 'Monthly Payroll Export', format: 'Excel', schedule: 'Last day of month', recipients: ['finance@company.com'] },
    { name: 'Quarterly Analytics', format: 'PDF', schedule: 'End of quarter', recipients: ['management@company.com'] }
  ]);

  const handleSave = () => {
    toast({
      title: "Reporting Settings Updated",
      description: "Data and reporting preferences have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Default Report Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-secondary" />
            Default Report Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="defaultExportFormat">Default Export Format</Label>
              <Select value={settings.defaultExportFormat} onValueChange={(value) => setSettings({...settings, defaultExportFormat: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dataRetentionPeriod">Data Retention Period</Label>
              <Select value={settings.dataRetentionPeriod} onValueChange={(value) => setSettings({...settings, dataRetentionPeriod: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="3years">3 Years</SelectItem>
                  <SelectItem value="5years">5 Years</SelectItem>
                  <SelectItem value="7years">7 Years</SelectItem>
                  <SelectItem value="indefinite">Indefinite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Export Reports</Label>
                <p className="text-sm text-muted-foreground">Automatically export reports to configured storage</p>
              </div>
              <Switch 
                checked={settings.autoExportEnabled}
                onCheckedChange={(checked) => setSettings({...settings, autoExportEnabled: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Scheduled Reports</Label>
                <p className="text-sm text-muted-foreground">Enable automated report generation and delivery</p>
              </div>
              <Switch 
                checked={settings.scheduledReportsEnabled}
                onCheckedChange={(checked) => setSettings({...settings, scheduledReportsEnabled: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Anonymize Exported Data</Label>
                <p className="text-sm text-muted-foreground">Remove personally identifiable information from reports</p>
              </div>
              <Switch 
                checked={settings.anonymizeData}
                onCheckedChange={(checked) => setSettings({...settings, anonymizeData: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Report Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-secondary" />
            Available Report Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Report Configuration</h3>
              <p className="text-sm text-muted-foreground">Enable and configure available report types</p>
            </div>
            <Button variant="outline" className="hover:bg-secondary hover:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Custom Report
            </Button>
          </div>
          <div className="space-y-3">
            {reportTypes.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch checked={report.enabled} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{report.name}</span>
                      <Badge variant={report.enabled ? "default" : "secondary"}>
                        {report.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Schedule: {report.schedule}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-secondary hover:text-white">
                  Configure
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-secondary" />
            Scheduled Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Active Schedules</h3>
              <p className="text-sm text-muted-foreground">Manage automated report delivery schedules</p>
            </div>
            <Button variant="outline" className="hover:bg-secondary hover:text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </div>
          <div className="space-y-3">
            {scheduledReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{report.name}</span>
                    <Badge variant="outline">{report.format}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{report.schedule}</p>
                  <div className="flex gap-1 mt-1">
                    {report.recipients.map((recipient) => (
                      <Badge key={recipient} variant="secondary" className="text-xs">
                        {recipient}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="hover:bg-secondary hover:text-white">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-destructive hover:text-white">
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
