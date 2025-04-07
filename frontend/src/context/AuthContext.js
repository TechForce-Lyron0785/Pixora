"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useSession, signIn, signOut } from "next-auth/react";

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVerified, setLastVerified] = useState(0);
  const router = useRouter();

  // Use the custom hook to get the API client
  const api = useApi();

  // Verify user with API, but rate limit to prevent too many calls
  const verifyUser = useCallback(async (force = false) => {
    // Don't verify too frequently unless forced
    const now = Date.now();
    if (!force && now - lastVerified < 5 * 60 * 1000) { // 5 minute cache
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get("/api/users/me");
      setUser(response.data.data);
      // Store verification time
      setLastVerified(now);
      // Cache user data in localStorage
      if (response.data.data) {
        localStorage.setItem('cachedUser', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error("Auth verification error:", error);
      // Clear cache on error
      localStorage.removeItem('cachedUser');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [api, lastVerified]);

  // Initialize from cache and session
  useEffect(() => {
    // Try to load from cache first to avoid flash of loading state
    const cachedUser = localStorage.getItem('cachedUser');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        setLoading(false);
      } catch (e) {
        console.error("Error parsing cached user:", e);
      }
    }

    // Then verify with API if session is loaded
    if (status !== "loading") {
      verifyUser();
    }
  }, [session, status, verifyUser]);

  // Add tab focus handler to re-verify only when needed
  useEffect(() => {
    const handleFocus = () => {
      // Only verify if we have a session but verification is stale
      if (session && Date.now() - lastVerified > 5 * 60 * 1000) {
        verifyUser();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [session, lastVerified, verifyUser]);

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/api/users/register", userData);
      setUser(response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Check if username or email exists
  const checkUserExists = async (identifier) => {
    try {
      await api.post("/api/users/check-availability", identifier);
      return { exists: false, message: "Available" };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error checking availability";
      return { exists: true, message: errorMessage };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/api/users/login", credentials);
      setUser(response.data.data);
      
      // Update the cache
      if (response.data.data) {
        localStorage.setItem('cachedUser', JSON.stringify(response.data.data));
        setLastVerified(Date.now());
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoading(true);
      await signIn("google");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/api/users/logout");
      setUser(null);
      // Clear the cache
      localStorage.removeItem('cachedUser');
      setLastVerified(0);
      await signOut();
      router.push("/login");
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Logout failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userId, profileData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.patch(`/api/users/${userId}`, profileData);
      
      // Update user state with the returned data
      setUser(response.data.data);
      
      // Update the cache with fresh user data
      localStorage.setItem('cachedUser', JSON.stringify(response.data.data));
      setLastVerified(Date.now());
      
      // Fetch the latest user data to ensure we have the most up-to-date information
      await verifyUser(true);
      
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Profile update failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update user password
  const updatePassword = async (userId, passwordData) => {
    try {
      setLoading(true);
      setError(null);

      await api.patch(`/api/users/${userId}/password`, passwordData);
      
      // Refresh user data after password update
      await verifyUser(true);
      
      return { success: true, message: "Password updated successfully" };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Password update failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    googleLogin,
    logout,
    checkUserExists,
    updateProfile,
    updatePassword,
    isAuthenticated: !!user,
    verifyUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 