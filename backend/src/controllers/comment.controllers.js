import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";

// Create new comment
const createComment = asyncHandler(async (req, res) => {
  const { content, photoId } = req.body;
  
  const comment = await Comment.create({
    content,
    photo: photoId,
    user: req.user._id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Comment created successfully", comment));
});

// Get comments for a photo
const getPhotoComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ photo: req.params.photoId })
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 });
  
  return res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully", comments));
});

// Update comment
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if user owns the comment
  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to modify this comment");
  }

  comment.content = content;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment updated successfully", comment));
});

// Delete comment
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if user owns the comment
  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this comment");
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully"));
});

// Like/Unlike comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const userLikedIndex = comment.likes.indexOf(req.user._id);
  
  if (userLikedIndex === -1) {
    // Like comment
    comment.likes.push(req.user._id);
  } else {
    // Unlike comment
    comment.likes.splice(userLikedIndex, 1);
  }

  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment like toggled successfully", comment));
});

export {
  createComment,
  getPhotoComments,
  updateComment,
  deleteComment,
  toggleCommentLike
};
