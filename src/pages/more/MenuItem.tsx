
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItem as MenuItemType } from './menuData';

interface MenuItemProps {
  item: MenuItemType;
  onItemClick: (route: string) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, onItemClick }) => {
  return (
    <Card 
      key={item.id}
      className="bg-white border-0 hover:bg-secondary hover:text-white transition-all duration-200 cursor-pointer active:scale-98 shadow-none"
      onClick={() => onItemClick(item.route)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${item.iconColor} rounded-xl flex items-center justify-center`}>
              <item.icon className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-gray-900">{item.title}</span>
          </div>
          
          {item.hasSubmenu ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
