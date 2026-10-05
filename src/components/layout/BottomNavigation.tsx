
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid3X3, CheckCircle, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface BottomNavigationProps {
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigationItems = [
    {
      id: 'services',
      label: 'Services',
      icon: Grid3X3,
      path: '/services',
      isActive: location.pathname === '/services'
    },
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'hr' ? '/hr/dashboard' : '/employee/dashboard',
      isActive: location.pathname.includes('/dashboard')
    },
    {
      id: 'add',
      label: '',
      icon: Plus,
      path: '#',
      isSpecial: true,
      isActive: false
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: CheckCircle,
      path: '/approvals',
      isActive: location.pathname === '/approvals'
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreHorizontal,
      path: '/more',
      isActive: location.pathname === '/more'
    }
  ];

  const handleNavigation = (item: any) => {
    if (item.id === 'add') {
      // Handle special add button action - could open a quick action menu
      console.log('Quick add action triggered');
      return;
    }
    navigate(item.path);
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 md:hidden shadow-lg",
      className
    )}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "flex flex-col items-center justify-center h-14 w-16 p-1 rounded-lg transition-all duration-200",
              item.isSpecial && "bg-primary text-white hover:bg-primary-600 shadow-lg transform hover:scale-105 h-12 w-12 rounded-full",
              item.isActive && !item.isSpecial && "text-primary bg-primary-50",
              !item.isActive && !item.isSpecial && "text-brand-gray hover:text-primary hover:bg-primary-50"
            )}
            onClick={() => handleNavigation(item)}
          >
            <item.icon className={cn(
              "h-5 w-5 mb-1",
              item.isSpecial && "h-6 w-6 mb-0"
            )} />
            {item.label && (
              <span className="text-xs font-medium leading-tight">{item.label}</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
