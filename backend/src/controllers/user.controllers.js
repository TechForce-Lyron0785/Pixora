import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getLocationFromIp } from "../utils/ipGeolocation.js";
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
// 9. checkUserAvailability
// 10. getLoginHistory

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
  const { fullName, username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "Username or Email already taken.");
  }

  // Get IP address and user agent
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const device = req.headers['user-agent'] || 'unknown';
  const location = await getLocationFromIp(ip);

  const newUser = new User({ 
    fullName, 
    username, 
    email, 
    password, 
    lastLogin: Date.now(),
    loginHistory: [{
      ip,
      device,
      location,
      timestamp: Date.now()
    }]
  });
  await newUser.save();

  const token = generateToken(newUser._id);

  // Set cookie with an expiration date of 7 days
  res.cookie("token", token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });

  res.status(201).json(new ApiResponse(201, "User registered successfully", {
    _id: newUser._id,
    fullName: newUser.fullName,
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

  // Get IP address and user agent
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const device = req.headers['user-agent'] || 'unknown';
  const location = await getLocationFromIp(ip);

  // Update lastLogin time and add login history entry
  user.lastLogin = Date.now();
  user.loginHistory.push({
    ip,
    device,
    location,
    timestamp: Date.now()
  });
  await user.save();

  const token = generateToken(user._id);

  // Set cookie with an expiration date of 7 days
  res.cookie("token", token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });

  res.status(200).json(new ApiResponse(200, "Login successful", {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    token,
  }));
})];

/** 
 * @desc Login user with Google
 * @route POST /api/users/google-login
 * @access Public
 */
export const googleLoginUser = asyncHandler(async (req, res) => {
  const { email, fullName, username, profilePicture } = req.body;

  // Get IP address and user agent
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const device = req.headers['user-agent'] || 'unknown';
  const location = await getLocationFromIp(ip);

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      email,
      username,
      fullName,
      profilePicture,
      provider: "google",
      isVerified: true,
      lastLogin: Date.now(),
      loginHistory: [{
        ip,
        device,
        location,
        timestamp: Date.now()
      }]
    });
    await user.save();
  } else {
    // Update lastLogin time and add login history entry
    user.lastLogin = Date.now();
    user.loginHistory.push({
      ip,
      device,
      location,
      timestamp: Date.now()
    });
    await user.save();
  }

  const token = generateToken(user._id);

  // Set cookie with an expiration date of 7 days
  res.cookie("token", token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  res.status(200).json(new ApiResponse(200, "User logged in with Google", {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    token,
  }));
});

/** 
 * @desc Logout user
 * @route POST /api/users/logout
 * @access Public
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});

/** 
 * @desc Check if username or email is available
 * @route POST /api/users/check-availability
 * @access Public
 */
export const checkUserAvailability = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  
  // Create query condition based on what was provided
  const query = {};
  if (username) query.username = username;
  if (email) query.email = email;
  
  // If neither username nor email was provided
  if (Object.keys(query).length === 0) {
    throw new ApiError(400, "Username or email is required");
  }
  
  const existingUser = await User.findOne(query);
  
  if (existingUser) {
    const field = existingUser.username === username ? "username" : "email";
    throw new ApiError(409, `This ${field} is already taken.`);
  }
  
  res.status(200).json(new ApiResponse(200, "Username and email are available"));
});

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
  }).select("-password -email -provider -loginHistory -lastLogin");

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

  const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select("-password -provider -loginHistory -lastLogin");
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
  const users = await User.find().select("-password -email -provider -loginHistory -lastLogin");
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
    .select("_id username profilePicture fullName");

  res.status(200).json(new ApiResponse(200, "Users fetched", users));
});

/** 
 * @desc Get user login history
 * @route GET /api/users/login-history
 * @access Private
 */
export const getLoginHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const user = await User.findById(userId).select("loginHistory");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  // Sort login history by timestamp in descending order (newest first)
  const sortedHistory = user.loginHistory.sort((a, b) => b.timestamp - a.timestamp);
  
  res.status(200).json(new ApiResponse(200, "Login history retrieved successfully", sortedHistory));
});