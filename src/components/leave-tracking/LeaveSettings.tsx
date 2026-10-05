
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaveTypeSettings } from './settings/LeaveTypeSettings';
import { LeavePolicySettings } from './settings/LeavePolicySettings';
import { ApprovalWorkflowSettings } from './settings/ApprovalWorkflowSettings';
import { GeneralLeaveSettings } from './settings/GeneralLeaveSettings';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { 
  Settings, 
  Users, 
  Shield, 
  Globe,
  ArrowLeft,
  FileText,
  Workflow
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LeaveSettings: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leave-types');

  const isAdminOrHR = user?.role && ['hr', 'admin'].includes(user.role);

  const handleBack = () => {
    navigate('/leave-tracking');
  };

  if (!isAdminOrHR) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              You don't have permission to access leave settings. This area is restricted to HR and Admin users only.
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
          title="Leave Settings" 
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
              <h1 className="text-lg font-semibold">Configure Leave System</h1>
            </div>
            <p className="text-sm text-gray-600">
              Manage leave types, policies, and approval workflows for your organization.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <TabsList className="grid w-full grid-cols-2 h-auto p-2 bg-gray-50">
                <TabsTrigger 
                  value="leave-types" 
                  className="flex flex-col items-center gap-2 py-3 px-2 text-xs data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white"
                >
                  <Users className="h-5 w-5" />
                  <span>Leave Types</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="system" 
                  className="flex flex-col items-center gap-2 py-3 px-2 text-xs data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white"
                >
                  <Settings className="h-5 w-5" />
                  <span>System</span>
                </TabsTrigger>
              </TabsList>

              <div className="p-4">
                <TabsContent value="leave-types" className="mt-0 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Users className="h-4 w-4 text-secondary" />
                      <h2 className="font-medium">Manage Leave Types</h2>
                    </div>
                    <LeaveTypeSettings />
                  </div>
                </TabsContent>

                <TabsContent value="system" className="mt-0 space-y-4">
                  <div className="space-y-6">
                    {/* Policies Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <FileText className="h-4 w-4 text-secondary" />
                        <h2 className="font-medium">Leave Policies</h2>
                      </div>
                      <LeavePolicySettings />
                    </div>

                    {/* Workflow Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <Workflow className="h-4 w-4 text-secondary" />
                        <h2 className="font-medium">Approval Workflow</h2>
                      </div>
                      <ApprovalWorkflowSettings />
                    </div>

                    {/* General Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <Globe className="h-4 w-4 text-secondary" />
                        <h2 className="font-medium">General Settings</h2>
                      </div>
                      <GeneralLeaveSettings />
                    </div>
                  </div>
                </TabsContent>
              </div>
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
                Leave Settings
              </h1>
              <p className="text-muted-foreground">Configure leave types, policies, and approval workflows</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-4">
            <TabsTrigger value="leave-types" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">Leave Types</TabsTrigger>
            <TabsTrigger value="policies" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">Policies</TabsTrigger>
            <TabsTrigger value="workflow" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">Workflow</TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">General</TabsTrigger>
          </TabsList>

          <TabsContent value="leave-types" className="space-y-6">
            <LeaveTypeSettings />
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <LeavePolicySettings />
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6">
            <ApprovalWorkflowSettings />
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <GeneralLeaveSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
