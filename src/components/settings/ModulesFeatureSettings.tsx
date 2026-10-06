import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Puzzle, Clock, Calendar, Users, BarChart3, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { readDemoData, writeDemoData } from '@/lib/demoStore';

type ModuleSetting = {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  features: string[];
};

const seedModules: ModuleSetting[] = [
  { id: 'attendance', name: 'Attendance Management', enabled: true, description: 'Check-in/out, breaks and attendance reporting', features: ['Check-in/out', 'Break tracking', 'Reports'] },
  { id: 'leave', name: 'Leave Tracking', enabled: true, description: 'Leave requests, approvals and balances', features: ['Applications', 'Approvals', 'Calendar'] },
  { id: 'time_tracking', name: 'Time Tracking', enabled: true, description: 'Time logs and timesheets', features: ['Timers', 'Timesheets', 'Exports'] },
  { id: 'employees', name: 'Employee Management', enabled: true, description: 'Employee records and lifecycle work', features: ['Directory', 'Employee changes', 'Lifecycle'] },
  { id: 'reports', name: 'Reports & Analytics', enabled: true, description: 'Operational reports and exports', features: ['Attendance', 'Payroll', 'Overtime'] },
  { id: 'performance', name: 'Performance Management', enabled: false, description: 'Performance reviews and goals', features: ['Reviews', 'Goals'] },
];

const seedDepartmentAccess: Record<string, string[]> = {
  Engineering: ['attendance', 'leave', 'time_tracking', 'reports'],
  HR: ['attendance', 'leave', 'employees', 'reports'],
  Sales: ['attendance', 'leave', 'reports'],
  Finance: ['attendance', 'reports'],
};

export const ModulesFeatureSettings = () => {
  const { toast } = useToast();
  const [modules, setModules] = useState<ModuleSetting[]>(() => readDemoData('settings-modules', seedModules));
  const [departmentAccess, setDepartmentAccess] = useState<Record<string, string[]>>(() => readDemoData('settings-department-access', seedDepartmentAccess));
  const [features, setFeatures] = useState(() => readDemoData('settings-feature-toggles', { mobileSupport: true, bulkOperations: true, auditTrail: true }));

  const toggleDepartmentModule = (department: string, moduleId: string) => {
    setDepartmentAccess((current) => {
      const currentAccess = current[department] || [];
      const nextAccess = currentAccess.includes(moduleId)
        ? currentAccess.filter((id) => id !== moduleId)
        : [...currentAccess, moduleId];
      return { ...current, [department]: nextAccess };
    });
  };

  const handleSave = () => {
    writeDemoData('settings-modules', modules);
    writeDemoData('settings-department-access', departmentAccess);
    writeDemoData('settings-feature-toggles', features);
    toast({ title: 'Module settings saved', description: 'Module access and feature toggles were saved in the demo workspace.' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Puzzle className="h-5 w-5 text-secondary" />Module Management</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {modules.map((module) => (
            <div key={module.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium">{module.name}</span>
                    <Badge variant={module.enabled ? 'default' : 'secondary'}>{module.enabled ? 'Enabled' : 'Disabled'}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">{module.features.map((feature) => <Badge key={feature} variant="outline" className="text-xs">{feature}</Badge>)}</div>
                </div>
                <Switch checked={module.enabled} onCheckedChange={() => setModules((current) => current.map((item) => item.id === module.id ? { ...item, enabled: !item.enabled } : item))} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-secondary" />Department Access</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          {Object.entries(departmentAccess).map(([department, access]) => (
            <div key={department} className="rounded-lg border p-4">
              <p className="mb-3 font-medium">{department}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => (
                  <label key={module.id} className="flex items-center justify-between gap-3 rounded-md bg-muted/40 p-3 text-sm">
                    <span>{module.name}</span>
                    <Switch checked={access.includes(module.id)} onCheckedChange={() => toggleDepartmentModule(department, module.id)} />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Platform Feature Toggles</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><div><Label>Mobile support</Label><p className="text-sm text-muted-foreground">Enable mobile-oriented navigation and layouts.</p></div><Switch checked={features.mobileSupport} onCheckedChange={(checked) => setFeatures({ ...features, mobileSupport: checked })} /></div>
          <div className="flex items-center justify-between"><div><Label>Bulk operations</Label><p className="text-sm text-muted-foreground">Show bulk-action capabilities where supported.</p></div><Switch checked={features.bulkOperations} onCheckedChange={(checked) => setFeatures({ ...features, bulkOperations: checked })} /></div>
          <div className="flex items-center justify-between"><div><Label>Audit trail</Label><p className="text-sm text-muted-foreground">Track demo configuration changes locally.</p></div><Switch checked={features.auditTrail} onCheckedChange={(checked) => setFeatures({ ...features, auditTrail: checked })} /></div>
        </CardContent>
      </Card>

      <div className="flex justify-end"><Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save Settings</Button></div>
    </div>
  );
};
