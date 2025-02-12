import { Album } from "../models/album.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc Create a new album
 * @route POST /api/albums
 * @access Private
 */
export const createAlbum = asyncHandler(async (req, res) => {
  const { name, description, isPublic } = req.body;

  if (!name) {
    throw new ApiError(400, "Album name is required");
  }

  const album = await Album.create({
    user: req.user._id,
    name,
    description,
    isPublic: isPublic ?? true,
  });

  res.status(201).json(new ApiResponse(201, "Album created successfully", album));
});

/**
 * @desc Get all albums for logged in user
 * @route GET /api/albums
 * @access Private
 */
export const getUserAlbums = asyncHandler(async (req, res) => {
  const albums = await Album.find({ user: req.user._id });

  res.status(200).json(new ApiResponse(200, "User albums fetched successfully", albums));
});

/**
 * @desc Get single album by ID
 * @route GET /api/albums/:albumId
 * @access Private
 */
export const getAlbumById = asyncHandler(async (req, res) => {
  const { albumId } = req.params;

  const album = await Album.findById(albumId).populate("images");

  if (!album) {
    throw new ApiError(404, "Album not found");
  }

  if (album.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to access this album");
  }

  res.status(200).json(new ApiResponse(200, "Album fetched successfully", album));
});

/**
 * @desc Update album
 * @route PATCH /api/albums/:albumId
 * @access Private
 */
export const updateAlbum = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const updates = req.body;

  const album = await Album.findById(albumId);

  if (!album) {
    throw new ApiError(404, "Album not found");
  }

  if (album.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this album");
  }

  Object.assign(album, updates);
  await album.save();

  res.status(200).json(new ApiResponse(200, "Album updated successfully", album));
});

/**
 * @desc Delete album
 * @route DELETE /api/albums/:albumId
 * @access Private
 */
export const deleteAlbum = asyncHandler(async (req, res) => {
  const { albumId } = req.params;

  const album = await Album.findById(albumId);

  if (!album) {
    throw new ApiError(404, "Album not found");
  }

  if (album.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this album");
  }

  await album.deleteOne();

  res.status(200).json(new ApiResponse(200, "Album deleted successfully"));
});
