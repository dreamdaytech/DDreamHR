
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Separator } from '@/components/ui/separator';
import { PrimaryMenuSection } from './more/PrimaryMenuSection';
import { SecondaryMenuSection } from './more/SecondaryMenuSection';
import { useAuth } from '@/context/AuthContext';

const More = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleItemClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader title="More" showSettings={true} />
      
      <div className="p-4 space-y-1">
        {/* Primary Menu Items */}
        <PrimaryMenuSection onItemClick={handleItemClick} userRole={user?.role} />

        {/* Separator */}
        <div className="py-2">
          <Separator className="bg-gray-200" />
        </div>

        {/* Secondary Menu Items */}
        <SecondaryMenuSection onItemClick={handleItemClick} userRole={user?.role} />
      </div>
    </div>
  );
};

export default More;
