
import { supabase } from '@/integrations/supabase/client';
import { getUserIdAsString } from './utils';
import type { SystemSettings } from './types';
import { getTenantContext } from '@/hooks/useTenantContext';

export class SystemSettingsService {
  private handleError: (error: any, operation: string) => any;

  constructor(handleError: (error: any, operation: string) => any) {
    this.handleError = handleError;
  }

  async fetchSystemSettings(hasAdminAccess: boolean) {
    if (!hasAdminAccess) {
      console.log('User does not have admin access for system settings');
      return [];
    }

    try {
      const context = await getTenantContext();
      if (!context?.businessId) return [];

      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('business_id', context.businessId)
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching system settings:', error);
        this.handleError(error, 'fetch system settings');
        return [];
      }
      
      console.log('Successfully fetched system settings:', data);
      return data || [];
    } catch (error) {
      console.error('Exception while fetching system settings:', error);
      this.handleError(error, 'fetch system settings');
      return [];
    }
  }

  async saveSystemSetting(
    settingKey: string,
    settingValue: Record<string, any>,
    category: string = 'general',
    description?: string,
    userId?: string,
    hasAdminAccess = false,
    retryCount = 0
  ) {
    if (!hasAdminAccess) {
      console.error('User does not have admin access to save system settings');
      throw new Error('You don\'t have permission to save system settings');
    }

    const userIdString = getUserIdAsString(userId);
    if (!userIdString) {
      console.error('No user ID available for saving system settings');
      throw new Error('User authentication required');
    }

    try {
      const context = await getTenantContext();
      if (!context?.businessId) {
        throw new Error('No tenant is assigned to this account.');
      }

      // Enhanced validation
      if (!settingKey || !settingKey.trim()) {
        throw new Error('Setting key is required');
      }
      
      if (!settingValue || typeof settingValue !== 'object') {
        throw new Error('Setting value must be a valid object');
      }

      if (!category || !category.trim()) {
        throw new Error('Category is required');
      }

      // Prepare upsert data with proper timestamps
      const upsertData = {
        business_id: context.businessId,
        setting_key: settingKey.trim(),
        setting_value: settingValue,
        category: category.trim(),
        description: description?.trim() || null,
        created_by: userIdString,
        updated_at: new Date().toISOString(),
      };

      console.log('Upserting system setting with data:', upsertData);

      const { error } = await supabase
        .from('system_settings')
        .upsert(upsertData, {
          onConflict: 'business_id,setting_key'
        });

      if (error) {
        console.error('Error saving system setting:', error);
        
        // Retry once on connection errors
        if (retryCount === 0 && (error.code === 'PGRST301' || error.message.includes('connection'))) {
          console.log('Retrying system setting save due to connection error...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.saveSystemSetting(settingKey, settingValue, category, description, userId, hasAdminAccess, 1);
        }
        
        this.handleError(error, 'save system setting');
        return false;
      }

      console.log('System setting saved successfully');
      
      // Trigger a custom event for other components to react to setting changes
      window.dispatchEvent(new CustomEvent('systemSettingsUpdated', { 
        detail: { settingKey, settingValue, category } 
      }));
      
      return true;
    } catch (error) {
      console.error('Exception while saving system setting:', error);
      this.handleError(error, 'save system setting');
      return false;
    }
  }

  async loadSystemSettings() {
    try {
      const context = await getTenantContext();
      if (!context?.businessId) return [];

      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('business_id', context.businessId);

      if (error) {
        console.error('Failed to load system settings:', error);
        throw new Error('Failed to load system settings');
      }

      console.log('System settings loaded successfully:', data);
      return data || [];
    } catch (error) {
      console.error('Exception loading system settings:', error);
      throw new Error('Failed to load system settings');
    }
  }

  async saveSystemSettings(settings: Record<string, any>, userId?: string, hasAdminAccess = false) {
    try {
      console.log('Saving multiple system settings:', settings);
      
      const results = await Promise.all(
        Object.entries(settings).map(([key, value]) =>
          this.saveSystemSetting(key, value, 'general', undefined, userId, hasAdminAccess)
        )
      );

      const allSuccessful = results.every(result => result === true);
      
      if (allSuccessful) {
        console.log('All system settings saved successfully');
      } else {
        console.warn('Some system settings failed to save');
      }

      return allSuccessful;
    } catch (error) {
      console.error('Exception saving system settings:', error);
      throw new Error('Failed to save system settings');
    }
  }
}
