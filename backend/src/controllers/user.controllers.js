import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register new user
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email }, { username }] 
  });

  if (existingUser) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    password
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    }));
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check password
  const isValidPassword = await user.isValidPassword(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Login successful", {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    }));
});

// Get user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('albums');

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile fetched successfully", user));
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const updates = {
    bio: req.body.bio,
    socialLinks: req.body.socialLinks
  };

  // If username is being updated
  if (req.body.username) {
    const existingUser = await User.findOne({ 
      username: req.body.username,
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      throw new ApiError(400, "Username already taken");
    }
    updates.username = req.body.username;
  }

  // If password is being updated
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(req.body.password, salt);
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully", user));
});

// Get user notifications
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('sender', 'username profilePicture')
    .populate('image', 'url title');

  return res
    .status(200)
    .json(new ApiResponse(200, "Notifications fetched successfully", notifications));
});

// Mark notification as read
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.notificationId,
      user: req.user._id
    },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Notification marked as read", notification));
});

// Delete user account
const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete user's images, comments, likes, etc.
  await Image.deleteMany({ user: req.user._id });
  await Comment.deleteMany({ user: req.user._id });
  await Follow.deleteMany({ 
    $or: [
      { follower: req.user._id },
      { following: req.user._id }
    ]
  });
  await Notification.deleteMany({ 
    $or: [
      { user: req.user._id },
      { sender: req.user._id }
    ]
  });

  // Finally delete the user
  await user.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Account deleted successfully"));
});

// Save search
const saveSearch = asyncHandler(async (req, res) => {
  const { searchTerm } = req.body;
  const user = await User.findById(req.user._id);
  
  await user.saveSearch(searchTerm);
  
  return res
    .status(200)
    .json(new ApiResponse(200, "Search saved successfully", user.savedSearches));
});

// Remove saved search
const removeSavedSearch = asyncHandler(async (req, res) => {
  const { searchTerm } = req.body;
  const user = await User.findById(req.user._id);
  
  await user.removeSavedSearch(searchTerm);
  
  return res
    .status(200)
    .json(new ApiResponse(200, "Search removed successfully", user.savedSearches));
});

// Get user's saved searches
const getSavedSearches = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  return res
    .status(200)
    .json(new ApiResponse(200, "Saved searches fetched successfully", user.savedSearches));
});

export {
  register,
  login,
  getProfile,
  updateProfile,
  getNotifications,
  markNotificationAsRead,
  deleteAccount,
  saveSearch,
  removeSavedSearch,
  getSavedSearches
};
