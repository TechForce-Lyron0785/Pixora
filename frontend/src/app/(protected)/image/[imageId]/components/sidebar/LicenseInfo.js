import React from 'react';

const LicenseInfo = ({ image }) => {
  return (
    <div className="rounded-xl bg-zinc-900/60 border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/5 rounded-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.5 15.5C10.5 14.5 11.1 14 12 14C12.9 14 13.5 14.5 13.5 15.5C13.5 16.5 12.9 17 12 17C11.1 17 10.5 16.5 10.5 15.5Z" fill="currentColor" />
            <path d="M12 7V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-lg font-bold">License Information</h3>
      </div>

      <div className="bg-white/5 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium capitalize">{image.license || 'Standard'} License</span>
          <span className="text-emerald-400">Active</span>
        </div>
        <p className="text-sm text-gray-400 mb-3">
          {image.license === 'extended' 
            ? 'Personal and commercial use with no attribution required.' 
            : 'Personal and commercial use with attribution required.'}
        </p>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Attribution</span>
          <span>{image.license === 'extended' ? 'Not Required' : 'Required'}</span>
        </div>
      </div>

      <button className="w-full py-2 text-center bg-white/5 hover:bg-white/10 rounded-lg text-violet-400 transition-colors">
        View full license details
      </button>
    </div>
  );
};

export default LicenseInfo; 