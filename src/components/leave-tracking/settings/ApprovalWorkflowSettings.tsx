
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Save, Plus, Trash2 } from 'lucide-react';

export const ApprovalWorkflowSettings: React.FC = () => {
  const { toast } = useToast();
  const [workflowSettings, setWorkflowSettings] = useState({
    enableWorkflow: true,
    defaultApprovalLevels: 1,
    autoApprovalThreshold: 1,
    enableAutoApproval: false,
    enableEscalation: true,
    escalationTimeoutHours: 48,
    enableNotifications: true,
    reminderFrequencyHours: 24
  });

  const [approvalLevels, setApprovalLevels] = useState([
    { id: 1, name: 'Line Manager', role: 'manager', required: true },
    { id: 2, name: 'HR Department', role: 'hr', required: false }
  ]);

  const handleSave = () => {
    toast({
      title: "Workflow Settings Saved",
      description: "Approval workflow settings have been updated successfully."
    });
  };

  const handleSettingChange = (key: string, value: any) => {
    setWorkflowSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addApprovalLevel = () => {
    const newLevel = {
      id: Date.now(),
      name: 'New Approval Level',
      role: 'manager',
      required: true
    };
    setApprovalLevels([...approvalLevels, newLevel]);
  };

  const removeApprovalLevel = (id: number) => {
    setApprovalLevels(approvalLevels.filter(level => level.id !== id));
  };

  const updateApprovalLevel = (id: number, field: string, value: any) => {
    setApprovalLevels(approvalLevels.map(level => 
      level.id === id ? { ...level, [field]: value } : level
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Approval Workflow Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Workflow */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enableWorkflow"
              checked={workflowSettings.enableWorkflow}
              onCheckedChange={(checked) => handleSettingChange('enableWorkflow', checked)}
            />
            <Label htmlFor="enableWorkflow">Enable approval workflow for leave requests</Label>
          </div>
        </div>

        {workflowSettings.enableWorkflow && (
          <>
            {/* Approval Levels */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Approval Levels</h3>
                <Button variant="outline" size="sm" onClick={addApprovalLevel}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Level
                </Button>
              </div>
              
              <div className="space-y-3">
                {approvalLevels.map((level, index) => (
                  <div key={level.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Badge variant="outline">Level {index + 1}</Badge>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Level Name</Label>
                        <Input
                          value={level.name}
                          onChange={(e) => updateApprovalLevel(level.id, 'name', e.target.value)}
                          placeholder="e.g., Line Manager"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Role Required</Label>
                        <Select 
                          value={level.role} 
                          onValueChange={(value) => updateApprovalLevel(level.id, 'role', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={level.required}
                          onCheckedChange={(checked) => updateApprovalLevel(level.id, 'required', checked)}
                        />
                        <Label>Required</Label>
                      </div>
                    </div>
                    
                    {approvalLevels.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeApprovalLevel(level.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Auto Approval */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Auto Approval Rules</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoApproval"
                    checked={workflowSettings.enableAutoApproval}
                    onCheckedChange={(checked) => handleSettingChange('enableAutoApproval', checked)}
                  />
                  <Label htmlFor="autoApproval">Enable auto-approval for short leave requests</Label>
                </div>
                
                {workflowSettings.enableAutoApproval && (
                  <div className="space-y-2">
                    <Label htmlFor="autoThreshold">Auto-approve leaves up to (days)</Label>
                    <Input
                      id="autoThreshold"
                      type="number"
                      value={workflowSettings.autoApprovalThreshold}
                      onChange={(e) => handleSettingChange('autoApprovalThreshold', parseInt(e.target.value) || 0)}
                      className="max-w-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Escalation Rules */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Escalation Rules</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="escalation"
                    checked={workflowSettings.enableEscalation}
                    onCheckedChange={(checked) => handleSettingChange('enableEscalation', checked)}
                  />
                  <Label htmlFor="escalation">Enable escalation for overdue approvals</Label>
                </div>
                
                {workflowSettings.enableEscalation && (
                  <div className="space-y-2">
                    <Label htmlFor="escalationTimeout">Escalate after (hours)</Label>
                    <Input
                      id="escalationTimeout"
                      type="number"
                      value={workflowSettings.escalationTimeoutHours}
                      onChange={(e) => handleSettingChange('escalationTimeoutHours', parseInt(e.target.value) || 0)}
                      className="max-w-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={workflowSettings.enableNotifications}
                    onCheckedChange={(checked) => handleSettingChange('enableNotifications', checked)}
                  />
                  <Label htmlFor="notifications">Send email notifications for pending approvals</Label>
                </div>
                
                {workflowSettings.enableNotifications && (
                  <div className="space-y-2">
                    <Label htmlFor="reminderFreq">Reminder frequency (hours)</Label>
                    <Input
                      id="reminderFreq"
                      type="number"
                      value={workflowSettings.reminderFrequencyHours}
                      onChange={(e) => handleSettingChange('reminderFrequencyHours', parseInt(e.target.value) || 0)}
                      className="max-w-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="pt-4">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Workflow Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
