"use client"
import React, { useState } from 'react';
import { UserCheck, Award, Trash, LogOut } from 'lucide-react';

const AccountSection = ({ user }) => {
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

  // Sample subscription plans
  const plans = [
    { id: 'free', name: 'Free', price: '$0', storage: '10GB', features: ['Basic editing tools', 'Standard quality exports', 'Public collections'] },
    { id: 'pro', name: 'Pro', price: '$9.99/mo', storage: '100GB', features: ['Advanced editing tools', 'HD exports', 'Private collections', 'Analytics dashboard', 'No watermarks'] },
    { id: 'premium', name: 'Premium', price: '$19.99/mo', storage: 'Unlimited', features: ['All Pro features', '4K exports', 'Priority support', 'Commercial usage rights', 'Custom branding'] },
  ];
  const [currentPlan, setCurrentPlan] = useState('free');

  return (
    <>
      <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Account Status</h2>

        <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${user?.accountStatus === 'active' ? 'bg-green-500/20 text-green-300' :
                user?.accountStatus === 'suspended' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
              }`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium">Account Status</h3>
              <p className="text-sm text-gray-400">
                {user?.accountStatus === 'active' ? 'Your account is active and in good standing' :
                  user?.accountStatus === 'suspended' ? 'Your account is temporarily suspended' :
                    'Your account has been deleted or deactivated'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs ${user?.accountStatus === 'active' ? 'bg-green-500/20 text-green-300' :
              user?.accountStatus === 'suspended' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
            }`}>
            <span className="capitalize">{user?.accountStatus || 'active'}</span>
          </div>
        </div>

        <div className="space-y-4">
          {user?.isPremium ? (
            <div className="border border-violet-500 rounded-xl p-4 bg-violet-900/20">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">Premium</h3>
                <span className="text-xs bg-violet-600 rounded-full px-2 py-0.5">Current</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                You&apos;re enjoying premium benefits, including unlimited storage and advanced features.
              </p>
              <button className="text-violet-400 hover:text-violet-300 text-sm">
                Manage subscription
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-xl p-4 transition-all ${currentPlan === plan.id
                      ? 'border-violet-500 bg-violet-900/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{plan.name}</h3>
                    {currentPlan === plan.id && (
                      <span className="text-xs bg-violet-600 rounded-full px-2 py-0.5">Current</span>
                    )}
                  </div>
                  <p className="text-xl font-bold mb-2">{plan.price}</p>
                  <p className="text-sm text-gray-400 mb-3">{plan.storage} Storage</p>

                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-xs flex items-start gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0 mt-0.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setCurrentPlan(plan.id)}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${currentPlan === plan.id
                        ? 'bg-white/20 text-white cursor-default'
                        : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white'
                      }`}
                    disabled={currentPlan === plan.id}
                  >
                    {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border border-white/10 rounded-lg p-4 bg-white/5">
            <h3 className="font-medium mb-2">Account Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Followers</span>
                <span>{user?.followersCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Following</span>
                <span>{user?.followingCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Posts</span>
                <span>{user?.postsCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Likes Received</span>
                <span>{user?.likesCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Interactions</span>
                <span>{user?.interactionsCount || 0}</span>
              </div>
            </div>
          </div>

          <div className="border border-white/10 rounded-lg p-4 bg-white/5">
            <h3 className="font-medium mb-2">Badge</h3>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${getBadgeDisplay(user?.badge || 'newbie').color}`}>
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{getBadgeDisplay(user?.badge || 'newbie').label}</p>
                <p className="text-xs text-gray-400">
                  {user?.badge === 'newbie' && 'Just getting started on your creative journey'}
                  {user?.badge === 'rising' && 'You\'re making an impact with your content'}
                  {user?.badge === 'pro' && 'A recognized creator with a growing audience'}
                  {user?.badge === 'trendsetter' && 'Your content is making waves across the platform'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Account Actions</h2>

        <div className="space-y-4">
          <div className="p-4 border border-white/10 rounded-lg bg-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Download Your Data</h3>
              <p className="text-sm text-gray-400">Get a copy of your data, including images, collections, and profile information.</p>
            </div>
            <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Download</button>
          </div>

          <div className="p-4 border border-violet-500/20 rounded-lg bg-violet-950/10 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-violet-400">Log Out</h3>
              <p className="text-sm text-gray-400">Sign out of your account on this device</p>
            </div>
            <button
              onClick={() => {/* handled by parent */}}
              className="px-3 py-1.5 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg text-sm flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Log Out
            </button>
          </div>

          <div className="p-4 border border-rose-500/20 rounded-lg bg-rose-950/10 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-rose-400">Delete Account</h3>
              <p className="text-sm text-gray-400">Permanently delete your account and all associated data.</p>
            </div>
            <button className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-sm flex items-center gap-1">
              <Trash className="w-3 h-3" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSection; 