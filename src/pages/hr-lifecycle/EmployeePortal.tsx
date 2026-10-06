import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, FileText, PartyPopper, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { completeMyOnboardingItem, loadMyOnboarding, type MyOnboarding } from '@/services/tenantOnboarding';
import { roleHome } from '@/services/tenantInvitations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const EmployeePortal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [onboarding, setOnboarding] = useState<MyOnboarding | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setOnboarding(await loadMyOnboarding());
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

  const completeTask = async (taskId: string) => {
    setUpdating(taskId);
    try {
      const result = await completeMyOnboardingItem(taskId);
      await refresh();
      toast({
        title: result.completed
          ? 'Onboarding completed'
          : result.activated
            ? 'Required onboarding completed'
            : 'Task completed',
        description: result.completed
          ? 'All onboarding items are complete.'
          : result.activated
            ? 'Your employee lifecycle is now Active. Optional onboarding items can still be completed.'
            : `Onboarding is ${Math.round(result.completion_percentage)}% complete.`,
      });
    } catch (error) {
      toast({
        title: 'Could not complete task',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading your onboarding…</div>;
  }

  if (!onboarding) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
              <UserCheck className="h-7 w-7 text-green-600" />
            </div>
            <CardTitle>You’re ready to work</CardTitle>
            <CardDescription>No active onboarding checklist is assigned to your employee record.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild><Link to={roleHome(user?.role)}>Go to dashboard</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completed = new Set(onboarding.completedItems);
  const allDone = onboarding.completionPercentage >= 100 || Boolean(onboarding.completedAt);
  const requiredComplete = onboarding.lifecycleState === 'active';

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {onboarding.employeeName}</h1>
        <p className="text-muted-foreground">
          {onboarding.position} · {onboarding.department}
          {onboarding.employeeNumber ? ` · ${onboarding.employeeNumber}` : ''}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{onboarding.templateName}</CardTitle>
              <CardDescription>Complete your assigned onboarding items before moving into normal day-to-day work.</CardDescription>
            </div>
            <Badge variant={allDone ? 'default' : 'secondary'}>{Math.round(onboarding.completionPercentage)}% complete</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={onboarding.completionPercentage} />
        </CardContent>
      </Card>

      {allDone && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <PartyPopper className="h-10 w-10 text-green-600" />
            <div>
              <h2 className="text-xl font-semibold">Onboarding complete</h2>
              <p className="mt-1 text-sm text-muted-foreground">All assigned onboarding items are complete and your DDreamHR workspace is ready.</p>
            </div>
            <Button asChild><Link to={roleHome(user?.role)}>Continue to dashboard</Link></Button>
          </CardContent>
        </Card>
      )}

      {!allDone && requiredComplete && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-green-700 dark:text-green-400">Required onboarding complete</h2>
              <p className="mt-1 text-sm text-muted-foreground">You are now an Active employee. You can continue to your dashboard and finish any optional items later.</p>
            </div>
            <Button asChild><Link to={roleHome(user?.role)}>Continue to dashboard</Link></Button>
          </CardContent>
        </Card>
      )}

      {!allDone && (
        <div className="space-y-3">
          {onboarding.tasks.map((task) => {
            const isComplete = completed.has(task.id);
            return (
              <Card key={task.id} className={isComplete ? 'border-green-500/30 bg-green-500/5' : ''}>
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="flex items-start gap-3">
                    {isComplete
                      ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                      : <Circle className="mt-0.5 h-5 w-5 text-muted-foreground" />}
                    <div>
                      <p className={isComplete ? 'font-medium text-muted-foreground line-through' : 'font-medium'}>{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.required ? 'Required' : 'Optional'} onboarding item</p>
                    </div>
                  </div>
                  {!isComplete && (
                    <Button size="sm" onClick={() => completeTask(task.id)} disabled={updating === task.id}>
                      {updating === task.id ? 'Saving…' : 'Mark complete'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div><p className="font-medium">Company documents</p><p className="text-sm text-muted-foreground">Policies and employee documents are available in your secure document library.</p></div>
          </div>
          <Button variant="outline" asChild><Link to="/documents">Open Documents</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeePortal;
