// models/image.model.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Image schema definition
const imageSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model, the uploader of the image
      required: true,
    },
    title: {
      type: String,
      maxlength: 100, // Maximum length for the image title
    },
    description: {
      type: String,
      maxlength: 500, // Maximum length for the image description
    },
    imageUrl: {
      type: String,
      required: true, // The URL to the image file (uploaded to cloud storage, etc.)
    },
    imageType: {
      type: String,
      enum: ['jpeg', 'png', 'gif', 'bmp', 'webp'], // Allowable image formats
      required: true,
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ], // Tags associated with the image, for search and categorization
    likesCount: {
      type: Number,
      default: 0, // Initial like count for the image
    },
    commentsCount: {
      type: Number,
      default: 0, // Initial comment count for the image
    },
    repostCount: {
      type: Number,
      default: 0, // Initial repost count for the image
    },
    isPublic: {
      type: Boolean,
      default: true, // Whether the image is public or private
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album', // If the image is associated with an album, link to the Album model
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Users who have saved this image as a favorite
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp for when the image was uploaded
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Timestamp for when the image was last updated
    },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

// Method to increment likes count
imageSchema.methods.incrementLikes = function () {
  this.likesCount += 1;
  return this.save();
};

// Method to decrement likes count
imageSchema.methods.decrementLikes = function () {
  if (this.likesCount > 0) {
    this.likesCount -= 1;
  }
  return this.save();
};

// Method to increment repost count
imageSchema.methods.incrementReposts = function () {
  this.repostCount += 1;
  return this.save();
};

// Method to add a tag to the image
imageSchema.methods.addTag = function (tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
  return this.save();
};

// Method to remove a tag from the image
imageSchema.methods.removeTag = function (tag) {
  this.tags = this.tags.filter(existingTag => existingTag !== tag);
  return this.save();
};

// Method to add a user to the savedBy array (favorites)
imageSchema.methods.addToFavorites = function (userId) {
  if (!this.savedBy.includes(userId)) {
    this.savedBy.push(userId);
    return this.save();
  }
  return this;
};

// Method to remove a user from the savedBy array (unfavorite)
imageSchema.methods.removeFromFavorites = function (userId) {
  this.savedBy = this.savedBy.filter(user => user.toString() !== userId.toString());
  return this.save();
};

// Create the Image model
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
