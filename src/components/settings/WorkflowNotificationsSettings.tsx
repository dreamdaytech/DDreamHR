
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Mail, Workflow, Save, Plus, Edit, Settings2, RotateCcw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowNotificationsSettingsProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

interface WorkflowType {
  id: string;
  name: string;
  steps: string[];
  enabled: boolean;
  description?: string;
}

interface NotificationRule {
  id: string;
  type: string;
  email: boolean;
  inApp: boolean;
  sms: boolean;
  roles: string[];
  triggers: string[];
}

export const WorkflowNotificationsSettings: React.FC<WorkflowNotificationsSettingsProps> = ({ onUnsavedChanges }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowType | null>(null);
  const [editingNotification, setEditingNotification] = useState<NotificationRule | null>(null);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    smsNotifications: false,
    digestFrequency: 'daily'
  });

  const [originalSettings] = useState({ ...settings });

  const [workflows, setWorkflows] = useState<WorkflowType[]>([
    { 
      id: 'leave_approval', 
      name: 'Leave Approval', 
      steps: ['Manager', 'HR'], 
      enabled: true,
      description: 'Multi-step approval process for employee leave requests'
    },
    { 
      id: 'time_approval', 
      name: 'Time Tracking Approval', 
      steps: ['Manager'], 
      enabled: true,
      description: 'Approval workflow for timesheet submissions'
    },
    { 
      id: 'expense_approval', 
      name: 'Expense Approval', 
      steps: ['Manager', 'Finance'], 
      enabled: false,
      description: 'Multi-level approval for expense reports'
    },
    { 
      id: 'onboarding', 
      name: 'Employee Onboarding', 
      steps: ['HR', 'IT', 'Manager'], 
      enabled: true,
      description: 'Comprehensive onboarding workflow for new employees'
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationRule[]>([
    { 
      id: 'leave_request', 
      type: 'Leave Request', 
      email: true, 
      inApp: true, 
      sms: false, 
      roles: ['Manager', 'HR'],
      triggers: ['submitted', 'approved', 'rejected']
    },
    { 
      id: 'attendance_alert', 
      type: 'Attendance Alert', 
      email: true, 
      inApp: true, 
      sms: false, 
      roles: ['HR'],
      triggers: ['late_checkin', 'missed_checkout', 'overtime']
    },
    { 
      id: 'payroll_reminder', 
      type: 'Payroll Reminder', 
      email: true, 
      inApp: false, 
      sms: false, 
      roles: ['Finance'],
      triggers: ['monthly', 'quarterly']
    },
    { 
      id: 'birthday_reminder', 
      type: 'Birthday Reminder', 
      email: false, 
      inApp: true, 
      sms: false, 
      roles: ['HR'],
      triggers: ['daily_check']
    }
  ]);

  const availableRoles = ['Manager', 'HR', 'Finance', 'IT', 'Admin', 'Employee'];
  const availableSteps = ['Manager', 'HR', 'Finance', 'IT', 'Admin', 'CEO', 'Department Head'];

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  React.useEffect(() => {
    onUnsavedChanges?.(hasChanges);
  }, [hasChanges, onUnsavedChanges]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving workflow and notification settings:', settings);
      console.log('Saving workflows:', workflows);
      console.log('Saving notifications:', notifications);
      
      toast({
        title: "Notifications Updated Successfully",
        description: "Workflow and notification settings have been saved successfully.",
      });
      
      onUnsavedChanges?.(false);
    } catch (error) {
      toast({
        title: "Error Saving Settings",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkflowToggle = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, enabled: !workflow.enabled }
        : workflow
    ));
    
    const workflow = workflows.find(w => w.id === workflowId);
    toast({
      title: `Workflow ${workflow?.enabled ? 'Disabled' : 'Enabled'}`,
      description: `${workflow?.name} has been ${workflow?.enabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleNotificationToggle = (notificationId: string, field: 'email' | 'inApp' | 'sms') => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, [field]: !notification[field] }
        : notification
    ));
  };

  const handleEditWorkflow = (workflow: WorkflowType) => {
    setEditingWorkflow({ ...workflow });
    setShowWorkflowDialog(true);
  };

  const handleCreateWorkflow = () => {
    setEditingWorkflow({
      id: '',
      name: '',
      steps: [],
      enabled: true,
      description: ''
    });
    setShowWorkflowDialog(true);
  };

  const handleSaveWorkflow = () => {
    if (!editingWorkflow?.name.trim()) {
      toast({
        title: "Invalid Workflow Name",
        description: "Please enter a valid workflow name.",
        variant: "destructive",
      });
      return;
    }

    if (editingWorkflow.steps.length === 0) {
      toast({
        title: "No Steps Defined",
        description: "Please add at least one step to the workflow.",
        variant: "destructive",
      });
      return;
    }

    if (editingWorkflow.id) {
      setWorkflows(prev => prev.map(workflow => 
        workflow.id === editingWorkflow.id ? editingWorkflow : workflow
      ));
      toast({
        title: "Workflow Updated",
        description: `Workflow "${editingWorkflow.name}" has been updated successfully.`,
      });
    } else {
      const newWorkflow = {
        ...editingWorkflow,
        id: editingWorkflow.name.toLowerCase().replace(/\s+/g, '_')
      };
      setWorkflows(prev => [...prev, newWorkflow]);
      toast({
        title: "Workflow Created",
        description: `Workflow "${editingWorkflow.name}" has been created successfully.`,
      });
    }

    setShowWorkflowDialog(false);
    setEditingWorkflow(null);
  };

  const handleEditNotification = (notification: NotificationRule) => {
    setEditingNotification({ ...notification });
    setShowNotificationDialog(true);
  };

  const handleCreateNotification = () => {
    setEditingNotification({
      id: '',
      type: '',
      email: true,
      inApp: true,
      sms: false,
      roles: [],
      triggers: []
    });
    setShowNotificationDialog(true);
  };

  const handleSaveNotification = () => {
    if (!editingNotification?.type.trim()) {
      toast({
        title: "Invalid Notification Type",
        description: "Please enter a valid notification type.",
        variant: "destructive",
      });
      return;
    }

    if (editingNotification.roles.length === 0) {
      toast({
        title: "No Roles Selected",
        description: "Please select at least one role for this notification.",
        variant: "destructive",
      });
      return;
    }

    if (editingNotification.id) {
      setNotifications(prev => prev.map(notification => 
        notification.id === editingNotification.id ? editingNotification : notification
      ));
      toast({
        title: "Notification Updated",
        description: `Notification rule "${editingNotification.type}" has been updated successfully.`,
      });
    } else {
      const newNotification = {
        ...editingNotification,
        id: editingNotification.type.toLowerCase().replace(/\s+/g, '_')
      };
      setNotifications(prev => [...prev, newNotification]);
      toast({
        title: "Notification Created",
        description: `Notification rule "${editingNotification.type}" has been created successfully.`,
      });
    }

    setShowNotificationDialog(false);
    setEditingNotification(null);
  };

  const addWorkflowStep = () => {
    if (!editingWorkflow) return;
    setEditingWorkflow(prev => prev ? { ...prev, steps: [...prev.steps, ''] } : null);
  };

  const updateWorkflowStep = (index: number, value: string) => {
    if (!editingWorkflow) return;
    setEditingWorkflow(prev => {
      if (!prev) return prev;
      const newSteps = [...prev.steps];
      newSteps[index] = value;
      return { ...prev, steps: newSteps };
    });
  };

  const removeWorkflowStep = (index: number) => {
    if (!editingWorkflow) return;
    setEditingWorkflow(prev => {
      if (!prev) return prev;
      return { ...prev, steps: prev.steps.filter((_, i) => i !== index) };
    });
  };

  const handleReset = () => {
    const confirmed = window.confirm('Are you sure you want to reset all settings to their original values?');
    if (confirmed) {
      setSettings({ ...originalSettings });
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to their original values.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-secondary" />
            Global Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send notifications via email</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications in the application</p>
                </div>
                <Switch 
                  checked={settings.inAppNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, inAppNotifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                </div>
                <Switch 
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="digestFrequency">Digest Frequency</Label>
              <Select value={settings.digestFrequency} onValueChange={(value) => setSettings({...settings, digestFrequency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-secondary" />
            Approval Workflows
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Workflow Configuration</h3>
              <p className="text-sm text-muted-foreground">Set up approval workflows for different processes</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleCreateWorkflow}
              className="hover:bg-secondary hover:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Workflow
            </Button>
          </div>
          <div className="space-y-3">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={workflow.enabled} 
                    onCheckedChange={() => handleWorkflowToggle(workflow.id)}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{workflow.name}</span>
                      <Badge variant={workflow.enabled ? "default" : "secondary"}>
                        {workflow.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {workflow.steps.map((step, index) => (
                        <React.Fragment key={step}>
                          <Badge variant="outline" className="text-xs">{step}</Badge>
                          {index < workflow.steps.length - 1 && <span className="text-xs text-muted-foreground">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEditWorkflow(workflow)}
                  className="hover:bg-secondary hover:text-white"
                >
                  <Settings2 className="h-4 w-4 mr-1" />
                  Configure
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-secondary" />
            Notification Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Active Notification Rules</h3>
              <p className="text-sm text-muted-foreground">Configure notification preferences for different events</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleCreateNotification}
              className="hover:bg-secondary hover:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="font-medium">{notification.type}</span>
                    <div className="flex gap-1 mt-1">
                      {notification.roles.map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span>Email:</span>
                      <Switch 
                        checked={notification.email} 
                        onCheckedChange={() => handleNotificationToggle(notification.id, 'email')}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span>App:</span>
                      <Switch 
                        checked={notification.inApp} 
                        onCheckedChange={() => handleNotificationToggle(notification.id, 'inApp')}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span>SMS:</span>
                      <Switch 
                        checked={notification.sms} 
                        onCheckedChange={() => handleNotificationToggle(notification.id, 'sms')}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditNotification(notification)}
                    className="hover:bg-secondary hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Dialog */}
      <Dialog open={showWorkflowDialog} onOpenChange={setShowWorkflowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingWorkflow?.id ? 'Edit Workflow' : 'Create New Workflow'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="workflowName">Workflow Name</Label>
              <Input
                id="workflowName"
                value={editingWorkflow?.name || ''}
                onChange={(e) => setEditingWorkflow(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Enter workflow name"
              />
            </div>
            
            <div>
              <Label htmlFor="workflowDescription">Description</Label>
              <Textarea
                id="workflowDescription"
                value={editingWorkflow?.description || ''}
                onChange={(e) => setEditingWorkflow(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="Enter workflow description"
                rows={2}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Approval Steps</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addWorkflowStep}
                  className="hover:bg-secondary hover:text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-2">
                {editingWorkflow?.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-8">#{index + 1}</span>
                    <Select 
                      value={step} 
                      onValueChange={(value) => updateWorkflowStep(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select approver role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSteps.map(stepOption => (
                          <SelectItem key={stepOption} value={stepOption}>
                            {stepOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeWorkflowStep(index)}
                      className="hover:bg-destructive hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowWorkflowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveWorkflow} className="bg-primary hover:bg-primary/90">
                {editingWorkflow?.id ? 'Update Workflow' : 'Create Workflow'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingNotification?.id ? 'Edit Notification Rule' : 'Create New Notification Rule'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notificationType">Notification Type</Label>
              <Input
                id="notificationType"
                value={editingNotification?.type || ''}
                onChange={(e) => setEditingNotification(prev => prev ? { ...prev, type: e.target.value } : null)}
                placeholder="Enter notification type"
              />
            </div>

            <div>
              <Label>Notification Methods</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <Switch 
                    checked={editingNotification?.email || false}
                    onCheckedChange={(checked) => setEditingNotification(prev => prev ? { ...prev, email: checked } : null)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>In-App Notifications</span>
                  <Switch 
                    checked={editingNotification?.inApp || false}
                    onCheckedChange={(checked) => setEditingNotification(prev => prev ? { ...prev, inApp: checked } : null)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Notifications</span>
                  <Switch 
                    checked={editingNotification?.sms || false}
                    onCheckedChange={(checked) => setEditingNotification(prev => prev ? { ...prev, sms: checked } : null)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Target Roles</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableRoles.map(role => (
                  <div key={role} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`role-${role}`}
                      checked={editingNotification?.roles.includes(role) || false}
                      onChange={(e) => {
                        if (!editingNotification) return;
                        const roles = e.target.checked 
                          ? [...editingNotification.roles, role]
                          : editingNotification.roles.filter(r => r !== role);
                        setEditingNotification({ ...editingNotification, roles });
                      }}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`role-${role}`} className="text-sm">
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotification} className="bg-primary hover:bg-primary/90">
                {editingNotification?.id ? 'Update Rule' : 'Create Rule'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={isLoading}
          className="hover:bg-destructive hover:text-white"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isLoading || !hasChanges}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
