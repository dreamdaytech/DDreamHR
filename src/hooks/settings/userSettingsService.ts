
import { supabase } from '@/integrations/supabase/client';
import { getUserIdAsString } from './utils';
import type { UserSettings, UserProfile } from './types';
import type { Json } from '@/integrations/supabase/types';

export class UserSettingsService {
  private handleError: (error: unknown, operation: string) => unknown;

  constructor(handleError: (error: unknown, operation: string) => unknown) {
    this.handleError = handleError;
  }

  async fetchUserSettings(userId?: string) {
    try {
      const targetUserId = getUserIdAsString(userId);
      if (!targetUserId) {
        console.log('No valid user ID available for fetching settings');
        return [];
      }

      console.log('Fetching user settings for user ID:', targetUserId);

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', targetUserId);

      if (error) {
        console.error('Error fetching user settings:', error);
        this.handleError(error, 'fetch user settings');
        return [];
      }
      
      console.log('Successfully fetched user settings:', data);
      return data || [];
    } catch (error) {
      console.error('Exception while fetching user settings:', error);
      this.handleError(error, 'fetch user settings');
      return [];
    }
  }

  async fetchUserProfile(userId?: string) {
    try {
      const targetUserId = getUserIdAsString(userId);
      if (!targetUserId) {
        console.log('No valid user ID available for fetching profile');
        return null;
      }

      console.log('Fetching user profile for user ID:', targetUserId);

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        this.handleError(error, 'fetch user profile');
        return null;
      }
      
      console.log('Successfully fetched user profile:', data);
      return data || null;
    } catch (error) {
      console.error('Exception while fetching user profile:', error);
      this.handleError(error, 'fetch user profile');
      return null;
    }
  }

  async saveUserSettings(
    settingsType: 'profile' | 'preferences' | 'notifications',
    settingsData: Record<string, Json>,
    userId?: string,
    retryCount = 0
  ) {
    const targetUserId = getUserIdAsString(userId);
    if (!targetUserId) {
      console.error('No valid user ID available for saving settings');
      throw new Error('User authentication required');
    }

    try {
      console.log('Saving user settings:', { settingsType, settingsData, targetUserId });

      // Validate settings data
      if (!settingsData || typeof settingsData !== 'object') {
        throw new Error('Invalid settings data provided');
      }

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: targetUserId,
          settings_type: settingsType,
          settings_data: settingsData,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,settings_type'
        });

      if (error) {
        console.error('Error saving user settings:', error);
        
        // Retry once on specific errors
        if (retryCount === 0 && (error.code === 'PGRST301' || error.message.includes('connection'))) {
          console.log('Retrying user settings save due to connection error...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.saveUserSettings(settingsType, settingsData, userId, 1);
        }
        
        this.handleError(error, 'save user settings');
        return false;
      }

      console.log('User settings saved successfully');
      return true;
    } catch (error) {
      console.error('Exception while saving user settings:', error);
      this.handleError(error, 'save user settings');
      return false;
    }
  }

  async updateUserProfile(
    profileData: Partial<UserProfile>,
    userId?: string
  ) {
    const targetUserId = getUserIdAsString(userId);
    if (!targetUserId) {
      console.error('No valid user ID available for updating profile');
      throw new Error('User authentication required');
    }

    try {
      console.log('Updating user profile:', { profileData, targetUserId });

      const allowedProfileData = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone: profileData.phone,
        avatar_url: profileData.avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(allowedProfileData)
        .eq('user_id', targetUserId);

      if (error) {
        console.error('Error updating user profile:', error);
        this.handleError(error, 'update profile');
        return false;
      }

      console.log('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Exception while updating user profile:', error);
      this.handleError(error, 'update profile');
      return false;
    }
  }
}
