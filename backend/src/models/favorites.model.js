// models/favorites.model.js

const mongoose = require('mongoose');
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
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp for when the image was favorited
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
  const favorite = await this.deleteOne({ user: userId, image: imageId });
  
  if (favorite.deletedCount === 0) {
    throw new Error('This image is not in your favorites.');
  }

  return favorite;
};

// Create the Favorites model
const Favorite = mongoose.model('Favorite', favoritesSchema);

module.exports = Favorite;
