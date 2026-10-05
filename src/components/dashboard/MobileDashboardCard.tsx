
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MobileDashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  onClick?: () => void;
}

export const MobileDashboardCard: React.FC<MobileDashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  onClick
}) => {
  return (
    <Card 
      className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-brand-gray">{value}</p>
          </div>
          <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
