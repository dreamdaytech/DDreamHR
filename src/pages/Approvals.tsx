import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isDemoSession, readDemoData, writeDemoData } from '@/lib/demoStore';
import { decideWorkItem, listWorkInbox, TenantInboxItem } from '@/services/tenantWorkflow';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clock, Calendar, FileText, CheckCircle, XCircle, RefreshCw, UserPlus } from 'lucide-react';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

type ApprovalItem = {
  id: string | number;
  type: string;
  employee: string;
  employeeAvatar: string;
  date: string;
  duration: string;
  status: ApprovalStatus;
  description: string;
  submittedAt: string;
  route?: string;
  category?: string;
};

const initialApprovals: ApprovalItem[] = [
  { id: 1, type: 'Leave Request', employee: 'Jane Smith', employeeAvatar: 'JS', date: '2026-10-14', duration: '5 days', status: 'pending', description: 'Annual Leave · Family vacation', submittedAt: '2 hours ago', route: '/leave-tracking', category: 'leave' },
  { id: 2, type: 'Timesheet Review', employee: 'John Doe', employeeAvatar: 'JD', date: '2026-10-05', duration: '1 week', status: 'pending', description: 'Weekly timesheet · 2 entries flagged', submittedAt: '5 hours ago', route: '/time-tracking', category: 'timesheet' },
  { id: 3, type: 'Employee Change', employee: 'Aminata Kamara', employeeAvatar: 'AK', date: '2026-11-01', duration: 'Promotion', status: 'pending', description: 'Finance Analyst → Senior Finance Analyst', submittedAt: '6 hours ago', route: '/employees?view=changes', category: 'employee_change' },
  { id: 4, type: 'Onboarding Task', employee: 'Joseph Conteh', employeeAvatar: 'JC', date: '2026-10-12', duration: 'Due today', status: 'pending', description: 'Manager welcome meeting requires completion', submittedAt: '1 day ago', route: '/hr-lifecycle/onboarding', category: 'onboarding' },
  { id: 5, type: 'Document Review', employee: 'Mike Johnson', employeeAvatar: 'MJ', date: '2026-10-04', duration: 'Contract', status: 'pending', description: 'Employment contract revision', submittedAt: '1 day ago', route: '/documents', category: 'document' },
  { id: 6, type: 'Leave Request', employee: 'Mariama Sesay', employeeAvatar: 'MS', date: '2026-09-28', duration: '2 days', status: 'approved', description: 'Personal leave', submittedAt: '5 days ago', route: '/leave-tracking', category: 'leave' },
  { id: 7, type: 'Timesheet Review', employee: 'Mohamed Sesay', employeeAvatar: 'MS', date: '2026-09-25', duration: '1 week', status: 'rejected', description: 'Weekly timesheet requires correction', submittedAt: '1 week ago', route: '/time-tracking', category: 'timesheet' },
];

const statusStyles: Record<ApprovalStatus, string> = {
  pending: 'border-primary/30 bg-primary/10 text-primary',
  approved: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
  rejected: 'border-destructive/30 bg-destructive/10 text-destructive',
};

const iconFor = (category?: string) => {
  if (category === 'leave') return Calendar;
  if (category === 'timesheet') return Clock;
  if (category === 'employee_change') return RefreshCw;
  if (category === 'onboarding' || category === 'offboarding') return UserPlus;
  return FileText;
};

const formatSubmittedAt = (value: string) => {
  if (!value || !value.includes('T')) return value;
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const hours = Math.max(0, Math.floor(diffMs / 3600000));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const Approvals = () => {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<ApprovalStatus>('pending');
  const [approvals, setApprovals] = useState<ApprovalItem[]>(() =>
    isDemoSession() ? readDemoData<ApprovalItem[]>('inbox-items', initialApprovals) : []
  );
  const [loading, setLoading] = useState(!isDemoSession());
  const navigate = useNavigate();

  const refreshInbox = async () => {
    if (isDemoSession()) {
      setApprovals(readDemoData<ApprovalItem[]>('inbox-items', initialApprovals));
      return;
    }

    setLoading(true);
    try {
      const items = await listWorkInbox();
      setApprovals(items.map((item: TenantInboxItem) => ({
        id: item.id,
        type: item.type,
        employee: item.employee,
        employeeAvatar: item.employeeAvatar,
        date: item.date,
        duration: item.duration,
        status: item.status,
        description: item.description,
        submittedAt: formatSubmittedAt(item.submittedAt),
        route: item.route,
        category: item.category,
      })));
    } catch (error) {
      toast({
        title: 'Could not load Work Inbox',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshInbox();
  }, []);

  const filteredApprovals = useMemo(
    () => approvals.filter((approval) => approval.status === activeFilter),
    [approvals, activeFilter],
  );

  const counts = useMemo(
    () => ({
      pending: approvals.filter((approval) => approval.status === 'pending').length,
      approved: approvals.filter((approval) => approval.status === 'approved').length,
      rejected: approvals.filter((approval) => approval.status === 'rejected').length,
    }),
    [approvals],
  );

  const updateStatus = async (id: string | number, status: ApprovalStatus) => {
    if (status === 'pending') return;

    try {
      if (isDemoSession()) {
        setApprovals((current) => {
          const next = current.map((approval) => approval.id === id ? { ...approval, status } : approval);
          writeDemoData('inbox-items', next);
          return next;
        });
      } else {
        await decideWorkItem(String(id), status === 'approved' ? 'approve' : 'reject');
        await refreshInbox();
      }

      toast({
        title: status === 'approved' ? 'Request approved' : 'Request rejected',
        description: 'The source workflow and inbox item were updated.',
      });
    } catch (error) {
      toast({
        title: 'Could not update request',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground">
      <MobileHeader title="Inbox" />
      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-2xl font-bold">Work Inbox</h1>
          <p className="mt-1 text-sm text-muted-foreground">Approvals, lifecycle work and items that need your attention.</p>
        </div>

        <div className="flex space-x-2 rounded-lg bg-muted p-1">
          {(['pending', 'approved', 'rejected'] as ApprovalStatus[]).map((status) => (
            <Button key={status} variant={activeFilter === status ? 'default' : 'ghost'} size="sm" className="flex-1 rounded-md capitalize" onClick={() => setActiveFilter(status)}>
              {status}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-primary">{counts.pending}</div><div className="text-xs text-muted-foreground">Pending</div></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600 dark:text-green-400">{counts.approved}</div><div className="text-xs text-muted-foreground">Approved</div></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-destructive">{counts.rejected}</div><div className="text-xs text-muted-foreground">Rejected</div></CardContent></Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold capitalize">{activeFilter} items</h2>

          {loading && <Card><CardContent className="p-6 text-center text-muted-foreground">Loading tenant inbox…</CardContent></Card>}

          {!loading && filteredApprovals.map((approval) => {
            const Icon = iconFor(approval.category);
            return (
              <Card key={approval.id} className="transition-shadow duration-200 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="rounded-lg bg-muted p-2"><Icon className="h-5 w-5 text-primary" /></div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold">{approval.type}</h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"><span className="text-xs font-medium text-muted-foreground">{approval.employeeAvatar}</span></div>
                          <p className="text-sm text-muted-foreground">{approval.employee}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{approval.description}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>{approval.date}</span><span>•</span><span>{approval.duration}</span><span>•</span><span>{approval.submittedAt}</span></div>
                      </div>
                    </div>
                    <Badge variant="outline" className={statusStyles[approval.status]}>{approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {approval.status === 'pending' && <>
                      <Button size="sm" className="flex-1" onClick={() => updateStatus(approval.id, 'approved')}><CheckCircle className="mr-1 h-4 w-4" />Approve</Button>
                      <Button size="sm" variant="outline" className="flex-1 text-destructive" onClick={() => updateStatus(approval.id, 'rejected')}><XCircle className="mr-1 h-4 w-4" />Reject</Button>
                    </>}
                    <Button size="sm" variant="ghost" onClick={() => navigate(approval.route || '/dashboard')} disabled={!approval.route}>View</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {!loading && filteredApprovals.length === 0 && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted"><CheckCircle className="h-8 w-8 text-muted-foreground" /></div>
              <h3 className="mb-2 text-lg font-medium">No {activeFilter} items</h3>
              <p className="text-muted-foreground">There are no {activeFilter} items in your inbox.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Approvals;
