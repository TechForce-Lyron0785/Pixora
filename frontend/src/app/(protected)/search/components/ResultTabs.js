"use client"
import React from 'react';
import { ImageIcon, Users, Grid, Tag } from 'lucide-react';

const ResultTabs = ({ activeTab, setActiveTab, counts }) => {
  const tabs = [
    { 
      id: 'all', 
      name: 'All Results', 
      count: (counts.images || 0) + (counts.users || 0) + (counts.collections || 0) + (counts.tags || 0) 
    },
    { 
      id: 'images', 
      name: 'Images', 
      count: counts.images || 0, 
      icon: <ImageIcon className="w-4 h-4" /> 
    },
    { 
      id: 'users', 
      name: 'Users', 
      count: counts.users || 0, 
      icon: <Users className="w-4 h-4" /> 
    },
    { 
      id: 'collections', 
      name: 'Collections', 
      count: counts.collections || 0, 
      icon: <Grid className="w-4 h-4" /> 
    },
    { 
      id: 'tags', 
      name: 'Tags', 
      count: counts.tags || 0, 
      icon: <Tag className="w-4 h-4" /> 
    },
  ];

  return (
    <div className="border-b border-white/10 mb-6">
      <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-violet-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            } transition-colors duration-200`}
          >
            {tab.icon && tab.icon}
            {tab.name}
            <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResultTabs; 