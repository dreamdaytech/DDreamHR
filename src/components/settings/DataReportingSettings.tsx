import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Calendar, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { readDemoData, writeDemoData } from '@/lib/demoStore';

const seedReportTypes = [
  { id: 'attendance_daily', name: 'Daily Attendance Report', enabled: true, schedule: 'daily' },
  { id: 'attendance_monthly', name: 'Monthly Attendance Summary', enabled: true, schedule: 'monthly' },
  { id: 'leave_summary', name: 'Leave Summary Report', enabled: true, schedule: 'weekly' },
  { id: 'payroll_data', name: 'Payroll Data Export', enabled: false, schedule: 'monthly' },
];

const scheduledReports = [
  { name: 'Weekly Team Report', format: 'PDF', schedule: 'Every Monday 9:00 AM' },
  { name: 'Monthly Payroll Export', format: 'Excel', schedule: 'Last day of month' },
];

export const DataReportingSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(() => readDemoData('settings-reporting', {
    defaultExportFormat: 'csv',
    dataRetentionPeriod: '7years',
    anonymizeData: false,
  }));
  const [reportTypes, setReportTypes] = useState(() => readDemoData('settings-report-types', seedReportTypes));

  const handleSave = () => {
    writeDemoData('settings-reporting', settings);
    writeDemoData('settings-report-types', reportTypes);
    toast({ title: 'Reporting settings saved', description: 'Export preferences and report availability were saved.' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-secondary" />Default Report Settings</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Default Export Format</Label><Select value={settings.defaultExportFormat} onValueChange={(value) => setSettings({ ...settings, defaultExportFormat: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="csv">CSV</SelectItem><SelectItem value="pdf">PDF</SelectItem><SelectItem value="excel">Excel</SelectItem><SelectItem value="json">JSON</SelectItem></SelectContent></Select></div>
            <div><Label>Data Retention Period</Label><Select value={settings.dataRetentionPeriod} onValueChange={(value) => setSettings({ ...settings, dataRetentionPeriod: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1year">1 Year</SelectItem><SelectItem value="3years">3 Years</SelectItem><SelectItem value="5years">5 Years</SelectItem><SelectItem value="7years">7 Years</SelectItem><SelectItem value="indefinite">Indefinite</SelectItem></SelectContent></Select></div>
          </div>
          <div className="flex items-center justify-between"><div><Label>Anonymize exported data</Label><p className="text-sm text-muted-foreground">Use anonymized values in supported demo exports.</p></div><Switch checked={settings.anonymizeData} onCheckedChange={(checked) => setSettings({ ...settings, anonymizeData: checked })} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Available Report Types</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {reportTypes.map((report) => (
            <div key={report.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div><div className="flex items-center gap-2"><span className="font-medium">{report.name}</span><Badge variant={report.enabled ? 'default' : 'secondary'}>{report.enabled ? 'Enabled' : 'Disabled'}</Badge></div><p className="text-sm text-muted-foreground">Cadence: {report.schedule}</p></div>
              <Switch checked={report.enabled} onCheckedChange={() => setReportTypes((current) => current.map((item) => item.id === report.id ? { ...item, enabled: !item.enabled } : item))} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-secondary" />Scheduled Reports</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Schedules are displayed for product preview only. Creating automated delivery requires the production backend and is intentionally not exposed as a clickable demo control.</p>
          {scheduledReports.map((report) => <div key={report.name} className="flex items-center justify-between rounded-lg border p-3"><div><p className="font-medium">{report.name}</p><p className="text-sm text-muted-foreground">{report.schedule}</p></div><Badge variant="outline">{report.format}</Badge></div>)}
        </CardContent>
      </Card>

      <div className="flex justify-end"><Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save Settings</Button></div>
    </div>
  );
};
