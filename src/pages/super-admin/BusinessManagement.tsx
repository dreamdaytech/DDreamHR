import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, Users, DollarSign, Eye, Edit, Pause, Play, Search, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadTextFile, toCsv } from '@/lib/demoStore';
import { supabase } from '@/integrations/supabase/client';

type Business = {
  id: string;
  name: string;
  admin_email: string;
  industry: string | null;
  country: string | null;
  subscription_plan: 'trial' | 'basic' | 'standard' | 'premium' | 'enterprise';
  status: 'active' | 'suspended' | 'trial' | 'pending' | 'inactive';
  monthly_revenue: number;
  created_at: string;
  employees: number;
};

const BusinessManagement = () => {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selected, setSelected] = useState<Business | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: '', admin_email: '', industry: '', country: '', subscription_plan: 'trial' as Business['subscription_plan'], monthly_revenue: '0' });

  const loadBusinesses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('businesses')
      .select('id,name,admin_email,industry,country,subscription_plan,status,monthly_revenue,created_at,employees(count)')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Could not load businesses', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    setBusinesses((data ?? []).map((row: any) => ({
      ...row,
      monthly_revenue: Number(row.monthly_revenue ?? 0),
      employees: Number(row.employees?.[0]?.count ?? 0),
    })));
    setLoading(false);
  };

  useEffect(() => { void loadBusinesses(); }, []);

  const filtered = useMemo(() => businesses.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (!search || item.name.toLowerCase().includes(search) || item.admin_email.toLowerCase().includes(search) || (item.industry ?? '').toLowerCase().includes(search))
      && (statusFilter === 'all' || item.status === statusFilter)
      && (planFilter === 'all' || item.subscription_plan === planFilter);
  }), [businesses, planFilter, searchTerm, statusFilter]);

  const saveBusiness = async () => {
    if (!editingId) {
      toast({ title: 'Tenant creation is unavailable here', description: 'Use the verified business registration flow so owner membership and tenant defaults are provisioned atomically.', variant: 'destructive' });
      return;
    }
    if (!draft.name.trim() || !draft.admin_email.trim() || !draft.industry.trim()) {
      toast({ title: 'Complete the business record', description: 'Name, admin email and industry are required.', variant: 'destructive' });
      return;
    }

    const payload = {
      name: draft.name.trim(),
      admin_email: draft.admin_email.trim().toLowerCase(),
      industry: draft.industry.trim(),
      country: draft.country.trim(),
      subscription_plan: draft.subscription_plan,
      monthly_revenue: Math.max(0, Number(draft.monthly_revenue) || 0),
    };

    const result = await supabase.from('businesses').update(payload).eq('id', editingId);

    if (result.error) {
      toast({ title: 'Save failed', description: result.error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Business updated', description: payload.name });
    setEditorOpen(false);
    await loadBusinesses();
  };

  const setStatus = async (item: Business, status: Business['status']) => {
    const { error } = await supabase.from('businesses').update({ status }).eq('id', item.id);
    if (error) toast({ title: 'Status update failed', description: error.message, variant: 'destructive' });
    else await loadBusinesses();
  };

  const openEdit = (item: Business) => {
    setEditingId(item.id);
    setDraft({ name: item.name, admin_email: item.admin_email, industry: item.industry ?? '', country: item.country ?? '', subscription_plan: item.subscription_plan, monthly_revenue: String(item.monthly_revenue) });
    setEditorOpen(true);
  };

  const exportBusinesses = () => {
    downloadTextFile('ddreamhr-businesses.csv', toCsv(businesses), 'text/csv;charset=utf-8');
    toast({ title: 'Export complete', description: `${businesses.length} business record(s) exported.` });
  };

  const totalEmployees = businesses.reduce((sum, item) => sum + item.employees, 0);
  const totalRevenue = businesses.reduce((sum, item) => sum + item.monthly_revenue, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-3xl font-bold">Business Management</h1><p className="text-muted-foreground">Live production tenant administration</p></div>
        <div className="flex gap-2"><Button variant="outline" onClick={exportBusinesses}><Download className="mr-2 h-4 w-4" />Export</Button><Button variant="outline" onClick={() => void loadBusinesses()}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button></div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Businesses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{businesses.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active Businesses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{businesses.filter((b) => b.status === 'active').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Employees</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2 text-2xl font-bold"><Users className="h-5 w-5 text-muted-foreground" />{totalEmployees}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Revenue</CardTitle></CardHeader><CardContent><div className="flex items-center gap-1 text-2xl font-bold"><DollarSign className="h-5 w-5 text-muted-foreground" />{totalRevenue.toLocaleString()}</div></CardContent></Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" placeholder="Search businesses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="trial">Trial</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select>
        <Select value={planFilter} onValueChange={setPlanFilter}><SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All plans</SelectItem><SelectItem value="trial">Trial</SelectItem><SelectItem value="basic">Basic</SelectItem><SelectItem value="standard">Standard</SelectItem><SelectItem value="premium">Premium</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent></Select>
      </div>

      <Card><CardHeader><CardTitle>Businesses ({filtered.length})</CardTitle><CardDescription>{loading ? 'Loading live tenant data…' : 'Changes are written to Supabase and protected by database RLS.'}</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {filtered.map((item) => <div key={item.id} className="flex flex-col gap-4 rounded-lg border p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3"><div className="rounded-lg bg-muted p-3"><Building2 className="h-5 w-5 text-primary" /></div><div><p className="font-semibold">{item.name}</p><p className="text-sm text-muted-foreground">{item.admin_email}</p><div className="mt-2 flex flex-wrap gap-2"><Badge variant="outline">{item.status}</Badge><Badge variant="secondary">{item.subscription_plan}</Badge><Badge variant="outline">{item.industry}</Badge></div></div></div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm"><div><p className="font-semibold">{item.employees}</p><p className="text-muted-foreground">Employees</p></div><div><p className="font-semibold">{item.monthly_revenue.toLocaleString()}</p><p className="text-muted-foreground">MRR</p></div><div><p className="font-semibold">{item.country || '—'}</p><p className="text-muted-foreground">Country</p></div></div>
            <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setSelected(item)}><Eye className="h-4 w-4" /></Button><Button variant="outline" size="sm" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>{item.status === 'active' ? <Button variant="outline" size="sm" onClick={() => void setStatus(item, 'suspended')}><Pause className="h-4 w-4" /></Button> : item.status === 'suspended' ? <Button variant="outline" size="sm" onClick={() => void setStatus(item, 'active')}><Play className="h-4 w-4" /></Button> : null}</div>
          </div>)}
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}><DialogContent><DialogHeader><DialogTitle>Edit business</DialogTitle></DialogHeader><div className="grid gap-4">
        <div className="grid gap-2"><Label>Name</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
        <div className="grid gap-2"><Label>Admin email</Label><Input type="email" value={draft.admin_email} onChange={(e) => setDraft({ ...draft, admin_email: e.target.value })} /></div>
        <div className="grid gap-2"><Label>Industry</Label><Input value={draft.industry} onChange={(e) => setDraft({ ...draft, industry: e.target.value })} /></div>
        <div className="grid gap-2"><Label>Country</Label><Input value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} /></div>
        <div className="grid gap-2"><Label>Plan</Label><Select value={draft.subscription_plan} onValueChange={(v) => setDraft({ ...draft, subscription_plan: v as Business['subscription_plan'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="trial">Trial</SelectItem><SelectItem value="basic">Basic</SelectItem><SelectItem value="standard">Standard</SelectItem><SelectItem value="premium">Premium</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent></Select></div>
        <div className="grid gap-2"><Label>Monthly revenue</Label><Input type="number" min="0" value={draft.monthly_revenue} onChange={(e) => setDraft({ ...draft, monthly_revenue: e.target.value })} /></div>
        <Button onClick={() => void saveBusiness()}>Save business</Button>
      </div></DialogContent></Dialog>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><DialogContent><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>{selected && <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Status</span><span>{selected.status}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span>{selected.subscription_plan}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{new Date(selected.created_at).toLocaleDateString()}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Employees</span><span>{selected.employees}</span></div></div>}</DialogContent></Dialog>
    </div>
  );
};

export default BusinessManagement;
