const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const followController = require('../controllers/follow.controllers');

// Follow a user
router.post('/:userId', auth, followController.followUser);

// Unfollow a user
router.delete('/:userId', auth, followController.unfollowUser);

// Get followers of a user
router.get('/:userId/followers', followController.getFollowers);

// Get users that a user is following
router.get('/:userId/following', followController.getFollowing);

// Check if user is following another user
router.get('/:userId/check', auth, followController.checkFollowing);

module.exports = router;
