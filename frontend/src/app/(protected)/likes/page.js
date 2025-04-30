"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import { useLikesFavorites } from '@/context/LikesFavoritesContext';
import { CategoryFilter } from '@/app/(protected)/dashboard/components';
import ImageCard from '@/components/cards/ImageCard';
import ImageSkeleton from '@/components/skeletons/ImageSkeleton';
import { Heart, SquareHeart, HeartOff } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const LikesPage = () => {
  const { user } = useAuth();
  const api = useApi();
  const { likedImages, toggleLike } = useLikesFavorites();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadedImages, setLoadedImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Custom toggle like handler to remove images from the list
  const handleUnlike = useCallback(async (imageId) => {
    const result = await toggleLike(imageId);
    if (result.success) {
      // Remove the image from the list if unliked
      setImages(prevImages => prevImages.filter(img => img._id !== imageId));
    }
  }, [toggleLike]);

  // Fetch liked images
  const fetchLikedImages = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setLoadedImages([]);
    }

    try {
      // Add category to the API request if it's not 'all'
      const endpoint = selectedCategory && selectedCategory !== 'all'
        ? `/api/likes?page=${pageNum}&limit=12&category=${selectedCategory}`
        : `/api/likes?page=${pageNum}&limit=12`;

      const response = await api.get(endpoint);
      
      // Format the data to work with ImageCard component
      const formattedImages = response.data.data.map(item => ({
        ...item.image,
        user: item.user
      }));
      
      if (isLoadMore) {
        setImages(prevImages => [...prevImages, ...formattedImages]);
      } else {
        setImages(formattedImages);
      }

      // Check if more images are available
      setHasMore(response.data.metadata.page < response.data.metadata.pages);

      // After a short delay, mark images as loaded for animation
      setTimeout(() => {
        setLoadedImages(prev => [...prev, ...formattedImages.map(img => img._id)]);
        setLoading(false);
        setLoadingMore(false);
      }, 300);
    } catch (error) {
      console.error('Error fetching liked images:', error);
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

  // Listen for changes to the likedImages object from context
  useEffect(() => {
    // If any image in our current list is no longer in likedImages, remove it
    setImages(prevImages => 
      prevImages.filter(img => img._id && likedImages[img._id] !== false)
    );
  }, [likedImages]);

  // Fetch images when component mounts or category changes
  useEffect(() => {
    if (user) {
      setPage(1);
      fetchLikedImages(1, false);
    }
  }, [user, selectedCategory]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Heart className="w-6 h-6 mr-3 text-rose-500" />
          <h1 className="text-2xl font-bold">Images You&apos;ve Liked</h1>
        </div>
        <p className="text-gray-400">Browse all the images you&apos;ve liked across the platform</p>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>

      {/* Images grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <ImageSkeleton key={`skeleton-${index}`} heightClass="aspect-[3/4]" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-64 bg-zinc-900/60 border border-white/10 rounded-xl mt-4"
        >
          <HeartOff className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-400 text-lg mb-2">No liked images found</p>
          <p className="text-gray-500 mb-6">You haven&apos;t liked any images in this category yet</p>
          <Link href="/feed">
            <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40">
              Explore Images
            </button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <ImageCard
                  image={image}
                  heightClass="aspect-[3/4]"
                  isLoaded={loadedImages.includes(image._id)}
                  index={index % 4}
                  columnIndex={Math.floor(index / 4)}
                  onUnlike={() => handleUnlike(image._id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load more button */}
      {hasMore && !loading && images.length > 0 && (
        <div className="flex justify-center mt-8 mb-8">
          <button
            className={`px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 ${loadingMore ? 'opacity-70 cursor-wait' : ''}`}
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LikesPage;