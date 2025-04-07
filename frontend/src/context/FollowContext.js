"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "./AuthContext";

// Create follow context
const FollowContext = createContext();

// Follow provider component
export const FollowProvider = ({ children }) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const api = useApi();

  // Get all followers of a user
  const getFollowers = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/follow/followers/${userId}`);
      setFollowers(response.data.data);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error fetching followers";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Get all users the current user is following
  const getFollowing = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/follow/following/${userId}`);
      setFollowing(response.data.data);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error fetching following";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Follow a user
  const followUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      await api.post(`/api/follow/${userId}`);
      
      // Update followers and following counts
      if (user) {
        // If we're viewing our own profile, refresh our following list
        if (user._id === userId) {
          await getFollowing(user._id);
        } else {
          // Otherwise, refresh the followers list of the user we're following
          await getFollowers(userId);
        }
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error following user";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [api, user, getFollowers, getFollowing]);

  // Unfollow a user
  const unfollowUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/api/follow/${userId}`);
      
      // Update followers and following counts
      if (user) {
        // If we're viewing our own profile, refresh our following list
        if (user._id === userId) {
          await getFollowing(user._id);
        } else {
          // Otherwise, refresh the followers list of the user we're unfollowing
          await getFollowers(userId);
        }
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error unfollowing user";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [api, user, getFollowers, getFollowing]);

  // Check if the current user is following another user
  const checkFollowStatus = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/follow/status/${userId}`);
      return response.data.data.isFollowing;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error checking follow status";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const value = {
    followers,
    following,
    loading,
    error,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    checkFollowStatus
  };

  return <FollowContext.Provider value={value}>{children}</FollowContext.Provider>;
};

// Custom hook to use follow context
export const useFollow = () => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error("useFollow must be used within a FollowProvider");
  }
  return context;
}; 