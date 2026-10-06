import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, Users, DollarSign, Eye, Edit, Pause, Play, Search, Download, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadTextFile, toCsv } from '@/lib/demoStore';
import { DemoBusiness, getDemoBusinesses, saveDemoBusinesses } from '@/lib/demoPlatformData';

const blankBusiness = {
  name: '',
  email: '',
  industry: '',
  country: 'Sierra Leone',
  plan: 'trial' as DemoBusiness['plan'],
  employees: '1',
  monthlyRevenue: '0',
};

const BusinessManagement = () => {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<DemoBusiness[]>(getDemoBusinesses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selected, setSelected] = useState<DemoBusiness | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(blankBusiness);

  const persist = (next: DemoBusiness[]) => {
    setBusinesses(next);
    saveDemoBusinesses(next);
  };

  const filteredBusinesses = useMemo(() => businesses.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (!search || item.name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search) || item.industry.toLowerCase().includes(search))
      && (statusFilter === 'all' || item.status === statusFilter)
      && (planFilter === 'all' || item.plan === planFilter);
  }), [businesses, planFilter, searchTerm, statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setDraft(blankBusiness);
    setEditorOpen(true);
  };

  const openEdit = (item: DemoBusiness) => {
    setEditingId(item.id);
    setDraft({
      name: item.name,
      email: item.email,
      industry: item.industry,
      country: item.country,
      plan: item.plan,
      employees: String(item.employees),
      monthlyRevenue: String(item.monthlyRevenue),
    });
    setEditorOpen(true);
  };

  const saveBusiness = () => {
    if (!draft.name.trim() || !draft.email.trim() || !draft.industry.trim()) {
      toast({ title: 'Complete the business record', description: 'Name, email and industry are required.', variant: 'destructive' });
      return;
    }
    if (editingId) {
      persist(businesses.map((item) => item.id === editingId ? {
        ...item,
        ...draft,
        employees: Math.max(0, Number(draft.employees) || 0),
        monthlyRevenue: Math.max(0, Number(draft.monthlyRevenue) || 0),
      } : item));
      toast({ title: 'Business updated', description: draft.name });
    } else {
      const created: DemoBusiness = {
        id: 'BUS-' + Date.now(),
        ...draft,
        status: draft.plan === 'trial' ? 'trial' : 'active',
        employees: Math.max(0, Number(draft.employees) || 0),
        monthlyRevenue: Math.max(0, Number(draft.monthlyRevenue) || 0),
        createdAt: new Date().toISOString().split('T')[0],
      };
      persist([created, ...businesses]);
      toast({ title: 'Business added', description: created.name });
    }
    setEditorOpen(false);
  };

  const setStatus = (id: string, status: DemoBusiness['status']) => {
    persist(businesses.map((item) => item.id === id ? { ...item, status } : item));
  };

  const exportBusinesses = () => {
    downloadTextFile('ddreamhr-platform-businesses.csv', toCsv(businesses), 'text/csv;charset=utf-8');
    toast({ title: 'Export complete', description: String(businesses.length) + ' business record(s) downloaded.' });
  };

  const activeCount = businesses.filter((item) => item.status === 'active').length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-3xl font-bold">Business Management</h1><p className="text-muted-foreground">Manage businesses in the demo platform workspace</p></div>
        <div className="flex gap-2"><Button variant="outline" onClick={exportBusinesses}><Download className="mr-2 h-4 w-4" />Export</Button><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Business</Button></div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Businesses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{businesses.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active Businesses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{activeCount}</div><p className="text-xs text-muted-foreground">{businesses.length ? Math.round((activeCount / businesses.length) * 100) : 0}% active</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Employees</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2 text-2xl font-bold"><Users className="h-5 w-5 text-muted-foreground" />{businesses.reduce((sum, item) => sum + item.employees, 0)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Revenue</CardTitle></CardHeader><CardContent><div className="flex items-center gap-1 text-2xl font-bold"><DollarSign className="h-5 w-5 text-muted-foreground" />{businesses.reduce((sum, item) => sum + item.monthlyRevenue, 0).toLocaleString()}</div></CardContent></Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" placeholder="Search businesses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="trial">Trial</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="terminated">Terminated</SelectItem></SelectContent></Select>
        <Select value={planFilter} onValueChange={setPlanFilter}><SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All plans</SelectItem><SelectItem value="trial">Trial</SelectItem><SelectItem value="basic">Basic</SelectItem><SelectItem value="professional">Professional</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent></Select>
      </div>

      <Card>
        <CardHeader><CardTitle>Businesses ({filteredBusinesses.length})</CardTitle><CardDescription>All visible controls update the persistent demo dataset.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {filteredBusinesses.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 rounded-lg border p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3"><div className="rounded-lg bg-muted p-3"><Building2 className="h-5 w-5 text-primary" /></div><div><p className="font-semibold">{item.name}</p><p className="text-sm text-muted-foreground">{item.email}</p><div className="mt-2 flex flex-wrap gap-2"><Badge variant="outline">{item.status}</Badge><Badge variant="secondary">{item.plan}</Badge><Badge variant="outline">{item.industry}</Badge></div></div></div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm"><div><p className="font-semibold">{item.employees}</p><p className="text-muted-foreground">Employees</p></div><div><p className="font-semibold">{item.monthlyRevenue.toLocaleString()}</p><p className="text-muted-foreground">MRR</p></div><div><p className="font-semibold">{item.country}</p><p className="text-muted-foreground">Country</p></div></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelected(item)}><Eye className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                {item.status === 'active' ? <Button variant="outline" size="sm" onClick={() => setStatus(item.id, 'suspended')}><Pause className="h-4 w-4" /></Button> : item.status === 'suspended' ? <Button variant="outline" size="sm" onClick={() => setStatus(item.id, 'active')}><Play className="h-4 w-4" /></Button> : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit business' : 'Add business'}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Admin email</Label><Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Industry</Label><Input value={draft.industry} onChange={(e) => setDraft({ ...draft, industry: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Country</Label><Input value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Plan</Label><Select value={draft.plan} onValueChange={(plan) => setDraft({ ...draft, plan: plan as DemoBusiness['plan'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="trial">Trial</SelectItem><SelectItem value="basic">Basic</SelectItem><SelectItem value="professional">Professional</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-3"><div className="grid gap-2"><Label>Employees</Label><Input type="number" min="0" value={draft.employees} onChange={(e) => setDraft({ ...draft, employees: e.target.value })} /></div><div className="grid gap-2"><Label>Monthly revenue</Label><Input type="number" min="0" value={draft.monthlyRevenue} onChange={(e) => setDraft({ ...draft, monthlyRevenue: e.target.value })} /></div></div>
            <Button onClick={saveBusiness}>Save business</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>{selected && <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Status</span><span>{selected.status}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span>{selected.plan}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{selected.createdAt}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Industry</span><span>{selected.industry}</span></div></div>}</DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessManagement;
