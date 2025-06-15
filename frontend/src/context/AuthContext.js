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
  const [lastVerified, setLastVerified] = useState(null);
  const router = useRouter();

  // Load cached user data on mount
  useEffect(() => {
    try {
      const cachedUser = sessionStorage.getItem('cachedUser');
      const cachedTimestamp = sessionStorage.getItem('cachedUserTimestamp');
      
      if (cachedUser && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        const now = Date.now();
        
        // Use cached data if it's less than 5 minutes old
        if (now - timestamp < 300000) {
          setUser(JSON.parse(cachedUser));
          setLastVerified(timestamp);
          setLoading(false); // Set loading to false since we have cached data
        }
      }
    } catch (error) {
      console.error('Error loading cached user data:', error);
    }
  }, []);

  // Use the custom hook to get the API client
  const api = useApi();

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/api/users/logout");
      setUser(null);

      // Clear cached user data
      try {
        sessionStorage.removeItem('cachedUser');
        sessionStorage.removeItem('cachedUserTimestamp');
      } catch (cacheError) {
        console.error('Error clearing cached user data:', cacheError);
      }

      // Only sign out of NextAuth if there is an active NextAuth session
      if (status === "authenticated") {
        await signOut();
      }
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

  // Verify user with API, but rate limit to prevent too many calls
  const verifyUser = useCallback(async (force = false) => {
    // Don't verify if we already have user data and session is valid, unless forced
    if (!force && user && session && status === "authenticated") {
      return;
    }

    // Rate limiting: don't verify more than once every 30 seconds unless forced
    const now = Date.now();
    if (!force && lastVerified && (now - lastVerified) < 30000) {
      return;
    }

    // Only set loading to true if we don't have user data yet
    const shouldSetLoading = !user;
    if (shouldSetLoading) {
      setLoading(true);
    }

    try {
      const response = await api.get("/api/users/me");
      const userData = response.data.data;
      setUser(userData);
      setLastVerified(now);
      
      // Cache user data in sessionStorage
      try {
        sessionStorage.setItem('cachedUser', JSON.stringify(userData));
        sessionStorage.setItem('cachedUserTimestamp', now.toString());
      } catch (cacheError) {
        console.error('Error caching user data:', cacheError);
      }
    } catch (error) {
      console.error("Auth verification error:", error);
      setUser(null);
      
      // If verification fails, it means the token is expired or invalid
      // We'll handle the silent cleanup without redirecting
      try {
        await api.post("/api/users/logout");
        // Only sign out of NextAuth if there is an active NextAuth session
        if (status === "authenticated") {
          await signOut({ redirect: false });
        }
      } catch (logoutError) {
        console.error("Silent logout error:", logoutError);
      }
    } finally {
      if (shouldSetLoading) {
        setLoading(false);
      }
    }
  }, [api, user, session, status, lastVerified]);

  // Initialize from cache and session
  useEffect(() => {
    // Regardless of NextAuth status, verify backend user if not loaded yet
    if (status !== "loading") {
      if (!user) {
        verifyUser();
      } else {
        setLoading(false);
      }
    }
  }, [status, user, verifyUser]);

  // Handle visibility change (tab switching) to prevent unnecessary re-fetching
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only verify if the page becomes visible and we have a session but no user
      // Also check if we haven't verified recently
      const now = Date.now();
      if (!document.hidden && status === "authenticated" && !user && 
          (!lastVerified || (now - lastVerified) > 30000)) {
        verifyUser();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, user, verifyUser, lastVerified]);

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

  // Update user profile
  const updateProfile = async (userId, profileData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.patch(`/api/users/${userId}`, profileData);

      // Update user state with the returned data
      setUser(response.data.data);

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