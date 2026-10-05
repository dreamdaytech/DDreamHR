import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, CalendarClock, CircleCheck, Clock3, RefreshCw, UserRound } from 'lucide-react';

type ChangeStatus = 'pending' | 'approved' | 'scheduled' | 'completed';

type EmployeeChange = {
  id: string;
  employee: string;
  employeeId: string;
  type: string;
  effectiveDate: string;
  oldValue: string;
  newValue: string;
  reason: string;
  status: ChangeStatus;
  approvals: string[];
};

const changes: EmployeeChange[] = [
  {
    id: 'CHG-1042',
    employee: 'Aminata Kamara',
    employeeId: '1',
    type: 'Promotion',
    effectiveDate: '01 Nov 2026',
    oldValue: 'Finance Analyst',
    newValue: 'Senior Finance Analyst',
    reason: 'Annual promotion cycle',
    status: 'pending',
    approvals: ['Manager ✓', 'HR ✓', 'Finance pending'],
  },
  {
    id: 'CHG-1041',
    employee: 'Joseph Conteh',
    employeeId: '1',
    type: 'Manager Change',
    effectiveDate: '15 Oct 2026',
    oldValue: 'Mariama Sesay',
    newValue: 'Fatmata Cole',
    reason: 'Team restructure',
    status: 'approved',
    approvals: ['Manager ✓', 'HR ✓'],
  },
  {
    id: 'CHG-1038',
    employee: 'Hawa Koroma',
    employeeId: '1',
    type: 'Salary Change',
    effectiveDate: '01 Nov 2026',
    oldValue: 'SLE 8,500 / month',
    newValue: 'SLE 10,000 / month',
    reason: 'Market adjustment',
    status: 'scheduled',
    approvals: ['Manager ✓', 'HR ✓', 'Finance ✓'],
  },
  {
    id: 'CHG-1032',
    employee: 'Abdul Bangura',
    employeeId: '1',
    type: 'Department Transfer',
    effectiveDate: '01 Oct 2026',
    oldValue: 'Operations',
    newValue: 'Customer Success',
    reason: 'Internal transfer',
    status: 'completed',
    approvals: ['Manager ✓', 'HR ✓'],
  },
];

const statusMeta: Record<ChangeStatus, { label: string; icon: typeof Clock3 }> = {
  pending: { label: 'Pending approval', icon: Clock3 },
  approved: { label: 'Approved', icon: CircleCheck },
  scheduled: { label: 'Scheduled', icon: CalendarClock },
  completed: { label: 'Completed', icon: CircleCheck },
};

const EmployeeChanges = () => {
  const [tab, setTab] = useState<ChangeStatus | 'all'>('all');
  const filtered = useMemo(() => tab === 'all' ? changes : changes.filter((change) => change.status === tab), [tab]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">People operations</p>
          <h1 className="text-3xl font-bold tracking-tight">Employee Changes</h1>
          <p className="mt-1 text-muted-foreground">
            Effective-dated employment events with approvals and history.
          </p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          New change
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(['pending', 'approved', 'scheduled', 'completed'] as ChangeStatus[]).map((status) => (
          <Card key={status}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{statusMeta[status].label}</p>
              <p className="mt-1 text-2xl font-bold">{changes.filter((change) => change.status === status).length}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as ChangeStatus | 'all')}>
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-4">
          {filtered.map((change) => {
            const StatusIcon = statusMeta[change.status].icon;
            return (
              <Card key={change.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-lg">{change.type}</CardTitle>
                        <Badge variant="outline" className="gap-1">
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusMeta[change.status].label}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">{change.id} · Effective {change.effectiveDate}</CardDescription>
                    </div>
                    <Link to={`/people/employees/${change.employeeId}`}>
                      <Button variant="ghost" size="sm">
                        Employee record <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="rounded-full bg-muted p-2"><UserRound className="h-4 w-4 text-primary" /></div>
                    <div>
                      <p className="font-medium">{change.employee}</p>
                      <p className="text-sm text-muted-foreground">{change.reason}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Before</p>
                      <p className="mt-1 font-medium">{change.oldValue}</p>
                    </div>
                    <ArrowRight className="mx-auto hidden h-5 w-5 text-muted-foreground md:block" />
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">After</p>
                      <p className="mt-1 font-medium">{change.newValue}</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium">Approval progress</p>
                    <div className="flex flex-wrap gap-2">
                      {change.approvals.map((approval) => (
                        <Badge key={approval} variant="secondary">{approval}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeChanges;
