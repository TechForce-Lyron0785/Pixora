const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const favoriteController = require('../controllers/favorite.controllers');

// Add image to favorites
router.post('/images/:imageId', auth, favoriteController.addToFavorites);

// Remove image from favorites 
router.delete('/images/:imageId', auth, favoriteController.removeFromFavorites);

// Get user's favorite images
router.get('/', auth, favoriteController.getFavorites);

// Check if image is favorited
router.get('/images/:imageId', auth, favoriteController.checkFavorite);

module.exports = router;
