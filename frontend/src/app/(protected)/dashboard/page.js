"use client"
import React, { useState } from 'react';
import {
  Activity,
  Heart,
  MessageSquare,
  BookmarkIcon,
  PlusCircle,
  Search,
  Bell,
  UserIcon,
  MoreHorizontal,
  Upload,
  Filter,
  ChevronDown,
  Award,
  Zap,
} from 'lucide-react';

const DashboardPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data
  const trendingImages = [
    { id: 1, thumbnail: "/images/upload/img1.webp", title: "Neon Dreams", creator: "Elena Bright", likes: "3.4K", comments: "245" },
    { id: 2, thumbnail: "/images/upload/img2.jpg", title: "Ocean Whispers", creator: "Marcus Wave", likes: "2.8K", comments: "178" },
    { id: 3, thumbnail: "/images/upload/img6.webp", title: "Cosmic Journey", creator: "Sasha Nova", likes: "4.1K", comments: "342" },
  ];

  const recommendedUsers = [
    { id: 1, name: "Jane Cooper", avatar: "/images/upload/user1.png", followers: "12.5K", images: 124 },
    { id: 2, name: "Robert Fox", avatar: "/images/upload/user2.png", followers: "8.2K", images: 86 },
    { id: 3, name: "Leslie Alexander", avatar: "/images/upload/user3.png", followers: "15.7K", images: 213 },
  ];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'portrait', name: 'Portrait' },
    { id: 'landscape', name: 'Landscape' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'minimal', name: 'Minimal' },
  ];

  // Activities feed
  const activities = [
    { user: "Elena Bright", action: "liked your image", time: "2h ago", avatar: "/images/upload/user2.png" },
    { user: "Marcus Wave", action: "commented on your post", time: "4h ago", avatar: "/images/upload/user3.png" },
    { user: "Sasha Nova", action: "followed you", time: "12h ago", avatar: "/images/upload/user1.png" }
  ];

  // Analytics data
  const analyticsData = [
    { label: "Views", value: "24.5K", growth: "+12%", icon: <Activity className="w-5 h-5 text-teal-400" /> },
    { label: "Likes", value: "8.3K", growth: "+18%", icon: <Heart className="w-5 h-5 text-rose-400" /> },
    { label: "Comments", value: "1.2K", growth: "+5%", icon: <MessageSquare className="w-5 h-5 text-blue-400" /> },
    { label: "Saves", value: "3.7K", growth: "+22%", icon: <BookmarkIcon className="w-5 h-5 text-amber-400" /> },
  ];

  return (
    <div className="p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for images, creators, or collections..."
            className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-white placeholder-gray-400"
          />
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <button className="bg-white/5 hover:bg-white/10 p-2 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full transform translate-x-1 -translate-y-1"></span>
          </button>

          <button className="hidden md:flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-2 px-4 transition-all duration-300">
            <PlusCircle className="w-4 h-4" />
            <span>Create</span>
          </button>

          <button className="md:hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 p-2 rounded-lg">
            <PlusCircle className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 p-0.5">
            <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column - Main content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Welcome card */}
          <div className="rounded-xl bg-gradient-to-br from-violet-900/50 via-fuchsia-900/30 to-zinc-900/50 border border-white/10 p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-zinc-900/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Welcome back, Alex!</h2>
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

          {/* Category filter */}
          <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${selectedCategory === category.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  } transition-colors duration-200`}
              >
                {category.name}
              </button>
            ))}
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Trending images grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Trending Images</h3>
              <button className="text-sm text-violet-400 hover:text-violet-300 flex items-center">
                See all
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingImages.map(image => (
                <div key={image.id} className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-zinc-800 border border-white/10">
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Image actions overlay */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                      <BookmarkIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs text-gray-300 mb-1">{image.creator}</p>
                    <h4 className="text-lg font-medium">{image.title}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="flex items-center text-sm text-rose-300">
                        <Heart className="w-3.5 h-3.5 mr-1 fill-rose-300" />
                        {image.likes}
                      </span>
                      <span className="flex items-center text-sm text-blue-300">
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        {image.comments}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
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
        </div>

        {/* Right column - Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick upload */}
          <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
            <h3 className="text-lg font-bold mb-4">Quick Upload</h3>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-violet-500/50 transition-colors cursor-pointer">
              <div className="p-3 bg-white/5 rounded-lg mb-4">
                <Upload className="w-6 h-6 text-violet-400" />
              </div>
              <p className="text-sm text-gray-300 mb-2">Drag and drop files here or click to upload</p>
              <p className="text-xs text-gray-500">PNG, JPG, SVG, WEBP up to 10MB</p>
            </div>
            <div className="mt-4">
              <button className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium transition-all duration-300">
                Upload New Image
              </button>
            </div>
          </div>

          {/* Recommended creators */}
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

          {/* Achievement card */}
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

          {/* Usage stats */}
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;