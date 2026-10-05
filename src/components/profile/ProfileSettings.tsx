
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/context/AuthContext';
import { User, Save, Clock, MapPin, Phone, Mail, Briefcase } from 'lucide-react';

interface ProfileSettingsProps {
  userId?: string;
  readOnly?: boolean;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  userId, 
  readOnly = false 
}) => {
  const { user } = useAuth();
  const {
    userProfile,
    getUserSetting,
    updateUserProfile,
    saveUserSettings,
    isSaving,
    hasHRAccess,
    fetchUserProfile,
    fetchUserSettings,
  } = useSettings();

  const isEditingOwnProfile = !userId || userId === String(user?.id);
  const canEdit = !readOnly && (isEditingOwnProfile || hasHRAccess);

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    role: 'employee',
  });

  // Profile settings state
  const [profileSettings, setProfileSettings] = useState({
    department: '',
    position: '',
    bio: '',
    location: '',
    timezone: 'UTC',
  });

  // Load data when component mounts or userId changes
  useEffect(() => {
    const loadData = async () => {
      if (userId && userId !== String(user?.id)) {
        await fetchUserProfile(userId);
        await fetchUserSettings(userId);
      }
    };

    loadData();
  }, [userId]);

  // Update form data when profile data changes
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        phone: userProfile.phone || '',
        role: userProfile.role || 'employee',
      });
    }

    // Get profile settings with proper type casting
    const profileSetting = getUserSetting('profile') as {
      department?: string;
      position?: string;
      bio?: string;
      location?: string;
      timezone?: string;
    };
    
    if (profileSetting) {
      setProfileSettings({
        department: profileSetting.department || '',
        position: profileSetting.position || '',
        bio: profileSetting.bio || '',
        location: profileSetting.location || '',
        timezone: profileSetting.timezone || 'UTC',
      });
    }
  }, [userProfile, getUserSetting]);

  const handleSaveProfile = async () => {
    if (!canEdit) return;

    const targetUserId = userId || String(user?.id);
    if (!targetUserId) return;

    // Update user profile
    const profileSuccess = await updateUserProfile({
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      phone: profileData.phone,
      role: profileData.role,
    }, targetUserId);

    // Update profile settings
    const settingsSuccess = await saveUserSettings('profile', {
      department: profileSettings.department,
      position: profileSettings.position,
      bio: profileSettings.bio,
      location: profileSettings.location,
      timezone: profileSettings.timezone,
    }, targetUserId);

    return profileSuccess && settingsSuccess;
  };

  const roles = [
    { value: 'employee', label: 'Employee' },
    { value: 'manager', label: 'Manager' },
    { value: 'hr', label: 'HR' },
    { value: 'admin', label: 'Admin' },
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <User className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">
              {isEditingOwnProfile ? 'My Profile' : 'User Profile'}
            </h2>
            <p className="text-muted-foreground">
              {canEdit ? 'Manage profile information and settings' : 'View profile information'}
            </p>
          </div>
        </div>
        {canEdit && (
          <Button onClick={handleSaveProfile} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={!canEdit}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!canEdit}
                  className="pl-10"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={profileData.role}
                onValueChange={(value) => setProfileData(prev => ({ ...prev, role: value }))}
                disabled={!canEdit || !hasHRAccess}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {profileData.role && (
                <Badge variant="outline" className="mt-2">
                  {roles.find(r => r.value === profileData.role)?.label}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profileSettings.department}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, department: e.target.value }))}
                disabled={!canEdit}
                placeholder="Engineering, Marketing, etc."
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={profileSettings.position}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, position: e.target.value }))}
                disabled={!canEdit}
                placeholder="Software Engineer, Manager, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={profileSettings.location}
                  onChange={(e) => setProfileSettings(prev => ({ ...prev, location: e.target.value }))}
                  disabled={!canEdit}
                  className="pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={profileSettings.timezone}
                onValueChange={(value) => setProfileSettings(prev => ({ ...prev, timezone: value }))}
                disabled={!canEdit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileSettings.bio}
              onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
              disabled={!canEdit}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button (Mobile) */}
      {canEdit && (
        <div className="md:hidden">
          <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
};
