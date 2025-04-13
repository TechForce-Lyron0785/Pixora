"use client"
import React from 'react';
import { BookOpen, Pencil } from 'lucide-react';

const ProfileBio = ({ profile, isOwnProfile }) => {
  // Function to extract domain from full URL
  const extractDomain = (url) => {
    if (!url) return '';
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  };

  // Get social links as array with proper error handling
  const getSocialLinks = () => {
    if (!profile.socialLinks) return [];

    try {
      return Object.entries(profile.socialLinks)
        .filter(([_, value]) => value)
        .map(([platform, url]) => ({
          platform,
          url: extractDomain(url),
          icon: getSocialIcon(platform)
        }));
    } catch (error) {
      console.error("Error processing social links:", error);
      return [];
    }
  };

  // Get social media icons
  const getSocialIcon = (platform) => {
    const icons = {
      'instagram': <Instagram className="w-4 h-4" />,
      'twitter': <Twitter className="w-4 h-4" />,
      'facebook': <Facebook className="w-4 h-4" />,
      'linkedin': <Linkedin className="w-4 h-4" />,
      'website': <Globe className="w-4 h-4" />,
    };
    return icons[platform] || <Globe className="w-4 h-4" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-2">
        <div className='group'>
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <BookOpen className='size-5 mr-2 text-yellow-400' /> About 
            {isOwnProfile && <Link 
              href={"/settings"} 
              className='opacity-0 group-hover:opacity-100 p-1 rounded-full bg-violet-600 hover:bg-violet-500 transition-all ml-2'
            >
              <Pencil className='size-4 text-white' />
            </Link>}
          </h2>
          {profile.bio ? (
            <p className="text-gray-300 mb-4">{profile.bio}</p>
          ) : <p className="text-sm text-gray-400">No bio available</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {getSocialLinks().length > 0 ? (
            getSocialLinks().map((link, idx) => (
              <a
                key={idx}
                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-violet-400 transition-colors"
              >
                {link.icon}
                {link.url}
              </a>
            ))
          ) : (
            <p className="text-sm text-gray-400">No social links available</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-4 lg:justify-end">
        {[
          { label: "Followers", value: profile.followersCount || 0, icon: <Users className="w-4 h-4 text-gray-400" /> },
          { label: "Following", value: profile.followingCount || 0, icon: <Users className="w-4 h-4 text-gray-400" /> },
          { label: "Likes", value: profile.likesCount || 0, icon: <Heart className="w-4 h-4 text-gray-400" /> },
          { label: "Posts", value: profile.postsCount || 0, icon: <Grid className="w-4 h-4 text-gray-400" /> },
          { label: "Interactions", value: profile.interactionsCount || 0, icon: <MessageSquare className="w-4 h-4 text-gray-400" /> },
        ].map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              {stat.icon}
              <span className="font-bold text-lg">{stat.value}</span>
            </div>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Social media icons
const Instagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Twitter = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const Facebook = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Linkedin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Globe = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

// Import icons needed for stats
import { Users, Heart, Grid, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default ProfileBio; 