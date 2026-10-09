
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { DEMO_STORAGE_KEY, findDemoAccount, getStoredDemoUser } from '@/lib/demoAccounts';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'manager' | 'employee' | 'super_admin';
  businessId?: string | null;
  businessName?: string | null;
  employeeId?: string | null;
  employeeNumber?: string | null;
  lifecycleState?: string | null;
  employmentCondition?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (roles: ReadonlyArray<User['role']>) => boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserWithRole = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    const [{ data: profile, error: profileError }, { data: tenantContext, error: contextError }] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('user_id, first_name, last_name, role, is_super_admin')
        .eq('user_id', supabaseUser.id)
        .single(),
      supabase.rpc('get_my_tenant_context'),
    ]);

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError);
      toast({ title: 'Error', description: 'Could not fetch user profile.', variant: 'destructive' });
      return null;
    }

    if (contextError) {
      console.error('Error fetching tenant context:', contextError);
    }

    if (!profile) return null;

    const context = tenantContext as {
      role?: User['role'];
      business_id?: string | null;
      business_name?: string | null;
      employee_id?: string | null;
      employee_number?: string | null;
      lifecycle_state?: string | null;
      employment_condition?: string | null;
    } | null;

    const userRole = profile.is_super_admin
      ? 'super_admin'
      : (context?.role || profile.role || 'employee');

    return {
      id: profile.user_id,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || supabaseUser.email || 'DDreamHR User',
      email: supabaseUser.email || '',
      role: userRole as User['role'],
      businessId: context?.business_id ?? null,
      businessName: context?.business_name ?? null,
      employeeId: context?.employee_id ?? null,
      employeeNumber: context?.employee_number ?? null,
      lifecycleState: context?.lifecycle_state ?? null,
      employmentCondition: context?.employment_condition ?? null,
    };
  };

  useEffect(() => {
    setIsLoading(true);

    // Restore a dev-only demo session if one exists
    const demo = getStoredDemoUser();
    if (demo) {
      setUser({ id: demo.id, name: demo.name, email: demo.email, role: demo.role, businessId: null, employeeId: null });
      setIsLoading(false);
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const appUser = await fetchUserWithRole(session.user);
        setUser(appUser);
        if (appUser) localStorage.setItem('user', JSON.stringify(appUser));
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const appUser = await fetchUserWithRole(session.user);
          setUser(appUser);
          if (appUser) localStorage.setItem('user', JSON.stringify(appUser));
        } else if (!getStoredDemoUser()) {
          setUser(null);
          localStorage.removeItem('user');
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    // Dev-only demo accounts (no Supabase / email verification needed)
    const demo = findDemoAccount(email, password);
    if (demo) {
      const demoUser: User = { id: demo.id, name: demo.name, email: demo.email, role: demo.role, businessId: null, employeeId: null };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ id: demo.id }));
      setUser(demoUser);
      setIsLoading(false);
      return demoUser;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return null;
    }

    if (data.user) {
      const appUser = await fetchUserWithRole(data.user);
      setUser(appUser);
      if (appUser) localStorage.setItem('user', JSON.stringify(appUser));
      setIsLoading(false);
      return appUser;
    }

    setIsLoading(false);
    return null;
  };

  const logout = async () => {
    setIsLoading(true);
    localStorage.removeItem(DEMO_STORAGE_KEY);
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    setIsLoading(false);
  };

  const hasRole = (roles: ReadonlyArray<User['role']>) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isSuperAdmin = user?.role === 'super_admin';

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    hasRole,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Auth guard component to protect routes
export const RequireAuth: React.FC<{ 
  children: React.ReactNode;
  allowedRoles?: ReadonlyArray<User['role']>;
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (allowedRoles && !hasRole(allowedRoles)) {
        // If user doesn't have the required role, redirect to their role-specific dashboard
        if (user?.role === 'super_admin') {
          navigate('/super-admin/dashboard');
        } else if (user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user?.role === 'hr') {
          navigate('/hr/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      }
    }
  }, [isAuthenticated, isLoading, navigate, allowedRoles, hasRole, user]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};
