import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import * as albumController from '../controllers/albums.controllers.js';

// Create album
router.post('/', auth, albumController.createAlbum);

// Get all albums for logged in user
router.get('/', auth, albumController.getUserAlbums);

// Get single album by ID
router.get('/:albumId', auth, albumController.getAlbumById);

// Update album
router.patch('/:albumId', auth, albumController.updateAlbum);

// Delete album
router.delete('/:albumId', auth, albumController.deleteAlbum);

// Add image to album
router.post('/:albumId/images/:imageId', auth, albumController.addImageToAlbum);

// Remove image from album
router.delete('/:albumId/images/:imageId', auth, albumController.removeImageFromAlbum);

export default router;
