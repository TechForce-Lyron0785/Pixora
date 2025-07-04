"use client"
import React from 'react';
import { BookOpen, Facebook, Instagram, Pencil, Twitter, Users, Heart, Grid, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const ProfileBio = ({ profile, isOwnProfile }) => {
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
          {profile.socialLinks && Object.values(profile.socialLinks).some(link => link) ? (
            <div className="flex flex-wrap gap-3">
              {profile.socialLinks.instagram && (
                <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg hover:from-purple-600/30 hover:to-pink-600/30 text-sm font-medium transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
                  <span>Instagram</span>
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg hover:from-blue-600/30 hover:to-cyan-600/30 text-sm font-medium transition-all duration-300 group"
                >
                  <Twitter className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  <span>Twitter</span>
                </a>
              )}
              {profile.socialLinks.facebook && (
                <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-800/20 to-blue-600/20 rounded-lg hover:from-blue-800/30 hover:to-blue-600/30 text-sm font-medium transition-all duration-300 group"
                >
                  <Facebook className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  <span>Facebook</span>
                </a>
              )}
            </div>
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

export default ProfileBio; 