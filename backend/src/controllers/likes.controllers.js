import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/likes.model.js";
import { Image } from "../models/image.model.js"; // Corrected import statement
import { Notification } from "../models/notification.model.js";

// Create like
const createLike = asyncHandler(async (req, res) => {
  const { photoId } = req.body;
  
  const existingLike = await Like.findOne({
    user: req.user._id,
    photo: photoId
  });

  if (existingLike) {
    throw new ApiError(400, "Already liked this photo");
  }

  const like = new Like({
    user: req.user._id,
    photo: photoId
  });

  await like.save();

  // Create notification for photo owner if it's not their own photo
  const photo = await Photo.findById(photoId);
  if (photo.user.toString() !== req.user._id.toString()) {
    await Notification.create({
      type: 'like',
      user: photo.user,
      sender: req.user._id,
      photo: photoId
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Like created successfully", like));
});

// Delete like
const deleteLike = asyncHandler(async (req, res) => {
  const like = await Like.findOneAndDelete({
    user: req.user._id,
    photo: req.params.photoId
  });

  if (!like) {
    throw new ApiError(404, "Like not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Like removed successfully"));
});

// Get likes for a photo
const getPhotoLikes = asyncHandler(async (req, res) => {
  const likes = await Like.find({ photo: req.params.photoId })
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Likes fetched successfully", likes));
});

// Check if user liked a photo
const checkLikeStatus = asyncHandler(async (req, res) => {
  const like = await Like.findOne({
    user: req.user._id,
    photo: req.params.photoId
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Like status checked successfully", { hasLiked: !!like }));
});

export {
  createLike,
  deleteLike,
  getPhotoLikes,
  checkLikeStatus
};
