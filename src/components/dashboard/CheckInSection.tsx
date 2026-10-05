import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAttendance } from '@/context/AttendanceContext';
import { useToast } from '@/hooks/use-toast';
import { LocationSelector } from '@/components/attendance/check-in/LocationSelector';
import { BreakButtons } from '@/components/attendance/check-in/BreakButtons';
import { Clock, LogIn, LogOut, AlertTriangle, Coffee, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { BreakRecord } from '@/types/attendance';

export const CheckInSection: React.FC = () => {
  const { isCheckedIn, isOnBreak, currentBreak, todayAttendance, checkIn, checkOut, startBreak, endBreak } = useAttendance();
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
      toast({ title: 'Location Required', description: 'Please select your work location to proceed with check-in.', variant: 'destructive' });
      return;
    }
    setIsChecking(true);
    try {
      const success = await checkIn(selectedLocationName);
      if (success) {
        toast({ title: 'Checked in successfully', description: `Location: ${selectedLocationName}` });
        setSelectedLocation('');
        setSelectedLocationName('');
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheckOut = async () => {
    setIsChecking(true);
    try { await checkOut(); } finally { setIsChecking(false); }
  };

  const handleStartBreak = async (type: BreakRecord['type'], isPaid: boolean): Promise<boolean> => {
    setIsChecking(true);
    try { return await startBreak(type, isPaid); } finally { setIsChecking(false); }
  };

  const handleEndBreak = async () => {
    if (!currentBreak) return;
    setIsChecking(true);
    try { await endBreak(currentBreak.id); } finally { setIsChecking(false); }
  };

  const getAttendanceStatus = () => {
    if (isOnBreak) return { status: 'On Break', className: 'border-amber-500/30 bg-amber-500/10 text-amber-500', icon: Coffee };
    if (isCheckedIn) return { status: 'Checked In', className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500', icon: CheckCircle };
    return { status: 'Not Checked In', className: 'border-red-500/30 bg-red-500/10 text-red-500', icon: Clock };
  };

  const attendanceStatus = getAttendanceStatus();
  const StatusIcon = attendanceStatus.icon;

  return (
    <Card className="border-border bg-card text-card-foreground shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Clock className="h-5 w-5 text-secondary" />
          Attendance Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="mb-1 text-3xl font-bold text-foreground">{format(new Date(), 'hh:mm a')}</div>
          <div className="text-sm text-muted-foreground">{format(new Date(), 'EEEE, MMMM d, yyyy')}</div>
        </div>

        <div className="flex items-center justify-center">
          <Badge variant="outline" className={`${attendanceStatus.className} flex items-center gap-2 px-3 py-1`}>
            <StatusIcon className="h-4 w-4" />
            {attendanceStatus.status}
          </Badge>
        </div>

        {todayAttendance && (
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-foreground">
            <div className="mb-2 text-sm font-medium">Today's Record</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Check In</span>
                <div className="font-medium">{todayAttendance.checkIn || '--'}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Check Out</span>
                <div className="font-medium">{todayAttendance.checkOut || '--'}</div>
              </div>
            </div>
          </div>
        )}

        {!isCheckedIn && (
          <div className="space-y-2">
            <LocationSelector selectedLocation={selectedLocation} onLocationChange={handleLocationChange} disabled={isChecking} />
            {showLocationError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Location selection is required for check-in</AlertDescription>
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

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={handleCheckIn} disabled={isCheckedIn || isChecking || (!selectedLocation && !isCheckedIn)}>
            <LogIn className="mr-2 h-4 w-4" />
            Check In
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleCheckOut} disabled={!isCheckedIn || isOnBreak || isChecking}>
            <LogOut className="mr-2 h-4 w-4" />
            Check Out
          </Button>
        </div>

        {isCheckedIn && (
          <BreakButtons isCheckedIn={isCheckedIn} isOnBreak={isOnBreak} isChecking={isChecking} handleEndBreak={handleEndBreak} handleStartBreak={handleStartBreak} />
        )}
      </CardContent>
    </Card>
  );
};
