
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  Eye,
  EyeOff,
  Palette
} from 'lucide-react';
import { LeaveType } from '../data/leaveTypes';

type ManagedLeaveType = LeaveType & {
  color: string; visibility: string; carryForward?: boolean; maxCarryForward?: number; noticePeriodDays?: number;
};

const colorOptions = [
  { value: 'bg-blue-500', label: 'Blue', color: '#3B82F6' },
  { value: 'bg-green-500', label: 'Green', color: '#10B981' },
  { value: 'bg-purple-500', label: 'Purple', color: '#8B5CF6' },
  { value: 'bg-pink-500', label: 'Pink', color: '#EC4899' },
  { value: 'bg-orange-500', label: 'Orange', color: '#F97316' },
  { value: 'bg-red-500', label: 'Red', color: '#EF4444' },
  { value: 'bg-yellow-500', label: 'Yellow', color: '#EAB308' },
  { value: 'bg-indigo-500', label: 'Indigo', color: '#6366F1' },
];

const roleOptions = [
  { value: 'all', label: 'All Employees' },
  { value: 'admin', label: 'Admin Only' },
  { value: 'hr', label: 'HR Only' },
  { value: 'manager', label: 'Managers Only' },
  { value: 'employee', label: 'Regular Employees' },
];

export const LeaveTypeSettings: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<ManagedLeaveType | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<ManagedLeaveType[]>([
    { value: 'annual', label: 'Annual Leave', balance: 25, color: 'bg-blue-500', isPaid: true, visibility: 'all', description: 'Standard annual vacation leave', active: true },
    { value: 'sick', label: 'Sick Leave', balance: 10, color: 'bg-red-500', isPaid: true, visibility: 'all', description: 'Medical leave for illness', active: true },
    { value: 'personal', label: 'Personal Leave', balance: 5, color: 'bg-purple-500', isPaid: false, visibility: 'all', description: 'Personal time off', active: true },
    { value: 'maternity', label: 'Maternity Leave', balance: 120, color: 'bg-pink-500', isPaid: true, visibility: 'all', description: 'Maternity leave for new mothers', active: true },
  ]);

  const [formData, setFormData] = useState({
    value: '',
    label: '',
    balance: 0,
    color: 'bg-blue-500',
    isPaid: true,
    visibility: 'all',
    description: '',
    active: true,
    carryForward: false,
    maxCarryForward: 0,
    noticePeriodDays: 1
  });

  const resetForm = () => {
    setFormData({
      value: '',
      label: '',
      balance: 0,
      color: 'bg-blue-500',
      isPaid: true,
      visibility: 'all',
      description: '',
      active: true,
      carryForward: false,
      maxCarryForward: 0,
      noticePeriodDays: 1
    });
    setEditingType(null);
  };

  const openDialog = (leaveType?: ManagedLeaveType) => {
    if (leaveType) {
      setFormData({
        value: leaveType.value,
        label: leaveType.label,
        balance: leaveType.balance,
        color: leaveType.color || 'bg-blue-500',
        isPaid: leaveType.isPaid ?? true,
        visibility: leaveType.visibility || 'all',
        description: leaveType.description || '',
        active: leaveType.active ?? true,
        carryForward: leaveType.carryForward ?? false,
        maxCarryForward: leaveType.maxCarryForward ?? 0,
        noticePeriodDays: leaveType.noticePeriodDays ?? 1
      });
      setEditingType(leaveType);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label || !formData.value) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newLeaveType = {
      ...formData,
      value: formData.value.toLowerCase().replace(/\s+/g, '-')
    };

    let updatedTypes;
    if (editingType) {
      updatedTypes = leaveTypes.map(type => 
        type.value === editingType.value ? newLeaveType : type
      );
    } else {
      updatedTypes = [...leaveTypes, newLeaveType];
    }

    setLeaveTypes(updatedTypes);
    setIsDialogOpen(false);
    resetForm();
    
    toast({
      title: editingType ? "Leave Type Updated" : "Leave Type Created",
      description: `${formData.label} has been ${editingType ? 'updated' : 'created'} successfully.`
    });
  };

  const toggleActive = (leaveType: ManagedLeaveType) => {
    const updatedTypes = leaveTypes.map(type => 
      type.value === leaveType.value 
        ? { ...type, active: !type.active }
        : type
    );
    setLeaveTypes(updatedTypes);
    
    toast({
      title: "Leave Type Updated",
      description: `${leaveType.label} has been ${leaveType.active ? 'deactivated' : 'activated'}.`
    });
  };

  const deleteLeaveType = (leaveType: ManagedLeaveType) => {
    const updatedTypes = leaveTypes.filter(type => type.value !== leaveType.value);
    setLeaveTypes(updatedTypes);
    
    toast({
      title: "Leave Type Deleted",
      description: `${leaveType.label} has been deleted successfully.`
    });
  };

  return (
    <Card className={isMobile ? "shadow-none border-0" : ""}>
      <CardHeader className={isMobile ? "px-0 pb-4" : ""}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            Leave Type Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()} size={isMobile ? "sm" : "default"}>
                <Plus className="mr-2 h-4 w-4" />
                {isMobile ? "Add" : "Add Leave Type"}
              </Button>
            </DialogTrigger>
            <DialogContent className={`${isMobile ? "max-w-[95vw] max-h-[90vh]" : "max-w-lg max-h-[90vh]"} overflow-y-auto`}>
              <DialogHeader>
                <DialogTitle>
                  {editingType ? 'Edit Leave Type' : 'Add New Leave Type'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  <div className="space-y-2">
                    <Label htmlFor="label">Leave Type Name *</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="e.g., Annual Leave"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Leave Type Code *</Label>
                    <Input
                      id="value"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="e.g., annual"
                    />
                  </div>
                </div>

                <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  <div className="space-y-2">
                    <Label htmlFor="balance">Annual Allocation (Days)</Label>
                    <Input
                      id="balance"
                      type="number"
                      value={formData.balance}
                      onChange={(e) => setFormData(prev => ({ ...prev, balance: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="noticePeriod">Notice Period (Days)</Label>
                    <Input
                      id="noticePeriod"
                      type="number"
                      value={formData.noticePeriodDays}
                      onChange={(e) => setFormData(prev => ({ ...prev, noticePeriodDays: parseInt(e.target.value) || 1 }))}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color Theme</Label>
                  <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${color.value}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={formData.visibility} onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPaid"
                      checked={formData.isPaid}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPaid: checked }))}
                    />
                    <Label htmlFor="isPaid">Paid Leave</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="carryForward"
                      checked={formData.carryForward}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, carryForward: checked }))}
                    />
                    <Label htmlFor="carryForward">Allow Carry Forward</Label>
                  </div>
                </div>

                {formData.carryForward && (
                  <div className="space-y-2">
                    <Label htmlFor="maxCarryForward">Max Carry Forward (Days)</Label>
                    <Input
                      id="maxCarryForward"
                      type="number"
                      value={formData.maxCarryForward}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxCarryForward: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingType ? 'Update' : 'Create'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className={isMobile ? "px-0" : ""}>
        <div className="space-y-3">
          {leaveTypes.map((leaveType) => (
            <div key={leaveType.value} className={`flex items-center justify-between p-4 border rounded-lg ${isMobile ? "flex-col space-y-3" : ""}`}>
              <div className={`flex items-center gap-3 ${isMobile ? "w-full" : ""}`}>
                <div className={`w-4 h-4 rounded-full ${leaveType.color}`} />
                <div className="space-y-1 flex-1">
                  <div className={`flex items-center gap-2 ${isMobile ? "flex-wrap" : ""}`}>
                    <h3 className="font-medium">{leaveType.label}</h3>
                    <Badge variant={leaveType.isPaid ? 'default' : 'secondary'} className="text-xs">
                      {leaveType.isPaid ? 'Paid' : 'Unpaid'}
                    </Badge>
                    <Badge variant={leaveType.active ? 'default' : 'destructive'} className="text-xs">
                      {leaveType.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {leaveType.balance} days • {roleOptions.find(r => r.value === leaveType.visibility)?.label}
                  </p>
                  {leaveType.description && (
                    <p className="text-xs text-muted-foreground">{leaveType.description}</p>
                  )}
                </div>
              </div>
              <div className={`flex items-center gap-1 ${isMobile ? "w-full justify-end" : ""}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActive(leaveType)}
                  className={isMobile ? "h-9 px-3" : ""}
                >
                  {leaveType.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDialog(leaveType)}
                  className={isMobile ? "h-9 px-3" : ""}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteLeaveType(leaveType)}
                  className={isMobile ? "h-9 px-3" : ""}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
