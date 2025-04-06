"use client";

import { createContext, useContext, useState, useEffect } from "react";
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
  const router = useRouter();

  // Use the custom hook to get the API client
  const api = useApi();

  useEffect(() => {
    async function verifyUser() {
      try {
        setLoading(true);
        const response = await api.get("/api/users/me");
        setUser(response.data.data);
      } catch (error) {
        console.error("Auth verification error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (status !== "loading") {
      verifyUser();
    }
  }, [session, status, api]);

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

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/api/users/logout");
      setUser(null);
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

  const value = {
    user,
    loading,
    error,
    register,
    login,
    googleLogin,
    logout,
    checkUserExists,
    isAuthenticated: !!user,
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