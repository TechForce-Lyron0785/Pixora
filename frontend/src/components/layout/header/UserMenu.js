"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Grid, Settings, BookmarkIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const UserMenu = ({ activeDropdown, toggleDropdown, setActiveDropdown, user, userStatus, setUserStatus, handleLogout }) => {
  // User status options
  const statusOptions = [
    { id: "online", label: "Online", color: "bg-emerald-500" },
    { id: "away", label: "Away", color: "bg-amber-500" },
    { id: "busy", label: "Busy", color: "bg-rose-500" },
    { id: "invisible", label: "Invisible", color: "bg-gray-500" },
  ];

  return (
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
          <div
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${
              userStatus === "online"
                ? "bg-emerald-500"
                : userStatus === "away"
                ? "bg-amber-500"
                : userStatus === "busy"
                ? "bg-rose-500"
                : "bg-gray-500"
            }`}
          ></div>
        </div>
        <ChevronDown
          className={`ml-1 w-4 h-4 text-gray-400 transition-transform ${
            activeDropdown === "userMenu" ? "rotate-180" : ""
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
                      className={`flex-1 p-1 rounded-md text-xs font-medium transition-colors ${
                        userStatus === status.id ? "bg-white/10" : "hover:bg-white/5"
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
  );
};

export default UserMenu; 