"use client"
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  MessageSquare, 
  Heart, 
  Grid, 
  UserCheck,
  UserX,
  Filter,
  ChevronDown,
  Award,
  TrendingUp,
  Image as ImageIcon,
  MessageCircle,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFollow } from '@/context/FollowContext';
import { useUsers } from '@/context/UsersContext';
import Link from 'next/link';

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
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
  
  const { 
    allUsers, 
    loading: usersLoading, 
    getOtherUsers, 
    getRandomUsers, 
    getFeaturedCreators,
    updateFollowerCount
  } = useUsers();
  
  // Get other users (excluding current user)
  const otherUsers = getOtherUsers();
  
  // Get featured creators
  const featuredCreators = getFeaturedCreators();
  
  // Get random users for suggestions
  const suggestedUsers = getRandomUsers(5);
  
  // Load followers and following when component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      getFollowers(user._id);
      getFollowing(user._id);
    }
  }, [isAuthenticated, user, getFollowers, getFollowing]);
  
  // Filter users based on active tab
  const filteredUsers = () => {
    let users = [];
    
    if (activeTab === 'all') {
      users = otherUsers;
    } else if (activeTab === 'followers') {
      // Filter followers to only include users that exist in allUsers
      users = followers.filter(follower => 
        otherUsers.some(user => user._id === follower.follower._id)
      ).map(follower => {
        // Find the full user object from allUsers
        const fullUser = allUsers.find(u => u._id === follower.follower._id);
        return fullUser || follower.follower;
      });
    } else if (activeTab === 'following') {
      // Filter following to only include users that exist in allUsers
      users = following.filter(followed => 
        otherUsers.some(user => user._id === followed.following._id)
      ).map(followed => {
        // Find the full user object from allUsers
        const fullUser = allUsers.find(u => u._id === followed.following._id);
        return fullUser || followed.following;
      });
    }
    
    if (searchQuery) {
      return users.filter(user => 
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return users;
  };
  
  // Check if current user is following a user using the following array
  const isFollowing = (userId) => {
    return following.some(followed => followed.following._id === userId);
  };
  
  // Handle follow/unfollow with optimistic UI updates
  const handleFollowToggle = async (userId) => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    
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
    <div className="w-full flex-1 min-h-screen bg-zinc-950 text-white">
      {/* Top section */}
      <div className="p-6 pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center">
              <Users className="mr-2 w-5 h-5" />
              Users & Community
            </h1>
            <p className="text-gray-400 text-sm">Connect with creators and build your network</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find users..." 
                className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-full md:w-60 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)} 
                className="flex items-center gap-2 bg-zinc-800/50 border border-white/10 rounded-lg py-2 px-4 hover:bg-zinc-700/50 transition"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filters</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-zinc-800 border border-white/10 rounded-lg shadow-xl z-10">
                  <div className="p-3">
                    <h3 className="text-sm font-medium mb-2">Filter by</h3>
                    <div className="space-y-2">
                      {['All Users', 'Verified', 'Pro Users', 'New Users'].map((filter, idx) => (
                        <div key={idx} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`filter-${idx}`} 
                            className="w-4 h-4 rounded border-white/20 text-violet-600 focus:ring-violet-500 bg-zinc-700"
                          />
                          <label htmlFor={`filter-${idx}`} className="ml-2 text-sm text-gray-300">{filter}</label>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button className="text-xs text-violet-400 hover:text-violet-300">Apply Filters</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10">
          {[
            { id: 'all', label: 'All Users', icon: <Users className="w-4 h-4" /> },
            { id: 'followers', label: 'Your Followers', icon: <UserPlus className="w-4 h-4" /> },
            { id: 'following', label: 'Following', icon: <UserCheck className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'followers' && <span className="bg-violet-900/60 text-violet-300 text-xs px-2 py-0.5 rounded-full">{followers.length}</span>}
              {tab.id === 'following' && <span className="bg-violet-900/60 text-violet-300 text-xs px-2 py-0.5 rounded-full">{following.length}</span>}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-12 gap-6">
        {/* Main content - Users list */}
        <div className="col-span-12 lg:col-span-8">
          {/* Users grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usersLoading ? (
              // Loading state
              Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="bg-zinc-900/60 border border-white/10 rounded-xl p-4 animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-800"></div>
                      <div>
                        <div className="h-5 w-32 bg-zinc-800 rounded mb-2"></div>
                        <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-zinc-800 rounded"></div>
                  </div>
                </div>
              ))
            ) : filteredUsers().length > 0 ? (
              filteredUsers().map(user => (
                <div key={user._id} className="bg-zinc-900/60 border border-white/10 rounded-xl p-4 hover:border-violet-500/30 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-violet-500 transition-colors">
                          <img src={user.profilePicture || "/images/default-profile.jpg"} alt={user.fullName} className="w-full h-full object-cover" />
                        </div>
                        {user.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-violet-500 rounded-full p-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-base">{user.fullName}</h3>
                          {user.badge && (
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              user.badge === 'pro' ? 'bg-violet-900/60 text-violet-300' :
                              user.badge === 'artist' ? 'bg-rose-900/60 text-rose-300' :
                              user.badge === 'featured' ? 'bg-amber-900/60 text-amber-300' :
                              'bg-emerald-900/60 text-emerald-300'
                            }`}>
                              {user.badge.charAt(0).toUpperCase() + user.badge.slice(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">@{user.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleFollowToggle(user._id)}
                        disabled={followLoading}
                        className={`text-xs font-medium py-1.5 px-3 rounded-lg transition-colors ${
                          isFollowing(user._id)
                            ? 'bg-violet-500 hover:bg-violet-600 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-white'
                        }`}
                      >
                        {isFollowing(user._id) ? 'Following' : 'Follow'}
                      </button>
                      <Link href={`/profile/${user.username}`} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white/5 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Followers</p>
                      <p className="text-sm font-medium">{user.followersCount || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Following</p>
                      <p className="text-sm font-medium">{user.followingCount || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Images</p>
                      <p className="text-sm font-medium">{user.posts || 0}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end items-center">
                    <Link href={`/profile/${user.username}`} className="text-xs text-violet-400 hover:text-violet-300">View Profile</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-zinc-900/60 border border-white/10 rounded-xl p-8 text-center">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveTab('all');}}
                  className="text-violet-400 hover:text-violet-300 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors">Previous</button>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(page => (
                <button 
                  key={page} 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    page === 1 ? 'bg-violet-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="text-gray-500">...</span>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-white/5 hover:bg-white/10 text-gray-300">
                12
              </button>
            </div>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors">Next</button>
          </div>
        </div>
        
        {/* Right sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* User stats card */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Your Network</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-violet-900/20 to-violet-900/5 border border-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Followers</span>
                  <UserPlus className="w-4 h-4 text-violet-400" />
                </div>
                <p className="text-2xl font-bold">{followers.length}</p>
                <div className="flex items-center text-xs text-emerald-400 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+{Math.floor(Math.random() * 10)} this week</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-fuchsia-900/20 to-fuchsia-900/5 border border-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Following</span>
                  <UserCheck className="w-4 h-4 text-fuchsia-400" />
                </div>
                <p className="text-2xl font-bold">{following.length}</p>
                <div className="flex items-center text-xs text-emerald-400 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+{Math.floor(Math.random() * 5)} this week</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured creators */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Featured Creators</h3>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-3">
              {featuredCreators.length > 0 ? (
                featuredCreators.map(creator => (
                  <div key={creator._id} className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img src={creator.profilePicture || "/images/default-profile.jpg"} alt={creator.fullName} className="w-full h-full object-cover" />
                        </div>
                        {creator.isVerified && (
                          <div className="absolute -bottom-0.5 -right-0.5 bg-violet-500 rounded-full p-0.5">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{creator.fullName}</p>
                        <p className="text-xs text-gray-400">{creator.followersCount || 0} followers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/profile/${creator.username}`} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </Link>
                      <button 
                        onClick={() => handleFollowToggle(creator._id)}
                        disabled={followLoading}
                        className={`text-xs font-medium py-1 px-2 rounded-lg transition-colors ${
                          isFollowing(creator._id)
                            ? 'bg-violet-500 hover:bg-violet-600'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {isFollowing(creator._id) ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">No featured creators available</p>
                </div>
              )}
            </div>
            <Link href="/users" className="w-full mt-4 text-center text-sm text-violet-400 hover:text-violet-300">
              Browse all featured creators
            </Link>
          </div>
          
          {/* Community insights */}
          <div className="bg-gradient-to-br from-violet-900/30 via-fuchsia-900/20 to-zinc-900/60 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Community Insights</h3>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Most Active Users</span>
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {suggestedUsers.slice(0, 7).map(user => (
                    <div key={user._id} className="w-8 h-8 rounded-full overflow-hidden">
                      <img src={user.profilePicture || "/images/default-profile.jpg"} alt={user.fullName} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">+{Math.floor(Math.random() * 20)}</div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Popular Topics</span>
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Photography', 'Digital Art', 'Illustration', '3D', 'Animation'].map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/5 rounded-md text-xs">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Weekly Challenge</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-xs text-gray-400 mb-2">Join our &quot;Urban Landscapes&quot; challenge this week!</p>
                <div className="flex justify-between text-xs">
                  <span className="text-violet-400">142 participants</span>
                  <span className="text-gray-400">3 days left</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm transition-colors">
              View Community Hub
            </button>
          </div>
          
          {/* Suggested connections */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">You might like</h3>
            <div className="flex overflow-x-auto gap-3 py-2 no-scrollbar">
              {suggestedUsers.map(user => (
                <div key={user._id} className="flex-shrink-0 w-36 bg-white/5 rounded-lg p-3 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-2">
                    <img src={user.profilePicture || "/images/default-profile.jpg"} alt={user.fullName} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm font-medium truncate">{user.fullName}</p>
                  <p className="text-xs text-gray-400 mb-2">@{user.username}</p>
                  <button 
                    onClick={() => handleFollowToggle(user._id)}
                    disabled={followLoading}
                    className={`w-full py-1.5 ${
                      isFollowing(user._id)
                        ? 'bg-violet-500 hover:bg-violet-600'
                        : 'bg-white/10 hover:bg-violet-600'
                    } rounded text-xs font-medium transition-colors`}
                  >
                    {isFollowing(user._id) ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;