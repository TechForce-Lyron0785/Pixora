const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/user.controllers');

// Create new user (register)
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

// Get current user profile
router.get('/me', auth, userController.getCurrentUser);

// Get user by ID
router.get('/:userId', userController.getUser);

// Update user profile
router.patch('/me', auth, userController.updateUser);

// Delete user account
router.delete('/me', auth, userController.deleteUser);

// Change password
router.patch('/me/password', auth, userController.changePassword);

// Follow user
router.post('/:userId/follow', auth, userController.followUser);

// Unfollow user
router.delete('/:userId/follow', auth, userController.unfollowUser);

// Get user followers
router.get('/:userId/followers', userController.getFollowers);

// Get users being followed
router.get('/:userId/following', userController.getFollowing);

// Check if user follows another user
router.get('/:userId/follow/check', auth, userController.checkFollow);

// Get user statistics
router.get('/:userId/stats', userController.getUserStats);

// Search users
router.get('/search/users', userController.searchUsers);

// Get suggested users to follow
router.get('/discover/suggestions', auth, userController.getSuggestedUsers);

module.exports = router;
