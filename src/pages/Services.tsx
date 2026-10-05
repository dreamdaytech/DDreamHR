
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { SearchBar } from './services/SearchBar';
import { ServicesGrid } from './services/ServicesGrid';
import { getServiceItems } from './services/serviceData';

const Services = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const services = getServiceItems(user?.role);

  const handleServiceClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader title="Services" />
      
      <div className="p-4 space-y-4">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <ServicesGrid 
          services={services}
          searchTerm={searchTerm}
          onServiceClick={handleServiceClick}
        />
      </div>
    </div>
  );
};

export default Services;
