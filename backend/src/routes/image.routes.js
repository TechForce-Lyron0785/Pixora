import express from 'express';
const router = express.Router();
import * as imageController from '../controllers/image.controllers.js';
import upload from '../middleware/upload.js';
import auth from '../middleware/auth.js';

// Upload a new image
router.post('/', auth, upload.single('image'), imageController.uploadImage);

// Get all images (with pagination)
router.get('/', imageController.getAllImages);

// Get images for logged in user
router.get('/me', auth, imageController.getUserImages);

// Get images for specific user
router.get('/user/:userId', imageController.getUserPublicImages);

// Get single image by ID
router.get('/:imageId', imageController.getImage);

// Update image details
router.patch('/:imageId', auth, imageController.updateImage);

// Delete image
router.delete('/:imageId', auth, imageController.deleteImage);

// Like an image
router.post('/:imageId/like', auth, imageController.likeImage);

// Unlike an image
router.delete('/:imageId/like', auth, imageController.unlikeImage);

// Get likes for an image
router.get('/:imageId/likes', imageController.getImageLikes);

// Get trending images
router.get('/discover/trending', imageController.getTrendingImages);

// Search images
router.get('/search/query', imageController.searchImages);

export default router;
