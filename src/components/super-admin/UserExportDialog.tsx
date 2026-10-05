
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

interface UserExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserExportDialog: React.FC<UserExportDialogProps> = ({ open, onOpenChange }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeFields, setIncludeFields] = useState({
    basicInfo: true,
    contact: true,
    business: true,
    role: true,
    status: true,
    activity: false,
    permissions: false
  });
  const [filterBy, setFilterBy] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const exportFields = [
    { key: 'basicInfo', label: 'Basic Information (Name, Email)', required: true },
    { key: 'contact', label: 'Contact Information' },
    { key: 'business', label: 'Business Assignment' },
    { key: 'role', label: 'Role & Permissions' },
    { key: 'status', label: 'Account Status' },
    { key: 'activity', label: 'Activity Data (Logins, Last Seen)' },
    { key: 'permissions', label: 'Detailed Permissions' }
  ];

  const handleExport = async () => {
    setIsLoading(true);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const filename = `users_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      
      toast({
        title: "Export completed",
        description: `User data exported to ${filename}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export user data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleField = (field: string) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Users
          </DialogTitle>
          <DialogDescription>
            Export user data with customizable fields and filters
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV (Excel Compatible)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  JSON (Raw Data)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Filter Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Filter Users</Label>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active Users Only</SelectItem>
                <SelectItem value="inactive">Inactive Users Only</SelectItem>
                <SelectItem value="admins">Admin Users Only</SelectItem>
                <SelectItem value="employees">Employees Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Include Fields */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Include Fields</Label>
            <div className="space-y-2">
              {exportFields.map((field) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={includeFields[field.key as keyof typeof includeFields]}
                    onCheckedChange={() => toggleField(field.key)}
                    disabled={field.required}
                  />
                  <Label 
                    htmlFor={field.key} 
                    className={`text-sm ${field.required ? 'text-gray-500' : ''}`}
                  >
                    {field.label}
                    {field.required && ' (Required)'}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm">
              <p className="font-medium mb-1">Export Summary:</p>
              <p>• Format: {exportFormat.toUpperCase()}</p>
              <p>• Filter: {filterBy}</p>
              <p>• Fields: {Object.values(includeFields).filter(Boolean).length} selected</p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isLoading}>
              {isLoading ? (
                <>Exporting...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserExportDialog;
