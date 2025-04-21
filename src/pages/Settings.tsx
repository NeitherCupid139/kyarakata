import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Bell, Mail, Shield, User, Key, Save } from 'lucide-react';

function Settings() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    fullName: 'Admin User',
    email: user?.email || '',
    title: 'System Administrator',
    phone: '+1 (555) 123-4567'
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    securityAlerts: true
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90'
  });
  
  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you would update the user profile in Supabase here
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update notification preferences in Supabase
    } finally {
      setLoading(false);
    }
  };
  
  const handleSecurityUpdate = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update security settings in Supabase
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>
      
      {/* Profile Settings */}
      <Card
        title="Profile Settings"
        icon={<User className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={profileSettings.fullName}
              onChange={(e) => setProfileSettings({
                ...profileSettings,
                fullName: e.target.value
              })}
            />
            <Input
              label="Email"
              type="email"
              value={profileSettings.email}
              onChange={(e) => setProfileSettings({
                ...profileSettings,
                email: e.target.value
              })}
            />
            <Input
              label="Job Title"
              value={profileSettings.title}
              onChange={(e) => setProfileSettings({
                ...profileSettings,
                title: e.target.value
              })}
            />
            <Input
              label="Phone"
              value={profileSettings.phone}
              onChange={(e) => setProfileSettings({
                ...profileSettings,
                phone: e.target.value
              })}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleProfileUpdate}
              isLoading={loading}
              leftIcon={<Save size={16} />}
            >
              Save Profile
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Notification Settings */}
      <Card
        title="Notification Preferences"
        icon={<Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Email Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates about your account</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    emailNotifications: e.target.checked
                  })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Push Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications in your browser</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.pushNotifications}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    pushNotifications: e.target.checked
                  })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Weekly Digest</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get a weekly summary of system activities</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.weeklyDigest}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    weeklyDigest: e.target.checked
                  })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleNotificationUpdate}
              isLoading={loading}
              leftIcon={<Save size={16} />}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Security Settings */}
      <Card
        title="Security Settings"
        icon={<Shield className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  twoFactorAuth: e.target.checked
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Session Timeout (minutes)"
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings({
                ...securitySettings,
                sessionTimeout: e.target.value
              })}
            />
            <Input
              label="Password Expiry (days)"
              type="number"
              value={securitySettings.passwordExpiry}
              onChange={(e) => setSecuritySettings({
                ...securitySettings,
                passwordExpiry: e.target.value
              })}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleSecurityUpdate}
              isLoading={loading}
              leftIcon={<Save size={16} />}
            >
              Save Security Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Settings;