"use client"
import React, { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ProfilePicVerify } from '@/components';
import {
  WelcomeCard,
  CategoryFilter,
  TrendingImages,
  RecentActivity,
  QuickUpload,
  RecommendedCreators,
  AchievementCard,
  StorageUsage
} from './components';

const DashboardPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if(user?.isDpConfirm !== true){
      setProfileOpen(true)
    } 
  }, [user]);

  return (
    <div className="p-6">
      {/* <ProfilePicVerify isOpen={profileOpen} onClose={()=> setProfileOpen(false)} /> */}
      {/* Dashboard grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column - Main content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Welcome card */}
          <WelcomeCard user={user} />

          {/* Category filter */}
          <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

          {/* Trending images grid */}
          <TrendingImages />

          {/* Recent activity */}
          <RecentActivity />
        </div>

        {/* Right column - Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick upload */}
          <QuickUpload />

          {/* Recommended creators */}
          <RecommendedCreators />

          {/* Achievement card */}
          <AchievementCard />

          {/* Usage stats */}
          <StorageUsage />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;