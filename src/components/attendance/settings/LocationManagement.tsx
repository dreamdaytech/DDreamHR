
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface BusinessLocation {
  id: string;
  name: string;
  branchName?: string;
  type: 'Office' | 'Remote' | 'Branch';
  address?: string;
  notes?: string;
  active: boolean;
}

export const LocationManagement: React.FC = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<BusinessLocation[]>([
    {
      id: '1',
      name: 'Main Office',
      branchName: 'Headquarters',
      type: 'Office',
      address: '123 Business Street, City, State',
      notes: 'Primary office location',
      active: true
    },
    {
      id: '2',
      name: 'Branch Office A',
      branchName: 'North Branch',
      type: 'Branch',
      address: '456 North Ave, City, State',
      notes: 'North side branch office',
      active: true
    },
    {
      id: '3',
      name: 'Remote Work',
      type: 'Remote',
      notes: 'For employees working from home',
      active: true
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<BusinessLocation | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    branchName: '',
    type: 'Office' as 'Office' | 'Remote' | 'Branch',
    address: '',
    notes: ''
  });

  const handleSaveLocation = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Location name is required",
        variant: "destructive"
      });
      return;
    }

    const newLocation: BusinessLocation = {
      id: editingLocation?.id || Date.now().toString(),
      name: formData.name,
      branchName: formData.branchName || undefined,
      type: formData.type,
      address: formData.address || undefined,
      notes: formData.notes || undefined,
      active: true
    };

    if (editingLocation) {
      setLocations(prev => prev.map(loc => loc.id === editingLocation.id ? newLocation : loc));
      toast({
        title: "Location Updated",
        description: "Business location has been updated successfully"
      });
    } else {
      setLocations(prev => [...prev, newLocation]);
      toast({
        title: "Location Added",
        description: "New business location has been added successfully"
      });
    }

    setIsDialogOpen(false);
    setEditingLocation(null);
    setFormData({ name: '', branchName: '', type: 'Office', address: '', notes: '' });
  };

  const handleEditLocation = (location: BusinessLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      branchName: location.branchName || '',
      type: location.type,
      address: location.address || '',
      notes: location.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
    toast({
      title: "Location Deleted",
      description: "Business location has been removed"
    });
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'Office': return 'bg-blue-100 text-blue-800';
      case 'Branch': return 'bg-green-100 text-green-800';
      case 'Remote': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Business Locations</CardTitle>
            <CardDescription>
              Manage business locations where employees can check in
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>
                  {editingLocation ? 'Edit Location' : 'Add New Location'}
                </DialogTitle>
                <DialogDescription>
                  Configure a business location for employee check-ins
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Main Office"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input
                      id="branchName"
                      value={formData.branchName}
                      onChange={(e) => setFormData(prev => ({ ...prev, branchName: e.target.value }))}
                      placeholder="e.g., Headquarters"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Location Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'Office' | 'Remote' | 'Branch') => 
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Branch">Branch</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Full address (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes (optional)"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveLocation}>
                    {editingLocation ? 'Update' : 'Add'} Location
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-blue-100">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{location.name}</h4>
                    {location.branchName && (
                      <span className="text-sm text-muted-foreground">
                        ({location.branchName})
                      </span>
                    )}
                    <Badge className={getLocationTypeColor(location.type)}>
                      {location.type}
                    </Badge>
                  </div>
                  {location.address && (
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                  )}
                  {location.notes && (
                    <p className="text-sm text-muted-foreground italic">{location.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditLocation(location)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteLocation(location.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {locations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No locations configured. Add your first business location to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
