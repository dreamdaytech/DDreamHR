
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getUserIdAsString } from './utils';

export const setupRealtimeSubscriptions = (
  userId?: string | number,
  hasAdminAccess = false,
  callbacks = {
    onUserSettingsChange: () => {},
    onProfileChange: () => {},
    onSystemSettingsChange: () => {},
  }
) => {
  if (!userId) return () => {};

  const userIdString = getUserIdAsString(userId);
  if (!userIdString) return () => {};

  console.log('Setting up real-time subscriptions for user:', userIdString);

  const userSettingsChannel = supabase
    .channel('user-settings-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_settings',
        filter: `user_id=eq.${userIdString}`,
      },
      (payload) => {
        console.log('User settings changed, refetching...', payload);
        callbacks.onUserSettingsChange();
      }
    )
    .subscribe();

  const profileChannel = supabase
    .channel('profile-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_profiles',
        filter: `user_id=eq.${userIdString}`,
      },
      (payload) => {
        console.log('User profile changed, refetching...', payload);
        callbacks.onProfileChange();
      }
    )
    .subscribe();

  let systemSettingsChannel: RealtimeChannel | null = null;
  if (hasAdminAccess) {
    systemSettingsChannel = supabase
      .channel('system-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_settings',
        },
        (payload) => {
          console.log('System settings changed, refetching...', payload);
          callbacks.onSystemSettingsChange();
        }
      )
      .subscribe();
  }

  return () => {
    console.log('Cleaning up real-time subscriptions');
    supabase.removeChannel(userSettingsChannel);
    supabase.removeChannel(profileChannel);
    if (systemSettingsChannel) {
      supabase.removeChannel(systemSettingsChannel);
    }
  };
};
