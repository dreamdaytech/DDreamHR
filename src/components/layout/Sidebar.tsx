
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { getNavigationItems } from './sidebar/navigationData';
import { MobileSidebar } from './sidebar/MobileSidebar';
import { DesktopSidebar } from './sidebar/DesktopSidebar';
import { SidebarProps } from './sidebar/types';

export const Sidebar = ({ open, setOpen, isMobile = false, onNavigate }: SidebarProps) => {
  const { user, hasRole } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };
  
  // Get navigation items and filter based on user role
  const navItems = getNavigationItems(user?.role);
  const filteredNavItems = navItems.filter(item => hasRole(item.roles));

  if (isMobile) {
    return (
      <MobileSidebar 
        filteredNavItems={filteredNavItems}
        expandedSection={expandedSection}
        toggleSection={toggleSection}
        handleNavClick={handleNavClick}
      />
    );
  }

  return (
    <DesktopSidebar 
      open={open}
      filteredNavItems={filteredNavItems}
      expandedSection={expandedSection}
      toggleSection={toggleSection}
    />
  );
};
