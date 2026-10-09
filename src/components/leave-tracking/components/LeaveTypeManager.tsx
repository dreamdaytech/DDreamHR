
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
  EyeOff
} from 'lucide-react';
import { LeaveType } from '../data/leaveTypes';

interface LeaveTypeManagerProps {
  leaveTypes: LeaveType[];
  onUpdate: (leaveTypes: LeaveType[]) => void;
}

export const LeaveTypeManager: React.FC<LeaveTypeManagerProps> = ({
  leaveTypes,
  onUpdate
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<LeaveType | null>(null);
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    balance: 0,
    isPaid: true,
    visibility: 'individual' as 'individual' | 'team',
    description: '',
    active: true
  });

  const resetForm = () => {
    setFormData({
      value: '',
      label: '',
      balance: 0,
      isPaid: true,
      visibility: 'individual',
      description: '',
      active: true
    });
    setEditingType(null);
  };

  const openDialog = (leaveType?: LeaveType) => {
    if (leaveType) {
      setFormData({
        value: leaveType.value,
        label: leaveType.label,
        balance: leaveType.balance,
        isPaid: leaveType.isPaid ?? true,
        visibility: leaveType.visibility ?? 'individual',
        description: leaveType.description ?? '',
        active: leaveType.active ?? true
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

    const newLeaveType: LeaveType = {
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

    onUpdate(updatedTypes);
    setIsDialogOpen(false);
    resetForm();
    
    toast({
      title: editingType ? "Leave Type Updated" : "Leave Type Created",
      description: `${formData.label} has been ${editingType ? 'updated' : 'created'} successfully.`
    });
  };

  const toggleActive = (leaveType: LeaveType) => {
    const updatedTypes = leaveTypes.map(type => 
      type.value === leaveType.value 
        ? { ...type, active: !(type as any).active }
        : type
    );
    onUpdate(updatedTypes);
    
    toast({
      title: "Leave Type Updated",
      description: `${leaveType.label} has been ${(leaveType as any).active ? 'deactivated' : 'activated'}.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Leave Type Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Leave Type
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingType ? 'Edit Leave Type' : 'Add New Leave Type'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="balance">Leave Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={formData.balance}
                    onChange={(e) => setFormData(prev => ({ ...prev, balance: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPaid"
                    checked={formData.isPaid}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPaid: checked }))}
                  />
                  <Label htmlFor="isPaid">Paid Leave</Label>
                </div>

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
      <CardContent>
        <div className="space-y-3">
          {leaveTypes.map((leaveType) => (
            <div key={leaveType.value} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{leaveType.label}</h3>
                  <Badge variant={(leaveType as any).isPaid ? 'default' : 'secondary'}>
                    {(leaveType as any).isPaid ? 'Paid' : 'Unpaid'}
                  </Badge>
                  <Badge variant={(leaveType as any).active ? 'default' : 'destructive'}>
                    {(leaveType as any).active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Balance: {leaveType.balance} days
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActive(leaveType)}
                >
                  {(leaveType as any).active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDialog(leaveType)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
