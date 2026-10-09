import { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, Users, DollarSign, Eye, Edit, Pause, Play, Search, Download, Link2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { downloadTextFile, toCsv } from '@/lib/demoStore';
import { listPlatformBusinesses, updatePlatformBusiness, type PlatformBusiness } from '@/services/platformBusinesses';

const BusinessManagement = () => {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<PlatformBusiness[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selected, setSelected] = useState<PlatformBusiness | null>(null);
  const [editing, setEditing] = useState<PlatformBusiness | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setBusinesses(await listPlatformBusinesses());
    } catch (error) {
      toast({
        title: 'Could not load businesses',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filteredBusinesses = useMemo(() => businesses.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (!search || item.name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search) || item.industry.toLowerCase().includes(search))
      && (statusFilter === 'all' || item.status === statusFilter)
      && (planFilter === 'all' || item.plan === planFilter);
  }), [businesses, planFilter, searchTerm, statusFilter]);

  const saveBusiness = async () => {
    if (!editing) return;
    try {
      await updatePlatformBusiness(editing.id, editing);
      setEditing(null);
      await refresh();
      toast({ title: 'Business updated', description: editing.name });
    } catch (error) {
      toast({
        title: 'Could not update business',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const setStatus = async (item: PlatformBusiness, status: PlatformBusiness['status']) => {
    try {
      await updatePlatformBusiness(item.id, { status });
      await refresh();
      toast({ title: 'Business status updated', description: `${item.name} is now ${status}.` });
    } catch (error) {
      toast({
        title: 'Could not update status',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const exportBusinesses = () => {
    downloadTextFile('ddreamhr-platform-businesses.csv', toCsv(businesses), 'text/csv;charset=utf-8');
    toast({ title: 'Export complete', description: `${businesses.length} business record(s) downloaded.` });
  };

  const activeCount = businesses.filter((item) => item.status === 'active' || item.status === 'trial').length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Management</h1>
          <p className="text-muted-foreground">Live DDreamHR tenants registered in Supabase.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportBusinesses}><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button
            onClick={async () => {
              const registrationUrl = `${window.location.origin}/register`;
              await navigator.clipboard.writeText(registrationUrl);
              toast({ title: 'Registration link copied', description: registrationUrl });
            }}
          >
            <Link2 className="mr-2 h-4 w-4" />Copy Registration Link
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Businesses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{businesses.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active / Trial</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{activeCount}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Employees</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2 text-2xl font-bold"><Users className="h-5 w-5 text-muted-foreground" />{businesses.reduce((sum, item) => sum + item.employees, 0)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Revenue</CardTitle></CardHeader><CardContent><div className="flex items-center gap-1 text-2xl font-bold"><DollarSign className="h-5 w-5 text-muted-foreground" />{businesses.reduce((sum, item) => sum + item.monthlyRevenue, 0).toLocaleString()}</div></CardContent></Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" placeholder="Search businesses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="trial">Trial</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select>
        <Select value={planFilter} onValueChange={setPlanFilter}><SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All plans</SelectItem><SelectItem value="trial">Trial</SelectItem><SelectItem value="basic">Basic</SelectItem><SelectItem value="standard">Standard</SelectItem><SelectItem value="premium">Premium</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent></Select>
      </div>

      <Card>
        <CardHeader><CardTitle>Businesses ({filteredBusinesses.length})</CardTitle><CardDescription>Registration creates these tenants automatically; Super Admin can review, suspend or update subscription state here.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {loading && <div className="py-8 text-center text-muted-foreground">Loading businesses…</div>}
          {!loading && filteredBusinesses.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 rounded-lg border p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3"><div className="rounded-lg bg-muted p-3"><Building2 className="h-5 w-5 text-primary" /></div><div><p className="font-semibold">{item.name}</p><p className="text-sm text-muted-foreground">{item.email}</p><div className="mt-2 flex flex-wrap gap-2"><Badge variant="outline">{item.status}</Badge><Badge variant="secondary">{item.plan}</Badge><Badge variant="outline">{item.industry}</Badge></div></div></div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm"><div><p className="font-semibold">{item.employees}</p><p className="text-muted-foreground">Employees</p></div><div><p className="font-semibold">{item.monthlyRevenue.toLocaleString()}</p><p className="text-muted-foreground">MRR</p></div><div><p className="font-semibold">{item.country}</p><p className="text-muted-foreground">Country</p></div></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelected(item)}><Eye className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setEditing({ ...item })}><Edit className="h-4 w-4" /></Button>
                {item.status === 'suspended'
                  ? <Button variant="outline" size="sm" onClick={() => setStatus(item, 'active')}><Play className="h-4 w-4" /></Button>
                  : <Button variant="outline" size="sm" onClick={() => setStatus(item, 'suspended')}><Pause className="h-4 w-4" /></Button>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit business</DialogTitle></DialogHeader>
          {editing && <div className="grid gap-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Admin email</Label><Input type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Industry</Label><Input value={editing.industry} onChange={(e) => setEditing({ ...editing, industry: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Country</Label><Input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Plan</Label><Select value={editing.plan} onValueChange={(plan) => setEditing({ ...editing, plan: plan as PlatformBusiness['plan'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="trial">Trial</SelectItem><SelectItem value="basic">Basic</SelectItem><SelectItem value="standard">Standard</SelectItem><SelectItem value="premium">Premium</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-3"><div className="grid gap-2"><Label>Company size</Label><Input value={editing.companySize || ''} onChange={(e) => setEditing({ ...editing, companySize: e.target.value })} /></div><div className="grid gap-2"><Label>Monthly revenue</Label><Input type="number" min="0" value={editing.monthlyRevenue} onChange={(e) => setEditing({ ...editing, monthlyRevenue: Math.max(0, Number(e.target.value) || 0) })} /></div></div>
            <Button onClick={saveBusiness}>Save business</Button>
          </div>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>{selected && <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Status</span><span>{selected.status}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span>{selected.plan}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Employees</span><span>{selected.employees}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{selected.createdAt}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Industry</span><span>{selected.industry}</span></div></div>}</DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessManagement;
