"use client"
import React from 'react';

const StorageUsage = () => {
  return (
    <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
      <h3 className="text-lg font-bold mb-4">Storage Usage</h3>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">4.2 GB / 10 GB Used</span>
          <span className="text-violet-400">42%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 h-2 rounded-full" style={{ width: '42%' }}></div>
        </div>
      </div>
      <button className="w-full text-center text-sm text-violet-400 hover:text-violet-300">
        Upgrade for more storage
      </button>
    </div>
  );
};

export default StorageUsage; 