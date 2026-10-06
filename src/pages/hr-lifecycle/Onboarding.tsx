import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, UserPlus, Users } from 'lucide-react';
import { listTenantOnboardingAssignments } from '@/services/tenantOnboarding';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

type Assignment = Awaited<ReturnType<typeof listTenantOnboardingAssignments>>[number];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      setAssignments(await listTenantOnboardingAssignments());
    } catch (error) {
      toast({
        title: 'Could not load onboarding',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const active = useMemo(() => assignments.filter((item) => !item.completedAt), [assignments]);
  const completed = useMemo(() => assignments.filter((item) => Boolean(item.completedAt)), [assignments]);
  const average = assignments.length
    ? Math.round(assignments.reduce((sum, item) => sum + item.progress, 0) / assignments.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Onboarding Management</h1>
          <p className="text-muted-foreground">Track employees who accepted DDreamHR invitations and are completing their onboarding checklist.</p>
        </div>
        <Button variant="outline" onClick={() => void refresh()} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-4"><UserPlus className="h-7 w-7 text-primary" /><div><p className="text-2xl font-bold">{active.length}</p><p className="text-sm text-muted-foreground">Active onboarding</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><CheckCircle2 className="h-7 w-7 text-green-600" /><div><p className="text-2xl font-bold">{completed.length}</p><p className="text-sm text-muted-foreground">Completed</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Users className="h-7 w-7 text-primary" /><div><p className="text-2xl font-bold">{average}%</p><p className="text-sm text-muted-foreground">Average progress</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee onboarding</CardTitle>
          <CardDescription>Checklist progress is updated directly from each employee’s onboarding portal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <div className="py-8 text-center text-muted-foreground">Loading onboarding assignments…</div>}
          {!loading && assignments.length === 0 && (
            <div className="py-10 text-center">
              <Clock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No onboarding assignments yet</p>
              <p className="text-sm text-muted-foreground">Employees will appear here after accepting their workspace invitation.</p>
            </div>
          )}

          {assignments.map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{item.employeeName}</p>
                    <Badge variant={item.completedAt ? 'default' : 'secondary'}>{item.completedAt ? 'Completed' : 'Onboarding'}</Badge>
                    <Badge variant="outline">{item.templateName}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.position} · {item.department}{item.employeeNumber ? ` · ${item.employeeNumber}` : ''}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.startDate ? `Start date ${new Date(item.startDate).toLocaleDateString()}` : 'Start date not set'}</span>
                    <span>•</span>
                    <span>{item.completedTasks}/{item.totalTasks} tasks</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={item.progress} className="max-w-sm" />
                    <span className="text-sm font-medium">{Math.round(item.progress)}%</span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => navigate(`/employees/${item.employeeId}`)}>View Employee</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
