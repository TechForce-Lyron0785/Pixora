"use client"
import React from 'react';
import Link from 'next/link';
import {
  Camera,
  Edit2,
  Users,
  Heart,
  Grid,
  MessageSquare,
  CheckCircle,
  Zap,
  Calendar,
  TreePine,
  Award,
  TrendingUp,
  UserPlus,
  UserMinus,
  Share2,
  MoreHorizontal,
  UserRoundPen,
  Pencil,
  UserPen
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileHeader = ({
  profile,
  isOwnProfile,
  isFollowing,
  followLoading,
  handleFollowToggle,
  setProfileOpen
}) => {
  // Get badge color based on badge type
  const getBadgeColor = (badgeType) => {
    const colors = {
      'newbie': 'blue',
      'rising': 'violet',
      'pro': 'amber',
      'trendsetter': 'rose',
    };
    return colors[badgeType] || 'blue';
  };

  // Get badge icon name based on badge type
  const getBadgeIconName = (badgeType) => {
    const icons = {
      'newbie': 'Users',
      'rising': 'TrendingUp',
      'pro': 'Zap',
      'trendsetter': 'Award',
    };
    return icons[badgeType] || 'Users';
  };

  // Map badge icon names to actual components
  const getBadgeIcon = (iconName) => {
    const icons = {
      'Award': <Award className="w-3.5 h-3.5 mr-1" />,
      'TrendingUp': <TrendingUp className="w-3.5 h-3.5 mr-1" />,
      'Zap': <Zap className="w-3.5 h-3.5 mr-1" />,
      'CheckCircle': <CheckCircle className="w-3.5 h-3.5 mr-1" />,
      'Heart': <Heart className="w-3.5 h-3.5 mr-1" />,
      'Camera': <Camera className="w-3.5 h-3.5 mr-1" />,
      'Users': <Users className="w-3.5 h-3.5 mr-1" />,
      'MessageSquare': <MessageSquare className="w-3.5 h-3.5 mr-1" />,
      'Grid': <Grid className="w-3.5 h-3.5 mr-1" />
    };
    return icons[iconName] || <Award className="w-3.5 h-3.5 mr-1" />;
  };

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
    <>
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-violet-900 to-fuchsia-900 overflow-hidden">
        <img
          src={profile.coverPicture}
          alt="Cover"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>

        {/* Cover Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-end gap-3">
          <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg flex items-center gap-2 text-sm">
            <Camera className="w-4 h-4 text-violet-400" />
            <span>{profile.postsCount || 0} Posts</span>
          </div>
          <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg flex items-center gap-2 text-sm">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>{profile.likesCount || 0} Likes</span>
          </div>
        </div>

        {/* Cover edit button */}
        {isOwnProfile && (
          <Link href={"/settings"} className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-md rounded-lg hover:bg-black/50 transition-colors">
            <Camera className="w-5 h-5" />
          </Link>
        )}
      </div>

      <div className="px-6 md:px-10 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end mb-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-xl border-4 border-zinc-950 overflow-hidden bg-zinc-900">
              <img
                src={profile.profilePicture}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {isOwnProfile && (
              <button onClick={() => setProfileOpen(true)} className="absolute bottom-2 right-2 p-1.5 bg-violet-600 rounded-lg text-white hover:bg-violet-500 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* User info */}
          <div className="mt-4 md:mt-0 md:ml-6 md:flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{profile.fullName}</h1>
              {profile.isVerified && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
              {profile.isPremium ? (
                <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Premium
                </span>
              ) : (
                <span className="bg-fuchsia-500/20 text-fuchsia-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                  <TreePine className="w-3 h-3 mr-1" />
                  Standard
                </span>
              )}
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></div>
                {profile.userStatus || "Online"}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              @{profile.username}
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 text-xs">
                <Calendar className="w-3 h-3 mr-1 text-gray-500" />
                Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ""}
              </span>
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Display the main badge */}
              <span
                className={`bg-${getBadgeColor(profile.badge)}/20 text-${getBadgeColor(profile.badge)} px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1`}
              >
                {getBadgeIcon(getBadgeIconName(profile.badge))}
                {profile.badge || "newbie"}
              </span>

              {/* Add achievement badges */}
              <span className="bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                <Award className="w-3.5 h-3.5 mr-1" />
                New Creator
              </span>
              <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                Growing
              </span>
            </div>
            {/* Quick stats bar */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">{profile.followersCount || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                <Grid className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium">{profile.postsCount || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-medium">{profile.likesCount || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium">{profile.interactionsCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4 md:mt-0">
            {isOwnProfile ? (
              <Link href={"/settings"} className="flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors font-medium text-sm">
                <UserPen className='size-4 mr-1.5' /> Edit Profile
              </Link>
            ) : (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 ${isFollowing
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-violet-600 hover:bg-violet-500 text-white'
                  }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </>
                )}
              </button>
            )}
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              {/* TODO: Make message working */}
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                // Share functionality
                navigator.clipboard.writeText(`${window.location.origin}/profile/@${profile.username}`);
                toast.success('Profile link copied to clipboard!');
              }}
            >
              <Share2 className="w-5 h-5" />
            </button>
            {/* <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button> */}
          </div>
        </div>
      </div>
    </>
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

export default ProfileHeader; 