import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, CheckCircle2, Mail, Users, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getTenantContext } from '@/hooks/useTenantContext';
import {
  registerBusinessTenant,
  resendBusinessVerification,
  signUpBusinessOwner,
  slugifyWorkspace,
  type BusinessRegistrationInput,
} from '@/services/businessRegistration';
import { createTenantEmployee } from '@/services/tenantPeople';
import { roleHome, sendEmployeeInvitation, type EmployeeAccessRole } from '@/services/tenantInvitations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const DRAFT_KEY = 'ddreamhr_business_registration_draft';

const steps = [
  'Account',
  'Verify email',
  'Business',
  'Plan',
  'HR basics',
  'Create workspace',
  'Invite team',
];

const defaultBusiness: BusinessRegistrationInput = {
  name: '',
  slug: '',
  country: 'Sierra Leone',
  industry: '',
  companySize: '1-10',
  entityType: 'company',
  plan: 'trial',
  timezone: 'Africa/Freetown',
  workStart: '09:00',
  workEnd: '17:00',
  payrollFrequency: 'monthly',
  payrollPayDay: 30,
  leaveYearStart: 1,
  phone: '',
};

const BusinessRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(location.pathname === '/setup' ? 2 : 0);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [account, setAccount] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [business, setBusiness] = useState<BusinessRegistrationInput>(() => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      return stored ? { ...defaultBusiness, ...JSON.parse(stored) } : defaultBusiness;
    } catch {
      return defaultBusiness;
    }
  });
  const [workspace, setWorkspace] = useState<{ businessId: string; name: string } | null>(null);
  const [existingRole, setExistingRole] = useState<string>('admin');
  const [teamMember, setTeamMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'employee' as EmployeeAccessRole,
    department: '',
    position: '',
    startDate: new Date().toISOString().slice(0, 10),
  });
  const [invited, setInvited] = useState<Array<{
    email: string;
    role: EmployeeAccessRole;
    delivery: string;
    inviteUrl?: string;
  }>>([]);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!user) {
        if (location.pathname === '/setup') navigate('/register', { replace: true });
        setCheckingSession(false);
        return;
      }

      const context = await getTenantContext().catch(() => null);
      if (cancelled) return;

      if (context?.isSuperAdmin) {
        navigate('/super-admin/dashboard', { replace: true });
        return;
      }

      if (context?.businessId) {
        if (context.lifecycleState === 'onboarding' || context.lifecycleState === 'preboarding') {
          navigate('/hr-lifecycle/portal', { replace: true });
          return;
        }

        if (!['admin', 'hr'].includes(context.role)) {
          navigate(roleHome(context.role), { replace: true });
          return;
        }

        setExistingRole(context.role);
        setWorkspace({ businessId: context.businessId, name: context.businessName || 'Your workspace' });
        setStep(6);
      } else {
        setAccount((current) => ({ ...current, email: user.email || current.email }));
        setStep((current) => Math.max(current, 2));
      }
      setCheckingSession(false);
    };

    void initialize();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, navigate]);

  const progress = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step]);

  const updateBusiness = <K extends keyof BusinessRegistrationInput>(
    key: K,
    value: BusinessRegistrationInput[K],
  ) => {
    setBusiness((current) => {
      const next = { ...current, [key]: value };
      if (key === 'name' && (!current.slug || current.slug === slugifyWorkspace(current.name))) {
        next.slug = slugifyWorkspace(String(value));
      }
      return next;
    });
  };

  const createAccount = async () => {
    if (!account.firstName.trim() || !account.lastName.trim()) {
      toast({ title: 'Name required', description: 'Enter your first and last name.', variant: 'destructive' });
      return;
    }
    if (!account.email.includes('@')) {
      toast({ title: 'Valid email required', variant: 'destructive' });
      return;
    }
    if (account.password.length < 8 || account.password !== account.confirmPassword) {
      toast({
        title: 'Check your password',
        description: 'Use at least 8 characters and make sure both passwords match.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUpBusinessOwner(account);
      if (error) throw error;

      if (data.session) {
        setStep(2);
      } else {
        setStep(1);
      }

      toast({
        title: data.session ? 'Account created' : 'Check your email',
        description: data.session
          ? 'Continue setting up your DDreamHR workspace.'
          : 'Verify your email to continue creating your workspace.',
      });
    } catch (error) {
      toast({
        title: 'Could not create account',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkVerification = async () => {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        throw new Error('Open the verification link from your email, then continue from that browser.');
      }
      if (!user.email_confirmed_at) {
        throw new Error('Your email is not verified yet.');
      }
      setStep(2);
    } catch (error) {
      toast({
        title: 'Verification not complete',
        description: error instanceof Error ? error.message : 'Please verify your email first.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!account.email) return;
    const { error } = await resendBusinessVerification(account.email);
    toast({
      title: error ? 'Could not resend email' : 'Verification email sent',
      description: error?.message,
      variant: error ? 'destructive' : 'default',
    });
  };

  const validateBusiness = () => {
    if (!business.name.trim() || business.slug.length < 3 || !business.industry.trim() || !business.country.trim()) {
      toast({
        title: 'Complete the business details',
        description: 'Business name, workspace URL, country and industry are required.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const provisionWorkspace = async () => {
    setLoading(true);
    try {
      const created = await registerBusinessTenant(business);
      setWorkspace({ businessId: created.business_id, name: created.business_name });
      localStorage.removeItem(DRAFT_KEY);
      setStep(6);
      toast({
        title: 'Workspace created',
        description: `${created.business_name} is ready. You are the primary administrator.`,
      });
    } catch (error) {
      toast({
        title: 'Could not create workspace',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const inviteTeamMember = async () => {
    if (!teamMember.firstName.trim() || !teamMember.lastName.trim() || !teamMember.email.includes('@')) {
      toast({
        title: 'Name and email required',
        description: 'Enter the staff member’s name and work email.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const employee = await createTenantEmployee({
        employeeId: `EMP-${Date.now().toString().slice(-7)}`,
        firstName: teamMember.firstName.trim(),
        lastName: teamMember.lastName.trim(),
        email: teamMember.email.trim().toLowerCase(),
        department: teamMember.department.trim() || 'General',
        location: business.country || 'Remote',
        designation: teamMember.position.trim() || 'Employee',
        role: teamMember.role,
        employmentType: 'Permanent',
        status: 'Onboarding',
        sourceOfHire: 'DDreamHR Invitation',
        dateOfJoining: teamMember.startDate,
      });

      const result = await sendEmployeeInvitation(employee.id, teamMember.role);
      setInvited((current) => [
        {
          email: teamMember.email.trim().toLowerCase(),
          role: teamMember.role,
          delivery: result.delivery_status,
          inviteUrl: result.invite_url,
        },
        ...current,
      ]);

      setTeamMember({
        firstName: '',
        lastName: '',
        email: '',
        role: 'employee',
        department: '',
        position: '',
        startDate: new Date().toISOString().slice(0, 10),
      });

      toast({
        title: result.delivery_status === 'sent' ? 'Invitation sent' : 'Invitation created',
        description: result.delivery_status === 'sent'
          ? 'The employee can accept the invitation from their email.'
          : 'Email delivery was unavailable. Copy the invitation link from the list below.',
      });
    } catch (error) {
      toast({
        title: 'Could not invite employee',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const launchWorkspace = () => {
    window.location.assign(roleHome(existingRole || 'admin'));
  };

  if (checkingSession) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Preparing registration…</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">DDreamHR</Link>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Already have an account? Sign in</Link>
        </div>

        <Card>
          <CardHeader>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <CardDescription>Step {step + 1} of {steps.length}</CardDescription>
                <CardTitle>{steps[step]}</CardTitle>
              </div>
              <Badge variant="outline">{progress}%</Badge>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 0 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold">Create your administrator account</h2>
                  <p className="text-sm text-muted-foreground">This account will own the new DDreamHR workspace.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>First name</Label><Input value={account.firstName} onChange={(e) => setAccount({ ...account, firstName: e.target.value })} /></div>
                  <div><Label>Last name</Label><Input value={account.lastName} onChange={(e) => setAccount({ ...account, lastName: e.target.value })} /></div>
                </div>
                <div><Label>Work email</Label><Input type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} placeholder="you@company.com" /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Password</Label><Input type="password" value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} /></div>
                  <div><Label>Confirm password</Label><Input type="password" value={account.confirmPassword} onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })} /></div>
                </div>
                <Button className="w-full" onClick={createAccount} disabled={loading}>{loading ? 'Creating account…' : 'Create my workspace'}</Button>
              </>
            )}

            {step === 1 && (
              <div className="space-y-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"><Mail className="h-7 w-7 text-primary" /></div>
                <div>
                  <h2 className="text-xl font-semibold">Check your inbox</h2>
                  <p className="mt-2 text-sm text-muted-foreground">We sent a verification link to <strong>{account.email}</strong>. Open it to continue setting up your business.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Button onClick={checkVerification} disabled={loading}>{loading ? 'Checking…' : 'I’ve verified my email'}</Button>
                  <Button variant="outline" onClick={resendVerification}>Resend email</Button>
                </div>
                <Button variant="ghost" onClick={() => setStep(0)}>Use another email</Button>
              </div>
            )}

            {step === 2 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold">Tell us about your business</h2>
                  <p className="text-sm text-muted-foreground">These details create your isolated DDreamHR tenant.</p>
                </div>
                <div><Label>Business or organization name</Label><Input value={business.name} onChange={(e) => updateBusiness('name', e.target.value)} placeholder="Example Company Ltd" /></div>
                <div>
                  <Label>Workspace URL</Label>
                  <div className="flex items-center rounded-md border bg-background">
                    <span className="px-3 text-sm text-muted-foreground">ddreamhr.com/</span>
                    <Input className="border-0 shadow-none focus-visible:ring-0" value={business.slug} onChange={(e) => updateBusiness('slug', slugifyWorkspace(e.target.value))} placeholder="example-company" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Country</Label><Input value={business.country} onChange={(e) => updateBusiness('country', e.target.value)} /></div>
                  <div><Label>Industry</Label><Input value={business.industry} onChange={(e) => updateBusiness('industry', e.target.value)} placeholder="Technology, Healthcare, Education…" /></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Organization type</Label>
                    <Select value={business.entityType} onValueChange={(value) => updateBusiness('entityType', value as BusinessRegistrationInput['entityType'])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                        <SelectItem value="institution">Institution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Approximate employees</Label>
                    <Select value={business.companySize} onValueChange={(value) => updateBusiness('companySize', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1–10</SelectItem>
                        <SelectItem value="11-50">11–50</SelectItem>
                        <SelectItem value="51-200">51–200</SelectItem>
                        <SelectItem value="201-500">201–500</SelectItem>
                        <SelectItem value="501+">501+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Business phone <span className="text-muted-foreground">(optional)</span></Label><Input value={business.phone || ''} onChange={(e) => updateBusiness('phone', e.target.value)} /></div>
                <div className="flex justify-end"><Button onClick={() => validateBusiness() && setStep(3)}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold">Choose your starting plan</h2>
                  <p className="text-sm text-muted-foreground">Billing is not connected yet, so paid plans are recorded as your intended plan while the business remains in trial status.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['trial', 'Trial', 'Explore the complete tenant setup'],
                    ['standard', 'Standard', 'Core HR operations for growing teams'],
                    ['premium', 'Premium', 'Advanced HR, analytics and workflows'],
                    ['enterprise', 'Enterprise', 'Large organizations and custom controls'],
                  ].map(([value, label, description]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateBusiness('plan', value as BusinessRegistrationInput['plan'])}
                      className={`rounded-lg border p-4 text-left transition ${business.plan === value ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                    >
                      <div className="flex items-center justify-between"><span className="font-semibold">{label}</span>{business.plan === value && <CheckCircle2 className="h-5 w-5 text-primary" />}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button><Button onClick={() => setStep(4)}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
              </>
            )}

            {step === 4 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold">Configure your HR basics</h2>
                  <p className="text-sm text-muted-foreground">These defaults can be changed later in Settings.</p>
                </div>
                <div><Label>Timezone</Label><Input value={business.timezone} onChange={(e) => updateBusiness('timezone', e.target.value)} placeholder="Africa/Freetown" /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Work day starts</Label><Input type="time" value={business.workStart} onChange={(e) => updateBusiness('workStart', e.target.value)} /></div>
                  <div><Label>Work day ends</Label><Input type="time" value={business.workEnd} onChange={(e) => updateBusiness('workEnd', e.target.value)} /></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label>Payroll frequency</Label>
                    <Select value={business.payrollFrequency} onValueChange={(value) => updateBusiness('payrollFrequency', value as BusinessRegistrationInput['payrollFrequency'])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Biweekly</SelectItem>
                        <SelectItem value="semimonthly">Twice monthly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Pay day</Label><Input type="number" min={1} max={31} value={business.payrollPayDay} onChange={(e) => updateBusiness('payrollPayDay', Number(e.target.value))} /></div>
                  <div>
                    <Label>Leave year starts</Label>
                    <Select value={String(business.leaveYearStart)} onValueChange={(value) => updateBusiness('leaveYearStart', Number(value))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, index) => <SelectItem key={month} value={String(index + 1)}>{month}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button><Button onClick={() => setStep(5)}>Review workspace <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
              </>
            )}

            {step === 5 && (
              <>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"><Building2 className="h-7 w-7 text-primary" /></div>
                  <h2 className="text-xl font-semibold">Create {business.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">DDreamHR will create your tenant, administrator membership, employee record and default HR configuration in one secure transaction.</p>
                </div>
                <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
                  <div><p className="text-xs text-muted-foreground">Workspace</p><p className="font-medium">{business.slug}</p></div>
                  <div><p className="text-xs text-muted-foreground">Plan</p><p className="font-medium capitalize">{business.plan}</p></div>
                  <div><p className="text-xs text-muted-foreground">Work hours</p><p className="font-medium">{business.workStart}–{business.workEnd}</p></div>
                  <div><p className="text-xs text-muted-foreground">Payroll</p><p className="font-medium capitalize">{business.payrollFrequency} · day {business.payrollPayDay}</p></div>
                </div>
                <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(4)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button><Button onClick={provisionWorkspace} disabled={loading}>{loading ? 'Creating workspace…' : 'Create workspace'} <ShieldCheck className="ml-2 h-4 w-4" /></Button></div>
              </>
            )}

            {step === 6 && (
              <>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10"><CheckCircle2 className="h-7 w-7 text-green-600" /></div>
                  <h2 className="text-xl font-semibold">{workspace?.name || business.name} is ready</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Invite staff now, or skip this step and add them later from People.</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><h3 className="font-semibold">Invite a team member</h3></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>First name</Label><Input value={teamMember.firstName} onChange={(e) => setTeamMember({ ...teamMember, firstName: e.target.value })} /></div>
                    <div><Label>Last name</Label><Input value={teamMember.lastName} onChange={(e) => setTeamMember({ ...teamMember, lastName: e.target.value })} /></div>
                  </div>
                  <div className="mt-4"><Label>Work email</Label><Input type="email" value={teamMember.email} onChange={(e) => setTeamMember({ ...teamMember, email: e.target.value })} /></div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>Access role</Label>
                      <Select value={teamMember.role} onValueChange={(value) => setTeamMember({ ...teamMember, role: value as EmployeeAccessRole })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Department</Label><Input value={teamMember.department} onChange={(e) => setTeamMember({ ...teamMember, department: e.target.value })} placeholder="General" /></div>
                    <div><Label>Position</Label><Input value={teamMember.position} onChange={(e) => setTeamMember({ ...teamMember, position: e.target.value })} placeholder="Employee" /></div>
                  </div>
                  <div className="mt-4"><Label>Start date</Label><Input type="date" value={teamMember.startDate} onChange={(e) => setTeamMember({ ...teamMember, startDate: e.target.value })} /></div>
                  <Button className="mt-4" onClick={inviteTeamMember} disabled={loading}>{loading ? 'Sending invitation…' : 'Send invitation'}</Button>
                </div>

                {invited.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Invitations created</h3>
                    {invited.map((item) => (
                      <div key={item.email} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div><p className="font-medium">{item.email}</p><p className="text-xs capitalize text-muted-foreground">{item.role} · {item.delivery}</p></div>
                        {item.delivery === 'link_only' && item.inviteUrl && (
                          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(item.inviteUrl || '')}>Copy invite link</Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button variant="outline" onClick={launchWorkspace}>Skip for now</Button>
                  <Button onClick={launchWorkspace}>Go to DDreamHR <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">Your workspace is isolated by tenant-level access controls. Staff roles are assigned by your business, not selected by employees.</p>
      </div>
    </div>
  );
};

export default BusinessRegistration;
