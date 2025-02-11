import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
      trim: true,
      lowercase: true, // Store email in lowercase
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      type: String, // URL or file path of the profile picture
      default: "default-profile.jpg", // Default profile picture
    },
    bio: {
      type: String,
      maxlength: 160, // Maximum length for user bio
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
    savedSearches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SavedSearch", // Reference to the SavedSearch model
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
        ref: "Album", // Reference to Album model
      },
    ],
    lastLogin: {
      type: Date,
      default: null, // Stores last login timestamp
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Hash the user's password before saving the user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Create the User model
export const User = mongoose.model("User", userSchema);