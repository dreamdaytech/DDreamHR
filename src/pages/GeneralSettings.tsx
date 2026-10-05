import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Building2, 
  Shield, 
  Bell, 
  Puzzle, 
  BarChart3,
  Globe,
  ArrowLeft
} from 'lucide-react';

// Import setting components
import { SystemConfigurationSettings } from '@/components/settings/SystemConfigurationSettings';
import { AccessPermissionsSettings } from '@/components/settings/AccessPermissionsSettings';
import { WorkflowNotificationsSettings } from '@/components/settings/WorkflowNotificationsSettings';
import { ModulesFeatureSettings } from '@/components/settings/ModulesFeatureSettings';
import { DataReportingSettings } from '@/components/settings/DataReportingSettings';
import { IntegrationsSettings } from '@/components/settings/IntegrationsSettings';
import { ProfileSettings } from '@/components/profile/ProfileSettings';

export const GeneralSettings: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('system');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const isAdminOrHR = user?.role && ['hr', 'admin'].includes(user.role);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    navigate('/more');
  };

  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (!confirmed) return;
    }
    setActiveTab(newTab);
  };

  if (!isAdminOrHR) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              You don't have permission to access general settings. This area is restricted to HR and Admin users only.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader 
          title="General Settings" 
          showLogo={false}
          showSearch={false}
          showNotifications={false}
          leftAction={
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2 hover:bg-secondary hover:text-white active:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          }
        />
        
        <div className="p-4 space-y-4 pb-24">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">System Configuration</h1>
            </div>
            <p className="text-sm text-gray-600">
              Manage global settings, permissions, and system-wide configurations.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <TabsList className="grid w-full grid-cols-4 h-auto p-2 bg-gray-50">
                <TabsTrigger 
                  value="system" 
                  className="flex flex-col items-center gap-1 py-3 px-2 text-xs data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white"
                >
                  <Building2 className="h-4 w-4" />
                  <span>System</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="flex flex-col items-center gap-1 py-3 px-2 text-xs data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="access" 
                  className="flex flex-col items-center gap-1 py-3 px-2 text-xs data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white"
                >
                  <Shield className="h-4 w-4" />
                  <span>Access</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="modules" 
                  className="flex flex-col items-center gap-1 py-3 px-2 text-xs data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white"
                >
                  <Puzzle className="h-4 w-4" />
                  <span>Modules</span>
                </TabsTrigger>
              </TabsList>

              <div className="p-4">
                <TabsContent value="system" className="mt-0 space-y-4">
                  <SystemConfigurationSettings />
                </TabsContent>

                <TabsContent value="profile" className="mt-0 space-y-4">
                  <ProfileSettings />
                </TabsContent>

                <TabsContent value="access" className="mt-0 space-y-4">
                  <AccessPermissionsSettings />
                </TabsContent>

                <TabsContent value="modules" className="mt-0 space-y-4">
                  <ModulesFeatureSettings />
                </TabsContent>
              </div>
            </div>

            {/* Additional mobile sections */}
            <div className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Bell className="h-4 w-4 text-secondary" />
                    Notifications & Workflows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WorkflowNotificationsSettings onUnsavedChanges={setHasUnsavedChanges} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4 text-secondary" />
                    Data & Reporting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DataReportingSettings />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Globe className="h-4 w-4 text-secondary" />
                    Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <IntegrationsSettings />
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="container py-6 max-w-full px-0">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-secondary hover:text-white active:bg-secondary">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Settings className="h-6 w-6" />
                General Settings
              </h1>
              <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full max-w-5xl grid-cols-7">
            <TabsTrigger value="system" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">
              <Building2 className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="access" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Access
            </TabsTrigger>
            <TabsTrigger value="workflow" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">
              <Puzzle className="h-4 w-4 mr-2" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="reporting" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reporting
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">
              <Globe className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-6">
            <SystemConfigurationSettings />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <AccessPermissionsSettings />
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <WorkflowNotificationsSettings onUnsavedChanges={setHasUnsavedChanges} />
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <ModulesFeatureSettings />
          </TabsContent>

          <TabsContent value="reporting" className="space-y-6">
            <DataReportingSettings />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <IntegrationsSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
