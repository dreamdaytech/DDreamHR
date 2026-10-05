
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, Home, Briefcase } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  branchName?: string;
  type: 'Office' | 'Remote' | 'Branch';
}

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (locationId: string, locationName: string) => void;
  disabled?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onLocationChange,
  disabled = false
}) => {
  const locations: Location[] = [
    {
      id: 'location-1',
      name: 'Main Office',
      branchName: 'Headquarters',
      type: 'Office'
    },
    {
      id: 'location-2',
      name: 'Branch Office A',
      branchName: 'North Branch',
      type: 'Branch'
    },
    {
      id: 'location-3',
      name: 'Branch Office B',
      branchName: 'South Branch',
      type: 'Branch'
    },
    {
      id: 'location-4',
      name: 'Remote Work',
      branchName: 'Work From Home',
      type: 'Remote'
    }
  ];

  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);

  const getLocationDisplay = (location: Location) => {
    return location.branchName 
      ? `${location.name} (${location.branchName})`
      : location.name;
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'Office': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Branch': return 'bg-green-100 text-green-800 border-green-200';
      case 'Remote': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'Office': return <Building className="h-4 w-4" />;
      case 'Branch': return <Briefcase className="h-4 w-4" />;
      case 'Remote': return <Home className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  console.log('LocationSelector - selectedLocation:', selectedLocation);
  console.log('LocationSelector - locations:', locations);

  return (
    <div className="space-y-2">
      <Label htmlFor="location" className="text-sm font-medium text-gray-700">
        Work Location <span className="text-red-500">*</span>
      </Label>
      <Select
        value={selectedLocation || undefined}
        onValueChange={(value) => {
          console.log('LocationSelector - onValueChange called with:', value);
          const location = locations.find(loc => loc.id === value);
          if (location) {
            onLocationChange(value, getLocationDisplay(location));
          }
        }}
        disabled={disabled}
        required
      >
        <SelectTrigger 
          id="location" 
          className={`${!selectedLocation ? 'border-red-200 focus:border-red-500' : 'border-gray-200'}`}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select your work location..." />
          </div>
        </SelectTrigger>
        <SelectContent className="z-50">
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id} className="cursor-pointer">
              <div className="flex items-center justify-between w-full py-1">
                <div className="flex items-center gap-2">
                  {getLocationIcon(location.type)}
                  <span className="font-medium">{getLocationDisplay(location)}</span>
                </div>
                <Badge className={`ml-2 text-xs ${getLocationTypeColor(location.type)}`}>
                  {location.type}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedLocationData && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded-lg">
          {getLocationIcon(selectedLocationData.type)}
          <span className="text-sm text-gray-600">
            Selected: <span className="font-medium">{getLocationDisplay(selectedLocationData)}</span>
          </span>
          <Badge className={`ml-auto ${getLocationTypeColor(selectedLocationData.type)}`}>
            {selectedLocationData.type}
          </Badge>
        </div>
      )}
      
      {!selectedLocation && (
        <p className="text-xs text-red-600 mt-1">
          Location selection is required for check-in
        </p>
      )}
    </div>
  );
};
