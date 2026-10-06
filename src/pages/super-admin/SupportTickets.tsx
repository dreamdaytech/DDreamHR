import { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { readDemoData, writeDemoData } from '@/lib/demoStore';

type TicketStatus = 'Open' | 'In Progress' | 'Closed';
type Ticket = {
  id: string;
  subject: string;
  user: string;
  business: string;
  status: TicketStatus;
  lastUpdated: string;
  description: string;
  assignee?: string;
};

const seedTickets: Ticket[] = [
  { id: 'TKT-001', subject: 'Login Issue', user: 'admin@business.com', business: 'Innovate Corp', status: 'Open', lastUpdated: '2 hours ago', description: 'Administrator cannot complete login after password reset.' },
  { id: 'TKT-002', subject: 'Billing Discrepancy', user: 'finance@techsolutions.io', business: 'Tech Solutions', status: 'In Progress', lastUpdated: '1 day ago', description: 'Invoice total does not match the expected subscription amount.', assignee: 'Platform Support' },
  { id: 'TKT-003', subject: 'Feature Request: Dark Mode', user: 'ceo@startup.co', business: 'Creative Minds', status: 'Closed', lastUpdated: '3 days ago', description: 'Request to add dark mode to the platform.' },
];

const SupportTickets = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>(() => readDemoData('platform-support-tickets', seedTickets));
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState({ subject: '', user: '', business: '', description: '' });

  const persist = (next: Ticket[]) => {
    setTickets(next);
    writeDemoData('platform-support-tickets', next);
  };

  const filtered = useMemo(() => tickets.filter((ticket) => {
    const query = search.toLowerCase();
    return !query || ticket.id.toLowerCase().includes(query) || ticket.subject.toLowerCase().includes(query) || ticket.business.toLowerCase().includes(query) || ticket.user.toLowerCase().includes(query);
  }), [search, tickets]);

  const createTicket = () => {
    if (!draft.subject.trim() || !draft.user.trim() || !draft.business.trim() || !draft.description.trim()) {
      toast({ title: 'Complete the ticket', description: 'Subject, user, business and description are required.', variant: 'destructive' });
      return;
    }
    const created: Ticket = {
      id: 'TKT-' + String(Date.now()).slice(-6),
      ...draft,
      status: 'Open',
      lastUpdated: 'Just now',
    };
    persist([created, ...tickets]);
    setDraft({ subject: '', user: '', business: '', description: '' });
    setCreateOpen(false);
    toast({ title: 'Support ticket created', description: created.id + ' is now open.' });
  };

  const updateTicket = (id: string, patch: Partial<Ticket>) => {
    const next = tickets.map((ticket) => ticket.id === id ? { ...ticket, ...patch, lastUpdated: 'Just now' } : ticket);
    persist(next);
    if (selected?.id === id) setSelected({ ...selected, ...patch, lastUpdated: 'Just now' });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Support Tickets</h1><p className="text-muted-foreground">Create, inspect, assign and close support work in the demo workspace.</p></div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div><CardTitle>User Support</CardTitle><CardDescription>{tickets.filter((ticket) => ticket.status !== 'Closed').length} active ticket(s)</CardDescription></div>
          <div className="flex items-center gap-2">
            <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets..." className="pl-8 sm:w-[260px]" /></div>
            <Button onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4" />New Ticket</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Ticket ID</TableHead><TableHead>Subject</TableHead><TableHead>Business</TableHead><TableHead>Status</TableHead><TableHead>Last Updated</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell><TableCell>{ticket.subject}</TableCell><TableCell>{ticket.business}</TableCell>
                  <TableCell><Badge variant={ticket.status === 'Open' ? 'default' : ticket.status === 'In Progress' ? 'secondary' : 'outline'}>{ticket.status}</Badge></TableCell>
                  <TableCell>{ticket.lastUpdated}</TableCell>
                  <TableCell>
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelected(ticket)}>View Ticket</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateTicket(ticket.id, { status: 'In Progress', assignee: 'Platform Support' })}>Assign to Support</DropdownMenuItem>
                      {ticket.status !== 'Closed' && <DropdownMenuItem onClick={() => updateTicket(ticket.id, { status: 'Closed' })}>Close Ticket</DropdownMenuItem>}
                    </DropdownMenuContent></DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New support ticket</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2"><Label>Subject</Label><Input value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} /></div>
            <div className="grid gap-2"><Label>User email</Label><Input type="email" value={draft.user} onChange={(e) => setDraft({ ...draft, user: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Business</Label><Input value={draft.business} onChange={(e) => setDraft({ ...draft, business: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Description</Label><Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
            <Button onClick={createTicket}>Create Ticket</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selected?.id} · {selected?.subject}</DialogTitle></DialogHeader>
          {selected && <div className="space-y-3 text-sm"><p>{selected.description}</p><div className="flex justify-between"><span className="text-muted-foreground">User</span><span>{selected.user}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Business</span><span>{selected.business}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Status</span><span>{selected.status}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Assignee</span><span>{selected.assignee || 'Unassigned'}</span></div></div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportTickets;
