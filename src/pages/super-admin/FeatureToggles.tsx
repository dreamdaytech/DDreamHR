
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { readDemoData, writeDemoData } from '@/lib/demoStore';

const initialFeatures = [
  { id: 'ai-reports', name: 'AI-Powered Reports', description: 'Enable generative AI for creating reports.', enabled: true, tags: ['New', 'Beta'] },
  { id: 'dark-mode', name: 'Dark Mode', description: 'Allow users to switch to a dark theme.', enabled: false, tags: [] },
  { id: 'sso-login', name: 'Single Sign-On (SSO)', description: 'Enable login via SAML/OAuth providers.', enabled: true, tags: ['Enterprise'] },
  { id: 'pwa-support', name: 'Progressive Web App (PWA)', description: 'Allow users to install the app on their devices.', enabled: true, tags: [] },
  { id: 'realtime-collab', name: 'Real-time Collaboration', description: 'Enable real-time collaboration features on documents.', enabled: false, tags: ['Coming Soon'] },
];

const FeatureToggles: React.FC = () => {
  const [features, setFeatures] = useState(() => readDemoData('platform-feature-flags', initialFeatures));

  const handleToggle = (id: string) => {
    setFeatures((current) => {
      const next = current.map((f) => f.id === id ? { ...f, enabled: !f.enabled } : f);
      writeDemoData('platform-feature-flags', next);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Feature Toggles</h1>
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{feature.name}</span>
                      {feature.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{feature.description}</TableCell>
                  <TableCell>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => handleToggle(feature.id)}
                      aria-label={`Toggle ${feature.name}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureToggles;
