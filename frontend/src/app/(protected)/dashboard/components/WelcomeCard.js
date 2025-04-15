"use client"
import React from 'react';
import { Activity, Heart, MessageSquare, BookmarkIcon, Upload } from 'lucide-react';

const WelcomeCard = ({ user }) => {
  // Analytics data
  const analyticsData = [
    { label: "Views", value: "24.5K", growth: "+12%", icon: <Activity className="w-5 h-5 text-teal-400" /> },
    { label: "Likes", value: "8.3K", growth: "+18%", icon: <Heart className="w-5 h-5 text-rose-400" /> },
    { label: "Comments", value: "1.2K", growth: "+5%", icon: <MessageSquare className="w-5 h-5 text-blue-400" /> },
    { label: "Saves", value: "3.7K", growth: "+22%", icon: <BookmarkIcon className="w-5 h-5 text-amber-400" /> },
  ];

  return (
    <div className="rounded-xl bg-gradient-to-br from-violet-900/50 via-fuchsia-900/30 to-zinc-900/50 border border-white/10 p-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-zinc-900/10 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName || "Bruh"}!</h2>
        <p className="text-gray-300 mb-6">Your images received <span className="text-violet-400 font-medium">1.4K new views</span> since yesterday.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {analyticsData.map((stat, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-4 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{stat.label}</span>
                {stat.icon}
              </div>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold">{stat.value}</span>
                <span className="text-xs text-emerald-400">{stat.growth}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button className="bg-white/10 hover:bg-white/20 flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300">
            <Upload className="w-4 h-4" />
            <span>Upload New</span>
          </button>
          <button className="bg-white/5 hover:bg-white/10 flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300">
            <Activity className="w-4 h-4" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard; 