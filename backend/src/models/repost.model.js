// models/repost.model.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Repost schema definition
const repostSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User who reposted the image
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image', // Reference to the Image that was reposted
      required: true,
    },
    message: {
      type: String,
      maxlength: 500, // Optionally, allow the user to add a custom message with the repost
    },
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp for when the image was reposted
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to create a new repost
repostSchema.statics.createRepost = async function (userId, imageId, message = '') {
  // Create a new repost instance
  const repost = new this({
    user: userId,
    image: imageId,
    message,
  });

  // Optionally, you can increment a repost count or add repost reference in the Image model
  const image = await mongoose.model('Image').findById(imageId);
  image.repostsCount += 1; // Increment repost count for the image
  await image.save();

  return repost.save();
};

// Method to remove a repost
repostSchema.statics.removeRepost = async function (userId, imageId) {
  const repost = await this.findOneAndDelete({ user: userId, image: imageId });
  
  if (!repost) {
    throw new Error('Repost not found');
  }

  // Decrement repost count for the image
  const image = await mongoose.model('Image').findById(imageId);
  image.repostsCount -= 1;
  await image.save();

  return repost;
};

// Create the Repost model
const Repost = mongoose.model('Repost', repostSchema);

module.exports = Repost;
