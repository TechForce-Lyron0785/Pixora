import React from 'react';
import { Info, Star, Flag } from 'lucide-react';
import Link from 'next/link';
import TechnicalDetails from './sidebar/TechnicalDetails';
import LicenseInfo from './sidebar/LicenseInfo';
import RatingsReviews from './sidebar/RatingsReviews';
import RelatedImages from './sidebar/RelatedImages';
import ReportImage from './sidebar/ReportImage';

const Sidebar = ({ image, relatedImages }) => {
  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      {/* Technical details */}
      <TechnicalDetails image={image} />
      
      {/* License info */}
      <LicenseInfo image={image} />
      
      {/* Ratings & reviews */}
      <RatingsReviews imageId={image._id} />
      
      {/* Related images */}
      <RelatedImages image={image} relatedImages={relatedImages} />
      
      {/* Report section */}
      <ReportImage imageId={image._id} ownerId={image.user?._id} />
    </div>
  );
};

export default Sidebar; 