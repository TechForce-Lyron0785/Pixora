import React, { useState, useEffect } from 'react';
import ImageCard from '@/components/cards/ImageCard';
import ImageSkeleton from '@/components/skeletons/ImageSkeleton';

// Example component that shows how to use ImageCard in a grid layout
const ImageGridExample = ({ images = [], loading = false }) => {
  const [loadedImages, setLoadedImages] = useState([]);

  // Track loaded images for animation
  useEffect(() => {
    if (images.length > 0) {
      // Simulate images loading over time
      const timer = setTimeout(() => {
        setLoadedImages(images.map(img => img._id));
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [images]);

  // Render skeleton loaders while loading
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ImageSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Render the actual grid of images
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images.map((image, index) => (
        <ImageCard
          key={image._id}
          image={image}
          isLoaded={loadedImages.includes(image._id)}
          index={index % 4}  // For staggered animation
          columnIndex={Math.floor(index / 4)}
        />
      ))}

      {images.length === 0 && !loading && (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-400">No images found.</p>
        </div>
      )}
    </div>
  );
};

export default ImageGridExample; 