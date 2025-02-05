const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/comment.controllers');

// Create a comment on an image
router.post('/images/:imageId', auth, commentController.createComment);

// Get comments for an image
router.get('/images/:imageId', commentController.getImageComments);

// Get a specific comment
router.get('/:commentId', commentController.getComment);

// Update a comment
router.patch('/:commentId', auth, commentController.updateComment);

// Delete a comment
router.delete('/:commentId', auth, commentController.deleteComment);

// Like a comment
router.post('/:commentId/like', auth, commentController.likeComment);

// Unlike a comment
router.delete('/:commentId/like', auth, commentController.unlikeComment);

// Get likes for a comment
router.get('/:commentId/likes', commentController.getCommentLikes);

module.exports = router;
