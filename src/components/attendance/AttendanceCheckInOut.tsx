
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

  const handleLocationChange = (locationId: string, locationName: string) => {
    setSelectedLocation(locationId);
    setSelectedLocationName(locationName);
    if (showLocationError) setShowLocationError(false);
  };

  const handleCheckIn = async () => {
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
      const success = await checkIn(selectedLocationName);
      if (success) {
        toast({
          title: "Checked in successfully",
          description: `Location: ${selectedLocationName}`,
        });
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
    <Card className="border-border bg-card text-card-foreground shadow-md">
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

        {!isCheckedIn && (
          <div className="space-y-2">
            <LocationSelector
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
              disabled={isChecking}
            />

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

        {isCheckedIn && todayAttendance?.location && (
          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="text-sm font-medium text-foreground">Current Location</p>
            <p className="text-sm text-muted-foreground">{todayAttendance.location}</p>
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
