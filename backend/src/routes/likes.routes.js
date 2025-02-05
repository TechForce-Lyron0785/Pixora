const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const likeController = require('../controllers/like.controllers');

// Get all likes for a user
router.get('/user/:userId', likeController.getUserLikes);

// Get users who liked an item
router.get('/:type/:id', likeController.getLikes);

// Check if user liked an item
router.get('/:type/:id/check', auth, likeController.checkLike);

// Like an item
router.post('/:type/:id', auth, likeController.addLike);

// Unlike an item
router.delete('/:type/:id', auth, likeController.removeLike);

module.exports = router;
