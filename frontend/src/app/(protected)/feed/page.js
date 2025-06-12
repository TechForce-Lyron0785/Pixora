"use client"
import React, { useState, useEffect } from 'react';
import {
  Camera,
  Image,
  PlusSquare,
} from 'lucide-react';
import CuratedSection from './CuratedSection';
import { useApi } from "@/hooks/useApi";
import { useAuth } from '@/context/AuthContext';
import { CategoryFilter } from '../dashboard/components';
import Link from 'next/link';

const Feed = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const [loadedImages, setLoadedImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const api = useApi();

  // Function to randomly assign heights to images
  const assignRandomHeight = (images) => {
    const heights = ['tall', 'medium', 'short'];
    return images.map(img => ({
      ...img,
      height: heights[Math.floor(Math.random() * heights.length)]
    }));
  };

  // Fetch images from API
  const fetchImages = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setLoadedImages([]);
    }

    try {
      // Add category to the API request if it's not 'all'
      const endpoint = selectedCategory && selectedCategory !== 'all'
        ? `/api/images/public?page=${pageNum}&limit=12&category=${selectedCategory}`
        : `/api/images/public?page=${pageNum}&limit=12`;

      const response = await api.get(endpoint);

      const imagesWithHeight = assignRandomHeight(response.data.data);

      if (isLoadMore) {
        setImages(prevImages => [...prevImages, ...imagesWithHeight]);
      } else {
        setImages(imagesWithHeight);
      }

      // Check if more images are available
      setHasMore(response.data.metadata.page < response.data.metadata.pages);

      // After a short delay, mark images as loaded for animation
      setTimeout(() => {
        setLoadedImages(prev => [...prev, ...imagesWithHeight.map(img => img._id)]);
        setLoading(false);
        setLoadingMore(false);
      }, 300);

    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more images
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchImages(nextPage, true);
    }
  };

  // Re-fetch when category changes
  useEffect(() => {
    if (user) {
      setPage(1);
      fetchImages(1, false);
    }
  }, [user, selectedCategory]);

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
      {/* Stories */}
      {/* Quick Actions Bar */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex justify-between items-center bg-zinc-900/50 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 p-0.5">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                <PlusSquare className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Create Post</p>
              <p className="text-xs text-gray-400">Share your moment</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={"/upload-image"} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Camera className="w-5 h-5 text-gray-300" />
            </Link>
            <Link href={"/upload-image"} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Image className="w-5 h-5 text-gray-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 mb-4">
        <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>

      {/* For you / curated section */}
      <CuratedSection
        feedImages={images}
        loadedImages={loadedImages}
        loading={loading}
      />

      {/* Load more button */}
      <div className="flex justify-center mt-8 mb-20">
        {hasMore && (
          <button
            className={`px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 ${loadingMore ? 'opacity-70 cursor-wait' : ''}`}
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Feed;