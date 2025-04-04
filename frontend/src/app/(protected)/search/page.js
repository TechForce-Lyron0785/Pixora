"use client"
import React, { useState } from 'react';
import { 
  Search, 
  ImageIcon, 
  Users, 
  Grid, 
  Filter,
  X,
  Bookmark,
  Heart,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  Clock,
  Share2,
  TrendingUp,
  Tag,
  Sparkles
} from 'lucide-react';

const SearchResults = () => {
  const [searchQuery, setSearchQuery] = useState('nature photography');
  const [activeTab, setActiveTab] = useState('all');
  const [activeFilters, setActiveFilters] = useState(['recent']);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // Sample search results data
  const imageResults = [
    { id: 1, thumbnail: "/api/placeholder/300/400", title: "Mountain Vista", creator: "Elena Bright", likes: "2.4K", comments: "132", saved: true, tags: ["nature", "mountains", "landscape"] },
    { id: 2, thumbnail: "/api/placeholder/300/400", title: "Forest Tranquility", creator: "Marcus Wave", likes: "1.8K", comments: "94", saved: false, tags: ["nature", "forest", "tranquil"] },
    { id: 3, thumbnail: "/api/placeholder/300/400", title: "Coastal Sunset", creator: "Sasha Nova", likes: "3.2K", comments: "215", saved: false, tags: ["nature", "ocean", "sunset"] },
    { id: 4, thumbnail: "/api/placeholder/300/400", title: "Desert Bloom", creator: "Raj Kumar", likes: "1.5K", comments: "67", saved: false, tags: ["nature", "desert", "flowers"] },
    { id: 5, thumbnail: "/api/placeholder/300/400", title: "Misty Morning", creator: "Corey Jensen", likes: "2.1K", comments: "108", saved: true, tags: ["nature", "fog", "morning"] },
    { id: 6, thumbnail: "/api/placeholder/300/400", title: "Wild Cascades", creator: "Mei Lin", likes: "2.7K", comments: "183", saved: false, tags: ["nature", "waterfall", "wilderness"] },
  ];

  const userResults = [
    { id: 1, name: "Nature Explorer", username: "@natureexplorer", avatar: "/api/placeholder/48/48", followers: "45.2K", following: false, tags: ["wildlife", "landscape", "nature"] },
    { id: 2, name: "Earth Scenes", username: "@earthscenes", avatar: "/api/placeholder/48/48", followers: "32.5K", following: true, tags: ["earth", "nature", "photography"] },
    { id: 3, name: "Wild Captures", username: "@wildcaptures", avatar: "/api/placeholder/48/48", followers: "28.7K", following: false, tags: ["wildlife", "nature", "animals"] },
  ];

  const collectionResults = [
    { id: 1, title: "Natural Wonders", images: 36, curator: "Elena Bright", thumbnail: "/api/placeholder/64/64", saves: "3.4K" },
    { id: 2, title: "Landscape Masters", images: 24, curator: "Marcus Wave", thumbnail: "/api/placeholder/64/64", saves: "2.1K" },
  ];

  const tagResults = [
    { name: "naturephotography", posts: "1.2M" },
    { name: "wildlifephotography", posts: "890K" },
    { name: "landscapephotography", posts: "1.5M" },
  ];

  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const clearFilters = () => {
    setActiveFilters(['recent']);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top search bar */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-800/50 border border-white/10 rounded-full py-3 pl-12 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-white placeholder-gray-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:ml-4">
            <button 
              className="bg-white/5 hover:bg-white/10 p-3 rounded-full relative"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter className="w-5 h-5" />
            </button>
            
            <button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-3 px-6 rounded-full transition-all duration-300">
              Search
            </button>
          </div>
        </div>
        
        {/* Filter menu */}
        {showFilterMenu && (
          <div className="max-w-screen-2xl mx-auto mt-4 p-4 bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-white/10 animate-in fade-in-0 slide-in-from-top-5 duration-300">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <button 
                onClick={clearFilters}
                className="text-xs text-violet-400 hover:text-violet-300"
              >
                Clear all filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Time period</h4>
                <div className="space-y-2">
                  {['recent', 'past week', 'past month', 'past year', 'all time'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        activeFilters.includes(filter)
                          ? 'bg-violet-600 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      } transition-colors`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Image type</h4>
                <div className="space-y-2">
                  {['photography', 'digital art', 'illustration', 'vector', '3D'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        activeFilters.includes(filter)
                          ? 'bg-violet-600 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      } transition-colors`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-400 mb-2">License</h4>
                <div className="space-y-2">
                  {['all rights reserved', 'creative commons', 'commercial use', 'free to use'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        activeFilters.includes(filter)
                          ? 'bg-violet-600 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      } transition-colors`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            {activeFilters.map(filter => (
              <div 
                key={filter}
                className="bg-white/10 rounded-full px-3 py-1 text-xs flex items-center gap-2"
              >
                {filter}
                <button 
                  onClick={() => toggleFilter(filter)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Results tabs */}
        <div className="border-b border-white/10 mb-6">
          <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', name: 'All Results', count: 150 },
              { id: 'images', name: 'Images', count: 124, icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'users', name: 'Users', count: 12, icon: <Users className="w-4 h-4" /> },
              { id: 'collections', name: 'Collections', count: 8, icon: <Grid className="w-4 h-4" /> },
              { id: 'tags', name: 'Tags', count: 6, icon: <Tag className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                } transition-colors duration-200`}
              >
                {tab.icon && tab.icon}
                {tab.name}
                <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Results summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Results for &quot;{searchQuery}&quot;</h2>
          <p className="text-gray-400">Found 150 results in 0.3 seconds</p>
        </div>
        
        {/* Top results section */}
        {activeTab === 'all' && (
          <div className="space-y-10">
            {/* Top images */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium">Top Images</h3>
                <button 
                  onClick={() => setActiveTab('images')}
                  className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  See all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageResults.slice(0, 4).map(image => (
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
                        <Heart className={`w-5 h-5 ${image.saved ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                      <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs text-gray-300 mb-1">{image.creator}</p>
                      <h4 className="text-lg font-medium">{image.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center text-xs text-rose-300">
                          <Heart className="w-3.5 h-3.5 mr-1" />
                          {image.likes}
                        </span>
                        <span className="flex items-center text-xs text-blue-300">
                          <MessageSquare className="w-3.5 h-3.5 mr-1" />
                          {image.comments}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {image.tags.map(tag => (
                          <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Top users */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium">Creators</h3>
                <button 
                  onClick={() => setActiveTab('users')}
                  className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  See all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userResults.map(user => (
                  <div key={user.id} className="bg-zinc-900/60 border border-white/10 rounded-xl p-4 hover:border-violet-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-400">{user.username}</p>
                      </div>
                      <button className={`text-xs font-medium py-1.5 px-4 rounded-full ${
                        user.following 
                          ? 'bg-violet-600 hover:bg-violet-700' 
                          : 'bg-white/10 hover:bg-white/20'
                      } transition-colors`}>
                        {user.following ? 'Following' : 'Follow'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      <span className="font-medium">{user.followers}</span> followers
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {user.tags.map(tag => (
                        <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Collections */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium">Collections</h3>
                <button 
                  onClick={() => setActiveTab('collections')}
                  className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  See all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collectionResults.map(collection => (
                  <div key={collection.id} className="bg-zinc-900/60 border border-white/10 rounded-xl overflow-hidden flex hover:border-violet-500/50 transition-colors">
                    <div className="w-16 h-16 bg-zinc-800">
                      <img src={collection.thumbnail} alt={collection.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex-1">
                      <h4 className="font-medium">{collection.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-gray-400">
                          <span className="text-gray-300">{collection.images}</span> images
                        </p>
                        <p className="text-xs text-gray-400">
                          By <span className="text-gray-300">{collection.curator}</span>
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Bookmark className="w-3 h-3" />
                          <span className="text-gray-300">{collection.saves}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center px-4">
                      <button className="text-xs font-medium py-1.5 px-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium">Tags</h3>
                <button 
                  onClick={() => setActiveTab('tags')}
                  className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  See all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {tagResults.map(tag => (
                  <div key={tag.name} className="bg-zinc-900/60 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 hover:border-violet-500/50 transition-colors">
                    <span className="text-sm font-medium">#{tag.name}</span>
                    <span className="text-xs text-gray-400">{tag.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Images tab content */}
        {activeTab === 'images' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <button className="bg-white/5 hover:bg-white/10 py-2 px-4 rounded-lg flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  Sort by: <span className="font-medium">Trending</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <button className="bg-white/5 hover:bg-white/10 py-2 px-4 rounded-lg text-sm hidden md:flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time: <span className="font-medium">Recent</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <button className="bg-white/5 hover:bg-white/10 p-2 rounded-lg hidden md:flex">
                <Grid className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageResults.map(image => (
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
                      <Heart className={`w-5 h-5 ${image.saved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs text-gray-300 mb-1">{image.creator}</p>
                    <h4 className="text-lg font-medium">{image.title}</h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center text-xs text-rose-300">
                        <Heart className="w-3.5 h-3.5 mr-1" />
                        {image.likes}
                      </span>
                      <span className="flex items-center text-xs text-blue-300">
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        {image.comments}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {image.tags.map(tag => (
                        <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <button className="bg-white/5 hover:bg-white/10 py-3 px-6 rounded-full text-sm flex items-center gap-2 transition-colors">
                Load more results
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Users tab content */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...userResults, ...userResults].map((user, idx) => (
              <div key={`${user.id}-${idx}`} className="bg-zinc-900/60 border border-white/10 rounded-xl p-4 hover:border-violet-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-400">{user.username}</p>
                  </div>
                  <button className={`text-xs font-medium py-1.5 px-4 rounded-full ${
                    user.following 
                      ? 'bg-violet-600 hover:bg-violet-700' 
                      : 'bg-white/10 hover:bg-white/20'
                  } transition-colors`}>
                    {user.following ? 'Following' : 'Follow'}
                  </button>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  <span className="font-medium">{user.followers}</span> followers
                </p>
                <div className="flex flex-wrap gap-1">
                  {user.tags.map(tag => (
                    <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Collections tab content */}
        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...collectionResults, ...collectionResults].map((collection, idx) => (
              <div key={`${collection.id}-${idx}`} className="bg-zinc-900/60 border border-white/10 rounded-xl overflow-hidden flex hover:border-violet-500/50 transition-colors">
                <div className="w-16 h-16 bg-zinc-800">
                  <img src={collection.thumbnail} alt={collection.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1">
                  <h4 className="font-medium">{collection.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-gray-400">
                      <span className="text-gray-300">{collection.images}</span> images
                    </p>
                    <p className="text-xs text-gray-400">
                      By <span className="text-gray-300">{collection.curator}</span>
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Bookmark className="w-3 h-3" />
                      <span className="text-gray-300">{collection.saves}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center px-4">
                  <button className="text-xs font-medium py-1.5 px-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Tags tab content */}
        {activeTab === 'tags' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...tagResults, ...tagResults, ...tagResults].map((tag, idx) => (
              <div key={`${tag.name}-${idx}`} className="bg-zinc-900/60 border border-white/10 rounded-full px-4 py-3 flex items-center justify-between hover:border-violet-500/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-violet-400"/>
                  <span className="text-sm font-medium">#{tag.name}</span>
                </div>
                <span className="text-xs text-gray-400">{tag.posts} posts</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Trending searches section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Trending Searches
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { query: "Mountain landscapes", count: "2.4K searches today" },
              { query: "Wildlife photography", count: "1.8K searches today" },
              { query: "Aerial nature views", count: "1.5K searches today" },
              { query: "Macro photography", count: "1.2K searches today" },
            ].map((item, idx) => (
              <div key={idx} className="bg-zinc-900/60 border border-white/10 rounded-xl p-4 hover:border-violet-500/50 transition-colors">
                <p className="font-medium mb-1">{item.query}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-8">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="text-center text-sm text-gray-400">
            <p>© 2025 Visual Search Platform. All rights reserved.</p>
            <div className="mt-2 flex justify-center gap-4">
              <a href="#" className="hover:text-violet-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-violet-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-violet-400 transition-colors">Help</a>
              <a href="#" className="hover:text-violet-400 transition-colors">Feedback</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchResults;