import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Building2, CheckCircle2, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  acceptEmployeeInvitation,
  previewEmployeeInvitation,
    sendExistingUserSignInLink,
  type InvitationPreview,
} from '@/services/tenantInvitations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const InvitationAcceptance = () => {
  const { token = '' } = useParams();
  const { toast } = useToast();
  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        const [invitation, sessionResult] = await Promise.all([
          previewEmployeeInvitation(token),
          supabase.auth.getSession(),
        ]);
        if (cancelled) return;
        setPreview(invitation);
        setSessionEmail(sessionResult.data.session?.user.email || null);
      } catch (error) {
        if (!cancelled) {
          toast({
            title: 'Could not open invitation',
            description: error instanceof Error ? error.message : 'Please request a new invitation.',
            variant: 'destructive',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void initialize();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setSessionEmail(session?.user.email || null);
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [token, toast]);

  const emailSignInLink = async () => {
    if (!preview?.email) return;
    const { error } = await sendExistingUserSignInLink(preview.email, token);
    toast({
      title: error ? 'Could not send sign-in link' : 'Sign-in link sent',
      description: error?.message || `Check ${preview.email} and return through the link to accept this invitation.`,
      variant: error ? 'destructive' : 'default',
    });
  };

  const acceptInvitation = async () => {
    if (!preview?.valid) return;

    if (!sessionEmail) {
      toast({
        title: 'Sign in required',
        description: 'Use the email address that received this invitation.',
        variant: 'destructive',
      });
      return;
    }

    if (preview.requires_password) {
      if (password.length < 8 || password !== confirmPassword) {
        toast({
          title: 'Set your password',
          description: 'Use at least 8 characters and make sure both passwords match.',
          variant: 'destructive',
        });
        return;
      }
    }

    setLoading(true);
    try {
      if (preview.requires_password) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
      }

      const result = await acceptEmployeeInvitation(token);
      setAccepted(true);
      toast({
        title: 'Welcome to DDreamHR',
        description: `You joined ${result.business_name} as ${result.role}.`,
      });

      window.setTimeout(() => {
        window.location.assign('/hr-lifecycle/portal');
      }, 900);
    } catch (error) {
      toast({
        title: 'Could not accept invitation',
        description: error instanceof Error ? error.message : 'Please request a new invitation.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !preview) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Opening invitation…</div>;
  }

  if (!preview?.valid || accepted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              {accepted ? <CheckCircle2 className="h-7 w-7 text-green-600" /> : <Mail className="h-7 w-7 text-muted-foreground" />}
            </div>
            <CardTitle>{accepted ? 'Invitation accepted' : 'Invitation unavailable'}</CardTitle>
            <CardDescription>
              {accepted
                ? 'Your workspace access is ready. Redirecting you to DDreamHR…'
                : preview?.status === 'expired'
                  ? 'This invitation has expired. Ask your Admin or HR team to send a new one.'
                  : 'This invitation is invalid, revoked, or has already been used.'}
            </CardDescription>
          </CardHeader>
          {!accepted && <CardContent><Button className="w-full" asChild><Link to="/login">Go to sign in</Link></Button></CardContent>}
        </Card>
      </div>
    );
  }

  const emailMatches = sessionEmail && preview.email
    ? sessionEmail.toLowerCase() === preview.email.toLowerCase()
    : false;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"><Building2 className="h-7 w-7 text-primary" /></div>
          <CardTitle>Join {preview.business_name}</CardTitle>
          <CardDescription>{preview.employee_name}, you have been invited to join this DDreamHR workspace.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
            <div><p className="text-xs text-muted-foreground">Work email</p><p className="font-medium">{preview.email}</p></div>
            <div><p className="text-xs text-muted-foreground">Access role</p><Badge variant="secondary" className="capitalize">{preview.role}</Badge></div>
          </div>

          {!sessionEmail && (
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-start gap-3"><Mail className="mt-0.5 h-5 w-5 text-primary" /><div><p className="font-medium">Sign in to continue</p><p className="text-sm text-muted-foreground">Use {preview.email}. Existing DDreamHR users can request a one-time sign-in link.</p></div></div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={emailSignInLink}>Email me a sign-in link</Button>
                <Button variant="outline" asChild><Link to="/login">Sign in with password</Link></Button>
              </div>
            </div>
          )}

          {sessionEmail && !emailMatches && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="font-medium text-destructive">Wrong account signed in</p>
              <p className="mt-1 text-sm text-muted-foreground">You are signed in as {sessionEmail}. This invitation was sent to {preview.email}.</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setSessionEmail(null);
                }}
              >
                Sign out and switch account
              </Button>
            </div>
          )}

          {sessionEmail && emailMatches && preview.requires_password && (
            <div className="space-y-4">
              <div className="flex items-start gap-3"><KeyRound className="mt-0.5 h-5 w-5 text-primary" /><div><p className="font-medium">Set your DDreamHR password</p><p className="text-sm text-muted-foreground">You are joining for the first time. Set a password for future sign-ins.</p></div></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <div><Label>Confirm password</Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
            </div>
          )}

          {sessionEmail && emailMatches && (
            <Button className="w-full" onClick={acceptInvitation} disabled={loading}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              {loading ? 'Joining workspace…' : `Join ${preview.business_name}`}
            </Button>
          )}

          <p className="text-center text-xs text-muted-foreground">Your employer controls your DDreamHR role. Accepting links your login to the employee record already created for you.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationAcceptance;
