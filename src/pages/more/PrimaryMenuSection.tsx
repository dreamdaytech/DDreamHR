
import React from 'react';
import { MenuItem } from './MenuItem';
import { primaryMenuItems } from './menuData';

interface PrimaryMenuSectionProps {
  onItemClick: (route: string) => void;
  userRole?: string;
}

export const PrimaryMenuSection: React.FC<PrimaryMenuSectionProps> = ({ onItemClick, userRole }) => {
  return (
    <div className="space-y-1">
      {primaryMenuItems.filter((item) => !userRole || item.roles.includes(userRole)).map((item) => (
        <MenuItem key={item.id} item={item} onItemClick={onItemClick} />
      ))}
    </div>
  );
};
