
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Settings, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2,
  Upload,
  FileText,
  Users,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmployeeSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeSettings = ({ isOpen, onClose }: EmployeeSettingsProps) => {
  const { toast } = useToast();
  const [profileSections, setProfileSections] = useState({
    personalInfo: true,
    contactInfo: true,
    employmentDetails: true,
    documents: true,
    education: true,
    skills: true,
    emergencyContact: true,
    leaveHistory: false,
    timeEntries: false,
  });

  const [departments, setDepartments] = useState([
    { id: 1, name: 'Engineering', employeeCount: 15 },
    { id: 2, name: 'Marketing', employeeCount: 8 },
    { id: 3, name: 'Finance', employeeCount: 6 },
    { id: 4, name: 'Product', employeeCount: 10 },
    { id: 5, name: 'Sales', employeeCount: 12 },
    { id: 6, name: 'Customer Support', employeeCount: 7 },
    { id: 7, name: 'Human Resources', employeeCount: 4 },
  ]);

  const [newDepartment, setNewDepartment] = useState('');
  const [hrPolicies, setHrPolicies] = useState([
    { id: 1, name: 'Employee Handbook', type: 'PDF', uploadDate: '2024-01-15' },
    { id: 2, name: 'Code of Conduct', type: 'PDF', uploadDate: '2024-01-15' },
    { id: 3, name: 'Remote Work Policy', type: 'PDF', uploadDate: '2024-02-01' },
  ]);

  const [editPermissions, setEditPermissions] = useState({
    employeesCanEditPersonal: true,
    employeesCanEditContact: true,
    employeesCanEditEmergency: true,
    requireApprovalForChanges: false,
  });

  const handleSectionToggle = (section: string) => {
    setProfileSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      const newDept = {
        id: Date.now(),
        name: newDepartment.trim(),
        employeeCount: 0
      };
      setDepartments([...departments, newDept]);
      setNewDepartment('');
      toast({
        title: "Department added",
        description: `${newDept.name} has been added successfully`
      });
    }
  };

  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter(dept => dept.id !== id));
    toast({
      title: "Department deleted",
      description: "Department has been removed successfully"
    });
  };

  const handleUploadPolicy = () => {
    toast({
      title: "Policy uploaded",
      description: "HR policy document has been uploaded successfully"
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Employee directory settings have been updated successfully"
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-center items-start overflow-y-auto pt-4">
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-background rounded-lg shadow-lg border">
          <div className="p-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold flex items-center">
                  <Settings className="mr-2 h-6 w-6" />
                  Employee Directory Settings
                </h2>
                <p className="text-muted-foreground">Configure employee profile sections, departments, and permissions</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Profile Section Visibility */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    Profile Section Visibility
                  </CardTitle>
                  <CardDescription>
                    Control which sections are visible in employee profiles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(profileSections).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="text-sm font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={() => handleSectionToggle(key)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Department Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Department Management
                  </CardTitle>
                  <CardDescription>
                    Add, edit, or remove departments in your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Add New Department */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter department name"
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddDepartment()}
                      />
                      <Button onClick={handleAddDepartment}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>

                    {/* Department List */}
                    <div className="space-y-2">
                      {departments.map((dept) => (
                        <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{dept.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {dept.employeeCount} employees
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDepartment(dept.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Edit Permissions
                  </CardTitle>
                  <CardDescription>
                    Control what employees can edit in their profiles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(editPermissions).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="text-sm font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => 
                            setEditPermissions(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* HR Policies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    HR Policies & Documents
                  </CardTitle>
                  <CardDescription>
                    Manage company policies and employee-related documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={handleUploadPolicy} className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Policy Document
                    </Button>

                    <div className="space-y-2">
                      {hrPolicies.map((policy) => (
                        <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{policy.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Uploaded: {policy.uploadDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">{policy.type}</Badge>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-2 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSettings;
