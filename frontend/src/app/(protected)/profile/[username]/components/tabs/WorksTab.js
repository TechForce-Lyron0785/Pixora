"use client"
import React, { useState } from 'react';
import { 
  Filter, 
  ChevronDown, 
  Zap, 
  Heart, 
  BookmarkIcon, 
  Share2 
} from 'lucide-react';

const WorksTab = ({ works = [] }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample data if works is not provided
  const sampleWorks = [
    { id: 1, title: "Neon Dreams", thumbnail: "/images/upload/img1.webp", likes: "3.4K", saves: "842", featured: true },
    { id: 2, title: "Cosmic Journey", thumbnail: "/images/upload/img2.jpg", likes: "2.8K", saves: "562" },
    { id: 3, title: "Digital Eden", thumbnail: "/images/upload/img3.jpg", likes: "5.1K", saves: "1.2K", featured: true },
    { id: 4, title: "Midnight City", thumbnail: "/images/upload/img7.png", likes: "4.7K", saves: "903" },
    { id: 5, title: "Futuristic Portal", thumbnail: "/images/upload/img6.webp", likes: "3.9K", saves: "715" },
    { id: 6, title: "Ethereal Landscape", thumbnail: "/images/upload/img3.jpg", likes: "6.2K", saves: "1.5K", featured: true },
  ];

  const displayWorks = works.length > 0 ? works : sampleWorks;

  // Filters
  const filters = [
    { id: 'all', name: 'All Works' },
    { id: 'featured', name: 'Featured' },
    { id: 'recent', name: 'Recent' },
    { id: 'popular', name: 'Popular' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${selectedFilter === filter.id
                ? 'bg-violet-600 text-white'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
                } transition-colors duration-200`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm">
            <span>Latest</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayWorks.map(work => (
          <div key={work.id} className="group relative rounded-xl overflow-hidden aspect-square bg-zinc-800/50 border border-white/10">
            <img
              src={work.thumbnail}
              alt={work.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Featured badge */}
            {work.featured && (
              <div className="absolute top-3 left-3 bg-violet-600/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                Featured
              </div>
            )}

            {/* Image actions */}
            <div className="absolute top-3 right-3 flex gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              <button className="p-2 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
                <BookmarkIcon className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h4 className="text-lg font-medium">{work.title}</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="flex items-center text-sm text-rose-300">
                  <Heart className="w-3.5 h-3.5 mr-1 fill-rose-300" />
                  {work.likes}
                </span>
                <span className="flex items-center text-sm text-amber-300">
                  <BookmarkIcon className="w-3.5 h-3.5 mr-1" />
                  {work.saves}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">
          Load More
        </button>
      </div>
    </div>
  );
};

export default WorksTab; 