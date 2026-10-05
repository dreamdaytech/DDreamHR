
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Globe, Key, Mail, Calendar, CreditCard, Save, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const IntegrationsSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [integrations, setIntegrations] = useState([
    { 
      id: 'email', 
      name: 'Email Service', 
      icon: Mail, 
      enabled: true, 
      status: 'connected',
      description: 'Send notifications and reports via email',
      config: { provider: 'SMTP', server: 'smtp.company.com' }
    },
    { 
      id: 'calendar', 
      name: 'Calendar Integration', 
      icon: Calendar, 
      enabled: false, 
      status: 'disconnected',
      description: 'Sync leave requests and meetings with calendar',
      config: { provider: 'Google Calendar', account: '' }
    },
    { 
      id: 'payroll', 
      name: 'Payroll System', 
      icon: CreditCard, 
      enabled: false, 
      status: 'not_configured',
      description: 'Integration with external payroll processing',
      config: { provider: 'ADP', api_key: '' }
    }
  ]);

  const [apiSettings, setApiSettings] = useState({
    enablePublicApi: false,
    requireApiKeys: true,
    rateLimitEnabled: true,
    maxRequestsPerHour: 1000
  });

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === integrationId 
        ? { ...integration, enabled: !integration.enabled }
        : integration
    ));
  };

  const handleSave = () => {
    toast({
      title: "Integration Settings Updated",
      description: "API and integration settings have been saved successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-300';
      case 'disconnected': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'not_configured': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Third-Party Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-secondary" />
            Third-Party Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Available Integrations</h3>
              <p className="text-sm text-muted-foreground">Connect with external services and platforms</p>
            </div>
            <Button variant="outline" className="hover:bg-secondary hover:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>
          <div className="space-y-4">
            {integrations.map((integration) => {
              const IconComponent = integration.icon;
              return (
                <div key={integration.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mt-1">
                        <IconComponent className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{integration.name}</span>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Provider: </span>
                          <span>{integration.config.provider}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={integration.enabled}
                        onCheckedChange={() => handleToggleIntegration(integration.id)}
                      />
                      <Button variant="outline" size="sm" className="hover:bg-secondary hover:text-white">
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-secondary" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Public API</Label>
                <p className="text-sm text-muted-foreground">Allow external applications to access your data via API</p>
              </div>
              <Switch 
                checked={apiSettings.enablePublicApi}
                onCheckedChange={(checked) => setApiSettings({...apiSettings, enablePublicApi: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Require API Keys</Label>
                <p className="text-sm text-muted-foreground">Enforce API key authentication for all requests</p>
              </div>
              <Switch 
                checked={apiSettings.requireApiKeys}
                onCheckedChange={(checked) => setApiSettings({...apiSettings, requireApiKeys: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">Enable rate limiting to prevent API abuse</p>
              </div>
              <Switch 
                checked={apiSettings.rateLimitEnabled}
                onCheckedChange={(checked) => setApiSettings({...apiSettings, rateLimitEnabled: checked})}
              />
            </div>
          </div>

          {apiSettings.rateLimitEnabled && (
            <div>
              <Label htmlFor="maxRequests">Max Requests Per Hour</Label>
              <Input
                id="maxRequests"
                type="number"
                value={apiSettings.maxRequestsPerHour}
                onChange={(e) => setApiSettings({...apiSettings, maxRequestsPerHour: parseInt(e.target.value)})}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Keys Management */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Active API Keys</h3>
              <p className="text-sm text-muted-foreground">Manage API keys for external integrations</p>
            </div>
            <Button variant="outline" className="hover:bg-secondary hover:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Generate Key
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Production API Key</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Created: 2024-01-15 | Last used: 2024-01-30</p>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">pk_live_****...****1234</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="hover:bg-secondary hover:text-white">
                  View
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-destructive hover:text-white">
                  Revoke
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Development API Key</span>
                  <Badge variant="secondary">Test</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Created: 2024-01-10 | Last used: 2024-01-29</p>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">pk_test_****...****5678</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="hover:bg-secondary hover:text-white">
                  View
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-destructive hover:text-white">
                  Revoke
                </Button>
              </div>
            </div>
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
