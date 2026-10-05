import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./context/AuthContext";
import { AttendanceProvider } from "./context/AttendanceContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Demo from "./pages/Demo";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HrDashboard from "./pages/HrDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Employees from "./pages/Employees";
import EmployeeDetail from "./pages/EmployeeDetail";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import NotFound from "./pages/NotFound";
import AttendanceSubmission from "./pages/AttendanceSubmission";
import TimeTracking from "./pages/TimeTracking";
import LeaveTracking from "./pages/LeaveTracking";
import Services from "./pages/Services";
import Approvals from "./pages/Approvals";
import More from "./pages/More";

// Super Admin Pages
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import BusinessManagement from "./pages/super-admin/BusinessManagement";
import BusinessAnalytics from "./pages/super-admin/BusinessAnalytics";
import SubscriptionManagement from "./pages/super-admin/SubscriptionManagement";
import UserManagement from "./pages/super-admin/UserManagement";
import UserAnalytics from "./pages/super-admin/UserAnalytics";
import UserActivityLogs from "./pages/super-admin/UserActivityLogs";
import PlatformSettings from "./pages/super-admin/PlatformSettings";
import FeatureToggles from "./pages/super-admin/FeatureToggles";
import SystemHealth from "./pages/super-admin/SystemHealth";
import PlatformAnalytics from "./pages/super-admin/PlatformAnalytics";
import RevenueReports from "./pages/super-admin/RevenueReports";
import UsageStatistics from "./pages/super-admin/UsageStatistics";
import Announcements from "./pages/super-admin/Announcements";
import SupportTickets from "./pages/super-admin/SupportTickets";

// HR Lifecycle Pages
import HRLifecycle from "./pages/hr-lifecycle/HRLifecycle";
import Preboarding from "./pages/hr-lifecycle/Preboarding";
import Onboarding from "./pages/hr-lifecycle/Onboarding";
import EmployeePortal from "./pages/hr-lifecycle/EmployeePortal";
import Offboarding from "./pages/hr-lifecycle/Offboarding";

// Payroll Pages
import PayrollDashboard from "./pages/payroll/PayrollDashboard";
import RunPayroll from "./pages/payroll/RunPayroll";
import SalaryProfiles from "./pages/payroll/SalaryProfiles";
import Payslips from "./pages/payroll/Payslips";
import PayrollReports from "./pages/payroll/PayrollReports";
import PayrollSettings from "./pages/payroll/PayrollSettings";

// Engagement Pages
import Engagement from "./pages/Engagement";
import EngagementDashboard from "./pages/engagement/EngagementDashboard";
import Surveys from "./pages/engagement/Surveys";
import Recognition from "./pages/engagement/Recognition";
import SocialFeed from "./pages/engagement/SocialFeed";
import Events from "./pages/engagement/Events";
import Communities from "./pages/engagement/Communities";
import Analytics from "./pages/engagement/Analytics";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";
import { LeaveSettings } from "./components/leave-tracking/LeaveSettings";
import { GeneralSettings } from "./pages/GeneralSettings";

import AttendanceDashboard from "./pages/attendance/AttendanceDashboard";
import AttendanceLog from "./pages/attendance/AttendanceLog";
import AttendanceReports from "./pages/attendance/AttendanceReports";
import AttendanceSettings from "./pages/attendance/AttendanceSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AttendanceProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/demo" element={<Demo />} />
              
              {/* Protected routes - Dashboard layout */}
              <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
                {/* Super Admin Routes */}
                <Route path="/super-admin/dashboard" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <SuperAdminDashboard />
                  </RequireAuth>
                } />
                
                <Route path="/super-admin/businesses" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <BusinessManagement />
                  </RequireAuth>
                } />
                <Route path="/super-admin/businesses/analytics" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <BusinessAnalytics />
                  </RequireAuth>
                } />
                <Route path="/super-admin/businesses/subscriptions" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <SubscriptionManagement />
                  </RequireAuth>
                } />

                <Route path="/super-admin/users" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <UserManagement />
                  </RequireAuth>
                } />
                <Route path="/super-admin/users/analytics" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <UserAnalytics />
                  </RequireAuth>
                } />
                <Route path="/super-admin/users/activity" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <UserActivityLogs />
                  </RequireAuth>
                } />

                <Route path="/super-admin/system/settings" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <PlatformSettings />
                  </RequireAuth>
                } />
                <Route path="/super-admin/system/features" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <FeatureToggles />
                  </RequireAuth>
                } />
                <Route path="/super-admin/system/health" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <SystemHealth />
                  </RequireAuth>
                } />

                <Route path="/super-admin/analytics/platform" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <PlatformAnalytics />
                  </RequireAuth>
                } />
                <Route path="/super-admin/analytics/revenue" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <RevenueReports />
                  </RequireAuth>
                } />
                <Route path="/super-admin/analytics/usage" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <UsageStatistics />
                  </RequireAuth>
                } />

                <Route path="/super-admin/communication/announcements" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <Announcements />
                  </RequireAuth>
                } />
                <Route path="/super-admin/communication/support" element={
                  <RequireAuth allowedRoles={['super_admin']}>
                    <SupportTickets />
                  </RequireAuth>
                } />
                
                {/* Legacy dashboard - redirect based on role */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Role-specific dashboards */}
                <Route path="/admin/dashboard" element={
                  <RequireAuth allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RequireAuth>
                } />
                
                <Route path="/hr/dashboard" element={
                  <RequireAuth allowedRoles={['hr', 'admin']}>
                    <HrDashboard />
                  </RequireAuth>
                } />
                
                <Route path="/employee/dashboard" element={
                  <RequireAuth allowedRoles={['employee', 'manager', 'hr', 'admin']}>
                    <EmployeeDashboard />
                  </RequireAuth>
                } />
                
                {/* Mobile-specific routes */}
                <Route path="/services" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <Services />
                  </RequireAuth>
                } />
                
                <Route path="/approvals" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager']}>
                    <Approvals />
                  </RequireAuth>
                } />
                
                <Route path="/more" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <More />
                  </RequireAuth>
                } />
                
                {/* General Settings route */}
                <Route path="/settings" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <GeneralSettings />
                  </RequireAuth>
                } />
                
                {/* Shared routes with role-based access */}
                <Route path="/employees" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <Employees />
                  </RequireAuth>
                } />
                
                <Route path="/employees/:id" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <EmployeeDetail />
                  </RequireAuth>
                } />
                
                {/* HR Lifecycle Routes */}
                <Route path="/hr-lifecycle" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <HRLifecycle />
                  </RequireAuth>
                } />
                
                <Route path="/hr-lifecycle/preboarding" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <Preboarding />
                  </RequireAuth>
                } />
                
                <Route path="/hr-lifecycle/onboarding" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager']}>
                    <Onboarding />
                  </RequireAuth>
                } />
                
                <Route path="/hr-lifecycle/portal" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <EmployeePortal />
                  </RequireAuth>
                } />
                
                <Route path="/hr-lifecycle/offboarding" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager']}>
                    <Offboarding />
                  </RequireAuth>
                } />
                
                {/* Main Attendance route */}
                <Route path="/attendance" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <Attendance />
                  </RequireAuth>
                } />
                
                {/* Attendance subpages */}
                <Route path="/attendance/dashboard" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <AttendanceDashboard />
                  </RequireAuth>
                } />
                
                <Route path="/attendance/log" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <AttendanceLog />
                  </RequireAuth>
                } />
                
                <Route path="/attendance/reports" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <AttendanceReports />
                  </RequireAuth>
                } />
                
                <Route path="/attendance/settings" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <AttendanceSettings />
                  </RequireAuth>
                } />
                
                <Route path="/attendance/submissions" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <AttendanceSubmission />
                  </RequireAuth>
                } />
                
                {/* Engagement Routes */}
                <Route path="/engagement" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <Engagement />
                  </RequireAuth>
                } />
                
                <Route path="/engagement/dashboard" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <EngagementDashboard />
                  </RequireAuth>
                } />
                
                <Route path="/engagement/surveys" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <Surveys />
                  </RequireAuth>
                } />
                
                <Route path="/engagement/recognition" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <Recognition />
                  </RequireAuth>
                } />
                
                {/* New Engagement Pages - Replace NotFound placeholders */}
                <Route path="/engagement/social" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <SocialFeed />
                  </RequireAuth>
                } />
                
                <Route path="/engagement/events" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <Events />
                  </RequireAuth>
                } />
                
                <Route path="/engagement/communities" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <Communities />
                  </RequireAuth>
                } />
                
                <Route path="/engagement/analytics" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager']}>
                    <Analytics />
                  </RequireAuth>
                } />
                
                {/* Payroll Routes */}
                <Route path="/payroll" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <PayrollDashboard />
                  </RequireAuth>
                } />
                
                <Route path="/payroll/dashboard" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <PayrollDashboard />
                  </RequireAuth>
                } />
                
                <Route path="/payroll/run" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <RunPayroll />
                  </RequireAuth>
                } />
                
                <Route path="/payroll/salary-profiles" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <SalaryProfiles />
                  </RequireAuth>
                } />
                
                <Route path="/payroll/payslips" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <Payslips />
                  </RequireAuth>
                } />
                
                <Route path="/payroll/reports" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <PayrollReports />
                  </RequireAuth>
                } />
                
                <Route path="/payroll/settings" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <PayrollSettings />
                  </RequireAuth>
                } />
                
                <Route path="/reports" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <Reports />
                  </RequireAuth>
                } />
                
                <Route path="/documents" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <Documents />
                  </RequireAuth>
                } />
                
                {/* Time Tracking module */}
                <Route path="/time-tracking" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <TimeTracking />
                  </RequireAuth>
                } />
                
                {/* Leave Tracking module */}
                <Route path="/leave-tracking" element={
                  <RequireAuth allowedRoles={['admin', 'hr', 'manager', 'employee']}>
                    <LeaveTracking />
                  </RequireAuth>
                } />
                
                {/* Dedicated Leave Settings route */}
                <Route path="/leave-tracking/settings" element={
                  <RequireAuth allowedRoles={['admin', 'hr']}>
                    <LeaveSettings />
                  </RequireAuth>
                } />
                
                {/* Future routes for other modules */}
                <Route path="/performance" element={<NotFound />} />
                <Route path="/onboarding" element={<NotFound />} />
                <Route path="/storage" element={<NotFound />} />
              </Route>
              
              {/* 404 catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AttendanceProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
