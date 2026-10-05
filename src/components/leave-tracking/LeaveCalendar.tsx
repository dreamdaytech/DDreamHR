
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Building
} from 'lucide-react';

export const LeaveCalendar = () => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'personal' | 'team' | 'company'>('personal');

  const leaveEvents = [
    {
      date: '2024-12-23',
      type: 'personal',
      title: 'Your Annual Leave',
      duration: '5 days',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      date: '2024-12-25',
      type: 'company',
      title: 'Christmas Day',
      duration: 'Company Holiday',
      color: 'bg-red-100 text-red-800'
    },
    {
      date: '2024-12-26',
      type: 'company',
      title: 'Boxing Day',
      duration: 'Company Holiday',
      color: 'bg-red-100 text-red-800'
    },
    {
      date: '2024-12-30',
      type: 'team',
      title: 'John Doe - Sick Leave',
      duration: '1 day',
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  const getFilteredEvents = () => {
    return leaveEvents.filter(event => {
      if (viewMode === 'personal') return event.type === 'personal';
      if (viewMode === 'team') return event.type === 'team' || event.type === 'personal';
      return true; // company view shows all
    });
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return getFilteredEvents().filter(event => event.date === dateStr);
  };

  return (
    <Card className={isMobile ? 'w-full' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Leave Calendar
          </CardTitle>
          {!isMobile && (
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'personal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('personal')}
              >
                Personal
              </Button>
              <Button
                variant={viewMode === 'team' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('team')}
              >
                <Users className="mr-1 h-4 w-4" />
                Team
              </Button>
              <Button
                variant={viewMode === 'company' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('company')}
              >
                <Building className="mr-1 h-4 w-4" />
                Company
              </Button>
            </div>
          )}
        </div>
        
        {isMobile && (
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'personal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('personal')}
            >
              Personal
            </Button>
            <Button
              variant={viewMode === 'team' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('team')}
            >
              Team
            </Button>
            <Button
              variant={viewMode === 'company' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('company')}
            >
              Company
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            hasLeave: (date) => getEventsForDate(date).length > 0
          }}
          modifiersStyles={{
            hasLeave: { 
              backgroundColor: 'rgb(239 246 255)', 
              color: 'rgb(29 78 216)',
              fontWeight: 'bold'
            }
          }}
        />

        {/* Legend */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-sm">Personal Leave</span>
            </div>
            {viewMode !== 'personal' && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className="text-sm">Team Leave</span>
              </div>
            )}
            {viewMode === 'company' && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-sm">Company Holiday</span>
              </div>
            )}
          </div>
        </div>

        {/* Events for selected date */}
        {selectedDate && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">
              Events on {selectedDate.toLocaleDateString()}
            </h4>
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-2">
                {getEventsForDate(selectedDate).map((event, index) => (
                  <div key={index} className="p-2 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{event.title}</span>
                      <Badge className={event.color}>
                        {event.duration}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No events on this date</p>
            )}
          </div>
        )}

        {/* Upcoming events */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Upcoming Events</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {getFilteredEvents().slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="space-y-1">
                  <span className="text-sm font-medium">{event.title}</span>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
                <Badge className={event.color} variant="secondary">
                  {event.duration}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
