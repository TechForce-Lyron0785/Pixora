import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import rateLimit from "express-rate-limit";

// list of controllers
// 1. registerUser
// 2. loginUser
// 3. getLoggedInUser
// 4. getUserProfile
// 5. updateUserProfile
// 6. updateUserPassword
// 7. getAllUsers
// 8. searchUsers

// Rate limiter (limits requests to 5 per minute per IP)
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: new ApiError(429, "Too many login attempts. Please try again later."),
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter (limits requests to 3 per minute per IP)
export const registerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Lower limit for registration attempts
  message: new ApiError(429, "Too many registration attempts. Please try again later."),
  standardHeaders: true,
  legacyHeaders: false,
});

// Utility function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/** 
 * @desc Register a new user
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = [registerLimiter, asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "Username or Email already taken.");
  }

  const newUser = new User({ username, email, password });
  await newUser.save();

  const token = generateToken(newUser._id);

  res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

  res.status(201).json(new ApiResponse(201, "User registered successfully", {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    profilePicture: newUser.profilePicture,
    token,
  }));
})];

/** 
 * @desc Login user
 * @route POST /api/users/login
 * @access Public (Rate limited)
 */
export const loginUser = [loginLimiter, asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  });
  
  if (!user) throw new ApiError(401, "Invalid credentials.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials.");

  const token = generateToken(user._id);

  res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

  res.status(200).json(new ApiResponse(200, "Login successful", {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    token,
  }));
})];

/** 
 * @desc Get logged-in user profile
 * @route GET /api/users/me
 * @access Public
 */
export const getLoggedInUser = asyncHandler(async (req, res) => {
  const userData = req.user;
  res.status(200).json(new ApiResponse(200, "User profile fetched", userData));
});

/** 
 * @desc Get user profile
 * @route GET /api/users/:identifier
 * @access Public
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  }).select("-password -email");

  if (!user) throw new ApiError(404, "User not found.");

  res.status(200).json(new ApiResponse(200, "User profile fetched", user));
});

/** 
 * @desc Update user profile
 * @route PATCH /api/users/:userId
 * @access Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  if (req.user._id.toString() !== userId) {
    throw new ApiError(403, "Unauthorized to update this profile.");
  }

  const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select("-password");
  if (!user) throw new ApiError(404, "User not found.");

  res.status(200).json(new ApiResponse(200, "User profile updated", user));
});

/** 
 * @desc Update user password
 * @route PATCH /api/users/:userId/password
 * @access Private
 */
export const updateUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (req.user._id.toString() !== userId) {
    throw new ApiError(403, "Unauthorized to update this password.");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found.");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new ApiError(400, "Old password is incorrect.");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json(new ApiResponse(200, "Password updated successfully"));
});

/** 
 * @desc Get all users
 * @route GET /api/users
 * @access Public
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -email");
  res.status(200).json(new ApiResponse(200, "All Users fetched", users));
});

/** 
 * @desc Search users
 * @route GET /api/users/search
 * @access Public
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) throw new ApiError(400, "Search query is required.");

  const users = await User.find({ username: { $regex: query, $options: "i" } })
    .select("_id username profilePicture");

  res.status(200).json(new ApiResponse(200, "Users fetched", users));
});
