
import React from 'react';
import { MenuItem } from './MenuItem';
import { secondaryMenuItems } from './menuData';

interface SecondaryMenuSectionProps {
  onItemClick: (route: string) => void;
  userRole?: string;
}

export const SecondaryMenuSection: React.FC<SecondaryMenuSectionProps> = ({ onItemClick, userRole }) => {
  return (
    <div className="space-y-1">
      {secondaryMenuItems.filter((item) => !userRole || item.roles.includes(userRole)).map((item) => (
        <MenuItem key={item.id} item={item} onItemClick={onItemClick} />
      ))}
    </div>
  );
};
