import { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, Mail, RefreshCw, ShieldX } from 'lucide-react';
import {
  listEmployeeInvitations,
  revokeEmployeeInvitation,
  sendEmployeeInvitation,
} from '@/services/tenantInvitations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type Invitation = Awaited<ReturnType<typeof listEmployeeInvitations>>[number];

const EmployeeInvitations = () => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setInvitations(await listEmployeeInvitations());
    } catch (error) {
      toast({
        title: 'Could not load invitations',
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

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return invitations;
    return invitations.filter((item) =>
      item.employeeName.toLowerCase().includes(term)
      || item.email.toLowerCase().includes(term)
      || item.department.toLowerCase().includes(term)
      || item.status.toLowerCase().includes(term)
    );
  }, [invitations, search]);

  const resend = async (invitation: Invitation) => {
    setActingId(invitation.id);
    try {
      const result = await sendEmployeeInvitation(invitation.employeeId, invitation.role);
      if (result.delivery_status === 'link_only') {
        await navigator.clipboard.writeText(result.invite_url);
        toast({
          title: 'New invitation link copied',
          description: 'Email delivery was unavailable. Send the copied secure link to the employee.',
        });
      } else {
        toast({ title: 'Invitation resent', description: `A new invitation was sent to ${invitation.email}.` });
      }
      await refresh();
    } catch (error) {
      toast({
        title: 'Could not resend invitation',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActingId(null);
    }
  };

  const revoke = async (invitation: Invitation) => {
    setActingId(invitation.id);
    try {
      await revokeEmployeeInvitation(invitation.id);
      await refresh();
      toast({ title: 'Invitation revoked', description: invitation.email });
    } catch (error) {
      toast({
        title: 'Could not revoke invitation',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActingId(null);
    }
  };

  const pending = invitations.filter((item) => item.status === 'pending').length;
  const accepted = invitations.filter((item) => item.status === 'accepted').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff Invitations</h1>
        <p className="text-muted-foreground">Track workspace access invitations. Employee records remain separate from login access.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{pending}</p><p className="text-sm text-muted-foreground">Pending</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{accepted}</p><p className="text-sm text-muted-foreground">Accepted</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{invitations.length}</p><p className="text-sm text-muted-foreground">Total invitations</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invitation history</CardTitle>
          <CardDescription>Resending automatically revokes the previous pending token and generates a new seven-day invitation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search name, email, department or status…" value={search} onChange={(event) => setSearch(event.target.value)} />

          {loading && <div className="py-8 text-center text-muted-foreground">Loading invitations…</div>}

          {!loading && filtered.length === 0 && (
            <div className="py-10 text-center">
              <Mail className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No staff invitations found</p>
              <p className="text-sm text-muted-foreground">Use Add Employee and choose “Send DDreamHR invitation now”.</p>
            </div>
          )}

          {filtered.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 rounded-lg border p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{item.employeeName || item.email}</p>
                  <Badge variant="outline" className="capitalize">{item.status}</Badge>
                  <Badge variant="secondary" className="capitalize">{item.role}</Badge>
                  <Badge variant="outline" className="capitalize">{item.deliveryStatus.replace('_', ' ')}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.position} · {item.department}
                  {item.employeeNumber ? ` · ${item.employeeNumber}` : ''}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.status === 'accepted' && item.acceptedAt
                    ? `Accepted ${new Date(item.acceptedAt).toLocaleString()}`
                    : `Expires ${new Date(item.expiresAt).toLocaleString()}`}
                </p>
                {item.deliveryError && <p className="mt-1 text-xs text-destructive">{item.deliveryError}</p>}
              </div>

              {item.status === 'pending' && (
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => void resend(item)} disabled={actingId === item.id}>
                    <RefreshCw className="mr-2 h-4 w-4" />Resend
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => void revoke(item)} disabled={actingId === item.id}>
                    <ShieldX className="mr-2 h-4 w-4" />Revoke
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeInvitations;
