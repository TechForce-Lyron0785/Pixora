"use client"
import React, { useState, useEffect } from 'react';
import { 
  Grid,
  Heart,
  Lock,
  Share2,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  ChevronDown,
  Layers,
  FolderPlus,
  Eye,
  EyeOff,
  ImagePlus,
  Shuffle,
  SortAsc,
  Calendar,
  Clock,
  ChevronRight,
  Tag,
  Users
} from 'lucide-react';

const CollectionsPage = () => {
  // State management
  const [view, setView] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('recent');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(null);
  
  // Sample data
  const collections = [
    { 
      id: 1, 
      name: "Abstract Wonders", 
      cover: "/api/placeholder/500/300", 
      imageCount: 42, 
      isPrivate: false,
      created: "2025-03-15",
      description: "A collection of mesmerizing abstract digital art pieces",
      tags: ["abstract", "colorful", "digital"],
      collaborators: 2
    },
    { 
      id: 2, 
      name: "Urban Photography", 
      cover: "/api/placeholder/500/300", 
      imageCount: 28, 
      isPrivate: false,
      created: "2025-03-02",
      description: "City landscapes and street photography from around the world",
      tags: ["urban", "city", "architecture"],
      collaborators: 0
    },
    { 
      id: 3, 
      name: "Cyberpunk Aesthetic", 
      cover: "/api/placeholder/500/300", 
      imageCount: 36, 
      isPrivate: true,
      created: "2025-02-18",
      description: "Futuristic dystopian visuals with neon lights and tech themes",
      tags: ["cyberpunk", "neon", "sci-fi"],
      collaborators: 1
    },
    { 
      id: 4, 
      name: "Minimalist Design", 
      cover: "/api/placeholder/500/300", 
      imageCount: 17, 
      isPrivate: false,
      created: "2025-01-24",
      description: "Clean, simple, and elegant minimalist designs and compositions",
      tags: ["minimal", "clean", "simple"],
      collaborators: 0
    },
    { 
      id: 5, 
      name: "Nature Landscapes", 
      cover: "/api/placeholder/500/300", 
      imageCount: 54, 
      isPrivate: false,
      created: "2025-03-20",
      description: "Beautiful nature scenes from mountains to oceans",
      tags: ["nature", "landscape", "outdoors"],
      collaborators: 3
    },
    { 
      id: 6, 
      name: "Portrait Photography", 
      cover: "/api/placeholder/500/300", 
      imageCount: 31, 
      isPrivate: true,
      created: "2025-02-05",
      description: "Expressive portrait photography and character studies",
      tags: ["portrait", "people", "photography"],
      collaborators: 0
    },
  ];
  
  // Filter data based on search query
  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Sort collections based on selected sort method
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch(sortBy) {
      case 'recent':
        return new Date(b.created) - new Date(a.created);
      case 'oldest':
        return new Date(a.created) - new Date(b.created);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'most-images':
        return b.imageCount - a.imageCount;
      default:
        return 0;
    }
  });
  
  // Handle collection selection
  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
  };
  
  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setIsContextMenuOpen(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Render collection creation modal
  const renderCollectionCreationModal = () => {
    if (!isCreatingCollection) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
          <h3 className="text-xl font-bold mb-4">Create New Collection</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Collection Name</label>
              <input 
                type="text" 
                className="w-full bg-zinc-800 border border-white/10 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="e.g. Abstract Art"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea 
                className="w-full bg-zinc-800 border border-white/10 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-24"
                placeholder="What's this collection about?"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Add Tags</label>
              <input 
                type="text" 
                className="w-full bg-zinc-800 border border-white/10 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Separate tags with commas"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="privacy" className="mr-2" />
                <label htmlFor="privacy" className="text-sm text-gray-300">Make this collection private</label>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="collaboration" className="mr-2" />
                <label htmlFor="collaboration" className="text-sm text-gray-300">Allow collaboration</label>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <button 
                onClick={() => setIsCreatingCollection(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                Create Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render collection details modal
  const renderCollectionDetailsModal = () => {
    if (!selectedCollection) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedCollection(null)}>
        <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden w-full max-w-4xl" onClick={e => e.stopPropagation()}>
          <div className="relative h-56">
            <img src={selectedCollection.cover} alt={selectedCollection.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCollection.name}</h2>
                  <p className="text-gray-300 mt-1">{selectedCollection.imageCount} images</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  {selectedCollection.isPrivate && (
                    <div className="p-2 rounded-lg bg-white/10">
                      <Lock className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-300">{selectedCollection.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedCollection.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({length: 6}).map((_, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-zinc-800 relative group">
                  <img 
                    src={`/api/placeholder/${400 + index}/${400 + index}`} 
                    alt="Collection image" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <button 
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <ImagePlus className="w-4 h-4" />
                <span>Add More Images</span>
              </button>
              
              <button 
                onClick={() => setSelectedCollection(null)}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors"
              >
                View All Images
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Handle context menu toggle
  const toggleContextMenu = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (isContextMenuOpen === id) {
      setIsContextMenuOpen(null);
    } else {
      setIsContextMenuOpen(id);
    }
  };
  
  return (
    <div className="flex-1 bg-zinc-950 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Collections</h1>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCreatingCollection(true)}
              className="hidden md:flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-2 px-4 transition-all duration-300"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Collection</span>
            </button>
            
            <button 
              onClick={() => setIsCreatingCollection(true)}
              className="md:hidden p-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600"
            >
              <FolderPlus className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="mb-6 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8 lg:col-span-9 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search collections by name, description or tags..." 
              className="bg-zinc-800/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="col-span-12 md:col-span-4 lg:col-span-3 grid grid-cols-2 gap-3">
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)} 
                className="bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-2 flex items-center justify-between w-full hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center">
                  <SortAsc className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Sort</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              
              {filterOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-zinc-800 border border-white/10 rounded-lg shadow-lg overflow-hidden z-20">
                  {[
                    { id: 'recent', label: 'Most Recent', icon: <Clock className="w-4 h-4" /> },
                    { id: 'oldest', label: 'Oldest First', icon: <Calendar className="w-4 h-4" /> },
                    { id: 'name-asc', label: 'Name (A-Z)', icon: <SortAsc className="w-4 h-4" /> },
                    { id: 'name-desc', label: 'Name (Z-A)', icon: <SortAsc className="w-4 h-4 transform rotate-180" /> },
                    { id: 'most-images', label: 'Most Images', icon: <Layers className="w-4 h-4" /> },
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left p-3 flex items-center hover:bg-white/5 transition-colors ${sortBy === option.id ? 'bg-white/10' : ''}`}
                    >
                      <span className="mr-2 text-gray-400">{option.icon}</span>
                      <span className="text-sm">{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setView('grid')}
                className={`flex-1 flex items-center justify-center p-2 rounded-lg border ${view === 'grid' ? 'bg-white/10 border-violet-500' : 'border-white/10 hover:bg-white/5'} transition-colors`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`flex-1 flex items-center justify-center p-2 rounded-lg border ${view === 'list' ? 'bg-white/10 border-violet-500' : 'border-white/10 hover:bg-white/5'} transition-colors`}
              >
                <Layers className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Collection Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/60 border border-white/10 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Collections</p>
                <p className="text-2xl font-bold mt-1">{collections.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-violet-900/30">
                <Layers className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-emerald-400 flex items-center">
              <span>+2 this month</span>
            </div>
          </div>
          
          <div className="bg-zinc-900/60 border border-white/10 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Images</p>
                <p className="text-2xl font-bold mt-1">{collections.reduce((acc, col) => acc + col.imageCount, 0)}</p>
              </div>
              <div className="p-3 rounded-lg bg-fuchsia-900/30">
                <Grid className="w-5 h-5 text-fuchsia-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-emerald-400 flex items-center">
              <span>+24 this month</span>
            </div>
          </div>
          
          <div className="bg-zinc-900/60 border border-white/10 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Private Collections</p>
                <p className="text-2xl font-bold mt-1">{collections.filter(c => c.isPrivate).length}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-900/30">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400 flex items-center">
              <span>{Math.round((collections.filter(c => c.isPrivate).length / collections.length) * 100)}% of all collections</span>
            </div>
          </div>
          
          <div className="bg-zinc-900/60 border border-white/10 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Collaborations</p>
                <p className="text-2xl font-bold mt-1">{collections.filter(c => c.collaborators > 0).length}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-900/30">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400 flex items-center">
              <span>{collections.reduce((acc, col) => acc + col.collaborators, 0)} total collaborators</span>
            </div>
          </div>
        </div>
        
        {/* Quick access */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button className="bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors flex flex-col items-center justify-center aspect-square">
              <div className="p-3 bg-white/10 rounded-lg mb-2">
                <Shuffle className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-sm font-medium">Random</p>
              <p className="text-xs text-gray-400">Explore randomly</p>
            </button>
            
            <button className="bg-gradient-to-br from-rose-900/50 to-violet-900/50 border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors flex flex-col items-center justify-center aspect-square">
              <div className="p-3 bg-white/10 rounded-lg mb-2">
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
              <p className="text-sm font-medium">Favorites</p>
              <p className="text-xs text-gray-400">Most liked images</p>
            </button>
            
            <button className="bg-gradient-to-br from-teal-900/50 to-cyan-900/50 border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors flex flex-col items-center justify-center aspect-square">
              <div className="p-3 bg-white/10 rounded-lg mb-2">
                <Clock className="w-5 h-5 text-teal-400" />
              </div>
              <p className="text-sm font-medium">Recent</p>
              <p className="text-xs text-gray-400">Last 30 days</p>
            </button>
            
            <button className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors flex flex-col items-center justify-center aspect-square">
              <div className="p-3 bg-white/10 rounded-lg mb-2">
                <Tag className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-sm font-medium">By Tags</p>
              <p className="text-xs text-gray-400">Filter by keywords</p>
            </button>
            
            <button className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors flex flex-col items-center justify-center aspect-square">
              <div className="p-3 bg-white/10 rounded-lg mb-2">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-sm font-medium">Shared</p>
              <p className="text-xs text-gray-400">Collaborative</p>
            </button>
            
            <button className="bg-gradient-to-br from-gray-800/50 to-zinc-900/50 border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors flex flex-col items-center justify-center aspect-square">
              <div className="p-3 bg-white/10 rounded-lg mb-2">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm font-medium">Private</p>
              <p className="text-xs text-gray-400">Your eyes only</p>
            </button>
          </div>
        </div>
        
        {/* Collections grid view */}
        {view === 'grid' && (
          <div>
            <h2 className="text-lg font-bold mb-4">All Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCollections.map(collection => (
                <div 
                  key={collection.id} 
                  className="group bg-zinc-900/60 border border-white/10 rounded-xl overflow-hidden hover:border-violet-500/50 transition-colors cursor-pointer"
                  onClick={() => handleCollectionClick(collection)}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={collection.cover} 
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg">{collection.name}</h3>
                          <p className="text-sm text-gray-300">{collection.imageCount} images</p>
                        </div>
                        
                        {collection.isPrivate && (
                          <div className="p-2 rounded-lg bg-white/10">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Collection actions overlay */}
                    <div className="absolute top-3 right-3 flex gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle share action
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20"
                        onClick={(e) => toggleContextMenu(e, collection.id)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {/* Context menu */}
                      {isContextMenuOpen === collection.id && (
                        <div className="absolute right-0 top-full mt-2 bg-zinc-800 border border-white/10 rounded-lg shadow-lg overflow-hidden z-20 min-w-40">
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            <span>Edit Collection</span>
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>Make Public</span>
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Manage Access</span>
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2 text-rose-400">
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>Created {new Date(collection.created).toLocaleDateString()}</span>
                      </div>
                      
                      {collection.collaborators > 0 && (
                        <div className="flex items-center gap-1 text-xs text-emerald-400">
                          <Users className="w-3 h-3" />
                          <span>{collection.collaborators} collaborators</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-300 line-clamp-2 mb-3">{collection.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {collection.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                      {collection.tags.length > 3 && (
                        <span className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs cursor-pointer">
                          +{collection.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Collections list view */}
        {view === 'list' && (
          <div>
            <h2 className="text-lg font-bold mb-4">All Collections</h2>
            <div className="space-y-3">
              {sortedCollections.map(collection => (
                <div 
                  key={collection.id} 
                  className="group bg-zinc-900/60 border border-white/10 rounded-lg overflow-hidden hover:border-violet-500/50 transition-colors flex cursor-pointer"
                  onClick={() => handleCollectionClick(collection)}
                >
                  <div className="w-20 md:w-32 lg:w-40 relative">
                    <img 
                      src={collection.cover} 
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">{collection.name}</h3>
                        <p className="text-sm text-gray-300">{collection.imageCount} images</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {collection.isPrivate && (
                          <div className="p-1 rounded-lg bg-white/10">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                        
                        <button 
                          className="p-1 rounded-lg bg-white/10 hover:bg-white/20"
                          onClick={(e) => toggleContextMenu(e, `list-${collection.id}`)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        
                        {/* Context menu */}
                        {isContextMenuOpen === `list-${collection.id}` && (
                          <div className="absolute bg-zinc-800 border border-white/10 rounded-lg shadow-lg overflow-hidden z-20 min-w-40">
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              <span>Edit Collection</span>
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              <span>Make Public</span>
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>Manage Access</span>
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2 text-rose-400">
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Created {new Date(collection.created).toLocaleDateString()}</span>
                      </div>
                      
                      {collection.collaborators > 0 && (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Users className="w-3 h-3" />
                          <span>{collection.collaborators} collaborators</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{collection.tags.slice(0, 2).join(', ')}{collection.tags.length > 2 ? ` +${collection.tags.length - 2} more` : ''}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center pr-4">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {sortedCollections.length === 0 && (
          <div className="text-center py-16 bg-zinc-900/50 border border-white/10 rounded-xl">
            <div className="flex justify-center mb-4">
              <FolderPlus className="w-16 h-16 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Collections Found</h3>
            <p className="text-gray-400 mb-6">No collections match your search criteria. Try adjusting your filters or create a new collection.</p>
            <button 
              onClick={() => setIsCreatingCollection(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-2 px-4 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Collection</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Collection creation modal */}
      {renderCollectionCreationModal()}
      
      {/* Collection details modal */}
      {renderCollectionDetailsModal()}
    </div>
  );
};

export default CollectionsPage;