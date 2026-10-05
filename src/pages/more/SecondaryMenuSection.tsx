
import React from 'react';
import { MenuItem } from './MenuItem';
import { secondaryMenuItems } from './menuData';

interface SecondaryMenuSectionProps {
  onItemClick: (route: string) => void;
}

export const SecondaryMenuSection: React.FC<SecondaryMenuSectionProps> = ({ onItemClick }) => {
  return (
    <div className="space-y-1">
      {secondaryMenuItems.map((item) => (
        <MenuItem key={item.id} item={item} onItemClick={onItemClick} />
      ))}
    </div>
  );
};
