"use client"
import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const RecentActivity = () => {
  // Activities feed
  const activities = [
    { user: "Elena Bright", action: "liked your image", time: "2h ago", avatar: "/images/upload/user2.png" },
    { user: "Marcus Wave", action: "commented on your post", time: "4h ago", avatar: "/images/upload/user3.png" },
    { user: "Sasha Nova", action: "followed you", time: "12h ago", avatar: "/images/upload/user1.png" }
  ];

  return (
    <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src={activity.avatar} alt={activity.user} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium text-white">{activity.user}</span>
                <span className="text-gray-400"> {activity.action}</span>
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/10">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
        View all activity
      </button>
    </div>
  );
};

export default RecentActivity; 