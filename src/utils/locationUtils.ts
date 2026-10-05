
// Haversine formula to calculate distance between two points
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  
  return d; // distance in meters
};

// Function to get the client's location (mock for development)
export const getClientLocation = async (): Promise<{ lat: number; lng: number } | null> => {
  // In a real app, this would use the Geolocation API
  return { lat: 40.7128, lng: -74.006 };
};

// Function to get the client's IP address (mock for development)
export const getClientIpAddress = async (): Promise<string> => {
  // In a real app, this would be an API call or use a third-party service
  return '192.168.1.1';
};
