
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavigationItem } from './types';

interface MobileSidebarProps {
  filteredNavItems: NavigationItem[];
  expandedSection: string | null;
  toggleSection: (section: string) => void;
  handleNavClick: () => void;
}

export const MobileSidebar = ({ 
  filteredNavItems, 
  expandedSection, 
  toggleSection, 
  handleNavClick 
}: MobileSidebarProps) => {
  return (
    <nav className="mt-4">
      <ul className="space-y-1 px-2">
        {filteredNavItems.map((item) => (
          <li key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleSection(item.name)} 
                  className={cn(
                    "flex w-full items-center px-3 py-3 rounded-md transition-colors text-base",
                    "hover:bg-secondary hover:text-white",
                    expandedSection === item.name ? "bg-secondary text-white" : "text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="ml-3 flex-1 text-left">{item.name}</span>
                  {expandedSection === item.name ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
                
                {expandedSection === item.name && (
                  <ul className="mt-1 ml-6 space-y-1 border-l border-sidebar-border">
                    {item.children.map(child => (
                      <li key={child.name}>
                        <NavLink 
                          to={child.path}
                          onClick={handleNavClick}
                          className={({ isActive }) => cn(
                            "block px-3 py-2 text-sm rounded-md transition-colors",
                            "hover:bg-secondary hover:text-white",
                            isActive ? "bg-secondary text-white font-medium" : "text-sidebar-foreground"
                          )}
                        >
                          {child.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <NavLink 
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-3 rounded-md transition-colors text-base",
                  "hover:bg-secondary hover:text-white",
                  isActive ? "bg-secondary text-white font-medium" : "text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="ml-3">{item.name}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
