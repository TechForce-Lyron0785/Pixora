// models/album.model.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Album schema definition
const albumSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User who owns the album
      required: true,
    },
    title: {
      type: String,
      required: true, // The title of the album
      trim: true,
      maxlength: 100, // Limiting title length for neatness
    },
    description: {
      type: String,
      default: '', // Optional description for the album
      maxlength: 500, // Limiting description length for consistency
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image', // Reference to the images in the album
      },
    ],
    visibility: {
      type: String,
      enum: ['public', 'private'], // Album visibility (public or private)
      default: 'private', // Default visibility setting
    },
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp for when the album was created
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to add an image to an album
albumSchema.statics.addImageToAlbum = async function (albumId, imageId) {
  const album = await this.findById(albumId);
  if (!album) {
    throw new Error('Album not found');
  }

  album.images.push(imageId);
  return album.save();
};

// Method to remove an image from an album
albumSchema.statics.removeImageFromAlbum = async function (albumId, imageId) {
  const album = await this.findById(albumId);
  if (!album) {
    throw new Error('Album not found');
  }

  album.images = album.images.filter((image) => !image.equals(imageId));
  return album.save();
};

// Method to change the visibility of the album
albumSchema.statics.changeVisibility = async function (albumId, visibility) {
  const album = await this.findById(albumId);
  if (!album) {
    throw new Error('Album not found');
  }

  album.visibility = visibility;
  return album.save();
};

// Method to get all albums for a user
albumSchema.statics.getAlbumsByUser = async function (userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Create the Album model
const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
