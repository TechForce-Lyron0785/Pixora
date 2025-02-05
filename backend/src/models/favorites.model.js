// models/favorites.model.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

// Favorites schema definition
const favoritesSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image', // Reference to the Image model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Method to add an image to a user's favorites
favoritesSchema.statics.addFavorite = async function (userId, imageId) {
  const existingFavorite = await this.findOne({ user: userId, image: imageId });
  
  // Prevent adding the same image as favorite multiple times
  if (existingFavorite) {
    throw new Error('This image is already in your favorites.');
  }

  const favorite = new this({
    user: userId,
    image: imageId,
  });

  return favorite.save();
};

// Method to remove an image from a user's favorites
favoritesSchema.statics.removeFavorite = async function (userId, imageId) {
  const result = await this.deleteOne({ user: userId, image: imageId });
  
  if (result.deletedCount === 0) {
    throw new Error('This image is not in your favorites.');
  }

  return result;
};

// Create the Favorites model
const Favorite = mongoose.model('Favorite', favoritesSchema);

export { Favorite };
