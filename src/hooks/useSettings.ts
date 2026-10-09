
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createErrorHandler } from './settings/utils';
import { UserSettingsService } from './settings/userSettingsService';
import { SystemSettingsService } from './settings/systemSettingsService';
import { setupRealtimeSubscriptions } from './settings/realtimeSubscriptions';
import type { UserSettings, SystemSettings, UserProfile, UserSettingsData } from './settings/types';
import { isDemoSession, readDemoData, writeDemoData } from '@/lib/demoStore';
import type { Json } from '@/integrations/supabase/types';

export const useSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userSettings, setUserSettings] = useState<UserSettings[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const demo = isDemoSession();

  // Get current user's role for access control
  const hasAdminAccess = user?.role === 'admin' || user?.role === 'hr';
  const hasHRAccess = hasAdminAccess;

  // Create error handler
  const handleError = createErrorHandler(toast);

  // Create service instances
  const userSettingsService = new UserSettingsService(handleError);
  const systemSettingsService = new SystemSettingsService(handleError);

  // Fetch functions with proper user ID handling
  const fetchUserSettings = async (userId?: string) => {
    // Use proper user ID from auth context
    const targetUserId = userId || user?.id;
    if (!targetUserId) {
      console.log('No user ID available for fetching settings');
      return;
    }
    
    if (demo) {
      setUserSettings(readDemoData<UserSettings[]>(`user-settings:${targetUserId}`, []));
      return;
    }

    const data = await userSettingsService.fetchUserSettings(String(targetUserId));
    setUserSettings(data);
  };

  const fetchUserProfile = async (userId?: string) => {
    // Use proper user ID from auth context
    const targetUserId = userId || user?.id;
    if (!targetUserId) {
      console.log('No user ID available for fetching profile');
      return;
    }
    
    if (demo) {
      setUserProfile(readDemoData<UserProfile | null>(`user-profile:${targetUserId}`, null));
      return;
    }

    const data = await userSettingsService.fetchUserProfile(String(targetUserId));
    setUserProfile(data);
  };

  const fetchSystemSettings = async () => {
    if (demo) {
      setSystemSettings(readDemoData<SystemSettings[]>('system-settings', []));
      return;
    }
    const data = await systemSettingsService.fetchSystemSettings(hasAdminAccess);
    setSystemSettings(data);
  };

  // Save functions with enhanced error handling and toast notifications
  const saveUserSettings = async (
    settingsType: 'profile' | 'preferences' | 'notifications',
    settingsData: Record<string, Json>,
    userId?: string
  ) => {
    setIsSaving(true);
    try {
      const targetUserId = userId || user?.id;
      if (!targetUserId) {
        throw new Error('User authentication required');
      }

      if (demo) {
        const current = readDemoData<UserSettings[]>(`user-settings:${targetUserId}`, []);
        const existingIndex = current.findIndex((item) => item.settings_type === settingsType);
        const record = {
          id: existingIndex >= 0 ? current[existingIndex].id : `demo-user-setting-${Date.now()}`,
          user_id: String(targetUserId),
          settings_type: settingsType,
          settings_data: settingsData,
          created_at: existingIndex >= 0 ? current[existingIndex].created_at : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const next = existingIndex >= 0
          ? current.map((item, index) => index === existingIndex ? record : item)
          : [record, ...current];
        writeDemoData(`user-settings:${targetUserId}`, next);
        setUserSettings(next as UserSettings[]);
        toast({ title: 'Success', description: 'Settings saved in the demo workspace' });
        return true;
      }

      const success = await userSettingsService.saveUserSettings(
        settingsType,
        settingsData,
        String(targetUserId)
      );

      if (success) {
        toast({
          title: "Success",
          description: "Settings saved successfully",
        });
        // Immediately refresh settings to reflect changes
        await fetchUserSettings(userId);
      }

      return success;
    } finally {
      setIsSaving(false);
    }
  };

  const saveSystemSetting = async (
    settingKey: string,
    settingValue: Record<string, Json>,
    category: string = 'general',
    description?: string
  ) => {
    setIsSaving(true);
    try {
      const targetUserId = user?.id;
      if (!targetUserId) {
        throw new Error('User authentication required');
      }

      if (demo) {
        const current = readDemoData<SystemSettings[]>('system-settings', []);
        const existingIndex = current.findIndex((item) => item.setting_key === settingKey);
        const record = {
          id: existingIndex >= 0 ? current[existingIndex].id : `demo-system-setting-${Date.now()}`,
          setting_key: settingKey,
          setting_value: settingValue,
          category,
          description: description || null,
          is_public: false,
          created_by: String(targetUserId),
          created_at: existingIndex >= 0 ? current[existingIndex].created_at : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const next = existingIndex >= 0
          ? current.map((item, index) => index === existingIndex ? record : item)
          : [record, ...current];
        writeDemoData('system-settings', next);
        setSystemSettings(next as SystemSettings[]);
        toast({ title: 'Success', description: 'System setting saved in the demo workspace' });
        return true;
      }

      const success = await systemSettingsService.saveSystemSetting(
        settingKey,
        settingValue,
        category,
        description,
        String(targetUserId),
        hasAdminAccess
      );

      if (success) {
        toast({
          title: "Success",
          description: "System setting saved successfully",
        });
        // Immediately refresh system settings to reflect changes
        await fetchSystemSettings();
      }

      return success;
    } finally {
      setIsSaving(false);
    }
  };

  const updateUserProfile = async (
    profileData: Partial<UserProfile>,
    userId?: string
  ) => {
    setIsSaving(true);
    try {
      const targetUserId = userId || user?.id;
      if (!targetUserId) {
        throw new Error('User authentication required');
      }

      if (demo) {
        const current = readDemoData<Partial<UserProfile>>(`user-profile:${targetUserId}`, {});
        const next = { ...current, ...profileData, user_id: String(targetUserId), updated_at: new Date().toISOString() };
        writeDemoData(`user-profile:${targetUserId}`, next);
        setUserProfile(next as UserProfile);
        toast({ title: 'Success', description: 'Profile updated in the demo workspace' });
        return true;
      }

      const success = await userSettingsService.updateUserProfile(
        profileData,
        String(targetUserId)
      );

      if (success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        // Refresh profile immediately
        await fetchUserProfile(userId);
      }

      return success;
    } finally {
      setIsSaving(false);
    }
  };

  // Get specific user setting with proper typing
  const getUserSetting = (settingsType: 'profile' | 'preferences' | 'notifications') => {
    const setting = userSettings.find(s => s.settings_type === settingsType);
    return setting?.settings_data as UserSettingsData[typeof settingsType] || {};
  };

  // Get system setting with caching
  const getSystemSetting = (settingKey: string): Record<string, Json> | null => {
    const setting = systemSettings.find(s => s.setting_key === settingKey);
    return setting?.setting_value as Record<string, Json> || null;
  };

  // Load system settings function
  const loadSystemSettings = async () => {
    try {
      if (demo) {
        const data = readDemoData<SystemSettings[]>('system-settings', []);
        setSystemSettings(data);
        return data;
      }
      const data = await systemSettingsService.loadSystemSettings();
      setSystemSettings(data);
      return data;
    } catch (error) {
      handleError(error, 'load system settings');
      return [];
    }
  };

  // Save multiple system settings function
  const saveSystemSettings = async (settings: Record<string, Json>) => {
    setIsSaving(true);
    try {
      const targetUserId = user?.id;
      if (!targetUserId) {
        throw new Error('User authentication required');
      }

      if (demo) {
        const next = Object.entries(settings).map(([settingKey, settingValue], index) => ({
          id: `demo-system-batch-${Date.now()}-${index}`,
          setting_key: settingKey,
          setting_value: settingValue,
          category: 'general',
          description: null,
          is_public: false,
          created_by: String(targetUserId),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        writeDemoData('system-settings', next);
        setSystemSettings(next as SystemSettings[]);
        toast({ title: 'Success', description: 'System settings saved in the demo workspace' });
        return true;
      }

      const success = await systemSettingsService.saveSystemSettings(
        settings,
        String(targetUserId),
        hasAdminAccess
      );

      if (success) {
        toast({
          title: "Success",
          description: "System settings saved successfully",
        });
        await fetchSystemSettings();
      }

      return success;
    } catch (error) {
      handleError(error, 'save system settings');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        console.log('No user found, skipping data load');
        setIsLoading(false);
        return;
      }

      console.log('Loading settings data for user:', user);
      setIsLoading(true);
      
      try {
        await Promise.all([
          fetchUserSettings(),
          fetchUserProfile(),
          hasAdminAccess ? fetchSystemSettings() : Promise.resolve(),
        ]);
      } catch (error) {
        console.error('Error during initial data load:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id, hasAdminAccess]);

  // Set up real-time subscriptions with error handling
  useEffect(() => {
    if (!user?.id || demo) return;

    const cleanup = setupRealtimeSubscriptions(
      String(user.id),
      hasAdminAccess,
      {
        onUserSettingsChange: fetchUserSettings,
        onProfileChange: fetchUserProfile,
        onSystemSettingsChange: fetchSystemSettings,
      }
    );

    return cleanup;
  }, [user?.id, hasAdminAccess]);

  return {
    userSettings,
    systemSettings,
    userProfile,
    isLoading,
    isSaving,
    hasAdminAccess,
    hasHRAccess,
    saveUserSettings,
    saveSystemSetting,
    updateUserProfile,
    getUserSetting,
    getSystemSetting,
    fetchUserSettings,
    fetchUserProfile,
    fetchSystemSettings,
    loadSystemSettings,
    saveSystemSettings,
  };
};
