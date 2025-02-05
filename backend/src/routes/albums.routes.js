const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const albumController = require('../controllers/album.controllers');

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

module.exports = router;
