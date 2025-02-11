import mongoose from 'mongoose';
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
      required: true,
    },
    description: {
      type: String,
      maxlength: 500, // Maximum length for the image description
      required: true,
    },
    imageUrl: {
      type: String,
      required: true, // The URL to the image file (uploaded to cloud storage, etc.)
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
          validator: function (value) {
            return value && value.length > 0;
          },
          message: 'Tags cannot be empty',
        },
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
    favoritesCount: {
      type: Number,
      default: 0, // Initial favorites by count for the image
    },
    isPublic: {
      type: Boolean,
      default: true, // Whether the image is public or private
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album', // If the image is associated with an album, link to the Album model
    },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

export const Image = mongoose.model('Image', imageSchema);