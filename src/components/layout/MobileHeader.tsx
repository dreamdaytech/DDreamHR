
import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

interface MobileHeaderProps {
  title: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  showLogo?: boolean;
  leftAction?: React.ReactNode;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showSearch = true,
  showNotifications = true,
  showSettings = false,
  showLogo = true,
  leftAction
}) => {
  const { user } = useAuth();

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 md:hidden shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {leftAction && leftAction}
          {showLogo && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">D</span>
              </div>
              <h1 className="text-lg font-semibold text-brand-gray">{title}</h1>
            </div>
          )}
          {!showLogo && !leftAction && (
            <h1 className="text-lg font-semibold text-brand-gray">{title}</h1>
          )}
          {!showLogo && leftAction && (
            <h1 className="text-lg font-semibold text-brand-gray">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {showSearch && (
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary-50 rounded-full text-brand-gray">
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {showNotifications && (
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary-50 rounded-full relative text-brand-gray">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
          )}
          
          {showSettings && (
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary-50 rounded-full text-brand-gray">
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
