const Like = require('../models/like.model');
const Notification = require('../models/notification.model');

// Create like
exports.createLike = async (req, res) => {
  try {
    const { photoId } = req.body;
    
    const existingLike = await Like.findOne({
      user: req.user._id,
      photo: photoId
    });

    if (existingLike) {
      return res.status(400).json({ message: 'Already liked this photo' });
    }

    const like = new Like({
      user: req.user._id,
      photo: photoId
    });

    await like.save();

    // Create notification for photo owner if it's not their own photo
    const photo = await Photo.findById(photoId);
    if (photo.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        type: 'like',
        user: photo.user,
        sender: req.user._id,
        photo: photoId
      });
    }

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete like
exports.deleteLike = async (req, res) => {
  try {
    const like = await Like.findOneAndDelete({
      user: req.user._id,
      photo: req.params.photoId
    });

    if (!like) {
      return res.status(404).json({ message: 'Like not found' });
    }

    res.json({ message: 'Like removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get likes for a photo
exports.getPhotoLikes = async (req, res) => {
  try {
    const likes = await Like.find({ photo: req.params.photoId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user liked a photo
exports.checkLikeStatus = async (req, res) => {
  try {
    const like = await Like.findOne({
      user: req.user._id,
      photo: req.params.photoId
    });

    res.json({ hasLiked: !!like });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
