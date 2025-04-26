import React from 'react';
import { Star } from 'lucide-react';

const RatingsReviews = () => {
  return (
    <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Ratings & Reviews</h3>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">4.9</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs w-8">5★</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: '85%' }}></div>
          </div>
          <span className="text-xs text-gray-400">85%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs w-8">4★</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: '12%' }}></div>
          </div>
          <span className="text-xs text-gray-400">12%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs w-8">3★</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: '3%' }}></div>
          </div>
          <span className="text-xs text-gray-400">3%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs w-8">2★</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: '0%' }}></div>
          </div>
          <span className="text-xs text-gray-400">0%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs w-8">1★</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: '0%' }}></div>
          </div>
          <span className="text-xs text-gray-400">0%</span>
        </div>
      </div>

      <button className="w-full py-2 text-center bg-white/5 hover:bg-white/10 rounded-lg text-violet-400 transition-colors">
        Read all 124 reviews
      </button>
    </div>
  );
};

export default RatingsReviews; 