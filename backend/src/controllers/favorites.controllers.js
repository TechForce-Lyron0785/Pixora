import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

// Add to favorites
const addToFavorites = asyncHandler(async (req, res) => {
  const { photoId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  if (!user.favorites.includes(photoId)) {
    user.favorites.push(photoId);
    await user.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Photo added to favorites successfully", user.favorites));
});

// Remove from favorites
const removeFromFavorites = asyncHandler(async (req, res) => {
  const { photoId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  user.favorites = user.favorites.filter(id => id.toString() !== photoId);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Photo removed from favorites successfully", user.favorites));
});

// Get user's favorites
const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('favorites');

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Favorites fetched successfully", user.favorites));
});

export {
  addToFavorites,
  removeFromFavorites,
  getFavorites
};
