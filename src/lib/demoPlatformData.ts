import { readDemoData, writeDemoData } from '@/lib/demoStore';

export type DemoBusiness = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'trial' | 'suspended' | 'terminated';
  plan: 'trial' | 'basic' | 'professional' | 'enterprise';
  employees: number;
  monthlyRevenue: number;
  createdAt: string;
  industry: string;
  country: string;
};

export type DemoPlatformUser = {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'hr' | 'manager' | 'employee';
  status: 'active' | 'inactive' | 'suspended';
  business: string;
  businessId: string | null;
  lastLogin: string | null;
  createdAt: string;
  loginCount: number;
  country: string;
};

export const seedBusinesses: DemoBusiness[] = [
  { id: 'BUS-001', name: 'DreamDay Technologies', email: 'admin@dreamdaytech.com', status: 'active', plan: 'enterprise', employees: 124, monthlyRevenue: 4200, createdAt: '2025-02-10', industry: 'Technology', country: 'Sierra Leone' },
  { id: 'BUS-002', name: 'West Africa Logistics', email: 'hr@walogistics.com', status: 'active', plan: 'professional', employees: 68, monthlyRevenue: 1800, createdAt: '2025-07-18', industry: 'Logistics', country: 'Ghana' },
  { id: 'BUS-003', name: 'Salone Creative Studio', email: 'hello@salonecreative.com', status: 'trial', plan: 'trial', employees: 21, monthlyRevenue: 0, createdAt: '2026-09-15', industry: 'Creative Services', country: 'Sierra Leone' },
  { id: 'BUS-004', name: 'Kono Retail Group', email: 'admin@konoretail.com', status: 'suspended', plan: 'basic', employees: 34, monthlyRevenue: 550, createdAt: '2025-11-04', industry: 'Retail', country: 'Sierra Leone' },
];

export const seedPlatformUsers: DemoPlatformUser[] = [
  { id: 'USR-001', name: 'Platform Administrator', email: 'superadmin@demo.local', role: 'super_admin', status: 'active', business: 'Platform', businessId: null, lastLogin: new Date().toISOString(), createdAt: '2025-01-01', loginCount: 64, country: 'Sierra Leone' },
  { id: 'USR-002', name: 'Aminata Kamara', email: 'admin@dreamdaytech.com', role: 'admin', status: 'active', business: 'DreamDay Technologies', businessId: 'BUS-001', lastLogin: '2026-10-06T07:30:00Z', createdAt: '2025-02-10', loginCount: 41, country: 'Sierra Leone' },
  { id: 'USR-003', name: 'Joseph Conteh', email: 'hr@dreamdaytech.com', role: 'hr', status: 'active', business: 'DreamDay Technologies', businessId: 'BUS-001', lastLogin: '2026-10-05T16:20:00Z', createdAt: '2025-03-12', loginCount: 32, country: 'Sierra Leone' },
  { id: 'USR-004', name: 'Hawa Koroma', email: 'manager@walogistics.com', role: 'manager', status: 'active', business: 'West Africa Logistics', businessId: 'BUS-002', lastLogin: '2026-10-05T11:05:00Z', createdAt: '2025-07-20', loginCount: 23, country: 'Ghana' },
  { id: 'USR-005', name: 'Abdul Bangura', email: 'employee@dreamdaytech.com', role: 'employee', status: 'suspended', business: 'DreamDay Technologies', businessId: 'BUS-001', lastLogin: '2026-09-29T09:15:00Z', createdAt: '2025-08-03', loginCount: 18, country: 'Sierra Leone' },
];

export const getDemoBusinesses = () => {
  const stored = readDemoData<DemoBusiness[]>('platform-businesses', []);
  if (stored.length) return stored;
  writeDemoData('platform-businesses', seedBusinesses);
  return seedBusinesses;
};

export const saveDemoBusinesses = (businesses: DemoBusiness[]) => {
  writeDemoData('platform-businesses', businesses);
};

export const getDemoPlatformUsers = () => {
  const stored = readDemoData<DemoPlatformUser[]>('platform-users', []);
  if (stored.length) return stored;
  writeDemoData('platform-users', seedPlatformUsers);
  return seedPlatformUsers;
};

export const saveDemoPlatformUsers = (users: DemoPlatformUser[]) => {
  writeDemoData('platform-users', users);
};
