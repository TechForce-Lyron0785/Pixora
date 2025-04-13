"use client"
import React from 'react';
import { Globe } from 'lucide-react';

const ConnectionsSection = () => {
  // Sample connected apps data
  const connectedApps = [
    { id: 1, name: 'Instagram', icon: "/api/placeholder/40/40", connectedDate: 'Jan 15, 2023' },
    { id: 2, name: 'Behance', icon: "/api/placeholder/40/40", connectedDate: 'Mar 24, 2023' },
    { id: 3, name: 'Pinterest', icon: "/api/placeholder/40/40", connectedDate: 'Jun 10, 2023' },
  ];

  return (
    <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">Connected Apps</h2>

      <div className="space-y-4">
        {connectedApps.map((app) => (
          <div key={app.id} className="flex items-center justify-between border border-white/10 rounded-lg p-4 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium">{app.name}</p>
                <p className="text-xs text-gray-400">Connected {app.connectedDate}</p>
              </div>
            </div>
            <button className="px-3 py-1.5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              Disconnect
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 border border-dashed border-white/20 rounded-lg p-4 flex flex-col items-center justify-center py-8">
        <Globe className="w-8 h-8 text-gray-500 mb-2" />
        <h3 className="font-medium mb-1">Connect Another App</h3>
        <p className="text-sm text-gray-400 mb-3 text-center">Connect your account to other platforms to share and sync your content</p>
        <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors">
          Browse Integrations
        </button>
      </div>
    </div>
  );
};

export default ConnectionsSection; 