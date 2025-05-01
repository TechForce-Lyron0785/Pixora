"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchBar = ({ searchActive, toggleSearch, setActiveDropdown, activeDropdown }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (searchActive) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchActive]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      toggleSearch();
      setSearchQuery("");
    }
  };

  return (
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
                onClick={() => setActiveDropdown("searchFilters")}
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

          <SearchFilters activeDropdown={activeDropdown} />
        </motion.form>
      )}
    </AnimatePresence>
  );
};

const SearchFilters = ({ activeDropdown }) => {
  if (activeDropdown !== "searchFilters") return null;
  
  return (
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
  );
};

export default SearchBar; 