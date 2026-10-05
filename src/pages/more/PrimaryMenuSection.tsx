
import React from 'react';
import { MenuItem } from './MenuItem';
import { primaryMenuItems } from './menuData';

interface PrimaryMenuSectionProps {
  onItemClick: (route: string) => void;
}

export const PrimaryMenuSection: React.FC<PrimaryMenuSectionProps> = ({ onItemClick }) => {
  return (
    <div className="space-y-1">
      {primaryMenuItems.map((item) => (
        <MenuItem key={item.id} item={item} onItemClick={onItemClick} />
      ))}
    </div>
  );
};
