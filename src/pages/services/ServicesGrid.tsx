
import React from 'react';
import { ServiceCard } from './ServiceCard';
import { ServiceItem } from './serviceData';

interface ServicesGridProps {
  services: ServiceItem[];
  searchTerm: string;
  onServiceClick: (route: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ 
  services, 
  searchTerm, 
  onServiceClick 
}) => {
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {filteredServices.map((service) => (
          <ServiceCard 
            key={service.id}
            service={service}
            onServiceClick={onServiceClick}
          />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No services found matching "{searchTerm}"</p>
        </div>
      )}
    </>
  );
};
