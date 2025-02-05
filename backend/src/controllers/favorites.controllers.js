const User = require('../models/user.model');

// Add to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { photoId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user.favorites.includes(photoId)) {
      user.favorites.push(photoId);
      await user.save();
    }

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const { photoId } = req.body;
    const user = await User.findById(req.user._id);
    
    user.favorites = user.favorites.filter(id => id.toString() !== photoId);
    await user.save();

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
