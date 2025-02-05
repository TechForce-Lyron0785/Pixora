// models/comment.model.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Comment schema definition
const commentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User who posted the comment
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image', // Reference to the Image on which the comment is made
      required: true,
    },
    text: {
      type: String,
      required: true, // Comment text content
      maxlength: 500, // Limiting comment length to 500 characters
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment', // For threaded replies (parent comment reference)
    },
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp when the comment is created
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Timestamp when the comment is updated
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to create a new comment
commentSchema.statics.createComment = async function (userId, imageId, text, parentCommentId = null) {
  const newComment = new this({
    user: userId,
    image: imageId,
    text,
    parentComment: parentCommentId,
  });

  // Increment the comment count on the image
  const image = await mongoose.model('Image').findById(imageId);
  image.commentsCount += 1;
  await image.save();

  return newComment.save();
};

// Method to update an existing comment
commentSchema.statics.updateComment = async function (commentId, newText) {
  const comment = await this.findByIdAndUpdate(commentId, { text: newText, updatedAt: Date.now() }, { new: true });
  if (!comment) {
    throw new Error('Comment not found');
  }
  return comment;
};

// Method to delete a comment
commentSchema.statics.deleteComment = async function (commentId) {
  const comment = await this.findById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  // Decrement the comment count on the image
  const image = await mongoose.model('Image').findById(comment.image);
  image.commentsCount -= 1;
  await image.save();

  return this.deleteOne({ _id: commentId });
};

// Create the Comment model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
