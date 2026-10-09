import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, RefreshCw, Ban, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadTextFile, toCsv } from '@/lib/demoStore';
import { supabase } from '@/integrations/supabase/client';

type PlatformUser = { user_id: string; name: string; role: string; membershipRole: string; isPrimaryAdmin: boolean; business: string; business_id: string; status: string; email: string };

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('business_users')
      .select('user_id,business_id,role,status,is_primary_admin,user_profiles(first_name,last_name,is_super_admin),businesses(name),employees(email)')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Could not load users', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }
    setUsers((data ?? []).map((row: any) => {
      const profile = Array.isArray(row.user_profiles) ? row.user_profiles[0] : row.user_profiles;
      const business = Array.isArray(row.businesses) ? row.businesses[0] : row.businesses;
      const employee = Array.isArray(row.employees) ? row.employees[0] : row.employees;
      return {
        user_id: row.user_id,
        name: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || row.user_id.slice(0, 8),
        role: profile?.is_super_admin ? 'super_admin' : row.role,
        membershipRole: row.role,
        isPrimaryAdmin: Boolean(row.is_primary_admin),
        business: business?.name ?? '—',
        business_id: row.business_id,
        status: row.status,
        email: employee?.email ?? '—',
      };
    }));
    setLoading(false);
  };

  useEffect(() => { void loadUsers(); }, []);

  const filtered = useMemo(() => users.filter((user) => {
    const q = searchTerm.toLowerCase();
    return (!q || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.business.toLowerCase().includes(q))
      && (roleFilter === 'all' || user.role === roleFilter);
  }), [roleFilter, searchTerm, users]);

  const isLastActiveAdmin = (user: PlatformUser) => user.membershipRole === 'admin'
    && user.status === 'active'
    && users.filter((candidate) => candidate.business_id === user.business_id && candidate.membershipRole === 'admin' && candidate.status === 'active').length <= 1;

  const setStatus = async (user: PlatformUser, status: 'active' | 'inactive') => {
    if (status === 'inactive' && isLastActiveAdmin(user)) {
      toast({ title: 'Cannot deactivate the last active administrator', description: 'Promote another active administrator first.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('business_users').update({ status }).eq('business_id', user.business_id).eq('user_id', user.user_id);
    if (error) toast({ title: 'User update failed', description: error.message, variant: 'destructive' });
    else await loadUsers();
  };

  return <div className="space-y-6 p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 className="text-3xl font-bold">User Management</h1><p className="text-muted-foreground">Live production users and workspace memberships</p></div>
      <div className="flex gap-2"><Button variant="outline" onClick={() => downloadTextFile('ddreamhr-users.csv', toCsv(users), 'text/csv;charset=utf-8')}><Download className="mr-2 h-4 w-4" />Export</Button><Button variant="outline" onClick={() => void loadUsers()}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button></div>
    </div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Memberships</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{users.length}</div></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{users.filter((u) => u.status === 'active').length}</div></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Super Admins</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{users.filter((u) => u.role === 'super_admin').length}</div></CardContent></Card>
    </div>
    <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All roles</SelectItem><SelectItem value="super_admin">Super Admin</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="hr">HR</SelectItem><SelectItem value="manager">Manager</SelectItem><SelectItem value="employee">Employee</SelectItem></SelectContent></Select></div>
    <Card><CardHeader><CardTitle>{loading ? 'Loading…' : `Users (${filtered.length})`}</CardTitle></CardHeader><CardContent className="space-y-3">{filtered.map((user) => <div key={user.user_id + user.business_id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p><div className="mt-2 flex gap-2"><Badge variant="secondary">{user.role}</Badge><Badge variant="outline">{user.status}</Badge><Badge variant="outline">{user.business}</Badge></div></div><div>{user.status === 'active' ? <Button variant="outline" size="sm" onClick={() => void setStatus(user, 'inactive')} disabled={user.role === 'super_admin' || isLastActiveAdmin(user)}><Ban className="mr-2 h-4 w-4" />Deactivate</Button> : <Button variant="outline" size="sm" onClick={() => void setStatus(user, 'active')}><CheckCircle className="mr-2 h-4 w-4" />Activate</Button>}</div></div>)}</CardContent></Card>
  </div>;
};

export default UserManagement;
