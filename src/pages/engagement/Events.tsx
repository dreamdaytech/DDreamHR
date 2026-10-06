import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Clock, Plus, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { readDemoData, writeDemoData } from '@/lib/demoStore';

type EventItem = {
  id: number;
  title: string;
  description: string;
  type: string;
  startDate: string;
  startTime: string;
  endTime: string;
  location: string;
  isVirtual: boolean;
  organizer: string;
  maxParticipants: number | null;
  registeredCount: number;
  registrationRequired: boolean;
  registeredUserIds: string[];
};

const seedEvents: EventItem[] = [
  { id: 1, title: 'October All-Hands Meeting', description: 'Company update covering goals, achievements, and upcoming initiatives.', type: 'meeting', startDate: '2026-10-09', startTime: '10:00', endTime: '11:30', location: 'Main Conference Room', isVirtual: false, organizer: 'Sarah Johnson', maxParticipants: 50, registeredCount: 42, registrationRequired: true, registeredUserIds: [] },
  { id: 2, title: 'Team Building Workshop', description: 'A practical collaboration and problem-solving session.', type: 'team_building', startDate: '2026-10-14', startTime: '14:00', endTime: '16:00', location: 'Training Room', isVirtual: false, organizer: 'Mike Chen', maxParticipants: 24, registeredCount: 18, registrationRequired: true, registeredUserIds: [] },
  { id: 3, title: 'Wellness Workshop', description: 'Interactive session on stress management and maintaining work-life balance.', type: 'training', startDate: '2026-10-20', startTime: '13:00', endTime: '14:30', location: 'Virtual Meeting Room', isVirtual: true, organizer: 'People Team', maxParticipants: null, registeredCount: 67, registrationRequired: true, registeredUserIds: [] },
  { id: 4, title: 'Friday Social', description: 'Informal gathering to unwind and connect with colleagues.', type: 'social', startDate: '2026-10-23', startTime: '17:00', endTime: '19:00', location: 'Office Lounge', isVirtual: false, organizer: 'Culture Committee', maxParticipants: null, registeredCount: 34, registrationRequired: false, registeredUserIds: [] },
];

const Events = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState<EventItem[]>(() => readDemoData<EventItem[]>('engagement-events', seedEvents));
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', description: '', type: 'meeting', startDate: '', startTime: '09:00', endTime: '10:00', location: '', isVirtual: false });

  const persist = (next: EventItem[]) => {
    setEvents(next);
    writeDemoData('engagement-events', next);
  };

  const register = (id: number) => {
    const userId = user?.id || 'demo-user';
    const event = events.find((item) => item.id === id);
    if (!event || event.registeredUserIds.includes(userId)) return;
    if (event.maxParticipants && event.registeredCount >= event.maxParticipants) {
      toast({ title: 'Event is full', description: 'No registration spaces remain.', variant: 'destructive' });
      return;
    }
    persist(events.map((item) => item.id === id ? { ...item, registeredCount: item.registeredCount + 1, registeredUserIds: [...item.registeredUserIds, userId] } : item));
    toast({ title: 'Registration confirmed', description: event.title });
  };

  const createEvent = () => {
    if (!draft.title.trim() || !draft.startDate || !draft.location.trim()) {
      toast({ title: 'Complete the event', description: 'Title, date and location are required.', variant: 'destructive' });
      return;
    }
    const created: EventItem = {
      id: Date.now(),
      ...draft,
      organizer: user?.name || 'Demo User',
      maxParticipants: null,
      registeredCount: 0,
      registrationRequired: true,
      registeredUserIds: [],
    };
    persist([created, ...events]);
    setCreateOpen(false);
    setDraft({ title: '', description: '', type: 'meeting', startDate: '', startTime: '09:00', endTime: '10:00', location: '', isVirtual: false });
    setActiveTab('upcoming');
    toast({ title: 'Event created', description: created.title });
  };

  const today = new Date().toISOString().split('T')[0];
  const visibleEvents = useMemo(() => {
    if (activeTab === 'past') return events.filter((event) => event.startDate < today);
    if (activeTab === 'my-events') {
      const userId = user?.id || 'demo-user';
      return events.filter((event) => event.registeredUserIds.includes(userId));
    }
    return events.filter((event) => event.startDate >= today);
  }, [activeTab, events, today, user?.id]);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-3xl font-bold">Events & Activities</h1><p className="mt-2 text-muted-foreground">Discover and participate in company events and team activities</p></div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4" />Create Event</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Upcoming Events</p><p className="text-2xl font-bold">{events.filter((event) => event.startDate >= today).length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">My registrations</p><p className="text-2xl font-bold">{events.filter((event) => event.registeredUserIds.includes(user?.id || 'demo-user')).length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total registrations</p><p className="text-2xl font-bold">{events.reduce((sum, event) => sum + event.registeredCount, 0)}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Virtual events</p><p className="text-2xl font-bold">{events.filter((event) => event.isVirtual && event.startDate >= today).length}</p></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="upcoming">Upcoming Events</TabsTrigger><TabsTrigger value="my-events">My Events</TabsTrigger><TabsTrigger value="past">Past Events</TabsTrigger></TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {visibleEvents.map((event) => {
              const registered = event.registeredUserIds.includes(user?.id || 'demo-user');
              return (
                <Card key={event.id}>
                  <CardHeader><CardTitle className="text-lg">{event.title}</CardTitle><CardDescription>{event.description}</CardDescription></CardHeader>
                  <CardContent className="space-y-4">
                    <Badge variant="outline">{event.type.replace('_', ' ')}</Badge>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{event.startDate}</div>
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" />{event.startTime}–{event.endTime}</div>
                      <div className="flex items-center gap-2">{event.isVirtual ? <Video className="h-4 w-4 text-muted-foreground" /> : <MapPin className="h-4 w-4 text-muted-foreground" />}{event.isVirtual ? 'Virtual' : event.location}</div>
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{event.registeredCount}{event.maxParticipants ? ` / ${event.maxParticipants}` : ''}</div>
                    </div>
                    <div className="flex gap-2 border-t pt-3">
                      <Button variant="outline" size="sm" onClick={() => setSelected(event)}>View Details</Button>
                      {event.registrationRequired && event.startDate >= today && (
                        <Button size="sm" disabled={registered} onClick={() => register(event.id)}>{registered ? 'Registered' : 'Register'}</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {visibleEvents.length === 0 && <Card className="md:col-span-2"><CardContent className="p-8 text-center text-muted-foreground">No events in this section.</CardContent></Card>}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create event</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2"><Label htmlFor="event-title">Title</Label><Input id="event-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="event-description">Description</Label><Textarea id="event-description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Type</Label><Select value={draft.type} onValueChange={(type) => setDraft({ ...draft, type })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="meeting">Meeting</SelectItem><SelectItem value="training">Training</SelectItem><SelectItem value="team_building">Team building</SelectItem><SelectItem value="social">Social</SelectItem></SelectContent></Select></div>
            <div className="grid gap-2"><Label htmlFor="event-date">Date</Label><Input id="event-date" type="date" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3"><div className="grid gap-2"><Label htmlFor="event-start">Start</Label><Input id="event-start" type="time" value={draft.startTime} onChange={(e) => setDraft({ ...draft, startTime: e.target.value })} /></div><div className="grid gap-2"><Label htmlFor="event-end">End</Label><Input id="event-end" type="time" value={draft.endTime} onChange={(e) => setDraft({ ...draft, endTime: e.target.value })} /></div></div>
            <div className="grid gap-2"><Label htmlFor="event-location">Location / meeting room</Label><Input id="event-location" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></div>
            <Button onClick={createEvent}>Create event</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && <div className="space-y-3 text-sm">
            <p>{selected.description}</p>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Organizer</span><span>{selected.organizer}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Date</span><span>{selected.startDate}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Time</span><span>{selected.startTime}–{selected.endTime}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Location</span><span>{selected.location}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Registrations</span><span>{selected.registeredCount}</span></div>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
