// models/likes.model.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

// Likes schema definition
const likeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model who liked the image
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image', // Reference to the Image model that is liked
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to add a like to an image
likeSchema.statics.addLike = async function (userId, imageId) {
  const existingLike = await this.findOne({ user: userId, image: imageId });
  
  // Prevent the user from liking the same image multiple times
  if (existingLike) {
    throw new Error('You have already liked this image.');
  }

  const like = new this({
    user: userId,
    image: imageId,
  });

  // Increment the likes count on the image
  const image = await mongoose.model('Image').findById(imageId);
  if (image) {
    image.likesCount = (image.likesCount || 0) + 1; // Ensure likesCount is initialized
    await image.save();
  }

  return like.save();
};

// Method to remove a like from an image
likeSchema.statics.removeLike = async function (userId, imageId) {
  const like = await this.deleteOne({ user: userId, image: imageId });
  
  if (like.deletedCount === 0) {
    throw new Error('You have not liked this image.');
  }

  // Decrement the likes count on the image
  const image = await mongoose.model('Image').findById(imageId);
  if (image) {
    image.likesCount = (image.likesCount || 0) - 1; // Ensure likesCount is initialized
    await image.save();
  }

  return like;
};

// Create the Likes model
const Like = mongoose.model('Like', likeSchema);

export { Like };
