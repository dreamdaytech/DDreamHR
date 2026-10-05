
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // For the main dashboard route, we'll show the unified dashboard
    // but still maintain role-specific routes for direct access
    if (user && window.location.pathname === '/dashboard') {
      // User is on the main dashboard, show unified dashboard
      return;
    }

    // Handle role-specific redirects for other dashboard routes
    if (user && window.location.pathname !== '/dashboard') {
      switch (user.role) {
        case 'admin':
          if (!window.location.pathname.includes('/admin/dashboard')) {
            navigate('/admin/dashboard');
          }
          break;
        case 'hr':
          if (!window.location.pathname.includes('/hr/dashboard')) {
            navigate('/hr/dashboard');
          }
          break;
        default:
          if (!window.location.pathname.includes('/employee/dashboard')) {
            navigate('/employee/dashboard');
          }
          break;
      }
    }
  }, [user, navigate]);

  // If we're on the main dashboard route, show the unified dashboard
  if (window.location.pathname === '/dashboard') {
    return (
      <div className="container py-6 max-w-full px-0">
        <UnifiedDashboard />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <p>Redirecting to your dashboard...</p>
    </div>
  );
};

export default Dashboard;
