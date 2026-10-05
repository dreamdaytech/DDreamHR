
import { useToast } from '@/hooks/use-toast';
import { AttendanceSettings } from '@/types/attendance';
import { getClientIpAddress, getClientLocation, calculateDistance } from '@/utils/locationUtils';

export function useLocationCheck(attendanceSettings: AttendanceSettings) {
  const { toast } = useToast();

  // Function to check if the client's IP is allowed
  const isIpAllowed = async (): Promise<boolean> => {
    if (!attendanceSettings.allowedIpAddresses.length) return true;
    
    const clientIp = await getClientIpAddress();
    
    // Simple wildcard matching (e.g., 192.168.1.*)
    return attendanceSettings.allowedIpAddresses.some(allowedIp => {
      if (allowedIp.endsWith('*')) {
        const prefix = allowedIp.slice(0, -1);
        return clientIp.startsWith(prefix);
      }
      return allowedIp === clientIp;
    });
  };

  // Function to check if the client's location is within geofence
  const isLocationAllowed = async (): Promise<boolean> => {
    if (!attendanceSettings.geoFencingEnabled) return true;
    
    const clientLocation = await getClientLocation();
    if (!clientLocation) return false;
    
    // Check if within radius of any allowed location
    return attendanceSettings.geoFencingLocations.some(loc => {
      const distance = calculateDistance(
        clientLocation.lat, clientLocation.lng,
        loc.lat, loc.lng
      );
      return distance <= attendanceSettings.geoFencingRadius;
    });
  };

  // Get nearest office location name
  const getNearestLocationName = async (): Promise<string> => {
    const clientLocation = await getClientLocation();
    if (!clientLocation) return 'Unknown';

    let locationName = 'Unknown';
    if (clientLocation) {
      const nearestLocation = attendanceSettings.geoFencingLocations.find(loc => {
        const distance = calculateDistance(
          clientLocation.lat, clientLocation.lng,
          loc.lat, loc.lng
        );
        return distance <= attendanceSettings.geoFencingRadius;
      });
      
      if (nearestLocation) {
        locationName = nearestLocation.name;
      }
    }

    return locationName;
  };

  // Validate location for check-in/check-out
  const validateLocation = async (forCheckIn: boolean = true): Promise<boolean> => {
    // Check IP restrictions
    const ipAllowed = await isIpAllowed();
    if (!ipAllowed) {
      toast({
        title: "IP restriction",
        description: `You are not allowed to ${forCheckIn ? 'check in' : 'check out'} from this IP address`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check geofencing
    const locationAllowed = await isLocationAllowed();
    if (!locationAllowed) {
      toast({
        title: "Location restriction",
        description: `You are not within the allowed vicinity to ${forCheckIn ? 'check in' : 'check out'}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    isIpAllowed,
    isLocationAllowed,
    getNearestLocationName,
    validateLocation
  };
}
