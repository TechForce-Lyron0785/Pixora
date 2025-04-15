"use client"
import React from 'react';

const RecommendedCreators = () => {
  const recommendedUsers = [
    { id: 1, name: "Jane Cooper", avatar: "/images/upload/user1.png", followers: "12.5K", images: 124 },
    { id: 2, name: "Robert Fox", avatar: "/images/upload/user2.png", followers: "8.2K", images: 86 },
    { id: 3, name: "Leslie Alexander", avatar: "/images/upload/user3.png", followers: "15.7K", images: 213 },
  ];

  return (
    <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Creators to Follow</h3>
        <button className="text-xs text-violet-400 hover:text-violet-300 flex items-center">
          See all
        </button>
      </div>

      <div className="space-y-3">
        {recommendedUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-400">{user.followers} followers</p>
              </div>
            </div>
            <button className="text-xs font-medium py-1.5 px-3 rounded-full bg-white/10 hover:bg-violet-600 transition-colors">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCreators; 