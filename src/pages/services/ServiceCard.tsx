
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceItem } from './serviceData';

interface ServiceCardProps {
  service: ServiceItem;
  onServiceClick: (route: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onServiceClick }) => {
  return (
    <Card 
      className="bg-white border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 rounded-xl"
      onClick={() => onServiceClick(service.route)}
    >
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <div className={`w-14 h-14 ${service.iconColor} rounded-2xl flex items-center justify-center shadow-lg`}>
          <service.icon className="h-7 w-7 text-white" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {service.title}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};
