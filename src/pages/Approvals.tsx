import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, FileText, CheckCircle, XCircle, RefreshCw, UserPlus } from 'lucide-react';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

type ApprovalItem = {
  id: number;
  type: string;
  employee: string;
  employeeAvatar: string;
  date: string;
  duration: string;
  status: ApprovalStatus;
  icon: React.ElementType;
  description: string;
  submittedAt: string;
  route?: string;
};

const initialApprovals: ApprovalItem[] = [
  {
    id: 1,
    type: 'Leave Request',
    employee: 'Jane Smith',
    employeeAvatar: 'JS',
    date: '2026-10-14',
    duration: '5 days',
    status: 'pending',
    icon: Calendar,
    description: 'Annual Leave · Family vacation',
    submittedAt: '2 hours ago'
  },
  {
    id: 2,
    type: 'Timesheet Review',
    employee: 'John Doe',
    employeeAvatar: 'JD',
    date: '2026-10-05',
    duration: '1 week',
    status: 'pending',
    icon: Clock,
    description: 'Weekly timesheet · 2 entries flagged',
    submittedAt: '5 hours ago'
  },
  {
    id: 3,
    type: 'Employee Change',
    employee: 'Aminata Kamara',
    employeeAvatar: 'AK',
    date: '2026-11-01',
    duration: 'Promotion',
    status: 'pending',
    icon: RefreshCw,
    description: 'Finance Analyst → Senior Finance Analyst',
    submittedAt: '6 hours ago',
    route: '/employees?view=changes'
  },
  {
    id: 4,
    type: 'Onboarding Task',
    employee: 'Joseph Conteh',
    employeeAvatar: 'JC',
    date: '2026-10-12',
    duration: 'Due today',
    status: 'pending',
    icon: UserPlus,
    description: 'Manager welcome meeting requires completion',
    submittedAt: '1 day ago',
    route: '/employees?view=new-hires'
  },
  {
    id: 5,
    type: 'Document Review',
    employee: 'Mike Johnson',
    employeeAvatar: 'MJ',
    date: '2026-10-04',
    duration: 'Contract',
    status: 'pending',
    icon: FileText,
    description: 'Employment contract revision',
    submittedAt: '1 day ago'
  },
  {
    id: 6,
    type: 'Leave Request',
    employee: 'Mariama Sesay',
    employeeAvatar: 'MS',
    date: '2026-09-28',
    duration: '2 days',
    status: 'approved',
    icon: Calendar,
    description: 'Personal leave',
    submittedAt: '5 days ago'
  },
  {
    id: 7,
    type: 'Timesheet Review',
    employee: 'Mohamed Sesay',
    employeeAvatar: 'MS',
    date: '2026-09-25',
    duration: '1 week',
    status: 'rejected',
    icon: Clock,
    description: 'Weekly timesheet requires correction',
    submittedAt: '1 week ago'
  }
];

const statusStyles: Record<ApprovalStatus, string> = {
  pending: 'border-primary/30 bg-primary/10 text-primary',
  approved: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
  rejected: 'border-destructive/30 bg-destructive/10 text-destructive'
};

const Approvals = () => {
  const [activeFilter, setActiveFilter] = useState<ApprovalStatus>('pending');
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const navigate = useNavigate();

  const filteredApprovals = useMemo(
    () => approvals.filter((approval) => approval.status === activeFilter),
    [approvals, activeFilter]
  );

  const counts = useMemo(
    () => ({
      pending: approvals.filter((approval) => approval.status === 'pending').length,
      approved: approvals.filter((approval) => approval.status === 'approved').length,
      rejected: approvals.filter((approval) => approval.status === 'rejected').length
    }),
    [approvals]
  );

  const updateStatus = (id: number, status: ApprovalStatus) => {
    setApprovals((current) =>
      current.map((approval) => (approval.id === id ? { ...approval, status } : approval))
    );
  };

  const handleViewDetails = (item: ApprovalItem) => {
    if (item.route) navigate(item.route);
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
            <Button
              key={status}
              variant={activeFilter === status ? 'default' : 'ghost'}
              size="sm"
              className="flex-1 rounded-md capitalize"
              onClick={() => setActiveFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{counts.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{counts.approved}</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{counts.rejected}</div>
              <div className="text-xs text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold capitalize">{activeFilter} items</h2>

          {filteredApprovals.map((approval) => (
            <Card key={approval.id} className="transition-shadow duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="rounded-lg bg-muted p-2">
                      <approval.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold">{approval.type}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                          <span className="text-xs font-medium text-muted-foreground">{approval.employeeAvatar}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{approval.employee}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{approval.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{approval.date}</span><span>•</span><span>{approval.duration}</span><span>•</span><span>{approval.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={statusStyles[approval.status]}>
                    {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {approval.status === 'pending' && (
                    <>
                      <Button size="sm" className="flex-1" onClick={() => updateStatus(approval.id, 'approved')}>
                        <CheckCircle className="mr-1 h-4 w-4" />Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-destructive" onClick={() => updateStatus(approval.id, 'rejected')}>
                        <XCircle className="mr-1 h-4 w-4" />Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleViewDetails(approval)} disabled={!approval.route}>
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredApprovals.length === 0 && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
              </div>
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
