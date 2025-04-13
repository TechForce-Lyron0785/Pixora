"use client"
import React, { useState } from 'react';
import { LogOut, Moon, Sun, Globe, MessageSquare, Lock, Shield, ChevronRight } from 'lucide-react';

const SettingsSidebar = ({ user, handleLogout }) => {
  const [theme, setTheme] = useState('dark');

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Generate badge display
  const getBadgeDisplay = (badge) => {
    const badges = {
      newbie: { label: 'Newbie', color: 'bg-blue-600' },
      rising: { label: 'Rising', color: 'bg-green-600' },
      pro: { label: 'Pro', color: 'bg-purple-600' },
      trendsetter: { label: 'Trendsetter', color: 'bg-yellow-600' }
    };

    return badges[badge] || badges.newbie;
  };

  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
            <img
              src={user?.profilePicture || "/images/default-profile.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-bold">{user?.fullName || 'User'}</h2>
          <p className="text-sm text-gray-400">@{user?.username || 'username'}</p>

          {user?.badge && (
            <div className="mt-2">
              <span className={`px-2 py-0.5 rounded-full text-xs ${getBadgeDisplay(user.badge).color}`}>
                {getBadgeDisplay(user.badge).label}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{user?.followersCount || 0}</p>
            <p className="text-xs text-gray-400">Followers</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{user?.postsCount || 0}</p>
            <p className="text-xs text-gray-400">Posts</p>
          </div>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${user?.userStatus === 'online' ? 'bg-green-500' :
                  user?.userStatus === 'away' ? 'bg-yellow-500' :
                    user?.userStatus === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                }`}></span>
              <span className="capitalize">{user?.userStatus || 'online'}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Member Since</span>
            <span>{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Login</span>
            <span>{user?.lastLogin ? formatDate(user.lastLogin) : 'N/A'}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Need Help?</h2>
        <div className="space-y-3">
          {[
            { label: 'Documentation', icon: <Globe className="w-4 h-4" /> },
            { label: 'Contact Support', icon: <MessageSquare className="w-4 h-4" /> },
            { label: 'Privacy Policy', icon: <Lock className="w-4 h-4" /> },
            { label: 'Terms of Service', icon: <Shield className="w-4 h-4" /> },
          ].map((item, index) => (
            <button
              key={index}
              className="flex items-center justify-between w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">App Info</h2>
          <span className="bg-white/10 text-xs rounded-full px-2 py-0.5">v2.3.1</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Release Date</span>
            <span>April 2, 2023</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Updated</span>
            <span>April 4, 2023</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar; 