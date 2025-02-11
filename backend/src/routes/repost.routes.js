import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import * as repostController from '../controllers/repost.controllers.js';

// Create a repost
router.post('/:type/:id', auth, repostController.createRepost);

// Get all reposts for a post/image
router.get('/:type/:id', repostController.getReposts);

// Get reposts by a specific user
router.get('/user/:userId', repostController.getUserReposts);

// Check if user reposted an item
router.get('/:type/:id/check', auth, repostController.checkRepost);

// Delete a repost
router.delete('/:type/:id', auth, repostController.deleteRepost);

// Get repost count for an item
router.get('/:type/:id/count', repostController.getRepostCount);

export default router;
