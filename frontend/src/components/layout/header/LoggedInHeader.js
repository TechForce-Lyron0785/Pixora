"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Import our component parts
import NavTabs from "./NavTabs";
import SearchBar from "./SearchBar";
import CreateMenu from "./CreateMenu";
import MessagesMenu from "./MessagesMenu";
import NotificationsMenu from "./NotificationsMenu";
import QuickView from "./QuickView";
import UserMenu from "./UserMenu";

const LoggedInHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [currentTab, setCurrentTab] = useState("discover");
  const [isCreatingMode, setIsCreatingMode] = useState(false);
  const [userStatus, setUserStatus] = useState("online");
  const [quickViewOpen, setQuickViewOpen] = useState(false);
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

  // Toggle search bar visibility
  const toggleSearch = () => {
    setSearchActive(!searchActive);
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

  // Toggle quick view
  const toggleQuickView = (e) => {
    e.stopPropagation();
    setQuickViewOpen(!quickViewOpen);
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

          {/* Search bar - Appears when search is active */}
          <SearchBar 
            searchActive={searchActive}
            toggleSearch={toggleSearch}
            setActiveDropdown={setActiveDropdown}
            activeDropdown={activeDropdown}
          />

          {/* Right side actions */}
          <div className="flex items-center space-x-2 dropdown-container">
            {/* Search toggle */}
            <button
              onClick={toggleSearch}
              className={`p-2.5 text-gray-300 hover:text-white rounded-full transition-colors ${
                searchActive ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Quick Stats Button & Panel */}
            <QuickView 
              quickViewOpen={quickViewOpen} 
              toggleQuickView={toggleQuickView}
            />

            {/* Create New Button & Menu */}
            <CreateMenu 
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            {/* Messages Button & Menu */}
            <MessagesMenu 
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
            />

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
    </motion.header>
  );
};

export default LoggedInHeader; 