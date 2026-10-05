import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, UserRound } from 'lucide-react';

const formerEmployees = [
  { name: 'Mohamed Sesay', role: 'Operations Coordinator', department: 'Operations', endDate: '30 Sep 2026', reason: 'Resigned' },
  { name: 'Kadiatu Kamara', role: 'HR Assistant', department: 'People', endDate: '15 Aug 2026', reason: 'Contract ended' },
  { name: 'Ibrahim Conteh', role: 'Support Specialist', department: 'Customer Success', endDate: '31 Jul 2026', reason: 'Resigned' },
];

const FormerEmployees = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Former Employees</h2>
      <p className="text-muted-foreground">Historical employment records and completed departures.</p>
    </div>

    <div className="space-y-3">
      {formerEmployees.map((employee) => (
        <Card key={employee.name}>
          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2"><UserRound className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-muted-foreground">{employee.role} · {employee.department}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">Ended {employee.endDate}</p>
                <p className="text-sm text-muted-foreground">{employee.reason}</p>
              </div>
              <Badge variant="outline">Former Employee</Badge>
              <Button variant="ghost" size="sm"><FileText className="mr-2 h-4 w-4" />Record</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="text-base">Record retention</CardTitle>
        <CardDescription>
          Former employee records remain available for employment history, documents and payroll history without appearing in the active directory.
        </CardDescription>
      </CardHeader>
    </Card>
  </div>
);

export default FormerEmployees;
