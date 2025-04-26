"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { useLikesFavorites } from '@/context/LikesFavoritesContext';
import { useFollow } from '@/context/FollowContext';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft } from 'lucide-react';
import LoadingScreen from '@/components/screens/LoadingScreen';

// Import components
import {
  ImageHeader,
  ImageMetadata,
  CommentsSection,
  Sidebar
} from './components';

const ImageDetail = () => {
  const { imageId } = useParams();
  const api = useApi();
  const { user } = useAuth();
  const { followUser, unfollowUser, checkFollowStatus } = useFollow();
  const {
    toggleLike,
    toggleFavorite,
    checkLikeStatus,
    checkFavoriteStatus,
  } = useLikesFavorites();

  // State
  const [image, setImage] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedImages, setRelatedImages] = useState([]);

  // Fetch image data
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/api/images/${imageId}`);
        setImage(response.data.data);
        
        // Fetch creator's other images
        if (response.data.data.user?._id) {
          const creatorImagesResponse = await api.get(`/api/images/user/${response.data.data.user._id}?limit=4`);
          setRelatedImages(creatorImagesResponse.data.data);
        }
        
        // Check if user is following the creator
        if (user && response.data.data.user?._id && user._id !== response.data.data.user._id) {
          const followStatus = await checkFollowStatus(response.data.data.user._id);
          setIsFollowing(followStatus);
        }
        
        // Check like and bookmark status
        if (user) {
          const likeStatus = await checkLikeStatus(imageId);
          setIsLiked(likeStatus);
          
          const bookmarkStatus = await checkFavoriteStatus(imageId);
          setIsBookmarked(bookmarkStatus);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load image");
        console.error("Error fetching image:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (imageId) {
      fetchImageData();
    }
  }, [imageId, api, user, checkFollowStatus, checkLikeStatus, checkFavoriteStatus]);

  // Handle like toggle
  const handleLikeToggle = async () => {
    if (!user) return;
    
    // Optimistic update
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    setImage(prev => ({
      ...prev,
      likesCount: newLikeStatus ? (prev.likesCount + 1) : (prev.likesCount - 1)
    }));
    
    // API call
    const result = await toggleLike(imageId);
    
    // Revert if failed
    if (!result.success) {
      setIsLiked(!newLikeStatus);
      setImage(prev => ({
        ...prev,
        likesCount: !newLikeStatus ? (prev.likesCount + 1) : (prev.likesCount - 1)
      }));
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    if (!user) return;
    
    // Optimistic update
    const newBookmarkStatus = !isBookmarked;
    setIsBookmarked(newBookmarkStatus);
    
    // API call
    const result = await toggleFavorite(imageId);
    
    // Revert if failed
    if (!result.success) {
      setIsBookmarked(!newBookmarkStatus);
    }
  };

  // Handle follow toggle
  const handleFollowToggle = async () => {
    if (!user || !image?.user) return;
    
    try {
      if (isFollowing) {
        await unfollowUser(image.user._id);
      } else {
        await followUser(image.user._id);
      }
      
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Error toggling follow status:", err);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Error state
  if (error || !image) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-white/10 p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-bold mb-2">Image Not Found</h2>
          <p className="text-gray-400 mb-6">{error || "The requested image could not be loaded"}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors font-medium text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="px-6">
      {/* Back navigation */}
      <div className="mb-6">
        <button 
          className="flex items-center text-gray-400 hover:text-white transition-colors gap-1"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to explore</span>
        </button>
      </div>

      {/* Image detail layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main image and info */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Image Header Component */}
          <ImageHeader
            image={image}
            isLiked={isLiked}
            isBookmarked={isBookmarked}
            handleLikeToggle={handleLikeToggle}
            handleBookmarkToggle={handleBookmarkToggle}
          />

          {/* Image Metadata Component */}
          <ImageMetadata
            image={image}
            formatDate={formatDate}
            user={user}
            isFollowing={isFollowing}
            handleFollowToggle={handleFollowToggle}
          />

          {/* Comments Section Component */}
          <CommentsSection
            imageId={imageId}
            user={user}
          />
        </div>

        {/* Sidebar Component */}
        <Sidebar 
          image={image} 
          relatedImages={relatedImages} 
        />
      </div>
    </div>
  );
};

export default ImageDetail; 