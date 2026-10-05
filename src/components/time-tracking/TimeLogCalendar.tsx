
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

// Mock data for time logs
const mockTimeLogsCalendar = [
  {
    date: new Date(2025, 4, 20),
    logs: [
      { project: "DreamDay Website Redesign", duration: "2h 15m" },
      { project: "Mobile App Development", duration: "1h 30m" }
    ],
    totalHours: 3.75
  },
  {
    date: new Date(2025, 4, 19),
    logs: [
      { project: "Internal HR Portal", duration: "3h 45m" },
      { project: "DreamDay Website Redesign", duration: "4h 00m" }
    ],
    totalHours: 7.75
  },
  {
    date: new Date(2025, 4, 18),
    logs: [
      { project: "Mobile App Development", duration: "2h 45m" }
    ],
    totalHours: 2.75
  }
];

const TimeLogCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Find time logs for selected date
  const selectedDateLogs = selectedDate ? 
    mockTimeLogsCalendar.find(logDay => 
      logDay.date.toDateString() === selectedDate.toDateString()
    ) : null;

  // Determine if a date has time logs
  const hasTimeLogs = (date: Date) => {
    return mockTimeLogsCalendar.some(log => 
      log.date.toDateString() === date.toDateString()
    );
  };

  // Custom day rendering to show time logged indicator
  const renderDay = (day: Date) => {
    const dateLog = mockTimeLogsCalendar.find(
      log => log.date.toDateString() === day.toDateString()
    );
    
    if (dateLog) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {day.getDate()}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-1">
            <Badge variant="outline" className="h-1 w-1 p-0 rounded-full bg-primary border-none" />
          </div>
          <span className="absolute bottom-0 text-[9px] text-muted-foreground">{dateLog.totalHours}h</span>
        </div>
      );
    }
    
    return day.getDate();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={date => {
              setDate(date);
              setSelectedDate(date);
            }}
            className="border rounded-md p-3 pointer-events-auto"
            components={{
              Day: ({ date, ...dayProps }) => (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className={`w-9 h-9 rounded-md flex items-center justify-center text-sm p-0 
                        ${hasTimeLogs(date) ? "font-medium" : ""} 
                        ${date.toDateString() === (selectedDate?.toDateString() || '') ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {renderDay(date)}
                    </button>
                  </DialogTrigger>
                  {hasTimeLogs(date) && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Time Logs for {format(date, 'MMMM d, yyyy')}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 space-y-2">
                        {mockTimeLogsCalendar
                          .find(log => log.date.toDateString() === date.toDateString())?.logs
                          .map((log, index) => (
                            <Card key={index} className="bg-muted/30">
                              <CardContent className="p-3">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{log.project}</span>
                                  <Badge>{log.duration}</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        }
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              ),
            }}
          />
        </div>

        <div className="w-full md:w-1/2 lg:w-2/3">
          {selectedDate && selectedDateLogs ? (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  Time Logs for {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <div className="space-y-3">
                  {selectedDateLogs.logs.map((log, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span>{log.project}</span>
                      <Badge className="ml-2 bg-primary">{log.duration}</Badge>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <Badge className="bg-accent-500">{selectedDateLogs.totalHours}h</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                <p className="text-muted-foreground">
                  Select a date to view time logs
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeLogCalendar;
