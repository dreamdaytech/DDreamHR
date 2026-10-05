// Local demo accounts for development only.
// These are enabled solely when running the Vite dev server (import.meta.env.DEV)
// and are stripped from production behaviour. They bypass Supabase entirely.

export type DemoRole = 'admin' | 'hr' | 'manager' | 'employee' | 'super_admin';

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: DemoRole;
}

export const DEMO_LOGIN_ENABLED = import.meta.env.DEV;

export const DEMO_STORAGE_KEY = 'demo_user';

export const DEMO_ACCOUNTS: ReadonlyArray<DemoAccount> = [
  { id: 'demo-super-admin', name: 'Demo Super Admin', email: 'superadmin@demo.local', password: 'Demo@1234', role: 'super_admin' },
  { id: 'demo-admin', name: 'Demo Admin', email: 'admin@demo.local', password: 'Demo@1234', role: 'admin' },
  { id: 'demo-hr', name: 'Demo HR', email: 'hr@demo.local', password: 'Demo@1234', role: 'hr' },
  { id: 'demo-manager', name: 'Demo Manager', email: 'manager@demo.local', password: 'Demo@1234', role: 'manager' },
  { id: 'demo-employee', name: 'Demo Employee', email: 'employee@demo.local', password: 'Demo@1234', role: 'employee' },
];

export const findDemoAccount = (email: string, password: string): DemoAccount | undefined => {
  if (!DEMO_LOGIN_ENABLED) return undefined;
  return DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
  );
};

export const getStoredDemoUser = (): DemoAccount | null => {
  if (!DEMO_LOGIN_ENABLED) return null;
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as { id: string };
    return DEMO_ACCOUNTS.find((a) => a.id === stored.id) ?? null;
  } catch {
    return null;
  }
};
