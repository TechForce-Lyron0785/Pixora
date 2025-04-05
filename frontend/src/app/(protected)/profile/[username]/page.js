"use client"
import React, { useState } from 'react';
import {
  Camera,
  Edit2,
  Grid,
  Heart,
  BookmarkIcon,
  Share2,
  Settings,
  Users,
  MessageSquare,
  Award,
  TrendingUp,
  Link as LinkIcon,
  Instagram,
  Twitter,
  Globe,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Zap,
  CheckCircle
} from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('works');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // User profile data
  const profile = {
    name: "Alex Morgan",
    username: "@alexcreates",
    avatar: "/images/upload/user1.png",
    coverImage: "/images/bg-img2.jpg",
    bio: "Digital artist and photographer based in San Francisco. Creating vibrant dreamscapes and visual stories through AI-assisted artwork.",
    isVerified: true,
    isPremium: true,
    stats: {
      followers: "15.7K",
      following: "423",
      likes: "182K",
      views: "1.2M"
    },
    links: [
      { type: "website", url: "alexmorgan.design", icon: <Globe className="w-4 h-4" /> },
      { type: "instagram", url: "instagram.com/alexcreates", icon: <Instagram className="w-4 h-4" /> },
      { type: "twitter", url: "twitter.com/alexcreates", icon: <Twitter className="w-4 h-4" /> }
    ],
    badges: [
      { name: "Top Creator", icon: <Award className="w-4 h-4 text-amber-400" /> },
      { name: "Trending", icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
      { name: "Verified", icon: <CheckCircle className="w-4 h-4 text-blue-400" /> }
    ]
  };
  
  // Portfolio works
  const works = [
    { id: 1, title: "Neon Dreams", thumbnail: "/images/upload/img1.webp", likes: "3.4K", saves: "842", featured: true },
    { id: 2, title: "Cosmic Journey", thumbnail: "/images/upload/img2.jpg", likes: "2.8K", saves: "562" },
    { id: 3, title: "Digital Eden", thumbnail: "/images/upload/img3.jpg", likes: "5.1K", saves: "1.2K", featured: true },
    { id: 4, title: "Midnight City", thumbnail: "/images/upload/img7.png", likes: "4.7K", saves: "903" },
    { id: 5, title: "Futuristic Portal", thumbnail: "/images/upload/img6.webp", likes: "3.9K", saves: "715" },
    { id: 6, title: "Ethereal Landscape", thumbnail: "/images/upload/img3.jpg", likes: "6.2K", saves: "1.5K", featured: true },
  ];
  
  // Collections
  const collections = [
    { id: 1, name: "Abstract Dreams", count: 18, thumbnail: "/images/bg-img1.jpg", color: "from-rose-500 to-orange-500" },
    { id: 2, name: "Cyberpunk Series", count: 12, thumbnail: "/images/bg-img2.jpg", color: "from-cyan-500 to-blue-500" },
    { id: 3, name: "Nature Reimagined", count: 24, thumbnail: "/images/bg-img3.jpg", color: "from-emerald-500 to-green-500" },
  ];
  
  // Recent activities
  const activities = [
    { type: "upload", title: "Uploaded 'Digital Eden'", time: "2 days ago" },
    { type: "award", title: "Received the 'Trendsetter' badge", time: "1 week ago" },
    { type: "like", title: "Liked 15 artworks from Elena Bright", time: "1 week ago" },
    { type: "feature", title: "'Cosmic Journey' was featured in Explore", time: "2 weeks ago" },
  ];
  
  // Filters
  const filters = [
    { id: 'all', name: 'All Works' },
    { id: 'featured', name: 'Featured' },
    { id: 'recent', name: 'Recent' },
    { id: 'popular', name: 'Popular' },
  ];

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-violet-900 to-fuchsia-900 overflow-hidden">
        <img 
          src={profile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
        
        {/* Cover edit button */}
        <button className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-md rounded-lg hover:bg-black/50 transition-colors">
          <Camera className="w-5 h-5" />
        </button>
      </div>
      
      {/* Profile Header */}
      <div className="px-6 md:px-10 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end mb-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-xl border-4 border-zinc-950 overflow-hidden bg-zinc-900">
              <img 
                src={profile.avatar} 
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-1.5 bg-violet-600 rounded-lg text-white hover:bg-violet-500 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          
          {/* User info */}
          <div className="mt-4 md:mt-0 md:ml-6 md:flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              {profile.isVerified && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
              {profile.isPremium && (
                <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Premium
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-3">{profile.username}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.badges.map((badge, idx) => (
                <span key={idx} className="bg-white/5 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  {badge.icon}
                  {badge.name}
                </span>
              ))}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors font-medium text-sm">
              Follow
            </button>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Bio and stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <p className="text-gray-300 mb-4">{profile.bio}</p>
            <div className="flex flex-wrap gap-3">
              {profile.links.map((link, idx) => (
                <a 
                  key={idx} 
                  href={`https://${link.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-violet-400 transition-colors"
                >
                  {link.icon}
                  {link.url}
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap justify-between gap-4 lg:justify-end">
            {[
              { label: "Followers", value: profile.stats.followers, icon: <Users className="w-4 h-4 text-gray-400" /> },
              { label: "Following", value: profile.stats.following, icon: <Users className="w-4 h-4 text-gray-400" /> },
              { label: "Likes", value: profile.stats.likes, icon: <Heart className="w-4 h-4 text-gray-400" /> },
              { label: "Views", value: profile.stats.views, icon: <TrendingUp className="w-4 h-4 text-gray-400" /> },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {stat.icon}
                  <span className="font-bold text-lg">{stat.value}</span>
                </div>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-white/10">
          <div className="flex space-x-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'works', name: 'Works', icon: <Grid className="w-4 h-4" /> },
              { id: 'collections', name: 'Collections', icon: <BookmarkIcon className="w-4 h-4" /> },
              { id: 'activity', name: 'Activity', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'about', name: 'About', icon: <Users className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-violet-600 text-violet-400' 
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-white/20'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="px-6 md:px-10 py-8">
        {/* Works tab */}
        {activeTab === 'works' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      selectedFilter === filter.id
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    } transition-colors duration-200`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm">
                  <span>Latest</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {works.map(work => (
                <div key={work.id} className="group relative rounded-xl overflow-hidden aspect-square bg-zinc-800/50 border border-white/10">
                  <img
                    src={work.thumbnail}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Featured badge */}
                  {work.featured && (
                    <div className="absolute top-3 left-3 bg-violet-600/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      Featured
                    </div>
                  )}
                  
                  {/* Image actions */}
                  <div className="absolute top-3 right-3 flex gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="p-2 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
                      <BookmarkIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-lg font-medium">{work.title}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="flex items-center text-sm text-rose-300">
                        <Heart className="w-3.5 h-3.5 mr-1 fill-rose-300" />
                        {work.likes}
                      </span>
                      <span className="flex items-center text-sm text-amber-300">
                        <BookmarkIcon className="w-3.5 h-3.5 mr-1" />
                        {work.saves}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">
                Load More
              </button>
            </div>
          </div>
        )}
        
        {/* Collections tab */}
        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(collection => (
              <div key={collection.id} className="group relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3]">
                <div className="absolute inset-0">
                  <img
                    src={collection.thumbnail}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-60 mix-blend-overlay`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                </div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <h3 className="text-xl font-bold mb-1">{collection.name}</h3>
                  <p className="text-sm text-gray-300">{collection.count} images</p>
                  
                  <div className="mt-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-colors text-sm font-medium">
                      View Collection
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add new collection */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 border-dashed aspect-[4/3] bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center cursor-pointer text-center">
              <div className="p-4 bg-white/5 rounded-full mb-3">
                <PlusCircle className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">Create Collection</h3>
              <p className="text-sm text-gray-400">Organize your works</p>
            </div>
          </div>
        )}
        
        {/* Activity tab */}
        {activeTab === 'activity' && (
          <div className="max-w-3xl mx-auto">
            <div className="relative pl-6 pb-12 border-l border-dashed border-white/10">
              {activities.map((activity, index) => {
                let icon;
                switch(activity.type) {
                  case 'upload':
                    icon = <Camera className="w-4 h-4" />;
                    break;
                  case 'award':
                    icon = <Award className="w-4 h-4" />;
                    break;
                  case 'like':
                    icon = <Heart className="w-4 h-4" />;
                    break;
                  case 'feature':
                    icon = <Zap className="w-4 h-4" />;
                    break;
                  default:
                    icon = <TrendingUp className="w-4 h-4" />;
                }
                
                return (
                  <div key={index} className="mb-8 relative">
                    <div className="absolute -left-10 p-2 rounded-full bg-zinc-800 border border-white/10">
                      {icon}
                    </div>
                    <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                      <h4 className="text-sm font-medium mb-1">{activity.title}</h4>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
              
              <div className="absolute bottom-0 left-0 transform -translate-x-1/2 p-2 rounded-full bg-zinc-800 border border-white/10">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </div>
            
            <button className="w-full py-2.5 mt-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">
              View Full Activity
            </button>
          </div>
        )}
        
        {/* About tab */}
        {activeTab === 'about' && (
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bio section */}
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-400" />
                  About Me
                </h3>
                <p className="text-gray-300 mb-4">
                  Digital artist and photographer with 7+ years of experience. I blend traditional photography techniques with AI-assisted digital art to create unique visual stories and dreamscapes.
                </p>
                <p className="text-gray-300">
                  Based in San Francisco, I&apos;ve collaborated with major brands and exhibited my work in galleries across the US and Europe. My work explores themes of futurism, nature, and human connection.
                </p>
              </div>
              
              {/* Stats section */}
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  Creator Stats
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Member Since", value: "March 2023" },
                    { label: "Total Posts", value: "87" },
                    { label: "Featured Works", value: "12" },
                    { label: "Total Views", value: "1.2M" },
                    { label: "Avg. Engagement", value: "24%" },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-gray-400">{stat.label}</span>
                      <span className="font-medium">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tools section */}
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-violet-400" />
                  Tools & Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Digital Photography", "Adobe Photoshop", "Stable Diffusion", 
                    "Midjourney", "DALL-E", "Lightroom", "Blender", "3D Modeling",
                    "Color Theory", "Composition"
                  ].map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white/5 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Contact & Links */}
              <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-violet-400" />
                  Contact & Links
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Personal Website", url: "alexmorgan.design", icon: <Globe className="w-5 h-5 text-gray-400" /> },
                    { name: "Instagram", url: "@alexcreates", icon: <Instagram className="w-5 h-5 text-gray-400" /> },
                    { name: "Twitter", url: "@alexcreates", icon: <Twitter className="w-5 h-5 text-gray-400" /> },
                    { name: "Business Inquiries", url: "alex@creativestudio.com", icon: <MessageSquare className="w-5 h-5 text-gray-400" /> },
                  ].map((link, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="p-2 bg-white/5 rounded-lg">
                        {link.icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{link.name}</p>
                        <p className="text-sm font-medium">{link.url}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-6 md:px-10 py-6 border-t border-white/10 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg p-2 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-400">Pixora</span>
          </div>
          
          <div className="flex gap-4">
            <button className="text-sm text-gray-400 hover:text-white transition-colors">Terms</button>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</button>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">Help</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// Helper Components
const PlusCircle = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
};

const Sparkles = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v3m0 12v3m-9-9H6m12 0h3m-2.5-6.5-2 2m-7 7-2 2m11 0-2-2m-7-7-2-2"></path>
    </svg>
  );
};