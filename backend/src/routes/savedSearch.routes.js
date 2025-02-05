const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const savedSearchController = require('../controllers/savedSearch.controllers');

// Create a new saved search
router.post('/', auth, savedSearchController.createSavedSearch);

// Get all saved searches for logged in user
router.get('/', auth, savedSearchController.getUserSavedSearches);

// Get single saved search by ID
router.get('/:savedSearchId', auth, savedSearchController.getSavedSearch);

// Update saved search
router.patch('/:savedSearchId', auth, savedSearchController.updateSavedSearch);

// Delete saved search
router.delete('/:savedSearchId', auth, savedSearchController.deleteSavedSearch);

// Execute saved search
router.get('/:savedSearchId/execute', auth, savedSearchController.executeSavedSearch);

// Get trending saved searches
router.get('/discover/trending', savedSearchController.getTrendingSavedSearches);

module.exports = router;
