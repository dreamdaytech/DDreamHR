
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SubscriptionManagement: React.FC = () => {
    const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('businesses').select('id, name, subscription_plan, status, created_at');
      if (error) throw error;
      if (!data) return [];
      
      return data.map((b) => {
        const statusMap: Record<string, string> = {
          active: 'Active',
          trial: 'Active',
          suspended: 'Past Due',
        };

        const nextBillingDate = new Date(b.created_at);
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

        return {
          id: b.id,
          business: b.name,
          plan: b.subscription_plan,
          status: statusMap[b.status] || 'Canceled',
          nextBilling: b.status === 'suspended' ? 'N/A' : nextBillingDate.toISOString().split('T')[0],
        };
      });
    },
    initialData: []
  });

  const getStatusVariant = (status: string): 'default' | 'destructive' | 'outline' => {
    if (status === 'Active') return 'default';
    if (status === 'Past Due') return 'destructive';
    return 'outline';
  }

  if (isLoading) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Subscription Management</h1>
            <Card>
                <CardHeader><CardTitle><Skeleton className="h-7 w-48" /></CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-2 mt-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscription Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Business Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Billing Date</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.business}</TableCell>
                  <TableCell><Badge variant="outline">{sub.plan}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(sub.status)}>
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{sub.nextBilling}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Upgrade/Downgrade Plan</DropdownMenuItem>
                        <DropdownMenuItem>Cancel Subscription</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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
