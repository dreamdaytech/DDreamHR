
import React from 'react';
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileHeader } from '@/components/layout/MobileHeader';

const EmployeeDashboard = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader title="Dashboard" showLogo={true} />
        <div className="p-4 pb-24">
          <UnifiedDashboard />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="container py-6 max-w-full px-0">
      <UnifiedDashboard />
    </div>
  );
};

export default EmployeeDashboard;
