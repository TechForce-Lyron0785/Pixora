import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Image } from "../models/image.model.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { Notification } from "../models/notification.model.js";

// Upload image
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  // Upload to cloudinary
  const result = await cloudinary.uploader.upload(req.file.path);

  // Create new image document
  const image = await Image.create({
    user: req.user._id,
    url: result.secure_url,
    cloudinaryId: result.public_id,
    caption: req.body.caption,
    location: req.body.location
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Image uploaded successfully", image));
});

// Get all images
const getAllImages = asyncHandler(async (req, res) => {
  const images = await Image.find()
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Images fetched successfully", images));
});

// Get single image
const getImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.imageId)
    .populate('user', 'username profilePicture')
    .populate('comments');
  
  if (!image) {
    throw new ApiError(404, "Image not found");
  }
  
  return res
    .status(200)
    .json(new ApiResponse(200, "Image fetched successfully", image));
});

// Update image
const updateImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.imageId);
  
  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  // Check if user owns the image
  if (image.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this image");
  }

  const updatedImage = await Image.findByIdAndUpdate(
    req.params.imageId,
    {
      caption: req.body.caption,
      location: req.body.location
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Image updated successfully", updatedImage));
});

// Delete image
const deleteImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.imageId);
  
  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  // Check if user owns the image
  if (image.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this image");
  }

  // Delete from cloudinary
  await cloudinary.uploader.destroy(image.cloudinaryId);
  
  // Delete image document
  await image.deleteOne();
  
  return res
    .status(200)
    .json(new ApiResponse(200, "Image deleted successfully", null));
});

// Like/Unlike image
const toggleImageLike = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.imageId);

  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  const userLikedIndex = image.likes.indexOf(req.user._id);
  
  if (userLikedIndex === -1) {
    // Like image
    image.likes.push(req.user._id);
    
    // Create notification for image owner if it's not their own image
    if (image.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        type: 'like',
        user: image.user,
        sender: req.user._id,
        image: image._id
      });
    }
  } else {
    // Unlike image
    image.likes.splice(userLikedIndex, 1);
  }

  await image.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Image like toggled successfully", image));
});

// Get user's images
const getUserImages = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;
  const images = await Image.find({ user: userId })
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 });
  
  return res
    .status(200)
    .json(new ApiResponse(200, "User images fetched successfully", images));
});

export {
  uploadImage,
  getAllImages,
  getImage,
  updateImage,
  deleteImage,
  toggleImageLike,
  getUserImages
};
