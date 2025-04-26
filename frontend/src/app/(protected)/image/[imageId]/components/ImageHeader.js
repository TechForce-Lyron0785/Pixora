import React from 'react';
import {
  Heart,
  MessageSquare,
  BookmarkIcon,
  Share2,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ImageHeader = ({ 
  image, 
  isLiked, 
  isBookmarked, 
  handleLikeToggle, 
  handleBookmarkToggle 
}) => {
  return (
    <>
      {/* Image container */}
      <div className="rounded-xl overflow-hidden bg-zinc-900 border border-white/10 relative group">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="w-full object-cover"
        />

        {/* Overlay controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex justify-between items-center">
            <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition">
              <Download className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Fullscreen button */}
        <button className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition opacity-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
            <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
            <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
            <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
          </svg>
        </button>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isLiked ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 hover:bg-white/10'} transition-colors`}
            onClick={handleLikeToggle}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-400' : ''}`} />
            <span>{image.likesCount || 0}</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span>{image.commentsCount || 0}</span>
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isBookmarked ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 hover:bg-white/10'} transition-colors`}
            onClick={handleBookmarkToggle}
          >
            <BookmarkIcon className={`w-5 h-5 ${isBookmarked ? 'fill-violet-400' : ''}`} />
            <span>Save</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              // Could add a toast notification here
            }}
          >
            <Share2 className="w-5 h-5" />
          </button>
          <a 
            href={image.imageUrl} 
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Download className="w-5 h-5" />
          </a>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageHeader; 