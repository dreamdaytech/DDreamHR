import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Award, Trophy, Plus, TrendingUp, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { readDemoData, writeDemoData } from '@/lib/demoStore';

type RecognitionItem = {
  id: number;
  title: string;
  recipient: string;
  recognizer: string;
  message: string;
  type: 'performance' | 'teamwork' | 'innovation' | 'service';
  points: number;
  date: string;
  likes: number;
};

const seedRecognitions: RecognitionItem[] = [
  { id: 1, title: 'Outstanding Performance', recipient: 'Sarah Johnson', recognizer: 'Mike Chen', message: 'Sarah has consistently delivered exceptional results this quarter and helped the team succeed.', type: 'performance', points: 100, date: '2026-10-04', likes: 12 },
  { id: 2, title: 'Team Player', recipient: 'David Kim', recognizer: 'Lisa Rodriguez', message: 'David always steps up to help colleagues and keeps the team moving.', type: 'teamwork', points: 75, date: '2026-10-02', likes: 8 },
  { id: 3, title: 'Innovation Award', recipient: 'Emma Wilson', recognizer: 'Sarah Johnson', message: 'Emma created a workflow improvement that made the team more efficient.', type: 'innovation', points: 150, date: '2026-09-28', likes: 15 },
  { id: 4, title: 'Customer Champion', recipient: 'Alex Thompson', recognizer: 'Mike Chen', message: 'Alex received excellent feedback from several clients this month.', type: 'service', points: 125, date: '2026-09-24', likes: 10 },
];

const Recognition = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('recent');
  const [items, setItems] = useState<RecognitionItem[]>(() => readDemoData<RecognitionItem[]>('engagement-recognition', seedRecognitions));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState({
    recipient: '',
    title: '',
    message: '',
    type: 'teamwork' as RecognitionItem['type'],
    points: '50',
  });

  const persist = (next: RecognitionItem[]) => {
    setItems(next);
    writeDemoData('engagement-recognition', next);
  };

  const createRecognition = () => {
    if (!draft.recipient.trim() || !draft.title.trim() || !draft.message.trim()) {
      toast({ title: 'Complete the recognition', description: 'Recipient, title and message are required.', variant: 'destructive' });
      return;
    }
    const created: RecognitionItem = {
      id: Date.now(),
      recipient: draft.recipient.trim(),
      recognizer: user?.name || 'Demo User',
      title: draft.title.trim(),
      message: draft.message.trim(),
      type: draft.type,
      points: Math.max(0, Number(draft.points) || 0),
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };
    persist([created, ...items]);
    setDraft({ recipient: '', title: '', message: '', type: 'teamwork', points: '50' });
    setDialogOpen(false);
    setActiveTab('recent');
    toast({ title: 'Recognition published', description: `${created.recipient} was recognized for ${created.title}.` });
  };

  const celebrate = (id: number) => {
    persist(items.map((item) => item.id === id ? { ...item, likes: item.likes + 1 } : item));
  };

  const leaderboard = useMemo(() => {
    const totals = new Map<string, { name: string; points: number; recognitions: number }>();
    items.forEach((item) => {
      const current = totals.get(item.recipient) || { name: item.recipient, points: 0, recognitions: 0 };
      current.points += item.points;
      current.recognitions += 1;
      totals.set(item.recipient, current);
    });
    return [...totals.values()].sort((a, b) => b.points - a.points).slice(0, 8);
  }, [items]);

  const getTypeIcon = (type: RecognitionItem['type']) => {
    switch (type) {
      case 'performance': return <Star className="h-4 w-4" />;
      case 'teamwork': return <Users className="h-4 w-4" />;
      case 'innovation': return <Trophy className="h-4 w-4" />;
      case 'service': return <Award className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recognition & Rewards</h1>
          <p className="mt-2 text-muted-foreground">Recognize achievements and celebrate team success</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Give Recognition</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Recognitions</p><p className="text-2xl font-bold">{items.length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">This month</p><p className="text-2xl font-bold">{items.filter((item) => item.date.startsWith(new Date().toISOString().slice(0, 7))).length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Points awarded</p><p className="text-2xl font-bold">{items.reduce((sum, item) => sum + item.points, 0)}</p></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Celebrations</p><p className="text-2xl font-bold">{items.reduce((sum, item) => sum + item.likes, 0)}</p></div><TrendingUp className="h-7 w-7 text-primary" /></div></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="recent">Recent Recognition</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-6 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2 text-primary">{getTypeIcon(item.type)}</div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.recognizer} recognized {item.recipient}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" />{item.date}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{item.message}</p>
                <div className="flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback>{item.recipient.split(' ').map((name) => name[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                    <div><p className="font-medium">{item.recipient}</p><Badge variant="secondary">{item.points} points</Badge></div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => celebrate(item.id)}>
                    <Star className="mr-1 h-4 w-4" />Celebrate · {item.likes}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Recognition Leaderboard</CardTitle><CardDescription>Calculated from the recognition activity in this demo workspace.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((person, index) => (
                <div key={person.name} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold">{index + 1}</div>
                    <div><p className="font-medium">{person.name}</p><p className="text-sm text-muted-foreground">{person.recognitions} recognition{person.recognitions === 1 ? '' : 's'}</p></div>
                  </div>
                  <div className="text-right"><p className="font-bold text-primary">{person.points}</p><p className="text-xs text-muted-foreground">points</p></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Give recognition</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2"><Label htmlFor="recognition-recipient">Recipient</Label><Input id="recognition-recipient" value={draft.recipient} onChange={(e) => setDraft({ ...draft, recipient: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="recognition-title">Title</Label><Input id="recognition-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Category</Label><Select value={draft.type} onValueChange={(value) => setDraft({ ...draft, type: value as RecognitionItem['type'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="performance">Performance</SelectItem><SelectItem value="teamwork">Teamwork</SelectItem><SelectItem value="innovation">Innovation</SelectItem><SelectItem value="service">Service</SelectItem></SelectContent></Select></div>
            <div className="grid gap-2"><Label htmlFor="recognition-points">Points</Label><Input id="recognition-points" type="number" min="0" value={draft.points} onChange={(e) => setDraft({ ...draft, points: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="recognition-message">Message</Label><Textarea id="recognition-message" value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} /></div>
            <Button onClick={createRecognition}>Publish recognition</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recognition;
