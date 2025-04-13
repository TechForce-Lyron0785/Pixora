"use client"
import React, { useState } from 'react';

const NotificationsSection = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState({
    likes: true,
    comments: true,
    followers: true,
    mentions: true,
    newsletter: false,
  });

  return (
    <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Notification Settings</h2>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-400">All notifications</span>
          <button
            className={`relative w-12 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-violet-600' : 'bg-gray-600'}`}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <span
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationsEnabled ? 'translate-x-6' : ''}`}
            ></span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-sm text-gray-300 mb-3">Email Notifications</h3>
          <div className="space-y-3">
            {Object.entries(emailNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <p className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                  <p className="text-xs text-gray-400">
                    {key === 'likes' && 'When someone likes your content'}
                    {key === 'comments' && 'When someone comments on your content'}
                    {key === 'followers' && 'When someone follows you'}
                    {key === 'mentions' && 'When someone mentions you'}
                    {key === 'newsletter' && 'Weekly featured content and tips'}
                  </p>
                </div>
                <button
                  className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-violet-600' : 'bg-gray-600'}`}
                  onClick={() => setEmailNotifications({ ...emailNotifications, [key]: !value })}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${value ? 'translate-x-6' : ''}`}
                  ></span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-sm text-gray-300 mb-3">Push Notifications</h3>
          <div className="space-y-3">
            {['Likes', 'Comments', 'New followers', 'Mentions', 'Direct messages'].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-white/5">
                <p>{item}</p>
                <button
                  className="relative w-12 h-6 rounded-full bg-violet-600"
                >
                  <span
                    className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full translate-x-6"
                  ></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection; 