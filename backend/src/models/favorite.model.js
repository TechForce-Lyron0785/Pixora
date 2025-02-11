// models/favorites.model.js

import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const { Schema } = mongoose;

// Favorites schema definition
const favoritesSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index to prevent duplicate favorites
favoritesSchema.index({ user: 1, image: 1 }, { unique: true });

/**
 * Toggle favorite status of an image
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} imageId - Image ID
 */
favoritesSchema.statics.toggleFavorite = async function (userId, imageId) {
  const existingFavorite = await this.findOne({ user: userId, image: imageId });

  if (existingFavorite) {
    await existingFavorite.deleteOne();
    await mongoose.model("Image").updateOne(
      { _id: imageId },
      { $inc: { favoritesCount: -1 } }
    );
    return { favorited: false };
  } else {
    await this.create({ user: userId, image: imageId });
    await mongoose.model("Image").updateOne(
      { _id: imageId },
      { $inc: { favoritesCount: 1 } }
    );
    return { favorited: true };
  }
};

/**
 * Get all favorite images of a user with pagination
 * @param {ObjectId} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Limit per page
 */
favoritesSchema.statics.getUserFavorites = async function (userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const favorites = await this.find({ user: userId })
    .populate("image", "title imageUrl isPublic")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments({ user: userId });

  return {
    favorites,
    metadata: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Create the Favorites model
export const Favorite = mongoose.model("Favorite", favoritesSchema);
