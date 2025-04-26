"use client"
import React, { useState, useEffect } from 'react';
import { Heart, Filter, ArrowDownCircle, SlidersHorizontal, LayoutGrid, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useApi } from "@/hooks/useApi";
import { useLikesFavorites } from '@/context/LikesFavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCard from '@/components/cards/ImageCard';
import ImageSkeleton from '@/components/skeletons/ImageSkeleton';
import toast from 'react-hot-toast';

const LikesPage = () => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('recent');
  const [viewMode, setViewMode] = useState('grid'); // grid or masonry
  const [loadedImages, setLoadedImages] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const api = useApi();
  const { loadUserLikes } = useLikesFavorites();

  // Fetch liked images
  const fetchLikedImages = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setLoadedImages([]);
    }

    try {
      // Get liked images from API
      const response = await api.get(`/api/likes?page=${pageNum}&limit=12&sort=${filter}`);
      const newLikes = response.data.data;
      
      // Extract images from likes
      const likedImages = newLikes.map(like => ({
        ...like.image,
        likedAt: like.createdAt,
        // Add random height for masonry layout
        height: ['tall', 'medium', 'short'][Math.floor(Math.random() * 3)]
      }));

      if (isLoadMore) {
        setLikes(prev => [...prev, ...likedImages]);
      } else {
        setLikes(likedImages);
      }

      // Check if more likes are available
      setHasMore(response.data.metadata.page < response.data.metadata.pages);
      
      // Update stats
      setStats({
        total: response.data.metadata.total || 0,
        thisWeek: Math.floor(response.data.metadata.total * 0.3) || 0, // Example calculation
        thisMonth: Math.floor(response.data.metadata.total * 0.7) || 0, // Example calculation
      });

      // After a short delay, mark images as loaded (for animation)
      setTimeout(() => {
        setLoadedImages(prev => [...prev, ...likedImages.map(img => img._id)]);
        setLoading(false);
        setLoadingMore(false);
      }, 300);

      // Also update the context
      await loadUserLikes(pageNum, 12);

    } catch (error) {
      console.error('Error fetching liked images:', error);
      toast.error('Failed to load liked images');
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more images
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLikedImages(nextPage, true);
    }
  };

  // Change filter
  const handleFilterChange = (newFilter) => {
    if (newFilter !== filter) {
      setFilter(newFilter);
      setPage(1);
      setShowFilterMenu(false);
      fetchLikedImages(1, false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLikedImages();
  }, []);

  // Stats cards to display
  const statsCards = [
    { title: 'Total Likes', value: stats.total, icon: <Heart className="w-5 h-5 text-rose-400" />, color: 'from-rose-500 to-rose-600' },
    { title: 'This Week', value: stats.thisWeek, icon: <Calendar className="w-5 h-5 text-blue-400" />, color: 'from-blue-500 to-blue-600' },
    { title: 'This Month', value: stats.thisMonth, icon: <TrendingUp className="w-5 h-5 text-green-400" />, color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="px-4 py-6 max-w-screen-2xl mx-auto">
      {/* Header with stats cards */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg p-2">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Liked Images</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-800/50 border border-white/5 rounded-xl p-4 backdrop-blur-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-400 text-sm">{card.title}</h3>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${card.color} rounded-lg p-2 shadow-lg`}>
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filters and controls */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-gray-300'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('masonry')}
            className={`p-2 rounded-lg ${viewMode === 'masonry' ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-gray-300'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)} 
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
          >
            <Filter className="w-4 h-4" />
            {filter === 'recent' ? 'Most Recent' : filter === 'oldest' ? 'Oldest First' : 'Most Popular'}
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
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Most Recent
                  </span>
                </button>
                <button 
                  onClick={() => handleFilterChange('oldest')}
                  className={`w-full text-left px-4 py-2 hover:bg-zinc-700 ${filter === 'oldest' ? 'bg-violet-600/20 text-violet-300' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Oldest First
                  </span>
                </button>
                <button 
                  onClick={() => handleFilterChange('popular')}
                  className={`w-full text-left px-4 py-2 hover:bg-zinc-700 rounded-b-lg ${filter === 'popular' ? 'bg-violet-600/20 text-violet-300' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Most Popular
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}>
          {Array.from({ length: 8 }).map((_, index) => (
            <ImageSkeleton key={`skeleton-${index}`} heightClass={
              ['aspect-square', 'aspect-[3/5]', 'aspect-[3/4]', 'aspect-[4/3]'][Math.floor(Math.random() * 4)]
            } />
          ))}
        </div>
      )}

      {/* Grid view */}
      {!loading && viewMode === 'grid' && (
        <>
          {likes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {likes.map((image, index) => (
                <motion.div
                  key={image._id}
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
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 bg-zinc-800/50 rounded-xl border border-white/5">
              <Heart className="w-12 h-12 text-gray-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">No liked images yet</h3>
              <p className="text-gray-400 mb-4">Start liking images to see them here</p>
              <a href="/feed" className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium transition-colors">
                Browse Images
              </a>
            </div>
          )}
        </>
      )}

      {/* Masonry view */}
      {!loading && viewMode === 'masonry' && (
        <>
          {likes.length > 0 ? (
            <div className="flex w-full gap-4">
              {Array.from({ length: 4 }).map((_, columnIndex) => (
                <div key={`column-${columnIndex}`} className="flex-1 flex flex-col gap-4">
                  {likes
                    .filter((_, index) => index % 4 === columnIndex)
                    .map((image, imageIndex) => (
                      <motion.div
                        key={image._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: imageIndex * 0.05 }}
                      >
                        <ImageCard
                          image={image}
                          isLoaded={loadedImages.includes(image._id)}
                          index={imageIndex}
                          columnIndex={columnIndex}
                        />
                      </motion.div>
                    ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 bg-zinc-800/50 rounded-xl border border-white/5">
              <Heart className="w-12 h-12 text-gray-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">No liked images yet</h3>
              <p className="text-gray-400 mb-4">Start liking images to see them here</p>
              <a href="/feed" className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium transition-colors">
                Browse Images
              </a>
            </div>
          )}
        </>
      )}

      {/* Load more button */}
      {!loading && hasMore && likes.length > 0 && (
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

export default LikesPage; 