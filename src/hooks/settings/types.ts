
import type { Database } from '@/integrations/supabase/types';

export type UserSettings = Database['public']['Tables']['user_settings']['Row'];
export type SystemSettings = Database['public']['Tables']['system_settings']['Row'];
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export interface UserSettingsData {
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    department?: string;
    position?: string;
    bio?: string;
    location?: string;
    timezone?: string;
  };
  preferences?: {
    theme?: string;
    language?: string;
    timezone?: string;
    dateFormat?: string;
  };
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    weeklyReport?: boolean;
  };
}
