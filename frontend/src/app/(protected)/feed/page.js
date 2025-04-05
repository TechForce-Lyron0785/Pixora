"use client"
import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageSquare,
  BookmarkIcon,
  MoreHorizontal,
  Filter,
  ChevronDown,
  Search,
  Zap,
  Compass,
  TrendingUp,
  Clock,
  LayoutGrid,
  Bell,
  PlusSquare,
} from 'lucide-react';
import CuratedSection from './CuratedSection';

const Feed = () => {
  // Sample image data with varying heights
  const feedImages = [
    { id: 1, thumbnail: "/images/upload/img6.webp", title: "Urban Dystopia", creator: "Maya Lens", likes: "2.7K", comments: "186", height: "tall" },
    { id: 2, thumbnail: "/images/upload/img2.jpg", title: "Morning Dew", creator: "Thomas Reed", likes: "1.4K", comments: "92", height: "short" },
    { id: 3, thumbnail: "/images/upload/img3.jpg", title: "Neon Nights", creator: "Elena Bright", likes: "3.9K", comments: "245", height: "medium" },
    { id: 4, thumbnail: "/images/upload/img1.webp", title: "Solitude", creator: "James North", likes: "2.1K", comments: "112", height: "medium" },
    { id: 5, thumbnail: "/images/upload/img4.jpg", title: "Forgotten Places", creator: "Sasha Nova", likes: "4.5K", comments: "324", height: "tall" },
    { id: 6, thumbnail: "/images/upload/img5.png", title: "Abstract Reality", creator: "Alex Stone", likes: "1.9K", comments: "87", height: "short" },
    { id: 7, thumbnail: "/images/upload/img7.png", title: "Midnight Run", creator: "Robin Wilde", likes: "3.2K", comments: "198", height: "tall" },
    { id: 8, thumbnail: "/images/upload/img1.webp", title: "Sea of Stars", creator: "Marcus Wave", likes: "2.4K", comments: "156", height: "medium" },
    { id: 9, thumbnail: "/images/upload/img2.jpg", title: "Desert Dreams", creator: "Aria Sand", likes: "1.8K", comments: "102", height: "short" },
    { id: 10, thumbnail: "/images/bg-img3.jpg", title: "Electric Flow", creator: "Devon Spark", likes: "3.6K", comments: "234", height: "tall" },
    { id: 11, thumbnail: "/images/upload/user1.png", title: "Crystal Caves", creator: "Luna Echo", likes: "2.3K", comments: "176", height: "medium" },
    { id: 12, thumbnail: "/images/upload/img7.png", title: "Vapor City", creator: "Neo Genesis", likes: "3.1K", comments: "212", height: "medium" }
  ];

  // Simulate image loading with staggered animation
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedImages(feedImages.map(img => img.id));
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const [selectedFilter, setSelectedFilter] = useState('forYou');
  const [layoutMode, setLayoutMode] = useState('masonry');

  // Filter options
  const filters = [
    { id: 'forYou', name: 'For You', icon: <Zap className="w-4 h-4" /> },
    { id: 'trending', name: 'Trending', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'discover', name: 'Discover', icon: <Compass className="w-4 h-4" /> },
    { id: 'latest', name: 'Latest', icon: <Clock className="w-4 h-4" /> }
  ];

  // Layout modes
  const layoutModes = [
    { id: 'masonry', icon: <LayoutGrid className="w-4 h-4" /> },
    {
      id: 'grid', icon: <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
        <div className="bg-current"></div>
        <div className="bg-current"></div>
        <div className="bg-current"></div>
        <div className="bg-current"></div>
      </div>
    }
  ];

  // Active users (for stories)
  const activeUsers = [
    { id: 1, name: "Alex", avatar: "/images/upload/img5.png", hasNewStory: true },
    { id: 2, name: "Elena", avatar: "/images/upload/user1.png", hasNewStory: true },
    { id: 3, name: "Marcus", avatar: "/images/upload/user2.png", hasNewStory: true },
    { id: 4, name: "Priya", avatar: "/images/upload/user3.png", hasNewStory: false },
    { id: 5, name: "Tom", avatar: "/images/upload/img5.png", hasNewStory: true },
    { id: 6, name: "Zoe", avatar: "/images/upload/user1.png", hasNewStory: true },
    { id: 7, name: "Raj", avatar: "/images/upload/user2.png", hasNewStory: false },
    { id: 8, name: "Sophia", avatar: "/images/upload/user3.png", hasNewStory: true },
  ];

  return (
    <div className="">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="flex justify-between items-center p-4">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg p-1.5 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">Pixora</span>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full max-w-md">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for creators, artworks, or tags..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors hidden md:flex">
              <Bell className="w-5 h-5" />
            </button>
            <button className="hidden md:flex p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="hidden md:flex p-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full transition-colors">
              <PlusSquare className="w-5 h-5" />
            </button>
            <button className="p-2 md:hidden">
              <Search className="w-6 h-6" />
            </button>
            <button className="md:hidden">
              <MessageSquare className="w-6 h-6" />
            </button>
            <div className="hidden md:block w-10 h-10 rounded-full bg-zinc-800 overflow-hidden cursor-pointer">
              <img
                src="/images/upload/user1.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Filters and layout toggles */}
        <div className="flex justify-between items-center px-4 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${selectedFilter === filter.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  } transition-colors duration-200`}
              >
                {filter.icon}
                {filter.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex border-r border-white/10 pr-3 mr-2">
              {layoutModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setLayoutMode(mode.id)}
                  className={`p-2 rounded-md ${layoutMode === mode.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5'
                    } transition-colors`}
                >
                  {mode.icon}
                </button>
              ))}
            </div>
            <button className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm">
              <span>Popular</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Stories */}
      <div className="px-4 pt-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 pb-4">
          {/* Your story */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 p-0.5">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                  <PlusSquare className="w-7 h-7 text-violet-400" />
                </div>
              </div>
            </div>
            <span className="text-xs mt-2">Add Story</span>
          </div>

          {/* Active users stories */}
          {activeUsers.map(user => (
            <div key={user.id} className="flex flex-col items-center">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full ${user.hasNewStory
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600'
                  : 'bg-white/20'
                  } p-0.5`}>
                  <div className="w-full h-full rounded-full bg-zinc-900 p-0.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs mt-2">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* For you / curated section */}
      <CuratedSection feedImages={feedImages} loadedImages={loadedImages} />

      {/* Load more button */}
      <div className="flex justify-center mt-8 mb-20">
        <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40">
          Load More
        </button>
      </div>
    </div>
  );
};

// Helper Components
const Sparkles = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v3m0 12v3m-9-9H6m12 0h3m-2.5-6.5-2 2m-7 7-2 2m11 0-2-2m-7-7-2-2"></path>
    </svg>
  );
};

export default Feed;