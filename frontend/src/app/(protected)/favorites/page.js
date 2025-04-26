"use client"
import React, { useState, useEffect } from 'react';
import { BookmarkIcon, Filter, ArrowDownCircle, Share2, Grid, Download, Trash2, Search, Bookmark, Check } from 'lucide-react';
import { useApi } from "@/hooks/useApi";
import { useLikesFavorites } from '@/context/LikesFavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCard from '@/components/cards/ImageCard';
import ImageSkeleton from '@/components/skeletons/ImageSkeleton';
import toast from 'react-hot-toast';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('recent');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [loadedImages, setLoadedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [collections, setCollections] = useState([
    { id: 1, name: 'Nature', count: 12, color: 'from-green-500 to-green-600' },
    { id: 2, name: 'Abstract', count: 8, color: 'from-blue-500 to-blue-600' },
    { id: 3, name: 'Portraits', count: 5, color: 'from-amber-500 to-amber-600' },
  ]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const api = useApi();
  const { loadUserFavorites } = useLikesFavorites();

  // Fetch favorited images
  const fetchFavorites = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setLoadedImages([]);
    }

    try {
      // Build query params
      let queryParams = `page=${pageNum}&limit=12&sort=${filter}`;
      if (searchTerm) queryParams += `&search=${searchTerm}`;
      if (selectedCollection) queryParams += `&collection=${selectedCollection}`;

      // Get favorited images from API
      const response = await api.get(`/api/favorites?${queryParams}`);
      const newFavorites = response.data.data;
      
      // Extract images from favorites
      const favoritedImages = newFavorites.map(favorite => ({
        ...favorite.image,
        favoritedAt: favorite.createdAt,
        // Add random height for masonry layout
        height: ['tall', 'medium', 'short'][Math.floor(Math.random() * 3)]
      }));

      if (isLoadMore) {
        setFavorites(prev => [...prev, ...favoritedImages]);
      } else {
        setFavorites(favoritedImages);
      }

      // Check if more favorites are available
      setHasMore(response.data.metadata.page < response.data.metadata.pages);

      // After a short delay, mark images as loaded (for animation)
      setTimeout(() => {
        setLoadedImages(prev => [...prev, ...favoritedImages.map(img => img._id)]);
        setLoading(false);
        setLoadingMore(false);
      }, 300);

      // Update context
      await loadUserFavorites(pageNum, 12);

    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorite images');
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFavorites(1, false);
  };

  // Load more images
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFavorites(nextPage, true);
    }
  };

  // Change filter
  const handleFilterChange = (newFilter) => {
    if (newFilter !== filter) {
      setFilter(newFilter);
      setPage(1);
      setShowFilterMenu(false);
      fetchFavorites(1, false);
    }
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setIsSelecting(!isSelecting);
    setSelectedImages([]);
  };

  // Toggle image selection
  const toggleImageSelection = (imageId) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(prev => prev.filter(id => id !== imageId));
    } else {
      setSelectedImages(prev => [...prev, imageId]);
    }
  };

  // Handle bulk actions on selected images
  const handleBulkAction = (action) => {
    if (selectedImages.length === 0) return;

    switch(action) {
      case 'download':
        toast.success(`Downloading ${selectedImages.length} images`);
        break;
      case 'share':
        toast.success(`Share panel opened for ${selectedImages.length} images`);
        break;
      case 'remove':
        toast.success(`Removed ${selectedImages.length} images from favorites`);
        setFavorites(prev => prev.filter(img => !selectedImages.includes(img._id)));
        setSelectedImages([]);
        break;
      case 'addToCollection':
        setCreatingCollection(true);
        break;
      default:
        break;
    }
  };

  // Create new collection
  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    
    const newCollection = {
      id: collections.length + 1,
      name: newCollectionName.trim(),
      count: selectedImages.length,
      color: ['from-violet-500 to-violet-600', 'from-rose-500 to-rose-600', 'from-cyan-500 to-cyan-600'][
        Math.floor(Math.random() * 3)
      ]
    };
    
    setCollections(prev => [...prev, newCollection]);
    setNewCollectionName('');
    setCreatingCollection(false);
    toast.success(`Created collection "${newCollectionName}" with ${selectedImages.length} images`);
    setSelectedImages([]);
    setIsSelecting(false);
  };

  // Filter by collection
  const handleSelectCollection = (collectionId) => {
    if (selectedCollection === collectionId) {
      setSelectedCollection(null);
    } else {
      setSelectedCollection(collectionId);
    }
    setPage(1);
    fetchFavorites(1, false);
  };

  // Initial fetch
  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="px-4 py-6 max-w-screen-2xl mx-auto">
      {/* Header with actions */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-2">
            <BookmarkIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Favorites</h1>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in favorites..."
              className="w-full pl-10 py-2 bg-zinc-800/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <button 
            type="submit"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>

        {/* Collections */}
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Collections</h2>
            <button 
              onClick={() => setCreatingCollection(true)}
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              + New Collection
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {collections.map(collection => (
              <button
                key={collection.id}
                onClick={() => handleSelectCollection(collection.id)}
                className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  selectedCollection === collection.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-800/80 hover:bg-zinc-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${collection.color}`}></span>
                {collection.name}
                <span className="text-xs opacity-70">({collection.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls and actions bar */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleSelectionMode}
            className={`px-4 py-2 rounded-lg text-sm ${
              isSelecting ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
            }`}
          >
            {isSelecting ? 'Cancel Selection' : 'Select Images'}
          </button>
          
          {isSelecting && (
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('download')}
                disabled={selectedImages.length === 0}
                className={`p-2 rounded-lg ${selectedImages.length ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-800/50 cursor-not-allowed'}`}
                title="Download selected"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleBulkAction('share')}
                disabled={selectedImages.length === 0}
                className={`p-2 rounded-lg ${selectedImages.length ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-800/50 cursor-not-allowed'}`}
                title="Share selected"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleBulkAction('remove')}
                disabled={selectedImages.length === 0}
                className={`p-2 rounded-lg ${selectedImages.length ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-800/50 cursor-not-allowed'}`}
                title="Remove from favorites"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleBulkAction('addToCollection')}
                disabled={selectedImages.length === 0}
                className={`p-2 rounded-lg ${selectedImages.length ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-800/50 cursor-not-allowed'}`}
                title="Add to collection"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)} 
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
          >
            <Filter className="w-4 h-4" />
            {filter === 'recent' ? 'Recently Added' : filter === 'oldest' ? 'Oldest First' : 'Most Popular'}
          </button>

          <AnimatePresence>
            {showFilterMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-white/10 rounded-lg shadow-xl z-10"
              >
                <button 
                  onClick={() => handleFilterChange('recent')}
                  className={`w-full text-left px-4 py-2 hover:bg-zinc-700 rounded-t-lg ${filter === 'recent' ? 'bg-violet-600/20 text-violet-300' : ''}`}
                >
                  Recently Added
                </button>
                <button 
                  onClick={() => handleFilterChange('oldest')}
                  className={`w-full text-left px-4 py-2 hover:bg-zinc-700 ${filter === 'oldest' ? 'bg-violet-600/20 text-violet-300' : ''}`}
                >
                  Oldest First
                </button>
                <button 
                  onClick={() => handleFilterChange('popular')}
                  className={`w-full text-left px-4 py-2 hover:bg-zinc-700 rounded-b-lg ${filter === 'popular' ? 'bg-violet-600/20 text-violet-300' : ''}`}
                >
                  Most Popular
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create collection dialog */}
      <AnimatePresence>
        {creatingCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setCreatingCollection(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Create New Collection</h3>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name"
                className="w-full p-3 bg-zinc-800 border border-white/10 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                autoFocus
              />
              <p className="text-gray-400 text-sm mb-4">
                This collection will include {selectedImages.length} selected image{selectedImages.length !== 1 ? 's' : ''}.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setCreatingCollection(false)}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm flex items-center gap-2"
                  disabled={!newCollectionName.trim()}
                >
                  <Check className="w-4 h-4" />
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ImageSkeleton key={`skeleton-${index}`} heightClass={
              ['aspect-square', 'aspect-[3/5]', 'aspect-[3/4]', 'aspect-[4/3]'][Math.floor(Math.random() * 4)]
            } />
          ))}
        </div>
      )}

      {/* Images grid */}
      {!loading && (
        <>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favorites.map((image, index) => (
                <div key={image._id} className="relative group">
                  {isSelecting && (
                    <div 
                      className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-full cursor-pointer transition-colors ${
                        selectedImages.includes(image._id)
                          ? 'bg-violet-600 border-2 border-white'
                          : 'bg-black/50 border border-white/50 hover:bg-black/80'
                      }`}
                      onClick={() => toggleImageSelection(image._id)}
                    >
                      {selectedImages.includes(image._id) && (
                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                      )}
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ImageCard
                      image={image}
                      isLoaded={loadedImages.includes(image._id)}
                      index={index % 4}
                      columnIndex={Math.floor(index / 4)}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 bg-zinc-800/50 rounded-xl border border-white/5">
              <BookmarkIcon className="w-12 h-12 text-gray-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
              <p className="text-gray-400 mb-4">Start bookmarking images to see them here</p>
              <a href="/feed" className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium transition-colors">
                Browse Images
              </a>
            </div>
          )}
        </>
      )}

      {/* Load more button */}
      {!loading && hasMore && favorites.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            className={`px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 flex items-center gap-2 ${loadingMore ? 'opacity-70 cursor-wait' : ''}`}
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
            <ArrowDownCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 