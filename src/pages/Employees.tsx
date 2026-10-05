
import { useState } from 'react';
import EmployeeDirectory from '@/components/employees/EmployeeDirectory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { useIsMobile } from '@/hooks/use-mobile';

const Employees = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'min-h-screen bg-gray-50' : 'container py-3 sm:py-4 lg:py-6 max-w-full px-0'}`}>
      {isMobile && <MobileHeader title="Employee Directory" />}
      
      <div className={isMobile ? 'p-4' : ''}>
        <Tabs 
          defaultValue="directory" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className={`mb-4 sm:mb-6 ${isMobile ? 'w-full grid grid-cols-2' : 'w-full sm:w-auto'}`}>
            <TabsTrigger 
              value="directory" 
              className="flex-1 sm:flex-none data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary-50"
            >
              Employee Directory
            </TabsTrigger>
            <TabsTrigger 
              value="departments" 
              className="flex-1 sm:flex-none data-[state=active]:bg-secondary data-[state=active]:text-white hover:bg-secondary-50"
            >
              Departments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="directory">
            <EmployeeDirectory />
          </TabsContent>
          
          <TabsContent value="departments">
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-gray">Department Management</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage your organization's departments here.
              </p>
              {/* Department management will be implemented in a future update */}
              <div className="h-32 flex items-center justify-center bg-muted rounded-lg border border-secondary-200">
                <p className="text-muted-foreground text-sm sm:text-base text-center px-4">Department management UI will be available soon.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Employees;
