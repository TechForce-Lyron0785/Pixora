import { Image } from "../models/image.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc Upload a new image
 * @route POST /api/images
 * @access Private
 */
export const uploadImage = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, tags, isPublic, albumId } = req.body;

  if (!title || !description || !imageUrl) {
    throw new ApiError(400, "Title, description and image URL are required");
  }

  const image = await Image.create({
    user: req.user._id,
    title,
    description,
    imageUrl,
    tags: tags || [],
    isPublic: isPublic ?? true,
    album: albumId
  });

  res.status(201).json(
    new ApiResponse(201, "Image uploaded successfully", image)
  );
});

/**
 * @desc Get image by ID
 * @route GET /api/images/:imageId
 * @access Public
 */
export const getImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;

  const image = await Image.findById(imageId)
    .populate("user", "username profilePicture")
    .populate("album", "name");

  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  // Check if private image is accessible by user
  if (!image.isPublic && (!req.user || image.user._id.toString() !== req.user._id.toString())) {
    throw new ApiError(403, "Access denied to private image");
  }

  res.status(200).json(
    new ApiResponse(200, "Image fetched successfully", image)
  );
});

/**
 * @desc Get all public images with pagination
 * @route GET /api/images/public
 * @access Public
 */
export const getAllImages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const images = await Image.find({ isPublic: true })
    .populate("user", "username profilePicture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Image.countDocuments({ isPublic: true });

  const metadata = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };

  res.status(200).json(
    new ApiResponse(200, "Images fetched successfully", images, metadata)
  );
});

/**
 * @desc Get logged in user's images
 * @route GET /api/images/me
 * @access Private
 */
export const getUserImages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const images = await Image.find({ user: req.user._id })
    .populate("album", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Image.countDocuments({ user: req.user._id });

  const metadata = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };

  res.status(200).json(
    new ApiResponse(200, "User images fetched successfully", images, metadata)
  );
});

/**
 * @desc Get user's public images
 * @route GET /api/images/user/:userId
 * @access Public
 */
export const getUserPublicImages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const images = await Image.find({ 
    user: userId,
    isPublic: true 
  })
    .populate("user", "username profilePicture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Image.countDocuments({ 
    user: userId,
    isPublic: true 
  });

  const metadata = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };

  res.status(200).json(
    new ApiResponse(200, "User public images fetched successfully", images, metadata)
  );
});

/**
 * @desc Update image
 * @route PATCH /api/images/:imageId
 * @access Private
 */
export const updateImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const updates = req.body;

  const image = await Image.findById(imageId);

  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  if (image.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this image");
  }

  Object.assign(image, updates);
  await image.save();

  res.status(200).json(
    new ApiResponse(200, "Image updated successfully", image)
  );
});

/**
 * @desc Delete image
 * @route DELETE /api/images/:imageId
 * @access Private
 */
export const deleteImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;

  const image = await Image.findById(imageId);

  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  if (image.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this image");
  }

  await image.deleteOne();

  res.status(200).json(
    new ApiResponse(200, "Image deleted successfully")
  );
});

/**
 * @desc Search images
 * @route GET /api/images/search/query
 * @access Public
 */
export const searchImages = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!q) {
    throw new ApiError(400, "Search query is required");
  }

  const searchQuery = {
    isPublic: true,
    $or: [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { tags: { $in: [new RegExp(q, "i")] } }
    ]
  };

  const images = await Image.find(searchQuery)
    .populate("user", "username profilePicture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Image.countDocuments(searchQuery);

  const metadata = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };

  res.status(200).json(
    new ApiResponse(200, "Search results fetched successfully", images, metadata)
  );
});

/**
 * @desc Get trending images
 * @route GET /api/images/discover/trending
 * @access Public
 */
export const getTrendingImages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const images = await Image.find({ isPublic: true })
    .populate("user", "username profilePicture")
    .sort({ 
      likesCount: -1,
      commentsCount: -1,
      favoritesCount: -1,
      createdAt: -1 
    })
    .skip(skip)
    .limit(limit);

  const total = await Image.countDocuments({ isPublic: true });

  const metadata = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };

  res.status(200).json(
    new ApiResponse(200, "Trending images fetched successfully", images, metadata)
  );
});

/**
 * @desc Get images by tag
 * @route GET /api/images/tags/:tag
 * @access Public
 */
export const getImagesByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const images = await Image.find({ 
    tags: { $in: [tag.toLowerCase()] },
    isPublic: true 
  })
    .populate("user", "username profilePicture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Image.countDocuments({ 
    tags: { $in: [tag.toLowerCase()] },
    isPublic: true 
  });

  const metadata = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };

  res.status(200).json(
    new ApiResponse(200, "Images by tag fetched successfully", images, metadata)
  );
});
