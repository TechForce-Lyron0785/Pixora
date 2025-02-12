import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { User } from './user.model.js'; // Assuming you want to reference the User model

const { Schema } = mongoose;

// Album schema definition
const albumSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User who created the album
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Album name is required'], // Album name is mandatory
      maxlength: [100, 'Album name cannot exceed 100 characters'], // Limiting album name length
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Album description cannot exceed 500 characters'], // Limiting album description length
      trim: true,
    },
    images: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image', // Reference to the Image model
    }],
    isPublic: {
      type: Boolean,
      default: true, // Whether the album is public or private
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to create a new album
albumSchema.statics.createAlbum = async function (userId, albumData) {
  const album = new this({ user: userId, ...albumData });
  await album.save();
  return album;
};

// Create the Album model
export const Album = mongoose.model('Album', albumSchema);
