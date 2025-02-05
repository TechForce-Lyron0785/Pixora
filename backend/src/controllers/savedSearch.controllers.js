import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SavedSearch } from "../models/savedSearch.model.js";

// Create a saved search
const createSavedSearch = asyncHandler(async (req, res) => {
  const { name, searchQuery } = req.body;

  // Check if user already has a saved search with this name
  const existingSearch = await SavedSearch.findOne({
    user: req.user._id,
    name
  });

  if (existingSearch) {
    throw new ApiError(400, "You already have a saved search with this name");
  }

  const savedSearch = await SavedSearch.create({
    user: req.user._id,
    name,
    searchQuery
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Saved search created successfully", savedSearch));
});

// Get user's saved searches
const getUserSavedSearches = asyncHandler(async (req, res) => {
  const savedSearches = await SavedSearch.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Saved searches fetched successfully", savedSearches));
});

// Get a specific saved search
const getSavedSearch = asyncHandler(async (req, res) => {
  const savedSearch = await SavedSearch.findById(req.params.savedSearchId);
  
  if (!savedSearch) {
    throw new ApiError(404, "Saved search not found");
  }

  // Check if saved search belongs to user
  if (savedSearch.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to access this saved search");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Saved search fetched successfully", savedSearch));
});

// Update a saved search
const updateSavedSearch = asyncHandler(async (req, res) => {
  const { name, searchQuery } = req.body;
  
  const savedSearch = await SavedSearch.findById(req.params.savedSearchId);
  if (!savedSearch) {
    throw new ApiError(404, "Saved search not found");
  }

  // Check if saved search belongs to user
  if (savedSearch.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this saved search");
  }

  savedSearch.name = name || savedSearch.name;
  savedSearch.searchQuery = searchQuery || savedSearch.searchQuery;
  await savedSearch.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Saved search updated successfully", savedSearch));
});

// Delete a saved search
const deleteSavedSearch = asyncHandler(async (req, res) => {
  const savedSearch = await SavedSearch.findById(req.params.savedSearchId);

  if (!savedSearch) {
    throw new ApiError(404, "Saved search not found");
  }

  // Check if saved search belongs to user
  if (savedSearch.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this saved search");
  }

  await savedSearch.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Saved search deleted successfully"));
});

export {
  createSavedSearch,
  getUserSavedSearches,
  getSavedSearch,
  updateSavedSearch,
  deleteSavedSearch
};
