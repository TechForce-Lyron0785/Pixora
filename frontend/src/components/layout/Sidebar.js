"use client";

import React, { useState } from "react";
import {
  Bolt,
  Clock,
  Compass,
  Drama,
  Grid,
  Heart,
  ImagePlus,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const menuItems = [
    { name: 'Dashboard', icon: <Compass />, href: '/dashboard' },
    { name: 'Feed', icon: <Grid />, href: '/feed' },
    { name: 'Profile', icon: <User />, href: `/profile/@${user?.username || 'username'}` },
    { name: 'Search', icon: <Search />, href: '/search' },
    { name: 'Users', icon: <Users />, href: '/users' },
    { name: 'Upload Image', icon: <ImagePlus />, href: '/upload-image' },
    { name: 'Image Detail', icon: <Drama />, href: '/image-detail' },
  ];

  return (
    <div className="w-20 lg:w-64 border-r border-white/10 h-screen fixed flex flex-col bg-zinc-900/60 backdrop-blur-lg">
      {/* Logo */}
      <div className="p-5 border-b border-white/10 flex items-center justify-center lg:justify-start">
        <Link href={"/dashboard"} className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg p-2 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold hidden lg:block">Pixora</h1>
        </Link>
      </div>

      {/* Navigation */}
      <div className="py-6 flex flex-col flex-1">
        <div className="space-y-1 px-3">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm ${pathname === item.href || (item.href.startsWith('/profile/') && pathname.startsWith('/profile/'))
                ? 'bg-violet-600 text-white'
                : 'text-gray-300 hover:bg-white/10'
                } transition-colors duration-200 w-full justify-center lg:justify-start`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="hidden lg:block">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 px-3">
          <div className="text-xs text-gray-400 font-medium px-3 hidden lg:block">COLLECTIONS</div>
          <div className="mt-2 space-y-1">
            {[
              { name: 'Abstract Art', color: 'bg-rose-500' },
              { name: 'Portraits', color: 'bg-amber-500' },
            ].map((collection, idx) => (
              <button key={idx} className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors duration-200 w-full justify-center lg:justify-start">
                <span className={`w-3 h-3 rounded-full ${collection.color}`}></span>
                <span className="hidden lg:block">{collection.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto px-3">
          <Link href={"/settings"}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm ${pathname === '/settings'
              ? 'bg-violet-600 text-white'
              : 'text-gray-300 hover:bg-white/10'
              } transition-colors duration-200 w-full justify-center lg:justify-start`}
          >
            <Settings className="w-5 h-5" />
            <span className="hidden lg:block">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
