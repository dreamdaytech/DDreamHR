
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, StopCircle, Clock } from "lucide-react";

interface TimerControlsProps {
  timer: number;
  isTracking: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onContinue: () => void;
  onStop: () => void;
  onReset: () => void;
  formatTime: (seconds: number) => string;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  timer,
  isTracking,
  isPaused,
  onStart,
  onPause,
  onContinue,
  onStop,
  onReset,
  formatTime,
}) => {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="flex flex-col items-center justify-center">
          <div className="text-2xl sm:text-3xl font-mono font-bold mb-4">
            {formatTime(timer)}
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            {!isTracking && !isPaused && (
              <Button 
                type="button"
                onClick={onStart}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            )}

            {isTracking && (
              <Button 
                type="button"
                onClick={onPause}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}

            {isPaused && (
              <Button 
                type="button"
                onClick={onContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Continue
              </Button>
            )}

            {(isTracking || isPaused) && (
              <Button 
                type="button"
                variant="destructive" 
                onClick={onStop}
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}

            <Button 
              type="button"
              variant="outline" 
              onClick={onReset}
              disabled={timer === 0}
            >
              <Clock className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {isPaused && (
            <p className="text-sm text-yellow-600 mt-2">Timer is paused</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
