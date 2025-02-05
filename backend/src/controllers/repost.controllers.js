import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Repost } from "../models/repost.model.js";
import { Image } from "../models/image.model.js";
import { Notification } from "../models/notification.model.js";

// Create a repost
const createRepost = asyncHandler(async (req, res) => {
  const { imageId } = req.params;

  const image = await Image.findById(imageId);
  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  // Check if user already reposted this image
  const existingRepost = await Repost.findOne({
    user: req.user._id,
    image: imageId
  });

  if (existingRepost) {
    throw new ApiError(400, "You have already reposted this image");
  }

  const repost = await Repost.create({
    user: req.user._id,
    image: imageId
  });

  // Create notification for image owner if it's not their own image
  if (image.user.toString() !== req.user._id.toString()) {
    await Notification.create({
      type: 'repost',
      user: image.user,
      sender: req.user._id,
      image: image._id
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Repost created successfully", repost));
});

// Delete a repost
const deleteRepost = asyncHandler(async (req, res) => {
  const repost = await Repost.findOne({
    user: req.user._id,
    image: req.params.imageId
  });

  if (!repost) {
    throw new ApiError(404, "Repost not found");
  }

  await repost.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Repost removed successfully"));
});

// Get reposts for an image
const getImageReposts = asyncHandler(async (req, res) => {
  const reposts = await Repost.find({ image: req.params.imageId })
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Reposts fetched successfully", reposts));
});

// Get user's reposts
const getUserReposts = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;
  const reposts = await Repost.find({ user: userId })
    .populate('image')
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "User reposts fetched successfully", reposts));
});

// Check if user reposted an image
const checkRepostStatus = asyncHandler(async (req, res) => {
  const repost = await Repost.findOne({
    user: req.user._id,
    image: req.params.imageId
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Repost status checked successfully", { hasReposted: !!repost }));
});

export {
  createRepost,
  deleteRepost,
  getImageReposts,
  getUserReposts,
  checkRepostStatus
};
