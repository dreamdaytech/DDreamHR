import { useCallback, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { listPlatformBusinesses, updatePlatformBusiness, type PlatformBusiness } from '@/services/platformBusinesses';

const SubscriptionManagement = () => {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<PlatformBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setBusinesses(await listPlatformBusinesses());
    } catch (error) {
      toast({
        title: 'Could not load subscriptions',
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

  const updatePlan = async (item: PlatformBusiness, plan: PlatformBusiness['plan']) => {
    try {
      await updatePlatformBusiness(item.id, {
        plan,
        status: plan === 'trial' ? 'trial' : item.status === 'trial' ? 'active' : item.status,
      });
      await refresh();
      toast({ title: 'Subscription updated', description: `${item.name} is now on ${plan}.` });
    } catch (error) {
      toast({
        title: 'Could not update plan',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateStatus = async (item: PlatformBusiness, status: PlatformBusiness['status']) => {
    try {
      await updatePlatformBusiness(item.id, { status });
      await refresh();
      toast({ title: 'Subscription status updated', description: `${item.name} is now ${status}.` });
    } catch (error) {
      toast({
        title: 'Could not update status',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Subscription Management</h1><p className="text-muted-foreground">Live tenant plan and account status. Self-service registrations begin in trial status until billing is connected.</p></div>
      <Card>
        <CardHeader><CardTitle>Business Subscriptions</CardTitle><CardDescription>Changing a plan or status updates the real business tenant.</CardDescription></CardHeader>
        <CardContent>
          {loading ? <div className="py-8 text-center text-muted-foreground">Loading subscriptions…</div> : (
            <Table>
              <TableHeader><TableRow><TableHead>Business</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead><TableHead>Employees</TableHead><TableHead>MRR</TableHead></TableRow></TableHeader>
              <TableBody>
                {businesses.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><div className="font-medium">{item.name}</div><div className="text-xs text-muted-foreground">{item.email}</div></TableCell>
                    <TableCell><Select value={item.plan} onValueChange={(value) => void updatePlan(item, value as PlatformBusiness['plan'])}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="trial">Trial</SelectItem><SelectItem value="basic">Basic</SelectItem><SelectItem value="standard">Standard</SelectItem><SelectItem value="premium">Premium</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent></Select></TableCell>
                    <TableCell><Select value={item.status} onValueChange={(value) => void updateStatus(item, value as PlatformBusiness['status'])}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="trial">Trial</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></TableCell>
                    <TableCell>{item.employees}</TableCell>
                    <TableCell><Badge variant="outline">{item.monthlyRevenue.toLocaleString()} / month</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
