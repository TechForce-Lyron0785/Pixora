const Repost = require('../models/repost.model');
const Image = require('../models/image.model');
const Notification = require('../models/notification.model');

// Create a repost
exports.createRepost = async (req, res) => {
  try {
    const { imageId } = req.params;

    // Check if image exists
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if user already reposted this image
    const existingRepost = await Repost.findOne({
      user: req.user._id,
      image: imageId
    });

    if (existingRepost) {
      return res.status(400).json({ message: 'You have already reposted this image' });
    }

    const repost = new Repost({
      user: req.user._id,
      image: imageId
    });

    await repost.save();

    // Create notification for image owner if it's not their own image
    if (image.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        type: 'repost',
        user: image.user,
        sender: req.user._id,
        image: image._id
      });
    }

    res.status(201).json(repost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a repost
exports.deleteRepost = async (req, res) => {
  try {
    const repost = await Repost.findOne({
      user: req.user._id,
      image: req.params.imageId
    });

    if (!repost) {
      return res.status(404).json({ message: 'Repost not found' });
    }

    await repost.remove();
    res.json({ message: 'Repost removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reposts for an image
exports.getImageReposts = async (req, res) => {
  try {
    const reposts = await Repost.find({ image: req.params.imageId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(reposts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's reposts
exports.getUserReposts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const reposts = await Repost.find({ user: userId })
      .populate('image')
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(reposts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user reposted an image
exports.checkRepostStatus = async (req, res) => {
  try {
    const repost = await Repost.findOne({
      user: req.user._id,
      image: req.params.imageId
    });

    res.json({ hasReposted: !!repost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
