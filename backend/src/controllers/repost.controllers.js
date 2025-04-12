import { Repost } from "../models/repost.model.js";
import { Image } from "../models/image.model.js";
import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateInteractionPoints } from "../utils/userUpdates.js";

/**
 * @desc Create a repost
 * @route POST /api/reposts
 * @access Private
 */
export const createRepost = asyncHandler(async (req, res) => {
  const { imageId, caption } = req.body;

  // Check if image exists
  const image = await Image.findById(imageId);
  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  // Check if user has already reposted this image
  const existingRepost = await Repost.findOne({
    user: req.user._id,
    image: imageId
  });

  if (existingRepost) {
    throw new ApiError(409, "You have already reposted this image");
  }

  const repost = await Repost.create({
    user: req.user._id,
    image: imageId,
    caption
  });

  await repost.populate("user", "username profilePicture");
  await repost.populate("image");
  
  // Update interaction points for reposting
  await updateInteractionPoints(req.user._id, 'repost');

  // Send notification to image owner
  await Notification.createNotification({
    recipient: image.user,
    sender: req.user._id,
    type: 'repost',
    content: 'reposted your image',
    relatedImage: imageId
  });

  res.status(201).json(
    new ApiResponse(201, "Image reposted successfully", repost)
  );
});

/**
 * @desc Get repost by ID
 * @route GET /api/reposts/:repostId
 * @access Public
 */
export const getRepost = asyncHandler(async (req, res) => {
  const { repostId } = req.params;

  const repost = await Repost.findById(repostId)
    .populate("user", "username profilePicture")
    .populate("image");

  if (!repost) {
    throw new ApiError(404, "Repost not found");
  }

  res.status(200).json(
    new ApiResponse(200, "Repost fetched successfully", repost)
  );
});

/**
 * @desc Get all reposts by a user
 * @route GET /api/reposts/user/:userId
 * @access Public
 */
export const getUserReposts = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reposts = await Repost.find({ user: userId })
    .populate("user", "username profilePicture")
    .populate("image")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Repost.countDocuments({ user: userId });

  const metadata = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };

  res.status(200).json(
    new ApiResponse(200, "User reposts fetched successfully", reposts, metadata)
  );
});

/**
 * @desc Get all reposts of an image
 * @route GET /api/reposts/image/:imageId
 * @access Public
 */
export const getImageReposts = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reposts = await Repost.find({ image: imageId })
    .populate("user", "username profilePicture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Repost.countDocuments({ image: imageId });

  const metadata = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };

  res.status(200).json(
    new ApiResponse(200, "Image reposts fetched successfully", reposts, metadata)
  );
});

/**
 * @desc Update repost caption
 * @route PATCH /api/reposts/:repostId
 * @access Private
 */
export const updateRepost = asyncHandler(async (req, res) => {
  const { repostId } = req.params;
  const { caption } = req.body;

  const repost = await Repost.findById(repostId);

  if (!repost) {
    throw new ApiError(404, "Repost not found");
  }

  if (repost.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this repost");
  }

  repost.caption = caption;
  await repost.save();

  await repost.populate("user", "username profilePicture");
  await repost.populate("image");

  res.status(200).json(
    new ApiResponse(200, "Repost updated successfully", repost)
  );
});

/**
 * @desc Delete repost
 * @route DELETE /api/reposts/:repostId
 * @access Private
 */
export const deleteRepost = asyncHandler(async (req, res) => {
  const { repostId } = req.params;

  const repost = await Repost.findById(repostId);

  if (!repost) {
    throw new ApiError(404, "Repost not found");
  }

  if (repost.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this repost");
  }

  await repost.deleteOne();

  res.status(200).json(
    new ApiResponse(200, "Repost deleted successfully")
  );
});
