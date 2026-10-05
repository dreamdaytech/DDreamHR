
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Puzzle, Clock, Calendar, Users, BarChart3, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ModulesFeatureSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [modules, setModules] = useState([
    { 
      id: 'attendance', 
      name: 'Attendance Management', 
      icon: Clock, 
      enabled: true, 
      description: 'Track employee check-ins, check-outs, and attendance reports',
      features: ['Check-in/out', 'Break tracking', 'Location validation', 'Reports']
    },
    { 
      id: 'leave', 
      name: 'Leave Tracking', 
      icon: Calendar, 
      enabled: true, 
      description: 'Manage leave requests, approvals, and leave balances',
      features: ['Leave applications', 'Approval workflow', 'Balance tracking', 'Calendar view']
    },
    { 
      id: 'time_tracking', 
      name: 'Time Tracking', 
      icon: Clock, 
      enabled: true, 
      description: 'Project time tracking and timesheet management',
      features: ['Project timers', 'Timesheets', 'Task tracking', 'Billing']
    },
    { 
      id: 'employees', 
      name: 'Employee Management', 
      icon: Users, 
      enabled: true, 
      description: 'Employee directory and profile management',
      features: ['Employee directory', 'Profile management', 'Department structure', 'Org chart']
    },
    { 
      id: 'reports', 
      name: 'Reports & Analytics', 
      icon: BarChart3, 
      enabled: true, 
      description: 'Generate reports and analytics dashboards',
      features: ['Attendance reports', 'Performance analytics', 'Custom reports', 'Data export']
    },
    { 
      id: 'performance', 
      name: 'Performance Management', 
      icon: BarChart3, 
      enabled: false, 
      description: 'Employee performance reviews and goal tracking',
      features: ['Performance reviews', 'Goal setting', '360 feedback', 'Evaluations']
    }
  ]);

  const [departmentAccess, setDepartmentAccess] = useState({
    'Engineering': ['attendance', 'leave', 'time_tracking', 'reports'],
    'HR': ['attendance', 'leave', 'employees', 'reports', 'performance'],
    'Sales': ['attendance', 'leave', 'reports'],
    'Finance': ['attendance', 'reports']
  });

  const handleModuleToggle = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, enabled: !module.enabled }
        : module
    ));
  };

  const handleSave = () => {
    toast({
      title: "Module Settings Updated",
      description: "Module and feature settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-secondary" />
            Module Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-3">Available Modules</h3>
            <p className="text-sm text-muted-foreground mb-4">Enable or disable modules for your organization</p>
          </div>
          <div className="space-y-4">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <div key={module.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mt-1">
                        <IconComponent className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{module.name}</span>
                          <Badge variant={module.enabled ? "default" : "secondary"}>
                            {module.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {module.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Switch 
                      checked={module.enabled}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Department Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-secondary" />
            Department Access Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-3">Module Access by Department</h3>
            <p className="text-sm text-muted-foreground mb-4">Configure which modules each department can access</p>
          </div>
          <div className="space-y-4">
            {Object.entries(departmentAccess).map(([department, accessModules]) => (
              <div key={department} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{department}</span>
                  <Button variant="outline" size="sm" className="hover:bg-secondary hover:text-white">
                    Configure
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {accessModules.map((moduleId) => {
                    const module = modules.find(m => m.id === moduleId);
                    return module ? (
                      <Badge key={moduleId} variant="outline" className="text-xs">
                        {module.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Feature Toggles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Mobile App Support</Label>
                <p className="text-sm text-muted-foreground">Enable mobile application features</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Offline Mode</Label>
                <p className="text-sm text-muted-foreground">Allow offline functionality where possible</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Advanced Analytics</Label>
                <p className="text-sm text-muted-foreground">Enable advanced reporting and analytics features</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>API Access</Label>
                <p className="text-sm text-muted-foreground">Allow external API integrations</p>
              </div>
              <Switch />
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
