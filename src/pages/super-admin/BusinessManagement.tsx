import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Calendar, 
  Eye, 
  Edit, 
  Pause, 
  Play,
  Trash2,
  Search,
  Filter,
  Download,
  Plus
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const BusinessManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const { data: businessesData, isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ['allBusinessesList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*, country:african_countries(name)');
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { data: usersPerBusiness, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['usersPerBusiness'],
    queryFn: async () => {
      const { data, error } = await supabase.from('business_users').select('business_id');
      if (error) throw new Error(error.message);
      
      if (!data) return {};

      const counts = data.reduce((acc, { business_id }) => {
        if (business_id) {
          acc[business_id] = (acc[business_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      return counts;
    },
  });

  const businesses = useMemo(() => {
    if (!businessesData || !usersPerBusiness) return [];
    return businessesData.map(b => ({
      id: b.id,
      name: b.name,
      email: b.admin_email,
      status: b.status,
      plan: b.subscription_plan,
      employees: usersPerBusiness[b.id] || 0,
      monthlyRevenue: b.monthly_revenue || 0,
      createdAt: b.created_at,
      lastActive: b.updated_at,
      industry: b.industry,
      country: b.country?.name || 'N/A'
    }));
  }, [businessesData, usersPerBusiness]);
  
  const isLoading = isLoadingBusinesses || isLoadingUsers;

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
    const matchesPlan = planFilter === 'all' || business.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'terminated':
        return <Badge className="bg-gray-100 text-gray-800">Terminated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'trial':
        return <Badge variant="outline">Trial</Badge>;
      case 'basic':
        return <Badge className="bg-yellow-100 text-yellow-800">Basic</Badge>;
      case 'professional':
        return <Badge className="bg-blue-100 text-blue-800">Professional</Badge>;
      case 'enterprise':
        return <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  const handleBusinessAction = (businessId: string, action: string) => {
    console.log(`Performing ${action} on business ${businessId}`);
    // Implement business actions here
  };
  
  if (isLoading) {
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div><Skeleton className="h-9 w-64" /><Skeleton className="h-5 w-96 mt-2" /></div>
                <div className="flex space-x-2"><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-32" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
            <div className="flex flex-col sm:flex-row gap-4"><Skeleton className="h-10 flex-1" /><Skeleton className="h-10 w-[200px]" /><Skeleton className="h-10 w-[200px]" /></div>
            <Card><CardHeader><Skeleton className="h-7 w-48" /><Skeleton className="h-5 w-72 mt-2" /></CardHeader><CardContent><div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div></CardContent></Card>
        </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
          <p className="text-gray-600">Manage all businesses on the platform</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Business
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.filter(b => b.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((businesses.filter(b => b.status === 'active').length / businesses.length) * 100)}% active rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.reduce((sum, b) => sum + b.employees, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all businesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${businesses.reduce((sum, b) => sum + b.monthlyRevenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total MRR</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>

        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Business List */}
      <Card>
        <CardHeader>
          <CardTitle>Businesses ({filteredBusinesses.length})</CardTitle>
          <CardDescription>Manage and monitor all registered businesses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBusinesses.map((business) => (
              <div key={business.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{business.name}</h3>
                    <p className="text-sm text-gray-600">{business.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(business.status)}
                      {getPlanBadge(business.plan)}
                      <Badge variant="outline" className="text-xs">
                        {business.industry}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">{business.employees}</div>
                    <div className="text-gray-500">Employees</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">${business.monthlyRevenue}</div>
                    <div className="text-gray-500">MRR</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{business.country}</div>
                    <div className="text-gray-500">Country</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{new Date(business.createdAt).toLocaleDateString()}</div>
                    <div className="text-gray-500">Created</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleBusinessAction(business.id, 'view')}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBusinessAction(business.id, 'edit')}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  {business.status === 'active' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleBusinessAction(business.id, 'suspend')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Pause className="w-4 h-4" />
                    </Button>
                  ) : business.status === 'suspended' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleBusinessAction(business.id, 'activate')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessManagement;
