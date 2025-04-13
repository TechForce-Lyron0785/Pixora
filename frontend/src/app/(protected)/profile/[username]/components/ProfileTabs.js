"use client"
import React from 'react';
import {
  Grid,
  BookmarkIcon,
  Users,
  TrendingUp,
} from 'lucide-react';

const ProfileTabs = ({ activeTab, setActiveTab, profile }) => {
  const tabs = [
    { id: 'works', name: 'Works', icon: <Grid className="w-4 h-4" /> },
    { id: 'collections', name: 'Collections', icon: <BookmarkIcon className="w-4 h-4" /> },
    { id: 'followers', name: 'Followers', icon: <Users className="w-4 h-4" /> },
    { id: 'following', name: 'Following', icon: <Users className="w-4 h-4" /> },
    { id: 'activity', name: 'Activity', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'about', name: 'About', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="border-b border-white/10">
      <div className="flex space-x-1 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
              ? 'border-violet-600 text-violet-400'
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-white/20'
              }`}
          >
            {tab.icon}
            {tab.name}
            {tab.id === 'followers' && profile.followersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-violet-600/20 text-violet-400 rounded-full text-xs">
                {profile.followersCount}
              </span>
            )}
            {tab.id === 'following' && profile.followingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-violet-600/20 text-violet-400 rounded-full text-xs">
                {profile.followingCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs; 