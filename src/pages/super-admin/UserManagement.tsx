import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, UserPlus, Search, Download, MoreHorizontal, Eye, Edit, Ban, CheckCircle, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadTextFile, toCsv } from '@/lib/demoStore';
import { DemoPlatformUser, getDemoBusinesses, getDemoPlatformUsers, saveDemoPlatformUsers } from '@/lib/demoPlatformData';

const UserManagement = () => {
  const { toast } = useToast();
  const businesses = getDemoBusinesses();
  const [users, setUsers] = useState<DemoPlatformUser[]>(getDemoPlatformUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [businessFilter, setBusinessFilter] = useState('all');
  const [selected, setSelected] = useState<DemoPlatformUser | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    name: '',
    email: '',
    role: 'employee' as DemoPlatformUser['role'],
    businessId: businesses[0]?.id || '',
    country: 'Sierra Leone',
  });

  const persist = (next: DemoPlatformUser[]) => {
    setUsers(next);
    saveDemoPlatformUsers(next);
  };

  const filteredUsers = useMemo(() => users.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (!search || item.name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search) || item.business.toLowerCase().includes(search))
      && (statusFilter === 'all' || item.status === statusFilter)
      && (roleFilter === 'all' || item.role === roleFilter)
      && (businessFilter === 'all' || item.businessId === businessFilter);
  }), [businessFilter, roleFilter, searchTerm, statusFilter, users]);

  const openCreate = () => {
    setEditingId(null);
    setDraft({ name: '', email: '', role: 'employee', businessId: businesses[0]?.id || '', country: 'Sierra Leone' });
    setEditorOpen(true);
  };

  const openEdit = (item: DemoPlatformUser) => {
    setEditingId(item.id);
    setDraft({ name: item.name, email: item.email, role: item.role, businessId: item.businessId || '', country: item.country });
    setEditorOpen(true);
  };

  const saveUser = () => {
    if (!draft.name.trim() || !draft.email.trim()) {
      toast({ title: 'Complete the user', description: 'Name and email are required.', variant: 'destructive' });
      return;
    }
    const business = businesses.find((item) => item.id === draft.businessId);
    if (editingId) {
      persist(users.map((item) => item.id === editingId ? {
        ...item,
        ...draft,
        business: draft.role === 'super_admin' ? 'Platform' : business?.name || item.business,
        businessId: draft.role === 'super_admin' ? null : draft.businessId || null,
      } : item));
      toast({ title: 'User updated', description: draft.name });
    } else {
      const created: DemoPlatformUser = {
        id: 'USR-' + Date.now(),
        ...draft,
        status: 'active',
        business: draft.role === 'super_admin' ? 'Platform' : business?.name || 'Unassigned',
        businessId: draft.role === 'super_admin' ? null : draft.businessId || null,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        loginCount: 0,
      };
      persist([created, ...users]);
      toast({ title: 'User invited', description: created.email + ' was added to the demo platform.' });
    }
    setEditorOpen(false);
  };

  const updateStatus = (id: string, status: DemoPlatformUser['status']) => {
    persist(users.map((item) => item.id === id ? { ...item, status } : item));
  };

  const exportUsers = () => {
    downloadTextFile('ddreamhr-platform-users.csv', toCsv(users), 'text/csv;charset=utf-8');
    toast({ title: 'Export complete', description: String(users.length) + ' user record(s) downloaded.' });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-3xl font-bold">User Management</h1><p className="text-muted-foreground">Manage platform users in the hosted demo workspace.</p></div>
        <div className="flex gap-2"><Button variant="outline" onClick={exportUsers}><Download className="mr-2 h-4 w-4" />Export Users</Button><Button onClick={openCreate}><UserPlus className="mr-2 h-4 w-4" />Invite User</Button></div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{users.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{users.filter((item) => item.status === 'active').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Administrators</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{users.filter((item) => item.role === 'admin' || item.role === 'super_admin').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Businesses</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2 text-2xl font-bold"><Building2 className="h-5 w-5 text-muted-foreground" />{businesses.length}</div></CardContent></Card>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="lg:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="suspended">Suspended</SelectItem></SelectContent></Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="lg:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All roles</SelectItem><SelectItem value="super_admin">Super Admin</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="hr">HR</SelectItem><SelectItem value="manager">Manager</SelectItem><SelectItem value="employee">Employee</SelectItem></SelectContent></Select>
        <Select value={businessFilter} onValueChange={setBusinessFilter}><SelectTrigger className="lg:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All businesses</SelectItem>{businesses.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select>
      </div>

      <Card>
        <CardHeader><CardTitle>Users ({filteredUsers.length})</CardTitle><CardDescription>View, edit, invite and suspend users without requiring a Supabase session.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {filteredUsers.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 rounded-lg border p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3"><Avatar><AvatarFallback>{item.name.split(' ').map((name) => name[0]).join('').slice(0, 2)}</AvatarFallback></Avatar><div><p className="font-semibold">{item.name}</p><p className="text-sm text-muted-foreground">{item.email}</p><div className="mt-1 flex flex-wrap gap-2"><Badge variant="outline">{item.status}</Badge><Badge variant="secondary">{item.role}</Badge><Badge variant="outline">{item.business}</Badge></div></div></div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm"><div><p className="font-semibold">{item.loginCount}</p><p className="text-muted-foreground">Logins</p></div><div><p className="font-semibold">{item.country}</p><p className="text-muted-foreground">Country</p></div><div><p className="font-semibold">{item.lastLogin ? new Date(item.lastLogin).toLocaleDateString() : 'Never'}</p><p className="text-muted-foreground">Last login</p></div></div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelected(item)}><Eye className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openEdit(item)}><Edit className="mr-2 h-4 w-4" />Edit User</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {item.status === 'active'
                    ? <DropdownMenuItem onClick={() => updateStatus(item.id, 'suspended')}><Ban className="mr-2 h-4 w-4" />Suspend User</DropdownMenuItem>
                    : <DropdownMenuItem onClick={() => updateStatus(item.id, 'active')}><CheckCircle className="mr-2 h-4 w-4" />Activate User</DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit user' : 'Invite user'}</DialogTitle><DialogDescription>Changes are stored in the hosted demo workspace.</DialogDescription></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Email</Label><Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Role</Label><Select value={draft.role} onValueChange={(role) => setDraft({ ...draft, role: role as DemoPlatformUser['role'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="super_admin">Super Admin</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="hr">HR</SelectItem><SelectItem value="manager">Manager</SelectItem><SelectItem value="employee">Employee</SelectItem></SelectContent></Select></div>
            {draft.role !== 'super_admin' && <div className="grid gap-2"><Label>Business</Label><Select value={draft.businessId} onValueChange={(businessId) => setDraft({ ...draft, businessId })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{businesses.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div>}
            <div className="grid gap-2"><Label>Country</Label><Input value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} /></div>
            <Button onClick={saveUser}>{editingId ? 'Save user' : 'Send demo invite'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent><DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>{selected && <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{selected.email}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Role</span><span>{selected.role}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Status</span><span>{selected.status}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Business</span><span>{selected.business}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{new Date(selected.createdAt).toLocaleDateString()}</span></div></div>}</DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
