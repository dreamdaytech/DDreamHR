import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Database, Users, Building2, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const SystemHealth = () => {
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [stats, setStats] = useState({ businesses: 0, employees: 0, users: 0 });
  const [status, setStatus] = useState<'checking' | 'operational' | 'error'>('checking');

  const checkHealth = async () => {
    setStatus('checking');
    const [businesses, employees, users] = await Promise.all([
      supabase.from('businesses').select('id', { count: 'exact', head: true }),
      supabase.from('employees').select('id', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('user_id', { count: 'exact', head: true }),
    ]);
    const failed = [businesses.error, employees.error, users.error].some(Boolean);
    if (!failed) setStats({ businesses: businesses.count ?? 0, employees: employees.count ?? 0, users: users.count ?? 0 });
    setStatus(failed ? 'error' : 'operational');
    setCheckedAt(new Date());
  };

  useEffect(() => { void checkHealth(); }, []);

  return <div className="space-y-6">
    <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">System Health</h1><p className="text-muted-foreground">Live checks against the production Supabase backend.</p></div><Button variant="outline" onClick={() => void checkHealth()}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button></div>
    <div className="grid gap-4 md:grid-cols-3">
      <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Database</CardTitle><Database className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{status === 'checking' ? 'Checking…' : status === 'operational' ? 'Operational' : 'Unavailable'}</div><p className="text-xs text-muted-foreground">Live query check</p></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Businesses</CardTitle><Building2 className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.businesses}</div><p className="text-xs text-muted-foreground">Visible to this administrator</p></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Employees</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.employees}</div><p className="text-xs text-muted-foreground">Visible to this administrator</p></CardContent></Card>
    </div>
    <Card><CardHeader><CardTitle>Health status</CardTitle></CardHeader><CardContent className="flex items-center gap-3">{status === 'operational' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}<Badge variant={status === 'operational' ? 'default' : 'destructive'}>{status === 'checking' ? 'Checking' : status === 'operational' ? 'Operational' : 'Check failed'}</Badge>{checkedAt && <span className="text-sm text-muted-foreground">Last checked {checkedAt.toLocaleTimeString()}</span>}</CardContent></Card>
  </div>;
};

export default SystemHealth;
