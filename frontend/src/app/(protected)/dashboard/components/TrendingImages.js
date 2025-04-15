"use client"
import React from 'react';
import { Heart, BookmarkIcon, MoreHorizontal, MessageSquare, ChevronDown } from 'lucide-react';

const TrendingImages = () => {
  // Sample data
  const trendingImages = [
    { id: 1, thumbnail: "/images/upload/img1.webp", title: "Neon Dreams", creator: "Elena Bright", likes: "3.4K", comments: "245" },
    { id: 2, thumbnail: "/images/upload/img2.jpg", title: "Ocean Whispers", creator: "Marcus Wave", likes: "2.8K", comments: "178" },
    { id: 3, thumbnail: "/images/upload/img6.webp", title: "Cosmic Journey", creator: "Sasha Nova", likes: "4.1K", comments: "342" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Trending Images</h3>
        <button className="text-sm text-violet-400 hover:text-violet-300 flex items-center">
          See all
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingImages.map(image => (
          <div key={image.id} className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-zinc-800 border border-white/10">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={image.thumbnail}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Image actions overlay */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                <BookmarkIcon className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-xs text-gray-300 mb-1">{image.creator}</p>
              <h4 className="text-lg font-medium">{image.title}</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="flex items-center text-sm text-rose-300">
                  <Heart className="w-3.5 h-3.5 mr-1 fill-rose-300" />
                  {image.likes}
                </span>
                <span className="flex items-center text-sm text-blue-300">
                  <MessageSquare className="w-3.5 h-3.5 mr-1" />
                  {image.comments}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingImages; 