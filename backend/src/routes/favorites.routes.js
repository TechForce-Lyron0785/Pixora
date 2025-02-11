import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import * as favoriteController from '../controllers/favorites.controllers.js';

// Add image to favorites
router.post('/images/:imageId', auth, favoriteController.addToFavorites);

// Remove image from favorites 
router.delete('/images/:imageId', auth, favoriteController.removeFromFavorites);

// Get user's favorite images
router.get('/', auth, favoriteController.getFavorites);

// Check if image is favorited
router.get('/images/:imageId', auth, favoriteController.checkFavorite);

export default router;
