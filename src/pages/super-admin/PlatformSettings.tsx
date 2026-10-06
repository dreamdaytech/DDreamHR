import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { readDemoData, writeDemoData } from '@/lib/demoStore';

const PlatformSettings = () => {
  const { toast } = useToast();
  const [general, setGeneral] = useState(() => readDemoData('platform-settings-general', {
    platformName: 'DDreamHR',
    maintenanceMode: false,
  }));
  const [security, setSecurity] = useState(() => readDemoData('platform-settings-security', {
    requireAdmin2fa: true,
    sessionTimeout: 60,
  }));

  const saveGeneral = () => {
    writeDemoData('platform-settings-general', general);
    toast({ title: 'Platform settings saved', description: 'General platform settings were saved in the demo workspace.' });
  };

  const saveSecurity = () => {
    writeDemoData('platform-settings-security', security);
    toast({ title: 'Security settings saved', description: 'Security preferences were saved in the demo workspace.' });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Platform Settings</h1><p className="text-muted-foreground">Manage demo platform configuration. External integrations and API credentials are intentionally not exposed here.</p></div>
      <Tabs defaultValue="general">
        <TabsList><TabsTrigger value="general">General</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger></TabsList>
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader><CardTitle>General Settings</CardTitle><CardDescription>Manage platform naming and maintenance state.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="platform-name">Platform Name</Label><Input id="platform-name" value={general.platformName} onChange={(e) => setGeneral({ ...general, platformName: e.target.value })} /></div>
              <div className="flex items-center justify-between"><div><Label htmlFor="maintenance-mode">Maintenance Mode</Label><p className="text-sm text-muted-foreground">Demo preference only; it does not disable the hosted site.</p></div><Switch id="maintenance-mode" checked={general.maintenanceMode} onCheckedChange={(checked) => setGeneral({ ...general, maintenanceMode: checked })} /></div>
            </CardContent>
            <CardFooter><Button onClick={saveGeneral}>Save Changes</Button></CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Security Settings</CardTitle><CardDescription>Configure demo security policy preferences.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div><Label htmlFor="enable-2fa">Require Two-Factor Authentication for Admins</Label><p className="text-sm text-muted-foreground">Stored as a policy preference in demo mode.</p></div><Switch id="enable-2fa" checked={security.requireAdmin2fa} onCheckedChange={(checked) => setSecurity({ ...security, requireAdmin2fa: checked })} /></div>
              <div className="space-y-2"><Label htmlFor="session-timeout">Session Timeout (minutes)</Label><Input id="session-timeout" type="number" min="5" value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: Math.max(5, Number(e.target.value) || 5) })} /></div>
            </CardContent>
            <CardFooter><Button onClick={saveSecurity}>Save Security Settings</Button></CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlatformSettings;
