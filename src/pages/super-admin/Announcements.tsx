import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { readDemoData, writeDemoData } from '@/lib/demoStore';

type Announcement = { id: number; title: string; content: string; date: string; author: string };

const seedAnnouncements: Announcement[] = [
  { id: 1, title: 'Scheduled Maintenance', content: 'A maintenance window is planned for Sunday from 2 AM to 4 AM UTC.', date: '2026-10-03', author: 'System Admin' },
  { id: 2, title: 'Functionality Stabilization', content: 'Core hosted demo workflows are being stabilized across the platform.', date: '2026-10-05', author: 'Product Team' },
];

const Announcements = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Announcement[]>(() => readDemoData('platform-announcements', seedAnnouncements));
  const [draft, setDraft] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const persist = (next: Announcement[]) => {
    setItems(next);
    writeDemoData('platform-announcements', next);
  };

  const publish = () => {
    if (!draft.title.trim() || !draft.content.trim()) {
      toast({ title: 'Complete the announcement', description: 'Title and content are required.', variant: 'destructive' });
      return;
    }
    if (editingId) {
      persist(items.map((item) => item.id === editingId ? { ...item, title: draft.title.trim(), content: draft.content.trim() } : item));
      toast({ title: 'Announcement updated', description: draft.title });
    } else {
      persist([{ id: Date.now(), title: draft.title.trim(), content: draft.content.trim(), date: new Date().toISOString().split('T')[0], author: 'System Admin' }, ...items]);
      toast({ title: 'Announcement published', description: draft.title });
    }
    setDraft({ title: '', content: '' });
    setEditingId(null);
  };

  const edit = (item: Announcement) => {
    setEditingId(item.id);
    setDraft({ title: item.title, content: item.content });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Announcements</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>{editingId ? 'Edit Announcement' : 'Create Announcement'}</CardTitle><CardDescription>Post an announcement for platform users.</CardDescription></CardHeader>
          <CardContent className="space-y-4"><div className="space-y-2"><Label htmlFor="announcement-title">Title</Label><Input id="announcement-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="announcement-content">Content</Label><Textarea id="announcement-content" rows={5} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /></div></CardContent>
          <CardFooter className="gap-2"><Button onClick={publish}>{editingId ? 'Save Announcement' : 'Publish Announcement'}</Button>{editingId && <Button variant="outline" onClick={() => { setEditingId(null); setDraft({ title: '', content: '' }); }}>Cancel</Button>}</CardFooter>
        </Card>
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">Recent Announcements</h2>
          {items.map((item) => <Card key={item.id}><CardHeader><CardTitle>{item.title}</CardTitle><div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Posted {item.date} by</span><Badge variant="secondary">{item.author}</Badge></div></CardHeader><CardContent><p>{item.content}</p></CardContent><CardFooter><Button variant="outline" size="sm" onClick={() => edit(item)}>Edit</Button></CardFooter></Card>)}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
