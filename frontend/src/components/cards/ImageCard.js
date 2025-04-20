import { BookmarkIcon, Heart, MessageSquare, MoreHorizontal } from 'lucide-react';
import React from 'react';

const ImageCard = ({ 
  image, 
  isLoaded = true, 
  heightClass = "aspect-square",
  index = 0, 
  columnIndex = 0 
}) => {
  // Determine height based on image height property if not explicitly provided
  if (image.height) {
    if (image.height === "tall") heightClass = "aspect-[3/5]";
    if (image.height === "medium") heightClass = "aspect-[3/4]";
    if (image.height === "short") heightClass = "aspect-[4/3]";
  }

  return (
    <div
      className={`group relative rounded-xl overflow-hidden ${heightClass} bg-zinc-800 border border-white/10 
          transition-all duration-500 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          hover:shadow-lg hover:shadow-violet-500/10 hover:border-violet-500/30`}
      style={{
        transitionDelay: `${(columnIndex * 4 + index) * 50}ms`
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image.imageUrl}
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
        <p className="text-xs text-gray-300 mb-1">{image.user?.username}</p>
        <h4 className="text-lg font-medium leading-tight mb-2">{image.title}</h4>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-xs text-rose-300">
            <Heart className="w-3 h-3 mr-1 fill-rose-300" />
            {Math.floor((image.likesCount || 0) / 1000) || 0}K
          </span>
          <span className="flex items-center text-xs text-blue-300">
            <MessageSquare className="w-3 h-3 mr-1" />
            {image.commentsCount?.toString() || '0'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard; 