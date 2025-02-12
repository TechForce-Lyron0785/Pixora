import { Like } from "../models/like.model.js";
import { Image } from "../models/image.model.js";
import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc Toggle image like status
 * @route POST /api/likes/:imageId/toggle
 * @access Private
 */
export const toggleLike = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user._id;

  // Check if image exists
  const image = await Image.findById(imageId);
  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  const result = await Like.toggleLike(userId, imageId);

  // Send notification if image was liked
  if (result.liked) {
    await Notification.createNotification({
      recipient: image.user,
      sender: userId,
      type: 'like',
      content: 'liked your image',
      relatedImage: imageId
    });
  }

  res.status(200).json(
    new ApiResponse(200, `Like status updated`, result)
  );
});

/**
 * @desc Get user's liked images
 * @route GET /api/likes
 * @access Private
 */
export const getLikes = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await Like.getUserLikes(req.user._id, page, limit);

  res.status(200).json(
    new ApiResponse(
      200,
      "Likes fetched successfully",
      result.likes,
      result.metadata
    )
  );
});

/**
 * @desc Check if image is liked by user
 * @route GET /api/likes/:imageId/check
 * @access Private
 */
export const checkLike = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user._id;

  const like = await Like.findOne({ user: userId, image: imageId });

  res.status(200).json(
    new ApiResponse(200, "Like status checked", { isLiked: !!like })
  );
});
