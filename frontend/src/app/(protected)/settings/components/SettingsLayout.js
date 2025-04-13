"use client"
import React, { useState } from 'react';
import { Users, CreditCard, Bell, Lock, Globe, Shield, Smartphone } from 'lucide-react';
import ProfileSection from './ProfileSection';
import AccountSection from './AccountSection';
import NotificationsSection from './NotificationsSection';
import PrivacySection from './PrivacySection';
import ConnectionsSection from './ConnectionsSection';
import SecuritySection from './SecuritySection';
import DevicesSection from './DevicesSection';
import SettingsSidebar from './SettingsSidebar';

const SettingsLayout = ({ user, loading, updateProfile, updatePassword, logout }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // If still loading and no user data
  if (loading && !user) {
    return (
      <div className="p-6 bg-zinc-950 text-white flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-950 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your account, preferences, and security</p>
      </div>

      {/* Settings navigation */}
      <div className="mb-8 overflow-x-auto no-scrollbar">
        <div className="flex space-x-2">
          {[
            { id: 'profile', name: 'Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'account', name: 'Account', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            { id: 'privacy', name: 'Privacy', icon: <Lock className="w-4 h-4" /> },
            { id: 'connections', name: 'Connections', icon: <Globe className="w-4 h-4" /> },
            { id: 'security', name: 'Security', icon: <Shield className="w-4 h-4" /> },
            { id: 'devices', name: 'Devices', icon: <Smartphone className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
                } transition-colors duration-200`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main settings area */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {activeTab === 'profile' && <ProfileSection user={user} updateProfile={updateProfile} />}
          {activeTab === 'account' && <AccountSection user={user} />}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'privacy' && <PrivacySection user={user} updateProfile={updateProfile} />}
          {activeTab === 'connections' && <ConnectionsSection />}
          {activeTab === 'security' && <SecuritySection user={user} updatePassword={updatePassword} />}
          {activeTab === 'devices' && <DevicesSection user={user} handleLogout={logout} />}
        </div>

        {/* Right sidebar */}
        <SettingsSidebar user={user} handleLogout={logout} />
      </div>
    </div>
  );
};

export default SettingsLayout; 