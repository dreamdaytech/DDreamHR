
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Play, Pause, StopCircle } from "lucide-react";

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  projectId: string;
}

interface TimerData {
  timer: number;
  isRunning: boolean;
  intervalId: number | null;
}

interface ActiveTimersProps {
  activeTimers: Record<string, TimerData>;
  projects: Project[];
  tasks: Task[];
  onStartTimer: (taskId: string) => void;
  onPauseTimer: (taskId: string) => void;
  onResetTimer: (taskId: string) => void;
  formatTime: (seconds: number) => string;
}

export const ActiveTimers: React.FC<ActiveTimersProps> = ({
  activeTimers,
  projects,
  tasks,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  formatTime,
}) => {
  if (Object.keys(activeTimers).length === 0) {
    return null;
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Active Task Timers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(activeTimers).map(([taskId, timerData]) => {
            const taskInfo = tasks.find(t => t.id === taskId);
            const projectInfo = projects.find(p => p.id === taskInfo?.projectId);
            
            return (
              <div key={taskId} className="bg-white p-3 rounded-lg border">
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">{projectInfo?.name}</div>
                  <div className="font-medium">{taskInfo?.name}</div>
                  <div className="text-lg font-mono font-bold text-blue-600">
                    {formatTime(timerData.timer)}
                  </div>
                  <div className="flex gap-1">
                    {timerData.isRunning ? (
                      <Button size="sm" variant="outline" onClick={() => onPauseTimer(taskId)}>
                        <Pause className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => onStartTimer(taskId)}>
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => onResetTimer(taskId)}>
                      <StopCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
