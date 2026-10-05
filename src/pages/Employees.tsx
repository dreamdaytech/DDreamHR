import { useSearchParams } from 'react-router-dom';
import EmployeeDirectory from '@/components/employees/EmployeeDirectory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import PeopleOverview from '@/pages/people/PeopleOverview';
import EmployeeChanges from '@/pages/people/EmployeeChanges';
import FormerEmployees from '@/pages/people/FormerEmployees';
import Preboarding from '@/pages/hr-lifecycle/Preboarding';
import Onboarding from '@/pages/hr-lifecycle/Onboarding';
import Offboarding from '@/pages/hr-lifecycle/Offboarding';

const viewValues = ['overview', 'directory', 'new-hires', 'changes', 'offboarding', 'former', 'departments'] as const;
type PeopleView = typeof viewValues[number];

const Employees = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const requestedView = searchParams.get('view') as PeopleView | null;
  const activeView: PeopleView = requestedView && viewValues.includes(requestedView) ? requestedView : 'overview';

  const setView = (view: string) => {
    const nextView = view as PeopleView;
    setSearchParams(nextView === 'overview' ? {} : { view: nextView });
  };

  return (
    <div className={isMobile ? 'min-h-screen bg-background' : 'container max-w-full px-0 py-3 sm:py-4 lg:py-6'}>
      {isMobile && <MobileHeader title="People" />}

      <div className={isMobile ? 'p-4' : ''}>
        <Tabs value={activeView} onValueChange={setView} className="w-full">
          <div className="mb-4 overflow-x-auto pb-1 sm:mb-6">
            <TabsList className="h-auto min-w-max justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="directory">Employees</TabsTrigger>
              <TabsTrigger value="new-hires">New Hires</TabsTrigger>
              <TabsTrigger value="changes">Employee Changes</TabsTrigger>
              <TabsTrigger value="offboarding">Offboarding</TabsTrigger>
              <TabsTrigger value="former">Former Employees</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0">
            <PeopleOverview />
          </TabsContent>

          <TabsContent value="directory" className="mt-0">
            <EmployeeDirectory />
          </TabsContent>

          <TabsContent value="new-hires" className="mt-0 space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">New Hires</h1>
              <p className="text-muted-foreground">Preboarding and onboarding work for employees joining the organization.</p>
            </div>
            <Tabs defaultValue="onboarding" className="w-full">
              <TabsList>
                <TabsTrigger value="preboarding">Preboarding</TabsTrigger>
                <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
              </TabsList>
              <TabsContent value="preboarding"><Preboarding /></TabsContent>
              <TabsContent value="onboarding"><Onboarding /></TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="changes" className="mt-0">
            <EmployeeChanges />
          </TabsContent>

          <TabsContent value="offboarding" className="mt-0">
            <Offboarding />
          </TabsContent>

          <TabsContent value="former" className="mt-0">
            <FormerEmployees />
          </TabsContent>

          <TabsContent value="departments" className="mt-0">
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Department Management</h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Manage your organization's departments here.
              </p>
              <div className="flex h-32 items-center justify-center rounded-lg border bg-muted/40">
                <p className="px-4 text-center text-sm text-muted-foreground sm:text-base">
                  Department management UI will be available soon.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Employees;
