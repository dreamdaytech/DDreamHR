
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaveDashboard } from '@/components/leave-tracking/LeaveDashboard';
import { LeaveApplication } from '@/components/leave-tracking/LeaveApplication';
import { LeaveHistory } from '@/components/leave-tracking/LeaveHistory';
import { LeaveCalendar } from '@/components/leave-tracking/LeaveCalendar';
import { LeaveApprovalManager } from '@/components/leave-tracking/LeaveApprovalManager';
import { LeaveSettings } from '@/components/leave-tracking/LeaveSettings';
import { LeaveTypeManager } from '@/components/leave-tracking/components/LeaveTypeManager';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Plus, Calendar, History, Users, Settings } from 'lucide-react';
import { leaveTypes as initialLeaveTypes } from '@/components/leave-tracking/data/leaveTypes';

const LeaveTracking = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leaveTypes, setLeaveTypes] = useState(initialLeaveTypes);

  const isManagerOrAbove = user?.role && ['manager', 'hr', 'admin'].includes(user.role);
  const isAdminOrHR = user?.role && ['hr', 'admin'].includes(user.role);

  const handleNavigateToApply = () => {
    setActiveTab('apply');
  };

  const handleNavigateToCalendar = () => {
    setActiveTab('calendar');
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader title="Leave Tracking" showLogo={false} />
        
        <div className="p-4 space-y-4 pb-24">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="dashboard" className="text-xs data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">
                <div className="flex flex-col items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Overview</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="apply" className="text-xs data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">
                <div className="flex flex-col items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Apply</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">
                <div className="flex flex-col items-center gap-1">
                  <History className="h-4 w-4" />
                  <span>History</span>
                </div>
              </TabsTrigger>
              {isManagerOrAbove && (
                <TabsTrigger value="approvals" className="text-xs data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">
                  <div className="flex flex-col items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Approvals</span>
                  </div>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <LeaveDashboard 
                onNavigateToApply={handleNavigateToApply}
                onNavigateToCalendar={handleNavigateToCalendar}
              />
            </TabsContent>

            <TabsContent value="apply" className="space-y-4">
              <LeaveApplication />
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <LeaveHistory />
            </TabsContent>

            {isManagerOrAbove && (
              <TabsContent value="approvals" className="space-y-4">
                <LeaveApprovalManager />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="container py-6 max-w-full px-0">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-baseline">
          <h1 className="text-2xl font-bold tracking-tight">Leave Tracking</h1>
          <p className="text-muted-foreground">Manage your leave and time off</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full max-w-3xl ${isAdminOrHR ? 'grid-cols-6' : 'grid-cols-5'}`}>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="apply" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">Apply for Leave</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">Calendar</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">History</TabsTrigger>
            {isManagerOrAbove && <TabsTrigger value="approvals" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">Approvals</TabsTrigger>}
            {isAdminOrHR && <TabsTrigger value="settings" className="data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary hover:text-white">Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LeaveDashboard 
                  onNavigateToApply={handleNavigateToApply}
                  onNavigateToCalendar={handleNavigateToCalendar}
                />
              </div>
              <div className="space-y-6">
                <LeaveCalendar />
                {isAdminOrHR && (
                  <LeaveTypeManager 
                    leaveTypes={leaveTypes}
                    onUpdate={setLeaveTypes}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apply" className="space-y-6">
            <LeaveApplication />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <LeaveCalendar />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <LeaveHistory />
          </TabsContent>

          {isManagerOrAbove && (
            <TabsContent value="approvals" className="space-y-6">
              <LeaveApprovalManager />
            </TabsContent>
          )}

          {isAdminOrHR && (
            <TabsContent value="settings" className="space-y-6">
              <LeaveSettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default LeaveTracking;
