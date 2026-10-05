import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Users, UserPlus, Search, Download, MoreHorizontal, Eye, Edit, Ban, CheckCircle, XCircle, AlertTriangle, Building2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserInviteDialog from '@/components/super-admin/UserInviteDialog';
import UserEditDialog from '@/components/super-admin/UserEditDialog';
import UserExportDialog from '@/components/super-admin/UserExportDialog';
import { Skeleton } from '@/components/ui/skeleton';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string | null;
  avatar: string | null;
  business: string;
  businessId: string | null;
  lastLogin: string | null;
  createdAt: string | null;
  permissions: string[];
  loginCount: number | null;
  country: string | null;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [businessFilter, setBusinessFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { toast } = useToast();

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['all_platform_users'],
    queryFn: async (): Promise<PlatformUser[]> => {
      // The rpc function is not in the generated types yet, so we cast the name to any
      const { data, error } = await supabase.rpc('get_all_platform_users' as any);
      if (error) {
        toast({
          title: 'Error fetching users',
          description: error.message,
          variant: 'destructive',
        });
        throw new Error(error.message);
      }
      return data || [];
    },
    initialData: [] // Using initialData ensures `users` is always an array and never undefined
  });

  const businesses = useMemo(() => {
    if (!users) return [];
    const businessMap = new Map<string, { id: string; name: string }>();
    users.forEach(user => {
      if (user.businessId && user.business && !businessMap.has(user.businessId)) {
        businessMap.set(user.businessId, { id: user.businessId, name: user.business });
      }
    });
    return Array.from(businessMap.values());
  }, [users]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.business.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesBusiness = businessFilter === 'all' || user.businessId?.toString() === businessFilter;
    
    return matchesSearch && matchesStatus && matchesRole && matchesBusiness;
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><Ban className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-purple-100 text-purple-800">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      case 'hr':
        return <Badge className="bg-green-100 text-green-800">HR</Badge>;
      case 'manager':
        return <Badge className="bg-orange-100 text-orange-800">Manager</Badge>;
      case 'employee':
        return <Badge className="bg-gray-100 text-gray-800">Employee</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const handleUserAction = (userId: string, action: string) => {
    const user = users.find(u => u.id === userId);
    toast({
      title: `User ${action}`,
      description: `${user?.name} has been ${action.toLowerCase()}`,
    });
  };

  const handleViewUser = (user: PlatformUser) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleEditUser = (user: PlatformUser) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleSaveUser = (updatedUser: any) => {
    console.log('Updated user:', updatedUser);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div><Skeleton className="h-9 w-64" /><Skeleton className="h-5 w-96 mt-2" /></div>
          <div className="flex space-x-2"><Skeleton className="h-10 w-32" /><Skeleton className="h-10 w-32" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
        <div className="flex flex-col sm:flex-row gap-4"><Skeleton className="h-10 flex-1" /><Skeleton className="h-10 w-[180px]" /><Skeleton className="h-10 w-[180px]" /><Skeleton className="h-10 w-[200px]" /></div>
        <Card><CardHeader><Skeleton className="h-7 w-48" /><Skeleton className="h-5 w-72 mt-2" /></CardHeader><CardContent><div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div></CardContent></Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <AlertTriangle className="h-16 w-16 text-red-500" />
        <h2 className="text-xl font-semibold mt-4">Failed to load users</h2>
        <p className="text-muted-foreground">{(error as Error).message}</p>
        <Button onClick={() => refetch()} className="mt-4">Try again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users across all businesses on the platform</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowExportDialog(true)}><Download className="w-4 h-4 mr-2" />Export Users</Button>
          <Button onClick={() => setShowInviteDialog(true)}><UserPlus className="w-4 h-4 mr-2" />Invite User</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{users.length}</div><p className="text-xs text-muted-foreground">Across all businesses</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Users</CardTitle><CheckCircle className="h-4 w-4 text-green-600" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</div><p className="text-xs text-muted-foreground">{users.length > 0 ? Math.round((users.filter(u => u.status === 'active').length / users.length) * 100) : 0}% active rate</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Admin Users</CardTitle><Users className="h-4 w-4 text-blue-600" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{users.filter(u => ['admin', 'super_admin'].includes(u.role)).length}</div><p className="text-xs text-muted-foreground">Admin & Super Admin</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Businesses</CardTitle><Building2 className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{businesses.length}</div><p className="text-xs text-muted-foreground">With active users</p></CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="suspended">Suspended</SelectItem></SelectContent></Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by role" /></SelectTrigger><SelectContent><SelectItem value="all">All Roles</SelectItem><SelectItem value="super_admin">Super Admin</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="hr">HR</SelectItem><SelectItem value="manager">Manager</SelectItem><SelectItem value="employee">Employee</SelectItem></SelectContent></Select>
        <Select value={businessFilter} onValueChange={setBusinessFilter}><SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by business" /></SelectTrigger><SelectContent><SelectItem value="all">All Businesses</SelectItem>{businesses.map((business) => (<SelectItem key={business.id} value={business.id}>{business.name}</SelectItem>))}</SelectContent></Select>
      </div>

      <Card>
        <CardHeader><CardTitle>Users ({filteredUsers.length})</CardTitle><CardDescription>Manage and monitor all platform users</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12"><AvatarImage src={user.avatar || undefined} alt={user.name} /><AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">{getStatusBadge(user.status)}{getRoleBadge(user.role)}<Badge variant="outline" className="text-xs"><Building2 className="w-3 h-3 mr-1" />{user.business}</Badge></div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center"><div className="font-semibold">{user.loginCount || 0}</div><div className="text-gray-500">Logins</div></div>
                  <div className="text-center"><div className="font-semibold">{user.country || 'N/A'}</div><div className="text-gray-500">Country</div></div>
                  <div className="text-center"><div className="font-semibold">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</div><div className="text-gray-500">Last Login</div></div>
                </div>
                <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewUser(user)}><Eye className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditUser(user)}><Edit className="mr-2 h-4 w-4" />Edit User</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status === 'active' ? (<DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')} className="text-red-600"><Ban className="mr-2 h-4 w-4" />Suspend User</DropdownMenuItem>) : (<DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')} className="text-green-600"><CheckCircle className="mr-2 h-4 w-4" />Activate User</DropdownMenuItem>)}
                  </DropdownMenuContent></DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>User Details</DialogTitle><DialogDescription>Detailed information about {selectedUser?.name}</DialogDescription></DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16"><AvatarImage src={selectedUser.avatar || undefined} alt={selectedUser.name} /><AvatarFallback className="text-lg">{selectedUser.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback></Avatar>
                <div><h3 className="text-xl font-semibold">{selectedUser.name}</h3><p className="text-gray-600">{selectedUser.email}</p><div className="flex items-center space-x-2 mt-2">{getStatusBadge(selectedUser.status)}{getRoleBadge(selectedUser.role)}</div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><h4 className="font-medium">Business Information</h4><div className="text-sm space-y-1"><div className="flex justify-between"><span className="text-gray-500">Business:</span><span>{selectedUser.business}</span></div><div className="flex justify-between"><span className="text-gray-500">Country:</span><span>{selectedUser.country}</span></div></div></div>
                <div className="space-y-2"><h4 className="font-medium">Activity Information</h4><div className="text-sm space-y-1"><div className="flex justify-between"><span className="text-gray-500">Login Count:</span><span>{selectedUser.loginCount}</span></div><div className="flex justify-between"><span className="text-gray-500">Last Login:</span><span>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'N/A'}</span></div><div className="flex justify-between"><span className="text-gray-500">Created:</span><span>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span></div></div></div>
              </div>
              <div className="space-y-2"><h4 className="font-medium">Permissions</h4><div className="flex flex-wrap gap-2">{selectedUser.permissions.map((permission: string) => (<Badge key={permission} variant="secondary">{permission}</Badge>))}</div></div>
              <div className="flex justify-end space-x-2"><Button variant="outline" onClick={() => setShowUserDetails(false)}>Close</Button><Button onClick={() => { handleEditUser(selectedUser); setShowUserDetails(false); }}>Edit User</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <UserInviteDialog open={showInviteDialog} onOpenChange={setShowInviteDialog} businesses={businesses} />
      <UserEditDialog open={showEditDialog} onOpenChange={setShowEditDialog} user={selectedUser} onSave={handleSaveUser} businesses={businesses} />
      <UserExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} />
    </div>
  );
};

export default UserManagement;
