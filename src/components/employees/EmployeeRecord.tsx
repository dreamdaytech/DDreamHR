import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { readDemoData, writeDemoData } from '@/lib/demoStore';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Target,
  UserRound,
  Users,
} from 'lucide-react';

const seedEmployee = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@dreamdayhr.com',
  phone: '+232 76 000 000',
  position: 'Senior Frontend Developer',
  department: 'Engineering',
  location: 'Freetown',
  manager: 'Jane Wilson',
  startDate: '15 Mar 2020',
  employmentType: 'Full-time',
  lifecycle: 'Active',
  condition: 'Working',
  salary: 'SLE 95,000',
  imageUrl: '/placeholder.svg',
};

const timeline = [
  { date: '03 Oct 2026', title: 'Annual leave approved', detail: '5 days · 14–18 Oct 2026' },
  { date: '28 Sep 2026', title: 'Salary adjustment approved', detail: 'Effective 01 Oct 2026' },
  { date: '20 Sep 2026', title: 'Performance review completed', detail: 'Overall rating: Exceeds expectations' },
  { date: '01 Aug 2025', title: 'Promoted', detail: 'Frontend Developer → Senior Frontend Developer' },
  { date: '15 Mar 2020', title: 'Joined DDreamHR', detail: 'Frontend Developer · Engineering' },
];

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value}</p>
  </div>
);

const EmployeeRecord = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storedEmployees = useMemo(() => readDemoData<any[]>('employees', []), [id]);
  const storedEmployee = storedEmployees.find((item) => String(item.id) === String(id));
  const initialEmployee = {
    ...seedEmployee,
    ...(storedEmployee || {}),
    manager: storedEmployee?.reportingManager || storedEmployee?.manager || seedEmployee.manager,
    employmentType: storedEmployee?.employmentType || seedEmployee.employmentType,
    lifecycle: storedEmployee?.status === 'Onboarding' ? 'Onboarding' : storedEmployee?.status === 'Terminated' ? 'Former Employee' : seedEmployee.lifecycle,
    condition: storedEmployee?.status === 'On Leave' ? 'On Leave' : storedEmployee?.status === 'Probation' ? 'Probation' : seedEmployee.condition,
  };
  const [employee, setEmployee] = useState(initialEmployee);
  const [editOpen, setEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState({
    name: initialEmployee.name,
    position: initialEmployee.position,
    department: initialEmployee.department,
    manager: initialEmployee.manager,
    location: initialEmployee.location,
  });

  const saveEmployee = () => {
    const nextEmployee = { ...employee, ...editDraft };
    setEmployee(nextEmployee);
    if (storedEmployee) {
      const next = storedEmployees.map((item) =>
        String(item.id) === String(id)
          ? { ...item, ...editDraft, reportingManager: editDraft.manager }
          : item,
      );
      writeDemoData('employees', next);
    }
    setEditOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/employees')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            People
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">Employee record · #{id || employee.id}</p>
            <h1 className="text-2xl font-bold tracking-tight">Employee Profile</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline">More actions</Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/employees?view=changes')}>Create employee change</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/employees?view=offboarding')}>Start offboarding</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/documents')}>Open documents</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setEditOpen(true)}>Edit employee</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={employee.imageUrl} alt={employee.name} />
                <AvatarFallback className="text-xl">JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold">{employee.name}</h2>
                  <Badge>{employee.lifecycle}</Badge>
                  <Badge variant="outline">{employee.condition}</Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{employee.position} · {employee.department}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{employee.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{employee.phone}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{employee.location}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:min-w-[460px]">
              <InfoRow label="Manager" value={employee.manager} />
              <InfoRow label="Start date" value={employee.startDate} />
              <InfoRow label="Employment" value={employee.employmentType} />
              <InfoRow label="Department" value={employee.department} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto min-w-max flex-wrap justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="time">Time & Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Clock3 className="h-4 w-4 text-primary" />Today</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">08:57</p>
                <p className="text-sm text-muted-foreground">Checked in · 7h 24m worked</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Calendar className="h-4 w-4 text-primary" />Leave</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">12 days</p>
                <p className="text-sm text-muted-foreground">Annual leave remaining</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><DollarSign className="h-4 w-4 text-primary" />Compensation</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{employee.salary}</p>
                <p className="text-sm text-muted-foreground">Current annual salary</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4 text-primary" />Performance</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">2 goals</p>
                <p className="text-sm text-muted-foreground">Review due in 18 days</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Employment snapshot</CardTitle></CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <InfoRow label="Position" value={employee.position} />
                <InfoRow label="Department" value={employee.department} />
                <InfoRow label="Manager" value={employee.manager} />
                <InfoRow label="Location" value={employee.location} />
                <InfoRow label="Employment type" value={employee.employmentType} />
                <InfoRow label="Start date" value={employee.startDate} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Needs attention</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border p-3">
                  <p className="font-medium">Document expiring soon</p>
                  <p className="text-sm text-muted-foreground">Work permit · 26 days</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium">Performance review</p>
                  <p className="text-sm text-muted-foreground">Due 23 Oct 2026</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employment">
          <Card>
            <CardHeader><CardTitle>Employment history</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {timeline.filter(item => item.title === 'Promoted' || item.title.includes('Joined')).map(item => (
                <div key={item.date} className="flex gap-4 border-l-2 border-primary pl-4">
                  <div className="flex-1"><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.detail}</p></div>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><CardTitle className="text-base">Attendance status</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">Present</p><p className="text-sm text-muted-foreground">Checked in 08:57</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Hours this week</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">36h 20m</p><p className="text-sm text-muted-foreground">Target 40h</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Attendance exceptions</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">1 open</p><p className="text-sm text-muted-foreground">Missing checkout · 30 Sep</p></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="leave">
          <Card><CardHeader><CardTitle>Leave</CardTitle></CardHeader><CardContent className="grid gap-6 sm:grid-cols-3"><InfoRow label="Annual leave" value="12 days" /><InfoRow label="Sick leave" value="5 days" /><InfoRow label="Next approved leave" value="14–18 Oct 2026" /></CardContent></Card>
        </TabsContent>

        <TabsContent value="compensation">
          <Card><CardHeader><CardTitle>Compensation</CardTitle></CardHeader><CardContent className="grid gap-6 sm:grid-cols-3"><InfoRow label="Current salary" value={employee.salary} /><InfoRow label="Pay schedule" value="Monthly" /><InfoRow label="Last adjustment" value="01 Oct 2026" /></CardContent></Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card><CardHeader><CardTitle>Performance</CardTitle></CardHeader><CardContent className="grid gap-6 sm:grid-cols-3"><InfoRow label="Active goals" value="2" /><InfoRow label="Last review" value="20 Sep 2026" /><InfoRow label="Next review" value="23 Oct 2026" /></CardContent></Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {['Employment contract', 'National ID', 'Work permit'].map((name, index) => (
                <div key={name} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-primary" /><div><p className="font-medium">{name}</p><p className="text-sm text-muted-foreground">Updated {index + 1} month{index ? 's' : ''} ago</p></div></div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/documents')}>Open</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle">
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" />Lifecycle state</CardTitle></CardHeader><CardContent className="space-y-4"><InfoRow label="Lifecycle" value={employee.lifecycle} /><InfoRow label="Condition" value={employee.condition} /><InfoRow label="Tenure" value="6 years 6 months" /></CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Current workflow</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-600" />No active lifecycle workflow</div></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader><CardTitle>Employee activity</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {timeline.map(item => (
                <div key={`${item.date}-${item.title}`} className="flex gap-4">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1 border-b pb-4 last:border-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-medium">{item.title}</p>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit employee</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2"><Label htmlFor="employee-name">Name</Label><Input id="employee-name" value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="employee-position">Position</Label><Input id="employee-position" value={editDraft.position} onChange={(e) => setEditDraft({ ...editDraft, position: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="employee-department">Department</Label><Input id="employee-department" value={editDraft.department} onChange={(e) => setEditDraft({ ...editDraft, department: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="employee-manager">Manager</Label><Input id="employee-manager" value={editDraft.manager} onChange={(e) => setEditDraft({ ...editDraft, manager: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="employee-location">Location</Label><Input id="employee-location" value={editDraft.location} onChange={(e) => setEditDraft({ ...editDraft, location: e.target.value })} /></div>
            <Button onClick={saveEmployee}>Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeRecord;
