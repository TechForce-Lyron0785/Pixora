"use client"
import React from 'react';
import { Filter } from 'lucide-react';

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'portrait', name: 'Portrait' },
    { id: 'landscape', name: 'Landscape' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'minimal', name: 'Minimal' },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${selectedCategory === category.id
            ? 'bg-violet-600 text-white'
            : 'bg-white/5 hover:bg-white/10 text-gray-300'
            } transition-colors duration-200`}
        >
          {category.name}
        </button>
      ))}
      <button className="p-2 rounded-full bg-white/5 hover:bg-white/10">
        <Filter className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CategoryFilter; 