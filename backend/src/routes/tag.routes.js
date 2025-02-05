const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tagController = require('../controllers/tag.controllers');

// Create a new tag
router.post('/', auth, tagController.createTag);

// Get all tags
router.get('/', tagController.getAllTags);

// Get single tag by ID
router.get('/:tagId', tagController.getTag);

// Get posts by tag
router.get('/:tagId/posts', tagController.getPostsByTag);

// Update tag
router.patch('/:tagId', auth, tagController.updateTag);

// Delete tag
router.delete('/:tagId', auth, tagController.deleteTag);

// Get trending tags
router.get('/discover/trending', tagController.getTrendingTags);

// Get tag suggestions based on search term
router.get('/search/suggestions', tagController.getTagSuggestions);

// Get tag statistics
router.get('/stats/overview', auth, tagController.getTagStats);

module.exports = router;
