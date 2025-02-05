import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Album } from "../models/album.model.js";

// Create new album
const createAlbum = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const album = await Album.create({
    name,
    description,
    user: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Album created successfully", album));
});

// Get all albums for a user
const getUserAlbums = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;

  const albums = await Album.find({ user: userId })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Albums fetched successfully", albums));
});

// Get single album
const getAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.albumId);
  
  if (!album) {
    throw new ApiError(404, "Album not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Album fetched successfully", album));
});

// Update album
const updateAlbum = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  
  const album = await Album.findById(req.params.albumId);
  
  if (!album) {
    throw new ApiError(404, "Album not found");
  }

  // Check if user owns the album
  if (album.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this album");
  }

  album.name = name || album.name;
  album.description = description || album.description;

  await album.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Album updated successfully", album));
});

// Delete album
const deleteAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.albumId);
  
  if (!album) {
    throw new ApiError(404, "Album not found");
  }

  // Check if user owns the album
  if (album.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this album");
  }

  await album.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Album deleted successfully", null));
});

// Add photo to album
const addPhotoToAlbum = asyncHandler(async (req, res) => {
  const { photoId } = req.body;
  const album = await Album.findById(req.params.albumId);
  
  if (!album) {
    throw new ApiError(404, "Album not found");
  }

  // Check if user owns the album
  if (album.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to modify this album");
  }

  if (!album.photos.includes(photoId)) {
    album.photos.push(photoId);
    await album.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Photo added to album successfully", album));
});

// Remove photo from album
const removePhotoFromAlbum = asyncHandler(async (req, res) => {
  const { photoId } = req.body;
  const album = await Album.findById(req.params.albumId);
  
  if (!album) {
    throw new ApiError(404, "Album not found");
  }

  // Check if user owns the album
  if (album.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to modify this album");
  }

  album.photos = album.photos.filter(id => id.toString() !== photoId);
  await album.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Photo removed from album successfully", album));
});

export {
  createAlbum,
  getUserAlbums,
  getAlbum,
  updateAlbum,
  deleteAlbum,
  addPhotoToAlbum,
  removePhotoFromAlbum
};
