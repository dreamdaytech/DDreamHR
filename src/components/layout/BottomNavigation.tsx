import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid3X3, CheckCircle, MoreHorizontal } from 'lucide-react';
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
  const canApprove = user && ['admin', 'hr', 'manager'].includes(user.role);

  const navigationItems = [
    {
      id: 'services',
      label: 'Services',
      icon: Grid3X3,
      path: '/services',
      isActive: location.pathname === '/services',
    },
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'hr' ? '/hr/dashboard' : '/employee/dashboard',
      isActive: location.pathname.includes('/dashboard'),
    },
    ...(canApprove ? [{
      id: 'approvals',
      label: 'Inbox',
      icon: CheckCircle,
      path: '/approvals',
      isActive: location.pathname === '/approvals',
    }] : []),
    {
      id: 'more',
      label: 'More',
      icon: MoreHorizontal,
      path: '/more',
      isActive: location.pathname === '/more',
    },
  ];

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 px-2 py-2 shadow-lg backdrop-blur md:hidden',
      className,
    )}>
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              'flex h-14 min-w-16 flex-col items-center justify-center rounded-lg p-1 transition-all duration-200',
              item.isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="mb-1 h-5 w-5" />
            <span className="text-xs font-medium leading-tight">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
