import { BookmarkIcon, Heart, MessageSquare, MoreHorizontal, Zap } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const CuratedSection = ({ feedImages, loadedImages }) => {
  // Create column arrays for masonry layout
  const [columns, setColumns] = useState([]);
  const [columnCount, setColumnCount] = useState(2); // Default for mobile

  // Determine column count based on screen size
  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth >= 1024) {
        setColumnCount(4); // lg
      } else if (window.innerWidth >= 768) {
        setColumnCount(3); // md
      } else {
        setColumnCount(2); // default/mobile
      }
    };

    // Initial setup
    updateColumnCount();
    
    // Add resize listener
    window.addEventListener('resize', updateColumnCount);
    
    // Clean up
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // Distribute images into columns using the height to determine placement
  useEffect(() => {
    if (feedImages.length && columnCount > 0) {
      // Initialize column heights
      const columnHeights = new Array(columnCount).fill(0);
      const newColumns = Array.from({ length: columnCount }, () => []);
      
      // Place each image in the shortest column
      feedImages.forEach(image => {
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
      
      setColumns(newColumns);
    }
  }, [feedImages, columnCount]);

  return (
    <div className="mb-10 px-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg p-1.5">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-bold">For You</h2>
        <span className="text-sm text-gray-400">Curated based on your preferences</span>
      </div>

      {/* Masonry grid layout */}
      <div className="flex w-full gap-4">
        {columns.map((column, columnIndex) => (
          <div key={`column-${columnIndex}`} className="flex-1 flex flex-col gap-4">
            {column.map((image, imageIndex) => {
              // Determine height based on image height property
              let heightClass = "aspect-square"; // default
              if (image.height === "tall") heightClass = "aspect-[3/5]";
              if (image.height === "medium") heightClass = "aspect-[3/4]";
              if (image.height === "short") heightClass = "aspect-[4/3]";

              return (
                <div
                  key={image.id}
                  className={`group relative rounded-xl overflow-hidden ${heightClass} bg-zinc-800 border border-white/10 
                      transition-all duration-500 transform ${loadedImages.includes(image.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                      hover:shadow-lg hover:shadow-violet-500/10 hover:border-violet-500/30`}
                  style={{
                    transitionDelay: `${(columnIndex * column.length + imageIndex) * 50}ms`
                  }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-300"></div>
                  </div>

                  {/* Image actions overlay */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
                      <BookmarkIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-xs text-gray-300 mb-1">{image.creator}</p>
                    <h4 className="text-lg font-medium leading-tight mb-2">{image.title}</h4>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-xs text-rose-300">
                        <Heart className="w-3 h-3 mr-1 fill-rose-300" />
                        {image.likes}
                      </span>
                      <span className="flex items-center text-xs text-blue-300">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {image.comments}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuratedSection;