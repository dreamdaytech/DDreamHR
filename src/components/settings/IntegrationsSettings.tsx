import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Globe, Key, Mail, Calendar, CreditCard, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { readDemoData, writeDemoData } from '@/lib/demoStore';

const availableIntegrations = [
  { id: 'email', name: 'Email Service', icon: Mail, provider: 'SMTP / transactional email', description: 'Send notifications and reports by email.' },
  { id: 'calendar', name: 'Calendar Integration', icon: Calendar, provider: 'Google / Microsoft calendar', description: 'Sync leave and organization events.' },
  { id: 'payroll', name: 'External Payroll', icon: CreditCard, provider: 'Payroll provider API', description: 'Exchange payroll processing data.' },
];

export const IntegrationsSettings = () => {
  const { toast } = useToast();
  const [apiPreferences, setApiPreferences] = useState(() => readDemoData('settings-api-preferences', {
    requireApiKeys: true,
    rateLimitEnabled: true,
    maxRequestsPerHour: 1000,
  }));

  const handleSave = () => {
    writeDemoData('settings-api-preferences', apiPreferences);
    toast({ title: 'API preferences saved', description: 'Demo configuration preferences were saved locally.' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-secondary" />Third-Party Integrations</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">External connection controls are intentionally read-only in the hosted demo. Connecting providers requires production credentials and backend configuration.</p>
          {availableIntegrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div key={integration.id} className="flex items-start gap-3 rounded-lg border p-4">
                <div className="rounded-lg bg-muted p-2"><Icon className="h-5 w-5 text-secondary" /></div>
                <div className="flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{integration.name}</p><Badge variant="outline">Production setup required</Badge></div><p className="mt-1 text-sm text-muted-foreground">{integration.description}</p><p className="mt-2 text-sm"><span className="text-muted-foreground">Provider:</span> {integration.provider}</p></div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-secondary" />API Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">These settings are demo preferences only; the hosted demo does not expose or generate API credentials.</p>
          <div className="flex items-center justify-between"><div><Label>Require API keys</Label><p className="text-sm text-muted-foreground">Require authentication for production API requests.</p></div><Switch checked={apiPreferences.requireApiKeys} onCheckedChange={(checked) => setApiPreferences({ ...apiPreferences, requireApiKeys: checked })} /></div>
          <div className="flex items-center justify-between"><div><Label>Rate limiting</Label><p className="text-sm text-muted-foreground">Apply a request limit in production.</p></div><Switch checked={apiPreferences.rateLimitEnabled} onCheckedChange={(checked) => setApiPreferences({ ...apiPreferences, rateLimitEnabled: checked })} /></div>
          {apiPreferences.rateLimitEnabled && <div><Label htmlFor="maxRequests">Max requests per hour</Label><Input id="maxRequests" type="number" min="1" value={apiPreferences.maxRequestsPerHour} onChange={(e) => setApiPreferences({ ...apiPreferences, maxRequestsPerHour: Math.max(1, parseInt(e.target.value) || 1) })} /></div>}
        </CardContent>
      </Card>

      <div className="flex justify-end"><Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save Preferences</Button></div>
    </div>
  );
};
