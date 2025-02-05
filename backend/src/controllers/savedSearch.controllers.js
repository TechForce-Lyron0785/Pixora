const SavedSearch = require('../models/savedSearch.model');

// Create a saved search
exports.createSavedSearch = async (req, res) => {
  try {
    const { name, searchQuery } = req.body;

    // Check if user already has a saved search with this name
    const existingSearch = await SavedSearch.findOne({
      user: req.user._id,
      name
    });

    if (existingSearch) {
      return res.status(400).json({ message: 'You already have a saved search with this name' });
    }

    const savedSearch = new SavedSearch({
      user: req.user._id,
      name,
      searchQuery
    });

    await savedSearch.save();
    res.status(201).json(savedSearch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's saved searches
exports.getUserSavedSearches = async (req, res) => {
  try {
    const savedSearches = await SavedSearch.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(savedSearches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific saved search
exports.getSavedSearch = async (req, res) => {
  try {
    const savedSearch = await SavedSearch.findById(req.params.savedSearchId);
    
    if (!savedSearch) {
      return res.status(404).json({ message: 'Saved search not found' });
    }

    // Check if saved search belongs to user
    if (savedSearch.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this saved search' });
    }

    res.json(savedSearch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a saved search
exports.updateSavedSearch = async (req, res) => {
  try {
    const { name, searchQuery } = req.body;
    
    const savedSearch = await SavedSearch.findById(req.params.savedSearchId);
    if (!savedSearch) {
      return res.status(404).json({ message: 'Saved search not found' });
    }

    // Check if saved search belongs to user
    if (savedSearch.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this saved search' });
    }

    savedSearch.name = name || savedSearch.name;
    savedSearch.searchQuery = searchQuery || savedSearch.searchQuery;
    await savedSearch.save();

    res.json(savedSearch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a saved search
exports.deleteSavedSearch = async (req, res) => {
  try {
    const savedSearch = await SavedSearch.findById(req.params.savedSearchId);

    if (!savedSearch) {
      return res.status(404).json({ message: 'Saved search not found' });
    }

    // Check if saved search belongs to user
    if (savedSearch.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this saved search' });
    }

    await savedSearch.remove();
    res.json({ message: 'Saved search deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
