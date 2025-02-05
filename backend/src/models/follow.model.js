// models/follow.model.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Follow schema definition
const followSchema = new Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model for the follower
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model for the following user
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Unique index to prevent multiple follows between the same pair of users
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Method to create a new follow relationship
followSchema.statics.followUser = async function (followerId, followingId) {
  // Check if the follow relationship already exists
  const existingFollow = await this.findOne({ follower: followerId, following: followingId });
  if (existingFollow) {
    throw new Error('You are already following this user');
  }

  // Create a new follow relationship
  const follow = new this({
    follower: followerId,
    following: followingId,
  });

  return follow.save();
};

// Method to unfollow a user
followSchema.statics.unfollowUser = async function (followerId, followingId) {
  // Remove the follow relationship
  const result = await this.deleteOne({ follower: followerId, following: followingId });
  if (result.deletedCount === 0) {
    throw new Error('You are not following this user');
  }
  return result;
};

// Create the Follow model
const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
