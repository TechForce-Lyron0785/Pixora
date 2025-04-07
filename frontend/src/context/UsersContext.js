"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from './AuthContext';

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [randomUsers, setRandomUsers] = useState([]);
  
  const api = useApi();
  const { isAuthenticated, user } = useAuth();
  
  // Fetch all users
  const fetchAllUsers = async (options = {}) => {
    const { manualData, randomData, skipApiCall = false } = options;

    // If we're providing manual data, update the state without API call
    if (skipApiCall && manualData) {
      // Filter out current user from the users list
      const filteredUsers = manualData.filter(u => u._id !== user?._id);
      setAllUsers(filteredUsers);
      
      if (randomData) {
        setRandomUsers(randomData);
      } else {
        // Set random users from the updated all users
        const shuffled = [...filteredUsers].sort(() => 0.5 - Math.random());
        setRandomUsers(shuffled.slice(0, 5));
      }
      
      // Set featured users from the updated all users
      const featured = filteredUsers.filter(user => 
        user.badge === "featured" || user.badge === "pro"
      );
      setFeaturedUsers(featured);
      
      return filteredUsers;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/users');
      // Filter out current user from the users list
      const filteredUsers = response.data.data.filter(u => u._id !== user?._id);
      setAllUsers(filteredUsers);
      
      // Set featured users (users with badge "featured" or "pro")
      const featured = filteredUsers.filter(user => 
        user.badge === "featured" || user.badge === "pro"
      );
      setFeaturedUsers(featured);
      
      // Set random users for suggestions
      const shuffled = [...filteredUsers].sort(() => 0.5 - Math.random());
      setRandomUsers(shuffled.slice(0, 5));
      
      return filteredUsers;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error fetching users";
      setError(errorMessage);
      console.error("Error fetching users:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Search users
  const searchUsers = async (query) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/users/search?q=${query}`);
      // Filter out current user from search results
      return response.data.data.filter(u => u._id !== user?._id);
    } catch (err) {
      console.error("Error searching users:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Get user by ID
  const getUserById = (userId) => {
    return allUsers.find(user => user._id === userId);
  };
  
  // Get user by username
  const getUserByUsername = (username) => {
    return allUsers.find(user => user.username === username);
  };
  
  // Get random users for suggestions
  const getRandomUsers = (count = 5) => {
    const shuffled = [...allUsers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  // Initial fetch
  useEffect(() => {
    fetchAllUsers();
  }, []);
  
  // Refresh random users periodically
  useEffect(() => {
    if (allUsers.length > 0) {
      const shuffled = [...allUsers].sort(() => 0.5 - Math.random());
      setRandomUsers(shuffled.slice(0, 5));
    }
  }, [allUsers]);
  
  const value = {
    allUsers,
    loading,
    error,
    featuredUsers,
    randomUsers,
    fetchAllUsers,
    searchUsers,
    getUserById,
    getUserByUsername,
    getRandomUsers
  };
  
  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

export default UsersContext; 