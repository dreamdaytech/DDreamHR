
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationManagement } from './LocationManagement';
import { PolicySettings } from './PolicySettings';
import { NotificationSettings } from './NotificationSettings';
import { useAuth } from '@/context/AuthContext';

export const AttendanceSettingsPanel: React.FC = () => {
  const { user } = useAuth();
  const isAdminOrHR = user && ['admin', 'hr'].includes(user.role);

  if (!isAdminOrHR) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            Only Admin and HR users can access attendance settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Settings</h1>
        <p className="text-muted-foreground">
          Configure attendance policies, locations, and notifications
        </p>
      </div>

      <Tabs defaultValue="locations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="locations">Business Locations</TabsTrigger>
          <TabsTrigger value="policies">Attendance Policies</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="locations" className="mt-6">
          <LocationManagement />
        </TabsContent>

        <TabsContent value="policies" className="mt-6">
          <PolicySettings />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
