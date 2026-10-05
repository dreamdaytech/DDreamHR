
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavigationItem } from './types';

interface DesktopSidebarProps {
  open: boolean;
  filteredNavItems: NavigationItem[];
  expandedSection: string | null;
  toggleSection: (section: string) => void;
}

export const DesktopSidebar = ({ 
  open, 
  filteredNavItems, 
  expandedSection, 
  toggleSection 
}: DesktopSidebarProps) => {
  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground h-screen z-20 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden shrink-0 border-r",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 flex justify-center items-center h-16 border-b border-sidebar-border">
        {open ? (
          <h1 className="text-xl font-bold text-primary-800 flex items-center">
            <span className="text-primary-600">Dream</span>Day<span className="text-primary-600">HR</span>
          </h1>
        ) : (
          <span className="text-xl font-bold text-primary-600">D</span>
        )}
      </div>
      
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <li key={item.name}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.name)} 
                    className={cn(
                      "flex w-full items-center px-3 py-2 rounded-md transition-colors",
                      "hover:bg-secondary hover:text-white",
                      expandedSection === item.name ? "bg-secondary text-white" : "text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {open && <span className="ml-3 flex-1 text-left">{item.name}</span>}
                    {open && expandedSection === item.name && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {open && expandedSection !== item.name && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                  
                  {open && expandedSection === item.name && (
                    <ul className="mt-1 ml-6 space-y-1 border-l border-sidebar-border">
                      {item.children.map(child => (
                        <li key={child.name}>
                          <NavLink 
                            to={child.path}
                            className={({ isActive }) => cn(
                              "block px-3 py-1.5 text-sm rounded-md transition-colors",
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
                  className={({ isActive }) => cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    "hover:bg-secondary hover:text-white",
                    isActive ? "bg-secondary text-white font-medium" : "text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {open && <span className="ml-3">{item.name}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
