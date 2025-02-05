// models/tag.model.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tag schema definition
const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Tags should be unique (case-insensitive)
      trim: true, // Removes extra spaces around tag names
      lowercase: true, // Stores tags in lowercase to maintain consistency
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image', // Reference to the Image model
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp for when the tag was created
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to add a tag to an image
tagSchema.statics.addTagToImage = async function (tagName, imageId) {
  const tag = await this.findOne({ name: tagName });

  if (!tag) {
    // If the tag does not exist, create a new tag
    const newTag = new this({ name: tagName, images: [imageId] });
    return newTag.save();
  }

  // If the tag exists, add the image to the tag's images array
  if (!tag.images.includes(imageId)) {
    tag.images.push(imageId);
    await tag.save();
  }

  return tag;
};

// Method to remove a tag from an image
tagSchema.statics.removeTagFromImage = async function (tagName, imageId) {
  const tag = await this.findOne({ name: tagName });

  if (!tag) {
    throw new Error('Tag not found');
  }

  // Remove the image from the tag's images array
  tag.images = tag.images.filter((image) => !image.equals(imageId));
  await tag.save();

  return tag;
};

// Method to get images by tag
tagSchema.statics.getImagesByTag = async function (tagName) {
  const tag = await this.findOne({ name: tagName }).populate('images');

  if (!tag) {
    throw new Error('Tag not found');
  }

  return tag.images;
};

// Create the Tag model
const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
