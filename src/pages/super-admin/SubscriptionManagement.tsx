import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DemoBusiness, getDemoBusinesses, saveDemoBusinesses } from '@/lib/demoPlatformData';

const SubscriptionManagement = () => {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<DemoBusiness[]>(getDemoBusinesses);

  const updatePlan = (id: string, plan: DemoBusiness['plan']) => {
    const next = businesses.map((item) => item.id === id ? {
      ...item,
      plan,
      status: plan === 'trial' ? 'trial' as const : item.status === 'trial' ? 'active' as const : item.status,
    } : item);
    setBusinesses(next);
    saveDemoBusinesses(next);
    toast({ title: 'Subscription updated', description: 'The demo business plan was updated.' });
  };

  const updateStatus = (id: string, status: DemoBusiness['status']) => {
    const next = businesses.map((item) => item.id === id ? { ...item, status } : item);
    setBusinesses(next);
    saveDemoBusinesses(next);
    toast({ title: 'Subscription status updated', description: 'Business is now ' + status + '.' });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Subscription Management</h1><p className="text-muted-foreground">Plans and subscription status use the shared persistent demo business dataset.</p></div>
      <Card>
        <CardHeader><CardTitle>Business Subscriptions</CardTitle><CardDescription>Change a plan or subscription status directly from the table.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Business</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead><TableHead>MRR</TableHead></TableRow></TableHeader>
            <TableBody>
              {businesses.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell><Select value={item.plan} onValueChange={(value) => updatePlan(item.id, value as DemoBusiness['plan'])}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="trial">Trial</SelectItem><SelectItem value="basic">Basic</SelectItem><SelectItem value="professional">Professional</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem></SelectContent></Select></TableCell>
                  <TableCell><Select value={item.status} onValueChange={(value) => updateStatus(item.id, value as DemoBusiness['status'])}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="trial">Trial</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="terminated">Terminated</SelectItem></SelectContent></Select></TableCell>
                  <TableCell><Badge variant="outline">{item.monthlyRevenue.toLocaleString()} / month</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
