
import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  name: string;
  icon: LucideIcon;
  path: string;
  roles: ReadonlyArray<'admin' | 'hr' | 'manager' | 'employee' | 'super_admin'>;
  children?: NavigationChild[];
}

export interface NavigationChild {
  name: string;
  path: string;
  roles: ReadonlyArray<'admin' | 'hr' | 'manager' | 'employee' | 'super_admin'>;
}

export interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile?: boolean;
  onNavigate?: () => void;
}
