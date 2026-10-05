
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendance } from '@/context/AttendanceContext';
import { useToast } from '@/hooks/use-toast';
import { ClockDisplay } from './check-in/ClockDisplay';
import { AttendanceStatus } from './check-in/AttendanceStatus';
import { CheckInOutButtons } from './check-in/CheckInOutButtons';
import { BreakButtons } from './check-in/BreakButtons';
import { LocationSelector } from './check-in/LocationSelector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const AttendanceCheckInOut = () => {
  const { 
    isCheckedIn,
    isOnBreak,
    currentBreak,
    todayAttendance,
    checkIn,
    checkOut,
    startBreak,
    endBreak
  } = useAttendance();
  
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLocationName, setSelectedLocationName] = useState('');
  const [showLocationError, setShowLocationError] = useState(false);
  
  console.log('AttendanceCheckInOut - selectedLocation:', selectedLocation);
  console.log('AttendanceCheckInOut - selectedLocationName:', selectedLocationName);
  console.log('AttendanceCheckInOut - isCheckedIn:', isCheckedIn);
  
  const handleLocationChange = (locationId: string, locationName: string) => {
    console.log('handleLocationChange called with:', { locationId, locationName });
    setSelectedLocation(locationId);
    setSelectedLocationName(locationName);
    if (showLocationError) {
      setShowLocationError(false);
    }
  };

  const handleCheckIn = async () => {
    console.log('handleCheckIn called');
    console.log('Current selectedLocation:', selectedLocation);
    console.log('Current selectedLocationName:', selectedLocationName);
    
    // Validate location selection before check-in
    if (!selectedLocation || !selectedLocationName) {
      setShowLocationError(true);
      toast({
        title: "Location Required",
        description: "Please select your work location to proceed with check-in.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    try {
      // Pass location information to check-in
      const success = await checkIn(selectedLocationName);
      if (success) {
        toast({
          title: "Checked in successfully",
          description: `Location: ${selectedLocationName}`,
        });
        // Clear location selection after successful check-in
        setSelectedLocation('');
        setSelectedLocationName('');
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheckOut = async () => {
    setIsChecking(true);
    try {
      await checkOut();
    } finally {
      setIsChecking(false);
    }
  };

  const handleStartBreak = async (breakType: any, isPaidBreak: boolean) => {
    setIsChecking(true);
    try {
      return await startBreak(breakType, isPaidBreak);
    } finally {
      setIsChecking(false);
    }
  };

  const handleEndBreak = async () => {
    if (!currentBreak) return;
    
    setIsChecking(true);
    try {
      await endBreak(currentBreak.id);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Attendance Check-In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ClockDisplay />
        
        <AttendanceStatus 
          isCheckedIn={isCheckedIn}
          isOnBreak={isOnBreak}
          todayAttendance={todayAttendance}
        />

        {/* Location Selection - Show beneath status and only if not checked in */}
        {!isCheckedIn && (
          <div className="space-y-2">
            <LocationSelector
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
              disabled={isChecking}
            />
            
            {/* Location Selection Error */}
            {showLocationError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please select your work location to proceed with check-in.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Show current location if checked in */}
        {isCheckedIn && todayAttendance?.location && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">Current Location</p>
            <p className="text-sm text-blue-700">{todayAttendance.location}</p>
          </div>
        )}
        
        <CheckInOutButtons
          isCheckedIn={isCheckedIn}
          isOnBreak={isOnBreak}
          isChecking={isChecking}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
          hasLocationSelected={!!selectedLocation}
        />
        
        <BreakButtons 
          isCheckedIn={isCheckedIn}
          isOnBreak={isOnBreak}
          isChecking={isChecking}
          handleEndBreak={handleEndBreak}
          handleStartBreak={handleStartBreak}
        />
      </CardContent>
    </Card>
  );
};
