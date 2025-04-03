"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Wand2,
  Users,
  BarChart3,
  Zap,
  LogIn,
  Compass,
} from "lucide-react";
import Image from "next/image";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle scroll effect for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Navigation data structure
  const navigationItems = [
    {
      name: "Features",
      href: "#features",
      hasDropdown: true,
      dropdownItems: [
        {
          name: "AI Generation",
          description: "Create stunning visuals with our advanced AI",
          href: "/features/ai-generation",
          icon: <Sparkles className="w-5 h-5 text-violet-400" />,
        },
        {
          name: "Creative Tools",
          description: "Professional editing with precision controls",
          href: "/features/creative-tools",
          icon: <Wand2 className="w-5 h-5 text-emerald-400" />,
        },
        {
          name: "Community",
          description: "Connect with creators from around the world",
          href: "/features/community",
          icon: <Users className="w-5 h-5 text-amber-400" />,
        },
        {
          name: "Analytics",
          description: "Track engagement and optimize your content",
          href: "/features/analytics",
          icon: <BarChart3 className="w-5 h-5 text-cyan-400" />,
        },
      ],
    },
    {
      name: "Explore",
      href: "/explore",
      hasDropdown: false,
    },
    {
      name: "Pricing",
      href: "/pricing",
      hasDropdown: false,
    },
    {
      name: "Gallery",
      href: "/gallery",
      hasDropdown: false,
    },
    {
      name: "Community",
      href: "/community",
      hasDropdown: false,
    },
  ];

  // Toggle dropdown menu
  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-zinc-950/85 backdrop-blur-lg border-b border-white/10 py-3"
            : "bg-transparent py-5"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative flex items-center space-x-2">
                <div className="p-1 rounded-md shadow-lg shadow-gray-500/20 bg-white/10 backdrop-blur-sm">
                  <Image
                    src="/images/logo.png"
                    alt="Pixora Logo"
                    className="w-8 h-8"
                    height={20}
                    width={20}
                  />
                </div>
                <span className="text-white font-bold text-xl">Pixora</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.hasDropdown) toggleDropdown(index);
                  }}
                >
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center ${
                      activeDropdown === index
                        ? "text-white bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`ml-1 w-4 h-4 transition-transform ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Dropdown Panel */}
                  {item.hasDropdown && (
                    <AnimatePresence>
                      {activeDropdown === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-72 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30 overflow-hidden z-50"
                        >
                          <div className="p-2">
                            {item.dropdownItems.map((dropdownItem, idx) => (
                              <Link
                                key={idx}
                                href={dropdownItem.href}
                                className="flex items-start p-3 rounded-lg hover:bg-white/10 transition-colors"
                              >
                                <div className="p-2 rounded-lg bg-white/5">
                                  {dropdownItem.icon}
                                </div>
                                <div className="ml-3">
                                  <p className="text-white font-medium">
                                    {dropdownItem.name}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {dropdownItem.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>

              {/* Authentication */}
              <div className="hidden md:flex items-center space-x-3 ml-2">
                <Link href={"/login"} className="px-4 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-lg transition-colors flex items-center">
                  <span>Get Started</span>
                  <Sparkles className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-gray-300 hover:text-white rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-white/10 md:hidden overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-6">
                {/* Mobile Nav Links */}
                <div className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <div key={index} className="w-full">
                      {item.hasDropdown ? (
                        <>
                          <button
                            onClick={() => toggleDropdown(index)}
                            className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 text-white"
                          >
                            <span className="font-medium">{item.name}</span>
                            <ChevronDown
                              className={`w-5 h-5 transition-transform ${
                                activeDropdown === index ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {activeDropdown === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 ml-2 pl-2 border-l-2 border-violet-500/30 space-y-2"
                              >
                                {item.dropdownItems.map((dropdownItem, idx) => (
                                  <Link
                                    key={idx}
                                    href={dropdownItem.href}
                                    className="flex items-center p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white"
                                  >
                                    <div className="mr-3">
                                      {dropdownItem.icon}
                                    </div>
                                    <span>{dropdownItem.name}</span>
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className="block p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                  <Link
                    href="/explore"
                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 text-white flex flex-col items-center text-center transition-colors"
                  >
                    <Compass className="w-6 h-6 mb-2 text-cyan-400" />
                    <span className="text-sm font-medium">Explore Gallery</span>
                  </Link>

                  <Link
                    href="/create"
                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 text-white flex flex-col items-center text-center transition-colors"
                  >
                    <Sparkles className="w-6 h-6 mb-2 text-violet-400" />
                    <span className="text-sm font-medium">Start Creating</span>
                  </Link>
                </div>

                {/* Mobile Authentication */}
                <div className="pt-6 space-y-3 border-t border-white/10">
                  <Link href={"/login"} className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium flex items-center justify-center">
                    <LogIn className="w-5 h-5 mr-2" />
                    <span>Sign In</span>
                  </Link>

                  <Link href={"/register"} className="w-full p-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium flex items-center justify-center">
                    <Zap className="w-5 h-5 mr-2" />
                    <span>Get Started</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
