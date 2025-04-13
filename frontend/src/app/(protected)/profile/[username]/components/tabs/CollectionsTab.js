"use client"
import React from 'react';

// Helper component
const PlusCircle = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
};

const CollectionsTab = ({ collections = [] }) => {
  // Sample data if collections is not provided
  const sampleCollections = [
    { id: 1, name: "Abstract Dreams", count: 18, thumbnail: "/images/bg-img1.jpg", color: "from-rose-500 to-orange-500" },
    { id: 2, name: "Cyberpunk Series", count: 12, thumbnail: "/images/bg-img2.jpg", color: "from-cyan-500 to-blue-500" },
    { id: 3, name: "Nature Reimagined", count: 24, thumbnail: "/images/bg-img3.jpg", color: "from-emerald-500 to-green-500" },
  ];

  const displayCollections = collections.length > 0 ? collections : sampleCollections;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayCollections.map(collection => (
        <div key={collection.id} className="group relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3]">
          <div className="absolute inset-0">
            <img
              src={collection.thumbnail}
              alt={collection.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-60 mix-blend-overlay`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <h3 className="text-xl font-bold mb-1">{collection.name}</h3>
            <p className="text-sm text-gray-300">{collection.count} images</p>

            <div className="mt-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button className="w-full py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-colors text-sm font-medium">
                View Collection
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add new collection */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 border-dashed aspect-[4/3] bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center cursor-pointer text-center">
        <div className="p-4 bg-white/5 rounded-full mb-3">
          <PlusCircle className="w-6 h-6 text-violet-400" />
        </div>
        <h3 className="text-lg font-medium mb-1">Create Collection</h3>
        <p className="text-sm text-gray-400">Organize your works</p>
      </div>
    </div>
  );
};

export default CollectionsTab; 