
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Users, Lock, Save, UserPlus, Edit, Trash2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessPermissionsSettingsProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

interface Role {
  id: string;
  name: string;
  users: number;
  permissions: string[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const AccessPermissionsSettings: React.FC<AccessPermissionsSettingsProps> = ({ onUnsavedChanges }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    passwordMinLength: 8,
    sessionTimeout: 480,
    twoFactorRequired: false,
    allowSelfRegistration: false,
    defaultRole: 'employee',
    maxLoginAttempts: 5,
    lockoutDuration: 30
  });

  const [originalSettings] = useState({ ...settings });
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  const [roles, setRoles] = useState<Role[]>([
    { id: 'admin', name: 'Administrator', users: 2, permissions: ['all_access', 'user_management', 'system_settings'] },
    { id: 'hr', name: 'HR Manager', users: 5, permissions: ['employee_management', 'attendance_view', 'leave_approval', 'reports_view'] },
    { id: 'manager', name: 'Manager', users: 12, permissions: ['team_view', 'attendance_view', 'leave_approval', 'reports_view'] },
    { id: 'employee', name: 'Employee', users: 45, permissions: ['self_view', 'time_tracking', 'leave_request'] }
  ]);

  const availablePermissions: Permission[] = [
    { id: 'all_access', name: 'Full System Access', description: 'Complete access to all features', category: 'System' },
    { id: 'user_management', name: 'User Management', description: 'Create, edit, and delete users', category: 'Users' },
    { id: 'system_settings', name: 'System Settings', description: 'Access to system configuration', category: 'System' },
    { id: 'employee_management', name: 'Employee Management', description: 'Manage employee profiles and data', category: 'HR' },
    { id: 'attendance_view', name: 'View Attendance', description: 'View attendance records', category: 'Attendance' },
    { id: 'leave_approval', name: 'Leave Approval', description: 'Approve or reject leave requests', category: 'Leave' },
    { id: 'reports_view', name: 'View Reports', description: 'Access to reports and analytics', category: 'Reports' },
    { id: 'team_view', name: 'Team Management', description: 'View and manage team members', category: 'Team' },
    { id: 'self_view', name: 'Self Service', description: 'View own profile and data', category: 'Personal' },
    { id: 'time_tracking', name: 'Time Tracking', description: 'Track time and manage timesheets', category: 'Time' },
    { id: 'leave_request', name: 'Leave Requests', description: 'Submit leave requests', category: 'Leave' }
  ];

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  React.useEffect(() => {
    onUnsavedChanges?.(hasChanges);
  }, [hasChanges, onUnsavedChanges]);

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving access permissions:', settings);
      console.log('Saving roles:', roles);
      
      toast({
        title: "Permissions Updated Successfully",
        description: "Access and permissions settings have been saved successfully.",
      });
      
      onUnsavedChanges?.(false);
    } catch (error) {
      toast({
        title: "Error Saving Permissions",
        description: "There was an error saving your permissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  const handleEditRole = (role: Role) => {
    setEditingRole({ ...role });
    setShowRoleDialog(true);
  };

  const handleCreateRole = () => {
    setEditingRole({
      id: '',
      name: '',
      users: 0,
      permissions: []
    });
    setShowRoleDialog(true);
  };

  const handleSaveRole = () => {
    if (!editingRole?.name.trim()) {
      toast({
        title: "Invalid Role Name",
        description: "Please enter a valid role name.",
        variant: "destructive",
      });
      return;
    }

    if (editingRole.permissions.length === 0) {
      toast({
        title: "No Permissions Selected",
        description: "Please select at least one permission for this role.",
        variant: "destructive",
      });
      return;
    }

    if (editingRole.id) {
      // Update existing role
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id ? editingRole : role
      ));
      toast({
        title: "Role Updated",
        description: `Role "${editingRole.name}" has been updated successfully.`,
      });
    } else {
      // Create new role
      const newRole = {
        ...editingRole,
        id: editingRole.name.toLowerCase().replace(/\s+/g, '_'),
        users: 0
      };
      setRoles(prev => [...prev, newRole]);
      toast({
        title: "Role Created",
        description: `Role "${editingRole.name}" has been created successfully.`,
      });
    }

    setShowRoleDialog(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    if (role.users > 0) {
      toast({
        title: "Cannot Delete Role",
        description: `This role has ${role.users} users assigned. Please reassign users before deleting.`,
        variant: "destructive",
      });
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete the role "${role.name}"?`);
    if (confirmed) {
      setRoles(prev => prev.filter(r => r.id !== roleId));
      toast({
        title: "Role Deleted",
        description: `Role "${role.name}" has been deleted successfully.`,
      });
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (!editingRole) return;
    
    setEditingRole(prev => {
      if (!prev) return prev;
      
      const hasPermission = prev.permissions.includes(permissionId);
      return {
        ...prev,
        permissions: hasPermission 
          ? prev.permissions.filter(p => p !== permissionId)
          : [...prev.permissions, permissionId]
      };
    });
  };

  const getPermissionName = (permissionId: string) => {
    return availablePermissions.find(p => p.id === permissionId)?.name || permissionId;
  };

  return (
    <div className="space-y-6">
      {/* Role Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-secondary" />
            Role Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">System Roles</h3>
              <p className="text-sm text-muted-foreground">Manage user roles and permissions</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleCreateRole}
              className="hover:bg-secondary hover:text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{role.name}</span>
                      <Badge variant="secondary">{role.users} users</Badge>
                    </div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {getPermissionName(permission)}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditRole(role)}
                    className="hover:bg-secondary hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {role.id !== 'admin' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteRole(role.id)}
                      className="hover:bg-destructive hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-secondary" />
            Security Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
              <Input
                id="passwordMinLength"
                type="number"
                min="4"
                max="50"
                value={settings.passwordMinLength}
                onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value) || 8)}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="30"
                max="1440"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value) || 480)}
              />
            </div>
            <div>
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min="3"
                max="10"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value) || 5)}
              />
            </div>
            <div>
              <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                min="5"
                max="1440"
                value={settings.lockoutDuration}
                onChange={(e) => handleInputChange('lockoutDuration', parseInt(e.target.value) || 30)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
              </div>
              <Switch 
                checked={settings.twoFactorRequired}
                onCheckedChange={(checked) => handleInputChange('twoFactorRequired', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Self Registration</Label>
                <p className="text-sm text-muted-foreground">Allow users to create their own accounts</p>
              </div>
              <Switch 
                checked={settings.allowSelfRegistration}
                onCheckedChange={(checked) => handleInputChange('allowSelfRegistration', checked)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="defaultRole">Default Role for New Users</Label>
            <Select value={settings.defaultRole} onValueChange={(value) => handleInputChange('defaultRole', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.filter(role => role.id !== 'admin').map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRole?.id ? 'Edit Role' : 'Create New Role'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={editingRole?.name || ''}
                onChange={(e) => setEditingRole(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Enter role name"
              />
            </div>
            
            <div>
              <Label>Permissions</Label>
              <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {Object.entries(
                  availablePermissions.reduce((acc, permission) => {
                    if (!acc[permission.category]) acc[permission.category] = [];
                    acc[permission.category].push(permission);
                    return acc;
                  }, {} as Record<string, Permission[]>)
                ).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">{category}</h4>
                    <div className="space-y-2 ml-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={editingRole?.permissions.includes(permission.id) || false}
                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {permission.name}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRole} className="bg-primary hover:bg-primary/90">
                {editingRole?.id ? 'Update Role' : 'Create Role'}
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
