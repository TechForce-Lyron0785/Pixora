"use client"
import React from 'react';
import { UserCheck } from 'lucide-react';

const PrivacySection = ({ user, updateProfile }) => {
  // Toggle the profile visibility
  const toggleProfileVisibility = () => {
    const newVisibility = user?.profileVisibility === 'public' ? 'private' : 'public';
    updateProfile(user?._id, { profileVisibility: newVisibility });
  };

  return (
    <>
      <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Privacy Settings</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-sm text-gray-300 mb-3">Account Privacy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-xs text-gray-400">
                    {user?.profileVisibility === 'public'
                      ? 'Your profile is visible to everyone'
                      : 'Only approved followers can see your content'
                    }
                  </p>
                </div>
                <button
                  onClick={toggleProfileVisibility}
                  className={`relative w-12 h-6 rounded-full transition-colors ${user?.profileVisibility === 'public' ? 'bg-violet-600' : 'bg-gray-600'
                    }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${user?.profileVisibility === 'public' ? 'translate-x-6' : ''
                      }`}
                  ></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Activity Status</p>
                  <p className="text-xs text-gray-400">Let others see when you&apos;re active</p>
                </div>
                <select
                  value={user?.userStatus || 'online'}
                  onChange={(e) => updateProfile(user?._id, { userStatus: e.target.value })}
                  className="bg-zinc-800 border border-white/10 rounded-lg py-1 px-2 text-sm"
                >
                  <option value="online">Online</option>
                  <option value="away">Away</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Account Status</p>
                  <p className="text-xs text-gray-400">Current status of your account</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${user?.accountStatus === 'active' ? 'bg-green-500' :
                      user?.accountStatus === 'suspended' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></span>
                  <span className="text-sm capitalize">
                    {user?.accountStatus || 'active'}
                  </span>
                </div>
              </div>

              {user?.isVerified && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Verified Account</p>
                    <p className="text-xs text-gray-400">Your account has been verified</p>
                  </div>
                  <div className="bg-blue-500/20 text-blue-300 p-1 rounded-full">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h3 className="font-medium text-sm text-gray-300 mb-3">Content Interactions</h3>
            <div className="space-y-4">
              {[
                { id: 'comments', label: 'Comments', description: 'Who can comment on your posts' },
                { id: 'mentions', label: 'Mentions', description: 'Who can mention you in their posts' },
                { id: 'messages', label: 'Direct Messages', description: 'Who can send you direct messages' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <select className="bg-zinc-800 border border-white/10 rounded-lg py-1 px-2 text-sm">
                    <option>Everyone</option>
                    <option>Followers only</option>
                    <option>Nobody</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h3 className="font-medium text-sm text-gray-300 mb-3">Data Usage</h3>
            <div className="space-y-4">
              {[
                { id: 'personalization', label: 'Personalization', description: 'Allow us to use your activity to personalize your experience' },
                { id: 'analytics', label: 'Analytics Cookies', description: 'Allow us to collect usage data to improve our services' },
                { id: 'ad_personalization', label: 'Ad Personalization', description: 'Allow us to show you personalized advertisements' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <button className="relative w-12 h-6 rounded-full bg-violet-600">
                    <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full translate-x-6"></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Blocked Accounts</h2>
        <p className="text-sm text-gray-400 mb-4">You haven&apos;t blocked any accounts yet. Blocked accounts won&apos;t be able to find your profile, posts, or contact you.</p>
        <button className="text-violet-400 hover:text-violet-300 text-sm">Manage blocked accounts</button>
      </div>
    </>
  );
};

export default PrivacySection; 