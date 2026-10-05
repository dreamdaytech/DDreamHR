import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  BriefcaseBusiness,
  LogOut,
  RefreshCw,
  UserPlus,
  Users,
} from 'lucide-react';

const areas = [
  {
    title: 'Employees',
    description: 'Search employee records, employment details, compensation and activity.',
    value: '124',
    label: 'active employees',
    icon: Users,
    path: '/employees?view=directory',
  },
  {
    title: 'New Hires',
    description: 'Manage preboarding and onboarding work for upcoming starters.',
    value: '5',
    label: 'in progress',
    icon: UserPlus,
    path: '/employees?view=new-hires',
  },
  {
    title: 'Employee Changes',
    description: 'Manage promotions, transfers, manager changes and compensation events.',
    value: '4',
    label: 'awaiting action',
    icon: RefreshCw,
    path: '/employees?view=changes',
  },
  {
    title: 'Offboarding',
    description: 'Coordinate departures, handovers, access removal and final HR tasks.',
    value: '2',
    label: 'active departures',
    icon: LogOut,
    path: '/employees?view=offboarding',
  },
  {
    title: 'Former Employees',
    description: 'Review historical employment records and completed departures.',
    value: '18',
    label: 'former employees',
    icon: BriefcaseBusiness,
    path: '/employees?view=former',
  },
];

const PeopleOverview = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">People operations</p>
        <h1 className="text-3xl font-bold tracking-tight">People</h1>
        <p className="mt-1 text-muted-foreground">
          Employee records, lifecycle work and employment changes in one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => (
          <Link key={area.title} to={area.path} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-lg bg-muted p-2">
                    <area.icon className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle className="pt-3 text-lg">{area.title}</CardTitle>
                <CardDescription>{area.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold">{area.value}</p>
                  <p className="text-sm text-muted-foreground">{area.label}</p>
                </div>
                {area.title === 'Employee Changes' && <Badge variant="secondary">Needs review</Badge>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lifecycle model</CardTitle>
          <CardDescription>
            DDreamHR now treats lifecycle state and employment condition as separate concepts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Lifecycle</p>
            <div className="flex flex-wrap items-center gap-2">
              {['Candidate', 'Preboarding', 'Onboarding', 'Active', 'Offboarding', 'Former Employee'].map((state) => (
                <Badge key={state} variant="outline">{state}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Employment condition</p>
            <div className="flex flex-wrap items-center gap-2">
              {['Working', 'On Leave', 'Probation', 'Notice Period', 'Suspended'].map((state) => (
                <Badge key={state} variant="secondary">{state}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeopleOverview;
