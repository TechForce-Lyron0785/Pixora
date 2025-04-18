"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Upload,
  ChevronDown,
  MessageSquare,
  Heart,
  Zap,
  Award,
  BookmarkIcon,
  Sparkles,
  ImagePlus,
  Compass,
  X,
  Bookmark,
  TrendingUp,
  Calendar,
  Clock,
  Grid,
  Filter,
  Layers,
  BarChart2,
  Moon,
  Share2,
  Gift,
  Info,
  HelpCircle,
  Users,
  Briefcase,
  FileText,
  Flag,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LoggedInHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("discover");
  const [isCreatingMode, setIsCreatingMode] = useState(false);
  const [userStatus, setUserStatus] = useState("online");
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const searchInputRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Handle scroll effect for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Handle document click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown !== null && !event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
      if (quickViewOpen && !event.target.closest(".quick-view-container")) {
        setQuickViewOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown, quickViewOpen]);

  // Toggle dropdown menu
  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchActive(false);
      setSearchQuery("");
    }
  };

  // Toggle search bar visibility
  const toggleSearch = () => {
    setSearchActive(!searchActive);
    if (!searchActive) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  // Toggle creator mode
  const toggleCreatorMode = () => {
    setIsCreatingMode(!isCreatingMode);
    // You could add additional logic here to switch UI modes
  };

  // Toggle quick view
  const toggleQuickView = (e) => {
    e.stopPropagation();
    setQuickViewOpen(!quickViewOpen);
  };

  // Sample notification data (replace with actual data from API)
  const notifications = [
    {
      id: 1,
      type: "like",
      user: { name: "Elena Bright", avatar: "/images/upload/user1.png" },
      content: "liked your image 'Cosmic Journey'",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "comment",
      user: { name: "Marcus Wave", avatar: "/images/upload/user2.png" },
      content: "commented on your post: 'This is absolutely stunning!'",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "follow",
      user: { name: "Sasha Nova", avatar: "/images/upload/user3.png" },
      content: "started following you",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "message",
      user: { name: "Noah Parker", avatar: "/images/upload/user4.png" },
      content: "sent you a direct message",
      time: "3 hours ago",
      read: false,
    },
    {
      id: 5,
      type: "feature",
      user: { name: "Pixel Gallery", avatar: "/images/upload/gallery1.png" },
      content: "featured your work in the weekly showcase",
      time: "1 day ago",
      read: false,
    },
  ];

  // Recent messages for quick view
  const recentMessages = [
    {
      id: 1,
      user: { name: "Noah Parker", avatar: "/images/upload/user4.png", status: "online" },
      lastMessage: "That's a brilliant concept! I'd love to collaborate...",
      time: "3:45 PM",
      unread: 2,
    },
    {
      id: 2,
      user: { name: "Maya Johnson", avatar: "/images/upload/user5.png", status: "offline" },
      lastMessage: "Thanks for the feedback on my latest design.",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 3,
      user: { name: "Design Community", avatar: "/images/upload/group1.png", status: "online" },
      lastMessage: "Liam: Has anyone tried the new filter pack?",
      time: "2 days ago",
      unread: 12,
    },
  ];

  // Stats for quick view
  const userStats = {
    views: 1243,
    viewsChange: "+18%",
    likes: 376,
    likesChange: "+24%",
    followers: 592,
    followersChange: "+3%",
    uploads: 28,
  };

  // Recent activity for quick stats
  const recentActivity = [
    {
      id: 1,
      type: "comment",
      action: "New comment on 'Neon Dreams'",
      time: "2h ago",
    },
    {
      id: 2,
      type: "like",
      action: "15 new likes on your recent uploads",
      time: "5h ago",
    },
    {
      id: 3,
      type: "follow",
      action: "3 new followers",
      time: "1d ago",
    },
  ];

  // Navigation tabs
  const navTabs = [
    { id: "discover", label: "Discover", icon: Compass },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "new", label: "New", icon: Zap },
    { id: "collections", label: "Collections", icon: Layers },
  ];

  // User status options
  const statusOptions = [
    { id: "online", label: "Online", color: "bg-emerald-500" },
    { id: "away", label: "Away", color: "bg-amber-500" },
    { id: "busy", label: "Busy", color: "bg-rose-500" },
    { id: "invisible", label: "Invisible", color: "bg-gray-500" },
  ];

  return (
    <motion.header
      className={`fixed top-0 right-0 left-0 ml-20 lg:ml-64 z-50 transition-all duration-300 border-b ${scrolled
          ? "bg-zinc-950/90 backdrop-blur-xl py-2.5 border-white/10"
          : "bg-transparent py-4 border-transparent"
        }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 mx-auto">
        <div className="flex items-center justify-between">
          {/* Left side - Tabs and navigation */}
          <div className="flex items-center">
            {/* Navigation tabs */}
            <div className="hidden lg:flex items-center space-x-1 mr-4">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentTab === tab.id
                      ? "bg-violet-600/20 text-violet-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <tab.icon className={`w-4 h-4 mr-2 ${currentTab === tab.id ? "text-violet-400" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Creator Mode Toggle */}
            <button
              onClick={toggleCreatorMode}
              className={`hidden md:flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isCreatingMode
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                }`}
            >
              {isCreatingMode ? (
                <>
                  <Sparkles className="w-3 h-3 mr-1.5 text-amber-400" />
                  Creator Mode
                </>
              ) : (
                <>
                  <ImagePlus className="w-3 h-3 mr-1.5" />
                  Switch to Creator
                </>
              )}
            </button>
          </div>

          {/* Search bar - Appears when search is active */}
          <AnimatePresence>
            {searchActive && (
              <motion.form
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 mx-auto w-full max-w-3xl px-6"
                onSubmit={handleSearchSubmit}
              >
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-gray-400 w-5 h-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search images, people, or collections..."
                    className="w-full bg-zinc-800/80 border border-white/10 rounded-full py-3 pl-12 pr-20 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-lg shadow-black/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-4 flex items-center space-x-2">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-violet-400 transition-colors"
                      onClick={() => {
                        toggleDropdown("searchFilters");
                        setActiveDropdown("searchFilters");
                      }}
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={toggleSearch}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Search Filters Dropdown */}
                <AnimatePresence>
                  {activeDropdown === "searchFilters" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-4 mt-2 w-64 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30 overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-white/10">
                        <h3 className="text-sm font-medium">Search Filters</h3>
                      </div>
                      <div className="p-3 space-y-3">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Content Type</label>
                          <div className="grid grid-cols-3 gap-1">
                            <button className="bg-violet-600/20 text-violet-400 rounded-lg p-2 text-xs">Images</button>
                            <button className="bg-white/5 hover:bg-white/10 rounded-lg p-2 text-xs">People</button>
                            <button className="bg-white/5 hover:bg-white/10 rounded-lg p-2 text-xs">Collections</button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Date Added</label>
                          <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs">
                            <option>Any time</option>
                            <option>Today</option>
                            <option>This week</option>
                            <option>This month</option>
                            <option>This year</option>
                          </select>
                        </div>
                        <button className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-lg p-2 text-xs font-medium transition-colors">
                          Apply Filters
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 dropdown-container">
            {/* Search toggle */}
            <button
              onClick={toggleSearch}
              className={`p-2.5 text-gray-300 hover:text-white rounded-full transition-colors ${searchActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Quick Stats Button */}
            <button
              onClick={toggleQuickView}
              className="quick-view-container p-2.5 text-gray-300 hover:text-white rounded-full transition-colors hover:bg-white/5 relative"
            >
              <BarChart2 className="w-5 h-5" />
              <span className="animate-ping absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-violet-400 opacity-75"></span>
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-violet-500"></span>
            </button>

            {/* Quick View Panel */}
            <AnimatePresence>
              {quickViewOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: 10, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="quick-view-container absolute right-0 top-14 w-96 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30 overflow-hidden z-50"
                >
                  <div className="flex border-b border-white/10">
                    <button
                      className="flex-1 p-3 text-center text-sm font-medium border-b-2 border-violet-500 text-violet-400"
                    >
                      Quick Stats
                    </button>
                    <button
                      className="flex-1 p-3 text-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                      Activity
                    </button>
                    <button
                      className="flex-1 p-3 text-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                      Messages
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-medium mb-3 flex items-center justify-between">
                      <span>Your Performance</span>
                      <select className="bg-white/5 border border-white/10 rounded-md text-xs p-1">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>All time</option>
                      </select>
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-400">Profile Views</div>
                          <div className={`text-xs ${userStats.viewsChange.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {userStats.viewsChange}
                          </div>
                        </div>
                        <div className="text-xl font-bold mt-1">{userStats.views.toLocaleString()}</div>
                        <div className="h-1 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div className="h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-400">Image Likes</div>
                          <div className={`text-xs ${userStats.likesChange.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {userStats.likesChange}
                          </div>
                        </div>
                        <div className="text-xl font-bold mt-1">{userStats.likes.toLocaleString()}</div>
                        <div className="h-1 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div className="h-1 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
                    <div className="space-y-2 mb-3">
                      {recentActivity.map(activity => (
                        <div key={activity.id} className="flex items-center p-2 rounded-lg hover:bg-white/5">
                          <div className="p-1.5 rounded-full bg-white/5 mr-3">
                            {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-emerald-400" />}
                            {activity.type === 'like' && <Heart className="w-4 h-4 text-rose-400" />}
                            {activity.type === 'follow' && <User className="w-4 h-4 text-sky-400" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">{activity.action}</div>
                            <div className="text-xs text-gray-400">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10">
                      <button className="w-full rounded-lg p-2 text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors">
                        View Full Analytics
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Create New Button */}
            <div className="relative dropdown-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("createMenu");
                }}
                className={`hidden md:flex items-center px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-full text-white text-sm font-medium transition-all duration-300 ${activeDropdown === "createMenu" ? "shadow-lg shadow-violet-500/20" : ""
                  }`}
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                <span>Create</span>
                <ChevronDown
                  className={`ml-1 w-4 h-4 transition-transform ${activeDropdown === "createMenu" ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Create Menu Dropdown */}
              <AnimatePresence>
                {activeDropdown === "createMenu" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30 overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-white/10">
                      <h3 className="text-sm font-medium">Create New</h3>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/upload-image"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600">
                          <ImagePlus className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Upload Image</div>
                          <div className="text-xs text-gray-400">Share your work with the community</div>
                        </div>
                      </Link>
                      <Link
                        href="/create-collection"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600">
                          <Layers className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Create Collection</div>
                          <div className="text-xs text-gray-400">Organize your work into collections</div>
                        </div>
                      </Link>
                      <Link
                        href="/create-story"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Create Story</div>
                          <div className="text-xs text-gray-400">Share the process behind your work</div>
                        </div>
                      </Link>
                      <Link
                        href="/schedule-post"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Schedule Post</div>
                          <div className="text-xs text-gray-400">Plan your content calendar</div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages Button */}
            <div className="relative dropdown-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("messagesMenu");
                }}
                className={`relative p-2.5 text-gray-300 hover:text-white rounded-full transition-colors ${activeDropdown === "messagesMenu" ? "bg-white/10" : "hover:bg-white/5"
                  }`}
              >
                <MessageCircle className="w-5 h-5" />
                {/* Message badge */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full"></span>
              </button>

              {/* Messages Dropdown */}
              <AnimatePresence>
                {activeDropdown === "messagesMenu" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Messages</h3>
                        <Link href="/messages" className="text-xs text-violet-400 hover:text-violet-300">
                          View all
                        </Link>
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      {recentMessages.map((message) => (
                        <div
                          key={message.id}
                          className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              <div className="relative">
                                <Image
                                  src={message.user.avatar}
                                  alt={message.user.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${message.user.status === 'online' ? 'bg-emerald-500' : 'bg-gray-500'
                                  }`}></div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">{message.user.name}</p>
                                <p className="text-xs text-gray-400">{message.time}</p>
                              </div>
                              <p className="text-gray-300 text-sm line-clamp-1 mt-0.5">
                                {message.lastMessage}
                              </p>
                            </div>
                            {message.unread > 0 && (
                              <div className="flex-shrink-0 ml-2">
                                <div className="bg-sky-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                  {message.unread}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3">
                      <button className="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-lg py-2 text-sm font-medium transition-colors">
                        New Message
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative dropdown-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("notifications");
                }}
                className={`relative p-2.5 text-gray-300 hover:text-white rounded-full transition-colors ${activeDropdown === "notifications" ? "bg-white/10" : "hover:bg-white/5"
                  }`}
              >
                <Bell className="w-5 h-5" />
                {/* Notification badge */}
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                  5
                </span>
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {activeDropdown === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Notifications</h3>
                        <button className="text-xs text-violet-400 hover:text-violet-300">
                          Mark all as read
                        </button>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!notification.read ? "bg-white/5" : ""
                            }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              <Image
                                src={notification.user.avatar}
                                alt={notification.user.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-medium">{notification.user.name}</span>{" "}
                                <span className="text-gray-300">{notification.content}</span>
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="flex-shrink-0 ml-2">
                                <div className="bg-violet-500 w-2 h-2 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3">
                      <Link href="/notifications" className="block w-full bg-white/5 hover:bg-white/10 text-center rounded-lg py-2 text-sm font-medium transition-colors">
                        View All Notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative dropdown-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("userMenu");
                }}
                className="flex items-center"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user?.profilePicture || "/images/default-profile.jpg"}
                    alt="User"
                    className="rounded-full h-9 w-9 border-2 border-white/10"
                  />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${userStatus === 'online' ? 'bg-emerald-500' :
                      userStatus === 'away' ? 'bg-amber-500' :
                        userStatus === 'busy' ? 'bg-rose-500' : 'bg-gray-500'
                    }`}></div>
                </div>
                <ChevronDown
                  className={`ml-1 w-4 h-4 text-gray-400 transition-transform ${activeDropdown === "userMenu" ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {activeDropdown === "userMenu" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center">
                        <Image
                          src={user?.profilePicture || "/images/default-profile.jpg"}
                          alt="User"
                          width={48}
                          height={48}
                          className="rounded-full mr-3"
                        />
                        <div>
                          <p className="font-semibold">{user?.fullName || "User"}</p>
                          <p className="text-sm text-gray-400">@{user?.username || "username"}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-xs text-gray-400 mb-1">Status</div>
                        <div className="flex gap-1">
                          {statusOptions.map((status) => (
                            <button
                              key={status.id}
                              onClick={() => setUserStatus(status.id)}
                              className={`flex-1 p-1 rounded-md text-xs font-medium transition-colors ${userStatus === status.id ? 'bg-white/10' : 'hover:bg-white/5'
                                }`}
                            >
                              <div className="flex justify-center items-center">
                                <div className={`w-2 h-2 rounded-full ${status.color} mr-1`}></div>
                                <span>{status.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <User className="w-5 h-5 text-gray-400" />
                        <span>View Profile</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <Grid className="w-5 h-5 text-gray-400" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <Settings className="w-5 h-5 text-gray-400" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/bookmarks"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <BookmarkIcon className="w-5 h-5 text-gray-400" />
                        <span>Saved Items</span>
                      </Link>
                      <button
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                        onClick={() => {
                          setActiveDropdown(null);
                          handleLogout();
                        }}
                      >
                        <LogOut className="w-5 h-5 text-gray-400" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default LoggedInHeader;