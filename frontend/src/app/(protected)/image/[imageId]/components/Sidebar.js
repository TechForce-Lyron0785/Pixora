import React from 'react';
import { Info, Star, Flag } from 'lucide-react';
import Link from 'next/link';
import TechnicalDetails from './sidebar/TechnicalDetails';
import LicenseInfo from './sidebar/LicenseInfo';
import RatingsReviews from './sidebar/RatingsReviews';
import RelatedImages from './sidebar/RelatedImages';

const Sidebar = ({ image, relatedImages }) => {
  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      {/* Technical details */}
      <TechnicalDetails image={image} />
      
      {/* License info */}
      <LicenseInfo image={image} />
      
      {/* Rating & reviews - keeping this static as requested */}
      <RatingsReviews />
      
      {/* Related images */}
      <RelatedImages image={image} relatedImages={relatedImages} />
      
      {/* Report section */}
      <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400">
          <Flag className="w-4 h-4" />
          <span className="text-sm">Report content</span>
        </div>
        <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
          Report
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 