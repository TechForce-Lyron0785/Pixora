"use client"
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Globe,
  Users,
  ChevronDown,
  MoreHorizontal,
  FolderPlus,
  Image as ImageIcon,
  ArrowRight,
  X,
  Star,
  UserPlus,
  Download,
  Eye,
  EyeOff,
  Share2,
  Layout,
  List,
  SlidersHorizontal,
  Filter,
  Clock,
  Calendar,
  Heart,
  Link
} from 'lucide-react';

const CollectionsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('recent');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollectionForShare, setSelectedCollectionForShare] = useState(null);
  
  // Sample data for collections
  const [collections, setCollections] = useState([
    {
      id: 1,
      name: "Urban Architecture",
      description: "Modern city buildings and structures",
      coverImage: "/api/placeholder/400/300",
      imageCount: 42,
      visibility: "public",
      isStarred: true,
      dateCreated: "March 12, 2025",
      lastUpdated: "2 days ago",
      tags: ["buildings", "city", "modern"],
      collaborators: 3
    },
    {
      id: 2,
      name: "Abstract Art",
      description: "Collection of vibrant abstract digital paintings",
      coverImage: "/api/placeholder/400/300",
      imageCount: 27,
      visibility: "private",
      isStarred: false,
      dateCreated: "January 5, 2025",
      lastUpdated: "1 week ago",
      tags: ["abstract", "colorful", "digital art"],
      collaborators: 0
    },
    {
      id: 3,
      name: "Nature Landscapes",
      description: "Beautiful natural scenery from around the world",
      coverImage: "/api/placeholder/400/300",
      imageCount: 64,
      visibility: "shared",
      isStarred: true,
      dateCreated: "February 18, 2025",
      lastUpdated: "3 days ago",
      tags: ["nature", "landscapes", "outdoor"],
      collaborators: 2
    },
    {
      id: 4,
      name: "Minimalist Design",
      description: "Clean, simple, and elegant design concepts",
      coverImage: "/api/placeholder/400/300",
      imageCount: 31,
      visibility: "public",
      isStarred: false,
      dateCreated: "March 5, 2025",
      lastUpdated: "5 days ago",
      tags: ["minimal", "clean", "design"],
      collaborators: 1
    },
    {
      id: 5,
      name: "Cyberpunk Imagery",
      description: "Futuristic neon-filled cyberpunk aesthetic",
      coverImage: "/api/placeholder/400/300",
      imageCount: 38,
      visibility: "private",
      isStarred: false,
      dateCreated: "January 22, 2025",
      lastUpdated: "2 weeks ago",
      tags: ["cyberpunk", "neon", "futuristic"],
      collaborators: 0
    },
    {
      id: 6,
      name: "Portrait Photography",
      description: "Expressive portrait shots with varied lighting",
      coverImage: "/api/placeholder/400/300",
      imageCount: 53,
      visibility: "shared",
      isStarred: true,
      dateCreated: "February 3, 2025",
      lastUpdated: "yesterday",
      tags: ["portraits", "people", "photography"],
      collaborators: 4
    }
  ]);
  
  // Recently viewed collections
  const recentlyViewed = [
    { id: 101, name: "Vintage Effects", coverImage: "/api/placeholder/100/100", imageCount: 17 },
    { id: 102, name: "Color Studies", coverImage: "/api/placeholder/100/100", imageCount: 24 },
    { id: 103, name: "Travel Moments", coverImage: "/api/placeholder/100/100", imageCount: 36 }
  ];
  
  // Sample collaborators data
  const collaborators = [
    { id: 1, name: "Alex Johnson", avatar: "/api/placeholder/40/40", role: "editor" },
    { id: 2, name: "Maya Patel", avatar: "/api/placeholder/40/40", role: "viewer" },
    { id: 3, name: "Sam Wilson", avatar: "/api/placeholder/40/40", role: "editor" }
  ];

  // Toggle star status for a collection
  const toggleStar = (id) => {
    setCollections(collections.map(collection => 
      collection.id === id ? {...collection, isStarred: !collection.isStarred} : collection
    ));
  };

  // Delete a collection
  const deleteCollection = (id) => {
    setCollections(collections.filter(collection => collection.id !== id));
  };
  
  // Update collections based on sort option
  useEffect(() => {
    let sortedCollections = [...collections];
    
    switch(sortOption) {
      case 'recent':
        sortedCollections.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      case 'name':
        sortedCollections.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'size':
        sortedCollections.sort((a, b) => b.imageCount - a.imageCount);
        break;
      case 'oldest':
        sortedCollections.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
        break;
      default:
        break;
    }
    
    setCollections(sortedCollections);
  }, [sortOption]);
  
  // Filtered collections based on search and filter
  const filteredCollections = collections.filter(collection => {
    // Filter by visibility
    if (filter !== 'all' && collection.visibility !== filter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !collection.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !collection.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !collection.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    return true;
  });

  // Function to open share modal for a specific collection
  const openShareModal = (collection) => {
    setSelectedCollectionForShare(collection);
    setShowShareModal(true);
  };

  // Get visibility icon
  const getVisibilityIcon = (visibility) => {
    switch(visibility) {
      case 'public': return <Globe className="w-4 h-4 text-green-400" />;
      case 'private': return <Lock className="w-4 h-4 text-amber-400" />;
      case 'shared': return <Users className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-zinc-950 text-white min-h-screen">
      {/* Top section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center">
              <Grid className="mr-2 text-violet-400" />
              My Collections
            </h1>
            <p className="text-gray-400 text-sm">Organize, manage, and share your visual content</p>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-4 py-2 rounded-lg transition-all duration-300"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Collection</span>
          </button>
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search collections by name, description, or tags..." 
              className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <button className="flex items-center gap-2 bg-zinc-800/70 hover:bg-zinc-700/70 px-4 py-2 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">
                  {filter === 'all' ? 'All' : filter === 'public' ? 'Public' : filter === 'private' ? 'Private' : 'Shared'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg overflow-hidden z-10 border border-white/10">
                <div className="py-1">
                  {['all', 'public', 'private', 'shared'].map((option) => (
                    <button
                      key={option}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 flex items-center gap-2"
                      onClick={() => setFilter(option)}
                    >
                      {option === 'all' ? 'All Collections' : 
                       option === 'public' ? <><Globe className="w-4 h-4 text-green-400" /> Public</> : 
                       option === 'private' ? <><Lock className="w-4 h-4 text-amber-400" /> Private</> : 
                       <><Users className="w-4 h-4 text-blue-400" /> Shared</>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <button className="flex items-center gap-2 bg-zinc-800/70 hover:bg-zinc-700/70 px-4 py-2 rounded-lg transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm">
                  {sortOption === 'recent' ? 'Recent' : 
                   sortOption === 'name' ? 'Name' : 
                   sortOption === 'size' ? 'Size' : 'Oldest'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-800 rounded-lg shadow-lg overflow-hidden z-10 border border-white/10">
                <div className="py-1">
                  {[
                    { value: 'recent', label: 'Recently Updated', icon: <Clock className="w-4 h-4" /> },
                    { value: 'name', label: 'Name (A-Z)', icon: <List className="w-4 h-4" /> },
                    { value: 'size', label: 'Size (Images)', icon: <ImageIcon className="w-4 h-4" /> },
                    { value: 'oldest', label: 'Date Created', icon: <Calendar className="w-4 h-4" /> }
                  ].map((option) => (
                    <button
                      key={option.value}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 flex items-center gap-2"
                      onClick={() => setSortOption(option.value)}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex border border-white/10 rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-violet-600' : 'bg-zinc-800/70 hover:bg-zinc-700/70'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-violet-600' : 'bg-zinc-800/70 hover:bg-zinc-700/70'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Recently viewed section */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-4 mb-8">
          <h3 className="text-sm text-gray-400 uppercase font-medium mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Recently Viewed
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {recentlyViewed.map(collection => (
              <div key={collection.id} className="flex-shrink-0 w-48 bg-zinc-800/70 rounded-lg overflow-hidden border border-white/10 hover:border-violet-500/50 transition-colors group">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={collection.coverImage} 
                    alt={collection.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-xs py-1 px-2 rounded-md backdrop-blur-sm">
                    {collection.imageCount} <ImageIcon className="w-3 h-3 inline ml-1" />
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm truncate">{collection.name}</h4>
                </div>
              </div>
            ))}
            <button className="flex-shrink-0 w-48 h-full flex items-center justify-center bg-zinc-800/40 hover:bg-zinc-800/70 rounded-lg border border-dashed border-white/20 hover:border-violet-500/50 transition-colors">
              <div className="flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-violet-400 mb-1" />
                <span className="text-sm text-gray-400">View All</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Collections display */}
      {filteredCollections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-zinc-900/60 rounded-xl border border-white/10">
          <div className="p-4 bg-zinc-800/70 rounded-full mb-4">
            <Grid className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No collections found</h3>
          <p className="text-gray-400 mb-6 text-center max-w-lg">
            {searchQuery 
              ? `No collections match "${searchQuery}". Try different keywords or filters.` 
              : "You don't have any collections yet or none match your current filters."}
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 rounded-lg"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create Collection</span>
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCollections.map(collection => (
                <div 
                  key={collection.id} 
                  className="bg-zinc-900/60 rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/30 transition-all group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={collection.coverImage} 
                      alt={collection.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <button className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md hover:bg-rose-500/70"
                          onClick={() => deleteCollection(collection.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="absolute top-3 right-3 flex gap-2">
                      <div className="bg-black/60 backdrop-blur-sm py-1 px-2 rounded-md flex items-center text-xs">
                        {collection.imageCount} <ImageIcon className="w-3 h-3 ml-1" />
                      </div>
                      <div className="bg-black/60 backdrop-blur-sm p-1 rounded-md">
                        {getVisibilityIcon(collection.visibility)}
                      </div>
                    </div>
                    
                    <button 
                      className={`absolute top-3 left-3 p-1.5 rounded-lg ${collection.isStarred ? 'bg-amber-500/70' : 'bg-black/60 backdrop-blur-sm'}`}
                      onClick={() => toggleStar(collection.id)}
                    >
                      <Star className={`w-4 h-4 ${collection.isStarred ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg truncate">{collection.name}</h3>
                      <div className="relative">
                        <button className="p-1 rounded-lg hover:bg-white/10">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{collection.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {collection.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-violet-900/30 text-violet-300 py-1 px-2 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {collection.lastUpdated}
                      </span>
                      
                      {collection.collaborators > 0 && (
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {collection.collaborators} collaborators
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between">
                      <button className="text-sm text-violet-400 hover:text-violet-300 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      
                      <button 
                        className="text-sm text-gray-300 hover:text-white flex items-center"
                        onClick={() => openShareModal(collection)}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Create new collection card */}
              <div 
                className="bg-zinc-900/40 rounded-xl border border-dashed border-white/20 hover:border-violet-500/50 transition-colors flex flex-col items-center justify-center p-8 cursor-pointer h-full"
                onClick={() => setShowAddModal(true)}
              >
                <div className="p-4 bg-white/5 rounded-full mb-4">
                  <FolderPlus className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="font-medium mb-2">Create New Collection</h3>
                <p className="text-gray-400 text-sm text-center">Organize your images into a new collection</p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/60 rounded-xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-12 py-3 px-4 bg-zinc-800/70 text-sm font-medium text-gray-300">
                <div className="col-span-5">Collection</div>
                <div className="col-span-2 text-center">Images</div>
                <div className="col-span-2 text-center">Visibility</div>
                <div className="col-span-2 text-center">Last Updated</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              {filteredCollections.map(collection => (
                <div 
                  key={collection.id} 
                  className="grid grid-cols-12 py-3 px-4 border-t border-white/10 hover:bg-zinc-800/30 transition-colors items-center"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={collection.coverImage} 
                        alt={collection.name} 
                        className="w-full h-full object-cover" 
                      />
                      {collection.isStarred && (
                        <div className="absolute top-0 right-0 bg-amber-500/80 p-0.5 rounded-bl">
                          <Star className="w-3 h-3 fill-white text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{collection.name}</h3>
                      <p className="text-gray-400 text-sm truncate max-w-md">{collection.description}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-center">
                    <span className="flex items-center justify-center gap-1 text-sm">
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                      {collection.imageCount}
                    </span>
                  </div>
                  
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800">
                      {getVisibilityIcon(collection.visibility)}
                      <span>
                        {collection.visibility.charAt(0).toUpperCase() + collection.visibility.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-center text-gray-400 text-sm">
                    {collection.lastUpdated}
                  </div>
                  
                  <div className="col-span-1 flex justify-end gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white/10">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/10">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/10" onClick={() => openShareModal(collection)}>
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-400" onClick={() => deleteCollection(collection.id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Add collection modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl border border-white/10 p-6 w-full max-w-xl relative">
            <button 
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10"
              onClick={() => setShowAddModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <FolderPlus className="mr-2 text-violet-400" />
              Create New Collection
            </h3>
            
            <div className="space-y-5 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Collection Name</label>
                <input 
                  type="text"
                  placeholder="Enter collection name"
                  className="bg-zinc-800/70 border border-white/10 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  placeholder="Describe what this collection is about..."
                  className="bg-zinc-800/70 border border-white/10 rounded-lg py-2 px-3 w-full h-24 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Visibility</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'private', label: 'Private', icon: <Lock className="w-4 h-4" /> },
                    { value: 'shared', label: 'Shared', icon: <Users className="w-4 h-4" /> },
                    { value: 'public', label: 'Public', icon: <Globe className="w-4 h-4" /> }
                  ].map(option => (
                    <button
                      key={option.value}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                        option.value === 'private' 
                          ? 'border-amber-500/30 bg-amber-900/10' 
                          : 'border-white/10 bg-zinc-800/70 hover:bg-zinc-700/50'
                      }`}
                    >
                      <div className={`p-2 rounded-full mb-1 ${
                        option.value === 'private' ? 'bg-amber-500/20' : 'bg-white/5'
                      }`}>
                        {option.icon}
                      </div>
                      <span className="text-sm">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
                <input 
                  type="text"
                  placeholder="Add tags separated by commas"
                  className="bg-zinc-800/70 border border-white/10 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Cover Image</label>
                <div className="border border-dashed border-white/20 rounded-lg p-4 flex flex-col items-center justify-center bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer">
                  <div className="p-3 bg-zinc-700/50 rounded-full mb-2">
                    <ImageIcon className="w-6 h-6 text-violet-400" />
                  </div>
                  <p className="text-sm text-center mb-1">Drag and drop an image or click to browse</p>
                  <p className="text-xs text-gray-400">Recommended size: 1280x720px</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-colors">
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Share collection modal */}
      {showShareModal && selectedCollectionForShare && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl border border-white/10 p-6 w-full max-w-xl relative">
            <button 
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10"
              onClick={() => setShowShareModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <Share2 className="mr-2 text-violet-400" />
              Share Collection
            </h3>
            
            <p className="text-gray-400 text-sm mb-6">
              Share &quot;{selectedCollectionForShare.name}&quot; with others and manage access permissions
            </p>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-300 mb-1">Visibility</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { value: 'private', label: 'Private', icon: <Lock className="w-4 h-4" /> },
                  { value: 'shared', label: 'Shared', icon: <Users className="w-4 h-4" /> },
                  { value: 'public', label: 'Public', icon: <Globe className="w-4 h-4" /> }
                ].map(option => (
                  <button
                    key={option.value}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                      option.value === selectedCollectionForShare.visibility 
                        ? option.value === 'private' 
                          ? 'border-amber-500/30 bg-amber-900/10' 
                          : option.value === 'shared'
                            ? 'border-blue-500/30 bg-blue-900/10'
                            : 'border-green-500/30 bg-green-900/10'
                        : 'border-white/10 bg-zinc-800/70 hover:bg-zinc-700/50'
                    }`}
                  >
                    <div className={`p-2 rounded-full mb-1 ${
                      option.value === selectedCollectionForShare.visibility 
                        ? option.value === 'private' 
                          ? 'bg-amber-500/20' 
                          : option.value === 'shared'
                            ? 'bg-blue-500/20'
                            : 'bg-green-500/20'
                        : 'bg-white/5'
                    }`}>
                      {option.icon}
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="relative mb-5">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type="text"
                  value="https://collections.example.com/share/abcd1234"
                  readOnly
                  className="bg-zinc-800/70 border border-white/10 rounded-lg py-2 pl-10 pr-24 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-sm transition-colors">
                  Copy Link
                </button>
              </div>
            </div>
            
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Collaborators</h4>
                <button className="flex items-center text-sm text-violet-400 hover:text-violet-300">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add People
                </button>
              </div>
              
              {collaborators.length > 0 ? (
                <div className="space-y-2">
                  {collaborators.map(collaborator => (
                    <div key={collaborator.id} className="flex justify-between items-center p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800">
                      <div className="flex items-center gap-3">
                        <img src={collaborator.avatar} alt={collaborator.name} className="w-8 h-8 rounded-full" />
                        <span>{collaborator.name}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="relative mr-2">
                          <button className="flex items-center gap-1 text-sm bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-600 transition-colors">
                            {collaborator.role === 'editor' ? 'Can edit' : 'Can view'}
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button className="p-1 rounded hover:bg-white/10">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 bg-zinc-800/30 rounded-lg border border-white/10">
                  <div className="p-3 bg-zinc-700/50 rounded-full mb-2">
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-center mb-1">No collaborators yet</p>
                  <p className="text-xs text-gray-400">Invite people to collaborate on this collection</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                onClick={() => setShowShareModal(false)}
              >
                Close
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;