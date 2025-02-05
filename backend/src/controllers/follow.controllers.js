import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

// Follow a user
const followUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  if (userId === req.user._id.toString()) {
    throw new ApiError(400, "Cannot follow yourself");
  }

  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new ApiError(404, "User not found");
  }

  const existingFollow = await Follow.findOne({
    follower: req.user._id,
    following: userId
  });

  if (existingFollow) {
    throw new ApiError(400, "Already following this user");
  }

  const follow = new Follow({
    follower: req.user._id,
    following: userId
  });

  await follow.save();

  // Create notification for the followed user
  await Notification.create({
    type: 'follow',
    user: userId,
    sender: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Successfully followed user", follow));
});

// Unfollow a user
const unfollowUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const follow = await Follow.findOneAndDelete({
    follower: req.user._id,
    following: userId
  });

  if (!follow) {
    throw new ApiError(404, "Follow relationship not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully unfollowed user"));
});

// Get followers of a user
const getFollowers = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;

  const followers = await Follow.find({ following: userId })
    .populate('follower', 'username profilePicture')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Followers fetched successfully", followers));
});

// Get users that a user is following
const getFollowing = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;

  const following = await Follow.find({ follower: userId })
    .populate('following', 'username profilePicture')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Following list fetched successfully", following));
});

// Check if user is following another user
const checkFollowStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const follow = await Follow.findOne({
    follower: req.user._id,
    following: userId
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Follow status checked successfully", { isFollowing: !!follow }));
});

export {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus
};
