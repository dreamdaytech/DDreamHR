import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { isDemoSession, readDemoData, writeDemoData } from '@/lib/demoStore';
import { advanceEmployeeChange, createEmployeeChange, listEmployeeChanges } from '@/services/tenantPeople';
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

const seedChanges: EmployeeChange[] = [
  {
    id: 'CHG-1042',
    employee: 'Aminata Kamara',
    employeeId: '1',
    type: 'Promotion',
    effectiveDate: '2026-11-01',
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
    effectiveDate: '2026-10-15',
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
    effectiveDate: '2026-11-01',
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
    effectiveDate: '2026-10-01',
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
  const { toast } = useToast();
  const [tab, setTab] = useState<ChangeStatus | 'all'>('all');
  const [changes, setChanges] = useState<EmployeeChange[]>(() =>
    isDemoSession() ? readDemoData('employee-changes', seedChanges) : []
  );

  const refreshChanges = useCallback(async () => {
    if (isDemoSession()) {
      setChanges(readDemoData('employee-changes', seedChanges));
      return;
    }

    try {
      const rows = await listEmployeeChanges();
      setChanges(rows.map((row) => ({
        id: row.id,
        employee: `${row.employees?.first_name || ''} ${row.employees?.last_name || ''}`.trim(),
        employeeId: row.employee_id,
        type: String(row.change_type || 'other').split('_').map((part: string) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '),
        effectiveDate: row.effective_date,
        oldValue: row.before_value?.value ?? JSON.stringify(row.before_value || {}),
        newValue: row.after_value?.value ?? JSON.stringify(row.after_value || {}),
        reason: row.reason,
        status: row.status,
        approvals: row.status === 'pending'
          ? ['Manager pending', 'HR pending']
          : row.status === 'approved'
            ? ['Manager ✓', 'HR ✓']
            : ['Workflow complete'],
      })) as EmployeeChange[]);
    } catch (error) {
      toast({
        title: 'Could not load employee changes',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    void refreshChanges();
  }, [refreshChanges]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState({
    employee: '',
    employeeId: '1',
    type: 'Promotion',
    effectiveDate: '',
    oldValue: '',
    newValue: '',
    reason: '',
  });

  const filtered = useMemo(
    () => (tab === 'all' ? changes : changes.filter((change) => change.status === tab)),
    [changes, tab],
  );

  const saveChanges = (next: EmployeeChange[]) => {
    setChanges(next);
    if (isDemoSession()) writeDemoData('employee-changes', next);
  };

  const createChange = async () => {
    if (!draft.employee.trim() || !draft.effectiveDate || !draft.oldValue.trim() || !draft.newValue.trim() || !draft.reason.trim()) {
      toast({
        title: 'Complete the change request',
        description: 'Employee, effective date, before/after values and reason are required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isDemoSession()) {
        const newChange: EmployeeChange = {
          id: `CHG-${Date.now().toString().slice(-6)}`,
          employee: draft.employee.trim(),
          employeeId: draft.employeeId.trim() || '1',
          type: draft.type,
          effectiveDate: draft.effectiveDate,
          oldValue: draft.oldValue.trim(),
          newValue: draft.newValue.trim(),
          reason: draft.reason.trim(),
          status: 'pending',
          approvals: ['Manager pending', 'HR pending'],
        };
        saveChanges([newChange, ...changes]);
      } else {
        await createEmployeeChange(draft);
        await refreshChanges();
      }

      setDialogOpen(false);
      setDraft({ employee: '', employeeId: '1', type: 'Promotion', effectiveDate: '', oldValue: '', newValue: '', reason: '' });
      setTab('pending');
      toast({ title: 'Employee change created', description: 'The change is now awaiting approval.' });
    } catch (error) {
      toast({
        title: 'Could not create employee change',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const advanceStatus = async (id: string) => {
    const current = changes.find((change) => change.id === id);
    if (!current) return;

    const nextStatus = current.status === 'pending'
      ? 'approved'
      : current.status === 'approved'
        ? 'scheduled'
        : current.status === 'scheduled'
          ? 'completed'
          : null;

    if (!nextStatus) return;

    try {
      if (isDemoSession()) {
        const next = changes.map((change) => {
          if (change.id !== id) return change;
          if (nextStatus === 'approved') return { ...change, status: nextStatus, approvals: ['Manager ✓', 'HR ✓'] };
          return { ...change, status: nextStatus };
        });
        saveChanges(next);
      } else {
        await advanceEmployeeChange(id, nextStatus);
        await refreshChanges();
      }

      toast({ title: 'Change updated', description: 'The employee change moved to its next workflow stage.' });
    } catch (error) {
      toast({
        title: 'Could not update change',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

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
        <Button onClick={() => setDialogOpen(true)}>
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
                    <Link to={`/employees/${change.employeeId}`}>
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

                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="mb-2 text-sm font-medium">Approval progress</p>
                      <div className="flex flex-wrap gap-2">
                        {change.approvals.map((approval) => (
                          <Badge key={approval} variant="secondary">{approval}</Badge>
                        ))}
                      </div>
                    </div>
                    {change.status !== 'completed' && (
                      <Button variant="outline" size="sm" onClick={() => advanceStatus(change.id)}>
                        {change.status === 'pending' ? 'Approve' : change.status === 'approved' ? 'Schedule' : 'Mark completed'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Create employee change</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="change-employee">Employee</Label>
              <Input id="change-employee" value={draft.employee} onChange={(e) => setDraft({ ...draft, employee: e.target.value })} placeholder="Employee name" />
            </div>
            <div className="grid gap-2">
              <Label>Change type</Label>
              <Select value={draft.type} onValueChange={(type) => setDraft({ ...draft, type })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Promotion">Promotion</SelectItem>
                  <SelectItem value="Salary Change">Salary Change</SelectItem>
                  <SelectItem value="Department Transfer">Department Transfer</SelectItem>
                  <SelectItem value="Manager Change">Manager Change</SelectItem>
                  <SelectItem value="Employment Type Change">Employment Type Change</SelectItem>
                  <SelectItem value="Termination">Termination</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="change-date">Effective date</Label>
              <Input id="change-date" type="date" value={draft.effectiveDate} onChange={(e) => setDraft({ ...draft, effectiveDate: e.target.value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="change-before">Before</Label>
                <Input id="change-before" value={draft.oldValue} onChange={(e) => setDraft({ ...draft, oldValue: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="change-after">After</Label>
                <Input id="change-after" value={draft.newValue} onChange={(e) => setDraft({ ...draft, newValue: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="change-reason">Reason</Label>
              <Textarea id="change-reason" value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} />
            </div>
            <Button onClick={createChange}>Create change request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeChanges;
