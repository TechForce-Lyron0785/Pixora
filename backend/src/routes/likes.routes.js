import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import * as likeController from '../controllers/likes.controllers.js';

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

export default router;
