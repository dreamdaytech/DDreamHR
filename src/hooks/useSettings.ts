
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createErrorHandler } from './settings/utils';
import { UserSettingsService } from './settings/userSettingsService';
import { SystemSettingsService } from './settings/systemSettingsService';
import { setupRealtimeSubscriptions } from './settings/realtimeSubscriptions';
import type { UserSettings, SystemSettings, UserProfile, UserSettingsData } from './settings/types';

export const useSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userSettings, setUserSettings] = useState<UserSettings[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Get current user's role for access control
  const hasAdminAccess = user?.role === 'admin';
  const hasHRAccess = user?.role === 'hr' || user?.role === 'admin';

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
    
    const data = await userSettingsService.fetchUserProfile(String(targetUserId));
    setUserProfile(data);
  };

  const fetchSystemSettings = async () => {
    const data = await systemSettingsService.fetchSystemSettings(hasAdminAccess);
    setSystemSettings(data);
  };

  // Save functions with enhanced error handling and toast notifications
  const saveUserSettings = async (
    settingsType: 'profile' | 'preferences' | 'notifications',
    settingsData: Record<string, any>,
    userId?: string
  ) => {
    setIsSaving(true);
    try {
      const targetUserId = userId || user?.id;
      if (!targetUserId) {
        throw new Error('User authentication required');
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
    settingValue: Record<string, any>,
    category: string = 'general',
    description?: string
  ) => {
    setIsSaving(true);
    try {
      const targetUserId = user?.id;
      if (!targetUserId) {
        throw new Error('User authentication required');
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
  const getSystemSetting = (settingKey: string): Record<string, any> | null => {
    const setting = systemSettings.find(s => s.setting_key === settingKey);
    return setting?.setting_value as Record<string, any> || null;
  };

  // Load system settings function
  const loadSystemSettings = async () => {
    try {
      const data = await systemSettingsService.loadSystemSettings();
      setSystemSettings(data);
      return data;
    } catch (error) {
      handleError(error, 'load system settings');
      return [];
    }
  };

  // Save multiple system settings function
  const saveSystemSettings = async (settings: Record<string, any>) => {
    setIsSaving(true);
    try {
      const targetUserId = user?.id;
      if (!targetUserId) {
        throw new Error('User authentication required');
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
    if (!user?.id) return;

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
