"use client"
import { useFollow } from '@/context/FollowContext';
import { useUsers } from '@/context/UsersContext';
import Link from 'next/link';
import React, { useEffect } from 'react';

const RecommendedCreators = ({ user }) => {
  const {
    getFeaturedCreators,
    updateFollowerCount,
  } = useUsers();

  const {
    followers,
    following,
    loading: followLoading,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    checkFollowStatus
  } = useFollow();


  // Load followers and following when component mounts
  useEffect(() => {
    if (user) {
      getFollowers(user._id);
      getFollowing(user._id);
    }
  }, [user, getFollowers, getFollowing]);

  const featuredCreators = getFeaturedCreators();

  const isFollowing = (userId) => {
    return following.some(followed => followed.following._id === userId);
  };

  // Handle follow/unfollow with optimistic UI updates
  const handleFollowToggle = async (userId) => {

    try {
      if (isFollowing(userId)) {
        // Optimistically update UI
        updateFollowerCount(userId, -1);

        // Call API
        await unfollowUser(userId);
      } else {
        // Optimistically update UI
        updateFollowerCount(userId, 1);

        // Call API
        await followUser(userId);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);

      // Revert the optimistic update if there was an error
      if (isFollowing(userId)) {
        updateFollowerCount(userId, 1);
      } else {
        updateFollowerCount(userId, -1);
      }
    }
  };

  return (
    <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Creators to Follow</h3>
        <Link href={"/users"} className="text-xs text-violet-400 hover:text-violet-300 flex items-center">
          See all
        </Link>
      </div>

      <div className="space-y-3">
        {featuredCreators.map(user => (
          <div key={user._id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-sm">{user.fullName}</p>
                <p className="text-xs text-gray-400">{user.followersCount} followers</p>
              </div>
            </div>
            <button
              onClick={() => handleFollowToggle(user._id)}
              disabled={followLoading}
              className={`text-xs font-medium py-1.5 px-3 rounded-full transition-colors ${isFollowing(user._id)
                ? 'bg-violet-500 hover:bg-violet-600'
                : 'bg-white/5 hover:bg-white/10'
                }`}
            >
              {isFollowing(user._id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCreators; 