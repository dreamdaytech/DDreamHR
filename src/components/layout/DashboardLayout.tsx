import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { Bell, Menu, Moon, Sun, User, LogOut, X } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/use-mobile';

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
        setMobileMenuOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Home';
    if (path.includes('approvals')) return 'Inbox';
    if (path.includes('employees')) return 'People';
    if (path.includes('attendance')) return 'Attendance';
    if (path.includes('time-tracking')) return 'Timesheets';
    if (path.includes('leave-tracking')) return 'Leave';
    if (path.includes('payroll')) return 'Payroll';
    if (path.includes('engagement')) return 'Engagement';
    if (path.includes('reports')) return 'Analytics';
    if (path.includes('documents')) return 'Documents';
    if (path.includes('settings')) return 'Settings';
    if (path.includes('hr-lifecycle')) return 'People';
    return 'DDreamHR';
  }, [location.pathname]);

  const initials = useMemo(() => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  const mobileOnlyPage = ['services', 'approvals', 'more'].some((route) =>
    location.pathname.includes(route),
  );

  const ThemeButton = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="text-foreground hover:bg-muted"
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 text-foreground hover:bg-muted">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={user?.name || 'User'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex md:flex-col md:items-start">
            <span className="max-w-32 truncate text-sm font-medium">{user?.name}</span>
            <span className="text-xs capitalize text-muted-foreground">{user?.role}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {mobileMenuOpen && (
          <>
            <button
              aria-label="Close navigation"
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto border-r bg-sidebar text-sidebar-foreground shadow-xl">
              <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
                <h1 className="text-xl font-bold">
                  <span className="text-primary">Dream</span>Day<span className="text-primary">HR</span>
                </h1>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Sidebar open setOpen={() => {}} isMobile onNavigate={() => setMobileMenuOpen(false)} />
            </aside>
          </>
        )}

        <div className="flex min-h-screen flex-col">
          {!mobileOnlyPage && (
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-3 backdrop-blur">
              <div className="flex min-w-0 items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="truncate font-semibold">{pageTitle}</h1>
              </div>
              <div className="flex items-center gap-1">
                <ThemeButton />
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                </Button>
                <UserMenu />
              </div>
            </header>
          )}
          <main className="flex-1 overflow-auto pb-20">
            <Outlet />
          </main>
          <BottomNavigation />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen((open) => !open)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden min-w-0 sm:block">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold">
                  <span className="text-primary">Dream</span>Day<span className="text-primary">HR</span>
                </h1>
                <span className="h-5 w-px bg-border" />
                <span className="truncate text-sm text-muted-foreground">{pageTitle}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeButton />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <UserMenu />
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
