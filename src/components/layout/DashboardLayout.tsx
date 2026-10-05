
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { Menu, Bell, User, LogOut, Sun, Moon, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isPWAInstallable, setIsPWAInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Check if viewport is smaller and collapse sidebar automatically 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
        setMobileMenuOpen(false);
      } else {
        setSidebarOpen(true);
        setMobileMenuOpen(false);
      }
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Force light theme for mobile
  useEffect(() => {
    if (isMobile) {
      setTheme('light');
      document.documentElement.className = 'light';
    }
  }, [isMobile]);

  // Toggle theme (disabled on mobile)
  const toggleTheme = () => {
    if (isMobile) return; // Disable theme toggle on mobile
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  // PWA Installation
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPWAInstallable(true);
    });
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "Installing DDreamHR",
          description: "Thank you for installing our app!"
        });
      }
      
      setDeferredPrompt(null);
      setIsPWAInstallable(false);
    }
  };
  
  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Get the current page title from the route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('employees')) return 'Employee Management';
    if (path.includes('attendance')) return 'Attendance';
    if (path.includes('leave-tracking')) return 'Leave Tracking';
    if (path.includes('time-tracking')) return 'Time Tracking';
    if (path.includes('reports')) return 'Reports';
    if (path.includes('documents')) return 'Documents';
    if (path.includes('performance')) return 'Performance Management';
    if (path.includes('onboarding')) return 'Onboarding';
    if (path.includes('storage')) return 'Document Storage';
    if (path.includes('settings')) return 'Settings';
    if (path.includes('workflows')) return 'HR Workflows';
    if (path.includes('my-data')) return 'My Data';
    if (path.includes('services')) return 'Services';
    if (path.includes('approvals')) return 'Approvals';
    if (path.includes('more')) return 'More';
    return 'DDreamHR';
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'admin': return 'bg-primary-100 text-primary-800 border border-primary-300';
      case 'hr': return 'bg-secondary-100 text-secondary-800 border border-secondary-300';
      case 'manager': return 'bg-purple-100 text-purple-800 border border-purple-300';
      default: return 'bg-green-100 text-green-800 border border-green-300';
    }
  };

  // Check if current route needs special mobile layout (mobile-only pages)
  const isMobileOnlyPage = () => {
    return ['services', 'approvals', 'more'].some(route => location.pathname.includes(route));
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className={cn("min-h-screen flex bg-background", 'light')}>
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-brand-gray text-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto border-r">
              <div className="p-4 flex justify-between items-center h-16 border-b border-gray-600">
                <h1 className="text-xl font-bold text-white flex items-center">
                  <span className="text-primary">Dream</span>Day<span className="text-primary">HR</span>
                </h1>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-gray-600 text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Sidebar 
                open={true} 
                setOpen={() => {}} 
                isMobile={true}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>
          </>
        )}
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header - only show on non-mobile-only pages */}
          {!isMobileOnlyPage() && (
            <header className="h-16 border-b flex items-center justify-between px-4 bg-background z-10 shadow-sm">
              <div className="flex items-center min-w-0">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle sidebar"
                  className="hover:bg-primary-50 flex-shrink-0 text-brand-gray"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="ml-2 text-base font-semibold text-brand-gray truncate">
                  {getPageTitle()}
                </h1>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary-50 h-8 w-8 text-brand-gray">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative flex items-center gap-1 hover:bg-primary-50 h-8 px-1 text-brand-gray" aria-label="User menu">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" alt={user?.name || 'User'} />
                        <AvatarFallback className="bg-primary-100 text-primary-800 text-xs">{getInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 z-50">
                    <DropdownMenuLabel className="text-brand-gray">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center cursor-pointer text-brand-gray hover:bg-primary-50">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center cursor-pointer text-brand-gray hover:bg-primary-50" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
          )}
          
          {/* Main Content */}
          <main className={cn(
            "flex-1 overflow-auto",
            isMobileOnlyPage() ? "p-0 pb-20" : "p-0 pb-20"
          )}>
            <Outlet />
          </main>
          
          {/* Bottom Navigation - Always visible on mobile */}
          <BottomNavigation />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className={cn("min-h-screen flex bg-background", 'light')}>
      {/* Desktop Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="h-16 border-b flex items-center justify-between px-3 sm:px-4 bg-background z-10 shadow-sm">
          <div className="flex items-center min-w-0">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
              className="hover:bg-primary-50 flex-shrink-0 text-brand-gray"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="ml-2 sm:ml-4 text-lg sm:text-xl font-semibold text-brand-gray hidden sm:flex truncate">
              <span className="text-primary">Dream</span>Day<span className="text-primary">HR</span>
              <span className="text-brand-gray font-normal ml-2 sm:ml-4 border-l pl-2 sm:pl-4 text-base sm:text-lg truncate">
                {getPageTitle()}
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="hover:bg-primary-50 h-8 w-8 sm:h-10 sm:w-10 text-brand-gray"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4 sm:h-5 sm:w-5" /> : <Sun className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            
            {isPWAInstallable && (
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex items-center gap-2 border-primary text-primary hover:bg-primary-50 text-xs"
                onClick={installPWA}
              >
                <Download className="h-3 w-3" />
                <span>Install App</span>
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="relative hover:bg-primary-50 h-8 w-8 sm:h-10 sm:w-10 text-brand-gray">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center gap-1 sm:gap-2 hover:bg-primary-50 h-8 sm:h-10 px-1 sm:px-3 text-brand-gray" aria-label="User menu">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarImage src="/placeholder.svg" alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-primary-100 text-primary-800 text-xs sm:text-sm">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <span className="text-sm font-medium truncate max-w-20 lg:max-w-none">{user?.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                      {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56 bg-white border border-gray-200 z-50">
                <DropdownMenuLabel className="text-brand-gray">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center cursor-pointer text-brand-gray hover:bg-primary-50">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center cursor-pointer text-brand-gray hover:bg-primary-50" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
