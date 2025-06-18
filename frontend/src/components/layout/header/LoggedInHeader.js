"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Search, Upload, Clock, TrendingUp } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";

// Import our component parts
import NavTabs from "./NavTabs";
// import SearchBar from "./SearchBar";
import CreateMenu from "./CreateMenu";
import MessagesMenu from "./MessagesMenu";
import NotificationsMenu from "./NotificationsMenu";
import QuickView from "./QuickView";
import UserMenu from "./UserMenu";
import Link from "next/link";

const LoggedInHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("discover");
  const [isCreatingMode, setIsCreatingMode] = useState(false);
  const [userStatus, setUserStatus] = useState("online");
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const api = useApi();

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

  // Prevent body scroll when modal open
  useEffect(() => {
    if (searchOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [searchOpen]);

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

  // Toggle search modal visibility
  const toggleSearch = () => {
    setSearchActive(!searchActive);
    setSearchOpen((prev) => !prev);
    if (!searchOpen) {
      // opening
      loadRecentSearches();
      fetchTrending();
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
  };

  // Derive current tab from pathname
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/dashboard")) setCurrentTab("dashboard");
    else if (pathname.startsWith("/feed")) setCurrentTab("discover");
    else if (pathname.startsWith("/search")) setCurrentTab("search");
    else if (pathname.startsWith("/users")) setCurrentTab("users");
    else if (pathname.startsWith("/collections")) setCurrentTab("collections");
    else if (pathname.startsWith("/notifications")) setCurrentTab("notifications");
    else setCurrentTab("discover");
  }, [pathname]);

  // Toggle quick view
  const toggleQuickView = (e) => {
    e.stopPropagation();
    setQuickViewOpen(!quickViewOpen);
  };

  // Recent & trending helpers
  const loadRecentSearches = () => {
    try {
      const recent = JSON.parse(localStorage.getItem("pixora_recent_searches") || "[]");
      setRecentSearches(recent.slice(0, 8));
    } catch {}
  };

  const saveSearch = (term) => {
    try {
      const recent = JSON.parse(localStorage.getItem("pixora_recent_searches") || "[]");
      const filtered = recent.filter((t) => t !== term);
      localStorage.setItem("pixora_recent_searches", JSON.stringify([term, ...filtered].slice(0, 12)));
    } catch {}
  };

  const fetchTrending = async () => {
    try {
      const res = await api.get("/api/images/trending-search?limit=4");
      setTrendingSearches(res?.data?.data || []);
    } catch (e) {
      setTrendingSearches([]);
    }
  };

  const onSubmitSearch = (e) => {
    e?.preventDefault?.();
    if (!query.trim()) return;
    saveSearch(query.trim());
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const onPickSearch = (term) => {
    saveSearch(term);
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setQuery("");
  };

  return (
    <motion.header
      className={`fixed top-0 right-0 left-0 ml-20 lg:ml-64 z-50 transition-all duration-300 border-b ${
        scrolled
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
          <NavTabs
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            isCreatingMode={isCreatingMode}
            toggleCreatorMode={toggleCreatorMode}
          />

          {/* Search button centered modal trigger */}
          <div className="flex-1 flex justify-center px-4">
            <div className="hidden md:block w-full max-w-xl">
              <button
                onClick={toggleSearch}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search images, people, collections...</span>
                <span className="ml-auto text-xs text-gray-500 bg-white/10 px-2 py-0.5 rounded">Ctrl K</span>
              </button>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 dropdown-container">
            {/* Search toggle */}
            {/* <button
              onClick={toggleSearch}
              className={`p-2.5 text-gray-300 hover:text-white rounded-full transition-colors ${
                searchActive ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <Search className="w-5 h-5" />
            </button> */}

            {/* Create New Button & Menu */}
            <CreateMenu
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            {/* 
            <Link
              href={"/upload-image"}
              className={`hidden md:flex items-center px-4 py-2 transition-all hover:from-violet-500 hover:to-fuchsia-500 rounded-full text-white text-sm font-medium duration-300 `}
            >
              <Upload className="w-4 h-4 mr-2" />
              <span>Upload Image</span>
            </Link> */}

            {/* Notifications Button & Menu */}
            <NotificationsMenu
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
            />

            {/* User Menu Button & Menu */}
            <UserMenu
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
              setActiveDropdown={setActiveDropdown}
              user={user}
              userStatus={userStatus}
              setUserStatus={setUserStatus}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </div>

      {/* Search Overlay Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 z-[130]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <form onSubmit={onSubmitSearch} className="flex items-center p-4 border-b border-white/10">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search for images, artists, collections, or tags..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <span className="text-xs text-gray-500 bg-white/10 px-2 py-1 rounded font-mono">ESC</span>
                </form>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recent Searches */}
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-violet-300" />
                      <h4 className="text-sm font-semibold text-violet-300">Recent</h4>
                    </div>
                    {recentSearches.length === 0 ? (
                      <p className="text-xs text-gray-400">No recent searches</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((t, idx) => (
                          <button
                            key={idx}
                            onClick={() => onPickSearch(t)}
                            className="px-2.5 py-1 text-xs rounded-full bg-white/10 hover:bg-white/15 text-gray-200 border border-white/10"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Trending Tags (chips like search page) */}
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-amber-300" />
                      <h4 className="text-sm font-semibold text-amber-300">Trending searches</h4>
                    </div>
                    {trendingSearches.length === 0 ? (
                      <p className="text-xs text-gray-400">No trending terms</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((trend, idx) => (
                          <button
                            key={idx}
                            onClick={() => onPickSearch(trend.query)}
                            className="px-3 py-1.5 text-xs rounded-full bg-white/10 hover:bg-white/15 text-gray-200 border border-white/10"
                          >
                            {trend.query}
                            {typeof trend.count === 'number' && (
                              <span className="ml-2 text-[10px] text-gray-400">{trend.count}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 pt-0">
                  <button
                    onClick={onSubmitSearch}
                    className="w-full py-2.5 text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-medium transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default LoggedInHeader; 