"use client"
import React, { useState, useEffect } from 'react';
import {
  PlusSquare,
} from 'lucide-react';
import CuratedSection from './CuratedSection';
import { useApi } from "@/hooks/useApi";

const Feed = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadedImages, setLoadedImages] = useState([]);

  const api = useApi();

  // Function to randomly assign heights to images
  const assignRandomHeight = (images) => {
    const heights = ['tall', 'medium', 'short'];
    return images.map(img => ({
      ...img,
      height: heights[Math.floor(Math.random() * heights.length)]
    }));
  };

  // Format API response to match our frontend structure
  const formatImageData = (apiImages) => {
    return apiImages.map(img => ({
      id: img._id,
      thumbnail: img.imageUrl,
      title: img.title,
      creator: img.user.username,
      likes: `${Math.floor(img.likesCount / 1000) || 0}K`,
      comments: img.commentsCount.toString(),
      description: img.description,
      tags: img.tags
    }));
  };

  // Fetch images from API
  const fetchImages = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await api.get(`/api/images/public?page=${pageNum}&limit=12`);
      
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

  // Initial fetch
  useEffect(() => {
    fetchImages();
  }, []);

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