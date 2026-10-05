
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAttendance } from '@/context/AttendanceContext';
import { useToast } from '@/hooks/use-toast';
import { LocationSelector } from '@/components/attendance/check-in/LocationSelector';
import { BreakButtons } from '@/components/attendance/check-in/BreakButtons';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  AlertTriangle, 
  Coffee,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { BreakRecord } from '@/types/attendance';

export const CheckInSection: React.FC = () => {
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
    if (showLocationError) {
      setShowLocationError(false);
    }
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

  const handleStartBreak = async (type: BreakRecord['type'], isPaid: boolean): Promise<boolean> => {
    setIsChecking(true);
    try {
      return await startBreak(type, isPaid);
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

  const getCurrentTime = () => {
    return format(new Date(), 'hh:mm a');
  };

  const getCurrentDate = () => {
    return format(new Date(), 'EEEE, MMMM d, yyyy');
  };

  const getAttendanceStatus = () => {
    if (isOnBreak) return { status: 'On Break', color: 'bg-yellow-100 text-yellow-800', icon: Coffee };
    if (isCheckedIn) return { status: 'Checked In', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    return { status: 'Not Checked In', color: 'bg-red-100 text-red-800', icon: Clock };
  };

  const attendanceStatus = getAttendanceStatus();
  const StatusIcon = attendanceStatus.icon;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg border-blue-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Attendance Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-900 mb-1">
            {getCurrentTime()}
          </div>
          <div className="text-sm text-gray-600">
            {getCurrentDate()}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center">
          <Badge className={`${attendanceStatus.color} flex items-center gap-2 px-3 py-1`}>
            <StatusIcon className="h-4 w-4" />
            {attendanceStatus.status}
          </Badge>
        </div>

        {/* Today's Record */}
        {todayAttendance && (
          <div className="bg-white/70 p-3 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-2">Today's Record</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Check In</span>
                <div className="font-medium">{todayAttendance.checkIn || '--'}</div>
              </div>
              <div>
                <span className="text-gray-500">Check Out</span>
                <div className="font-medium">{todayAttendance.checkOut || '--'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Location Selection - Show only if not checked in */}
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
                  Location selection is required for check-in
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

        {/* Check In/Out Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="default" 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            onClick={handleCheckIn} 
            disabled={isCheckedIn || isChecking || (!selectedLocation && !isCheckedIn)}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Check In
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleCheckOut}
            disabled={!isCheckedIn || isOnBreak || isChecking}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Check Out
          </Button>
        </div>

        {/* Break Management - Only show if checked in */}
        {isCheckedIn && (
          <BreakButtons
            isCheckedIn={isCheckedIn}
            isOnBreak={isOnBreak}
            isChecking={isChecking}
            handleEndBreak={handleEndBreak}
            handleStartBreak={handleStartBreak}
          />
        )}
      </CardContent>
    </Card>
  );
};
