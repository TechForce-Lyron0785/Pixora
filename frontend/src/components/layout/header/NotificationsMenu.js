"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Check, 
  ChevronRight, 
  Trash2, 
  MoreVertical, 
  CheckCheck, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Bookmark,
  Clock
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from "@/context/AuthContext";

const NotificationsMenu = ({ activeDropdown, toggleDropdown }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const router = useRouter();
  const api = useApi();
  const { user } = useAuth();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/notifications?limit=10');
      setNotifications(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      setLoading(false);
    }
  }, [api, user]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await api.get('/api/notifications/unread/count');
      setUnreadCount(response.data.data.count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, [api, user]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.patch('/api/notifications/read-all');
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      
      // Update local state
      const updatedNotifications = notifications.filter(
        notification => notification._id !== notificationId
      );
      setNotifications(updatedNotifications);
      
      // Update unread count if needed
      const deletedNotification = notifications.find(n => n._id === notificationId);
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Handle notification click based on type and related entities
  const handleNotificationClick = (notification) => {
    // Mark as read first
    if (!notification.read) {
      markAsRead(notification._id);
    }
    
    // Close the dropdown
    toggleDropdown(null);
    
    // Navigate based on notification type and related entities
    if (notification.type === 'follow' && notification.relatedUser) {
      // Get username from sender (since that's who followed)
      const username = notification.sender?.username;
      if (username) {
        router.push(`/profile/${username}`);
      }
    } 
    else if (['like', 'favorite', 'comment'].includes(notification.type) && notification.relatedImage) {
      // For likes, favorites, comments on images
      const imageId = notification.relatedImage._id || notification.relatedImage;
      let url = `/image/${imageId}`;
      
      // If it's a comment and we have the comment ID, add it to highlight the comment
      if (notification.type === 'comment' && notification.relatedComment) {
        url += `?comment=${notification.relatedComment._id || notification.relatedComment}`;
      }
      
      router.push(url);
    }
    else if (notification.type === 'reply' && notification.relatedComment) {
      // For replies to comments
      const imageId = notification.relatedImage._id || notification.relatedImage;
      const commentId = notification.relatedComment._id || notification.relatedComment;
      
      router.push(`/image/${imageId}?comment=${commentId}&isReply=true`);
    }
  };

  // Toggle action menu for a notification
  const toggleActionMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'reply':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-violet-500" />;
      case 'favorite':
        return <Bookmark className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  // Format time as relative
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (err) {
      return "recently";
    }
  };

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (activeDropdown === "notifications") {
      fetchNotifications();
    }
  }, [activeDropdown, fetchNotifications]);

  // Fetch unread count on mount and periodically
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      
      // Set up polling for unread count every minute
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [fetchUnreadCount, user]);

  return (
    <div className="relative dropdown-container">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown("notifications");
        }}
        className={`relative p-2.5 text-gray-300 hover:text-white rounded-full transition-colors ${
          activeDropdown === "notifications" ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        <Bell className="w-5 h-5" />
        {/* Notification badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {activeDropdown === "notifications" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center">
                  <Bell className="w-4 h-4 mr-2 text-violet-400" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <button 
                  onClick={markAllAsRead}
                  className="text-xs font-medium bg-white/5 hover:bg-white/10 text-violet-400 hover:text-violet-300 py-1 px-2 rounded flex items-center transition-colors"
                >
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Mark all read
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400 text-sm">Loading notifications...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-400 text-sm">{error}</p>
                  <button 
                    onClick={fetchNotifications}
                    className="mt-3 text-violet-400 hover:text-violet-300 text-sm underline"
                  >
                    Try again
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="w-12 h-12 text-gray-500 mb-3" />
                  <p className="text-gray-400 mb-1">No notifications yet</p>
                  <p className="text-gray-500 text-sm">We&apos;ll notify you when something happens</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`relative p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                      !notification.read ? "bg-zinc-800/40" : ""
                    }`}
                  >
                    <div 
                      className="flex items-start cursor-pointer group"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* Notification icon */}
                      <div className="mr-2 mt-1 p-1.5 rounded-lg bg-zinc-800">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      {/* User avatar */}
                      <div className="flex-shrink-0 mr-3">
                        {notification.sender?.profilePicture ? (
                          <Image
                            src={notification.sender.profilePicture}
                            alt={notification.sender.username || "User"}
                            width={40}
                            height={40}
                            className="rounded-full ring-2 ring-zinc-700/50 group-hover:ring-violet-500/30 transition-all"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                            <span className="text-zinc-300 font-medium">
                              {notification.sender?.username?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium text-white">
                            {notification.sender?.username || "Someone"}
                          </span>{" "}
                          <span className="text-gray-300">
                            {notification.content}
                          </span>
                        </p>
                        
                        {/* Preview of related content if available */}
                        {notification.relatedImage && notification.relatedImage.title && (
                          <div className="mt-1 p-2 rounded bg-zinc-800/50 text-xs text-gray-400 truncate">
                            &quot;{notification.relatedImage.title}&quot;
                          </div>
                        )}
                        
                        {notification.relatedComment && notification.relatedComment.text && (
                          <div className="mt-1 p-2 rounded bg-zinc-800/50 text-xs text-gray-400 truncate">
                            &quot;{notification.relatedComment.text}&quot;
                          </div>
                        )}
                        
                        <div className="flex items-center mt-1.5">
                          <Clock className="w-3 h-3 text-gray-500 mr-1" />
                          <p className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="bg-violet-500 w-2 h-2 rounded-full"></div>
                        </div>
                      )}
                      
                      {/* Action menu trigger */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleActionMenu(notification._id);
                        }}
                        className="ml-2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Action menu */}
                    <AnimatePresence>
                      {activeMenu === notification._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-3 top-8 z-10 bg-zinc-800 border border-white/10 rounded-lg shadow-lg py-1 w-40"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!notification.read && (
                            <button
                              onClick={() => {
                                markAsRead(notification._id);
                                setActiveMenu(null);
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors"
                            >
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => {
                              deleteNotification(notification._id);
                              setActiveMenu(null);
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-white/5 text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-white/5">
              <Link
                href="/notifications"
                className="flex items-center justify-center w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-center rounded-lg py-2 text-sm font-medium transition-colors"
                onClick={() => toggleDropdown(null)}
              >
                View All Notifications
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsMenu; 