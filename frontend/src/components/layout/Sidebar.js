"use client";

import React, { useState, useEffect } from "react";
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
  const [isHovered, setIsHovered] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <Compass className="transition-transform duration-300 group-hover:scale-110" />, href: '/dashboard' },
    { name: 'Feed', icon: <Grid className="transition-transform duration-300 group-hover:scale-110" />, href: '/feed' },
    { name: 'Profile', icon: <User className="transition-transform duration-300 group-hover:scale-110" />, href: `/profile/@${user?.username || 'username'}` },
    { name: 'Search', icon: <Search className="transition-transform duration-300 group-hover:scale-110" />, href: '/search' },
    { name: 'Users', icon: <Users className="transition-transform duration-300 group-hover:scale-110" />, href: '/users' },
    { name: 'Upload Image', icon: <ImagePlus className="transition-transform duration-300 group-hover:scale-110" />, href: '/upload-image' },
  ];

  return (
    <div className="w-20 lg:w-64 border-r border-white/5 h-screen fixed flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-zinc-900 backdrop-blur-xl">
      {/* Logo */}
      <div className="p-6 border-b border-white/5 flex items-center justify-center lg:justify-start">
        <Link href={"/dashboard"} className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl p-2.5 flex items-center justify-center shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:scale-110">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold hidden lg:block bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Pixora</h1>
        </Link>
      </div>

      {/* Navigation */}
      <div className="py-8 flex flex-col flex-1">
        <div className="space-y-2 px-3">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setIsHovered(item.href)}
              onMouseLeave={() => setIsHovered(null)}
              className={`group flex items-center lg:space-x-3 px-4 py-3.5 rounded-xl text-sm 
                ${pathname === item.href || (item.href.includes('/profile/') && pathname.includes('/profile/'))
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20'
                : 'text-gray-300 hover:bg-white/5 hover:shadow-lg hover:shadow-violet-500/5'
                } transition-all duration-300 w-full justify-center lg:justify-start relative overflow-hidden`}
            >
              <span className="flex-shrink-0 relative z-10 group">{item.icon}</span>
              <span className={`hidden lg:block font-medium relative z-10 transition-transform duration-300 ${isHovered === item.href ? 'translate-x-1' : ''}`}>
                {item.name}
              </span>
              {isHovered === item.href && !pathname.includes(item.href) && (
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 blur-xl" />
              )}
            </Link>
          ))}
        </div>

        <div className="mt-8 px-3">
          <div className="text-xs font-medium px-3 hidden lg:block text-violet-400">COLLECTIONS</div>
          <div className="mt-3 space-y-2">
            {[
              { name: 'Abstract Art', color: 'from-rose-500 to-rose-600' },
              { name: 'Portraits', color: 'from-amber-500 to-amber-600' },
            ].map((collection, idx) => (
              <button 
                key={idx} 
                className="group flex items-center lg:space-x-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5 transition-all duration-300 w-full justify-center lg:justify-start"
              >
                <span className={`w-3 h-3 rounded-lg bg-gradient-to-br ${collection.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}></span>
                <span className="hidden lg:block group-hover:translate-x-1 transition-transform duration-300">{collection.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto px-3">
          <Link href={"/settings"}
            className={`group flex items-center lg:space-x-3 px-4 py-3.5 rounded-xl text-sm 
              ${pathname === '/settings'
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20'
                : 'text-gray-300 hover:bg-white/5'
              } transition-all duration-300 w-full justify-center lg:justify-start`}
          >
            <Settings className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            <span className="hidden lg:block font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
