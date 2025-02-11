// models/like.model.js

import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const { Schema } = mongoose;

// Likes schema definition
const likeSchema = new Schema(
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

// Unique index to prevent duplicate likes
likeSchema.index({ user: 1, image: 1 }, { unique: true });

/**
 * Toggle like status on an image
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} imageId - Image ID
 */
likeSchema.statics.toggleLike = async function (userId, imageId) {
  const existingLike = await this.findOne({ user: userId, image: imageId });

  if (existingLike) {
    await existingLike.deleteOne();
    await mongoose.model("Image").updateOne(
      { _id: imageId },
      { $inc: { likesCount: -1 } }
    );
    return { liked: false };
  } else {
    await this.create({ user: userId, image: imageId });
    await mongoose.model("Image").updateOne(
      { _id: imageId },
      { $inc: { likesCount: 1 } }
    );
    return { liked: true };
  }
};

/**
 * Get all liked images of a user with pagination
 * @param {ObjectId} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Limit per page
 */
likeSchema.statics.getUserLikes = async function (userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const likes = await this.find({ user: userId })
    .populate("image", "title imageUrl isPublic")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments({ user: userId });

  return {
    likes,
    metadata: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Create the Likes model
export const Like = mongoose.model("Like", likeSchema);
