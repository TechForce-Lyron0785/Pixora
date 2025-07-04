"use client"
import React from 'react';
import { Globe, LogOut } from 'lucide-react';

const DevicesSection = ({ user, handleLogout }) => {
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">Active Sessions</h2>

      {user?.loginHistory && user.loginHistory.length > 0 ? (
        <div className="space-y-4">
          {user.loginHistory.slice(0, 5).map((session, index) => (
            <div key={index} className="border border-white/10 rounded-lg p-4 bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{session.device || 'Unknown Device'}</p>
                    <p className="text-xs text-gray-400">
                      {index === 0 ? 'Current session' : formatDate(session.timestamp)}
                    </p>
                  </div>
                </div>
                {index === 0 ? (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 rounded-full px-2 py-0.5">
                    Active now
                  </span>
                ) : (
                  <button className="text-rose-400 hover:text-rose-300 text-sm">
                    Not active
                  </button>
                )}
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>Location: {session.location || 'Unknown'}</span>
                <span>IP: {session.ip ? session.ip.replace(/\d+\.\d+$/, 'XX.XX') : 'Unknown'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-white/10 rounded-lg p-4 bg-white/5">
          <p className="text-gray-400">No active sessions found</p>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log out of all other sessions
        </button>
      </div>
    </div>
  );
};

export default DevicesSection; 