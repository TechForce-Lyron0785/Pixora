import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tag } from "../models/tag.model.js";
import { Image } from "../models/image.model.js";

// Create a tag
const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Check if tag already exists
  const existingTag = await Tag.findOne({ name: name.toLowerCase() });
  if (existingTag) {
    throw new ApiError(400, "Tag already exists");
  }

  const tag = await Tag.create({
    name: name.toLowerCase()
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Tag created successfully", tag));
});

// Get all tags
const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().sort({ name: 1 });
  
  return res
    .status(200)
    .json(new ApiResponse(200, "Tags fetched successfully", tags));
});

// Get tag by ID
const getTagById = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.tagId);
  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tag fetched successfully", tag));
});

// Update tag
const updateTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  
  const tag = await Tag.findById(req.params.tagId);
  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }

  // Check if new name already exists
  if (name && name !== tag.name) {
    const existingTag = await Tag.findOne({ name: name.toLowerCase() });
    if (existingTag) {
      throw new ApiError(400, "Tag name already exists");
    }
    tag.name = name.toLowerCase();
  }

  await tag.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Tag updated successfully", tag));
});

// Delete tag
const deleteTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.tagId);
  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }

  // Remove tag from all images that use it
  await Image.updateMany(
    { tags: tag._id },
    { $pull: { tags: tag._id } }
  );

  await tag.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Tag deleted successfully"));
});

// Search tags
const searchTags = asyncHandler(async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    throw new ApiError(400, "Search query is required");
  }

  const tags = await Tag.find({
    name: { $regex: searchQuery, $options: 'i' }
  }).limit(10);

  return res
    .status(200)
    .json(new ApiResponse(200, "Tags searched successfully", tags));
});

// Get images by tag
const getImagesByTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.tagId);
  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }

  const images = await Image.find({ tags: tag._id })
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Images fetched successfully", images));
});

export {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
  searchTags,
  getImagesByTag
};
