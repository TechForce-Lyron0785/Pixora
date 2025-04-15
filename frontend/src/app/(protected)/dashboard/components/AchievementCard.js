"use client"
import React from 'react';
import { Award, Zap } from 'lucide-react';

const AchievementCard = () => {
  return (
    <div className="rounded-xl bg-gradient-to-br from-amber-900/50 to-zinc-900/60 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Achievements</h3>
        <Award className="text-amber-400 w-5 h-5" />
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-amber-900/50 rounded-lg">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-sm">Rising Star</p>
            <p className="text-xs text-gray-400">3 more uploads to unlock</p>
          </div>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-1">
          <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-1.5 rounded-full" style={{ width: '70%' }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>7/10</span>
          <span>70%</span>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard; 