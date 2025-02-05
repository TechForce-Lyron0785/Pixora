import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const { Schema } = mongoose;

// User schema definition
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
      lowercase: true, // Store username in lowercase
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Store email in lowercase
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      type: String, // URL or file path of the profile picture
      default: 'default-profile.jpg', // Default profile picture
    },
    bio: {
      type: String,
      maxlength: 160, // Maximum length for user bio
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      },
    ],
    savedSearches: [
      {
        type: String, // A saved search term
      },
    ],
    socialLinks: {
      instagram: {
        type: String,
        match: /^https?:\/\/(www\.)?instagram\.com\/[\w\-\.]+\/?$/,
      },
      twitter: {
        type: String,
        match: /^https?:\/\/(www\.)?twitter\.com\/[\w\-\.]+\/?$/,
      },
      facebook: {
        type: String,
        match: /^https?:\/\/(www\.)?facebook\.com\/[\w\-\.]+\/?$/,
      },
      linkedin: {
        type: String,
        match: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-\.]+\/?$/,
      },
      tiktok: {
        type: String,
        match: /^https?:\/\/(www\.)?tiktok\.com\/@[\w\-\.]+\/?$/,
      },
      youtube: {
        type: String,
        match: /^https?:\/\/(www\.)?youtube\.com\/channel\/[\w\-\.]+\/?$/,
      },
      // Additional social media links can be added
    },
    isActive: {
      type: Boolean,
      default: true, // User is active by default
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    albums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album', // Reference to Album model
      },
    ],
    lastLogin: {
      type: Date,
      default: null, // Stores last login timestamp
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Hash the user's password before saving the user document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    // Salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method for authentication
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to update the user's profile picture
userSchema.methods.updateProfilePicture = function (imageURL) {
  this.profilePicture = imageURL;
  return this.save();
};

// Method to add/remove followers
userSchema.methods.followUser = function (userId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId);
    return this.save();
  }
  return this;
};

userSchema.methods.unfollowUser = function (userId) {
  this.following = this.following.filter(followingId => followingId.toString() !== userId.toString());
  return this.save();
};

// Create a method to add a saved search
userSchema.methods.saveSearch = function (searchTerm) {
  if (!this.savedSearches.includes(searchTerm)) {
    this.savedSearches.push(searchTerm);
    return this.save();
  }
  return this;
};

// Create a method to remove a saved search
userSchema.methods.removeSavedSearch = function (searchTerm) {
  this.savedSearches = this.savedSearches.filter(term => term !== searchTerm);
  return this.save();
};

// Create the User model
const User = mongoose.model('User', userSchema);

export { User };