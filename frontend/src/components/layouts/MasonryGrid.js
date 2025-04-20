import React, { useState, useEffect } from 'react';
import ImageCard from '@/components/cards/ImageCard';
import ImageSkeleton from '@/components/skeletons/ImageSkeleton';

const MasonryGrid = ({ images = [], loading = false, columns = [2, 3, 4] }) => {
  // columns is an array of [mobile, tablet, desktop] column counts
  const [imageColumns, setImageColumns] = useState([]);
  const [columnCount, setColumnCount] = useState(columns[0]); // Default to mobile
  const [loadedImages, setLoadedImages] = useState([]);

  // Track loaded images for animation
  useEffect(() => {
    if (images.length > 0 && !loading) {
      // Simulate images loading over time
      const timer = setTimeout(() => {
        setLoadedImages(images.map(img => img._id));
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [images, loading]);

  // Determine column count based on screen size
  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth >= 1024) {
        setColumnCount(columns[2]); // desktop
      } else if (window.innerWidth >= 768) {
        setColumnCount(columns[1]); // tablet
      } else {
        setColumnCount(columns[0]); // mobile
      }
    };

    // Initial setup
    updateColumnCount();
    
    // Add resize listener
    window.addEventListener('resize', updateColumnCount);
    
    // Clean up
    return () => window.removeEventListener('resize', updateColumnCount);
  }, [columns]);

  // Distribute images into columns using the height to determine placement
  useEffect(() => {
    if (images.length && columnCount > 0) {
      // Initialize column heights
      const columnHeights = new Array(columnCount).fill(0);
      const newColumns = Array.from({ length: columnCount }, () => []);
      
      // Place each image in the shortest column
      images.forEach(image => {
        // Determine approximate height based on image.height property
        let heightFactor = 1; // default for "aspect-square"
        if (image.height === "tall") heightFactor = 5/3; // aspect-[3/5]
        if (image.height === "medium") heightFactor = 4/3; // aspect-[3/4]
        if (image.height === "short") heightFactor = 3/4; // aspect-[4/3]
        
        // Find index of column with smallest height
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        
        // Add image to shortest column
        newColumns[shortestColumnIndex].push(image);
        
        // Update column height
        columnHeights[shortestColumnIndex] += heightFactor;
      });
      
      setImageColumns(newColumns);
    }
  }, [images, columnCount]);

  // Create skeleton loaders for loading state
  const renderSkeletons = () => {
    const skeletonColumns = Array.from({ length: columnCount }, () => []);
    const heights = ["aspect-square", "aspect-[3/5]", "aspect-[3/4]", "aspect-[4/3]"];
    
    // Create skeleton items (2 per column)
    for (let i = 0; i < columnCount * 2; i++) {
      const columnIndex = i % columnCount;
      const randomHeight = heights[Math.floor(Math.random() * heights.length)];
      skeletonColumns[columnIndex].push(randomHeight);
    }
    
    return (
      <div className="flex w-full gap-4">
        {skeletonColumns.map((column, colIdx) => (
          <div key={`skeleton-col-${colIdx}`} className="flex-1 flex flex-col gap-4">
            {column.map((heightClass, idx) => (
              <ImageSkeleton key={`skeleton-${colIdx}-${idx}`} heightClass={heightClass} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Show loading skeletons
  if (loading) {
    return renderSkeletons();
  }

  // Show empty state
  if (!loading && images.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No images found.</p>
      </div>
    );
  }

  // Render masonry grid layout
  return (
    <div className="flex w-full gap-4">
      {imageColumns.map((column, columnIndex) => (
        <div key={`column-${columnIndex}`} className="flex-1 flex flex-col gap-4">
          {column.map((image, imageIndex) => (
            <ImageCard 
              key={image._id}
              image={image}
              isLoaded={loadedImages.includes(image._id)}
              index={imageIndex}
              columnIndex={columnIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid; 