const Image = require('../models/image.model');
const cloudinary = require('../config/cloudinaryConfig');
const Notification = require('../models/notification.model');

// Upload image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new image document
    const image = new Image({
      user: req.user._id,
      url: result.secure_url,
      cloudinaryId: result.public_id,
      caption: req.body.caption,
      location: req.body.location
    });

    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all images
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find()
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single image
exports.getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.imageId)
      .populate('user', 'username profilePicture')
      .populate('comments');
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update image
exports.updateImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.imageId);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if user owns the image
    if (image.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this image' });
    }

    const updatedImage = await Image.findByIdAndUpdate(
      req.params.imageId,
      {
        caption: req.body.caption,
        location: req.body.location
      },
      { new: true }
    );

    res.json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.imageId);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if user owns the image
    if (image.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this image' });
    }

    // Delete from cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);
    
    // Delete image document
    await image.remove();
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike image
exports.toggleImageLike = async (req, res) => {
  try {
    const image = await Image.findById(req.params.imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const userLikedIndex = image.likes.indexOf(req.user._id);
    
    if (userLikedIndex === -1) {
      // Like image
      image.likes.push(req.user._id);
      
      // Create notification for image owner if it's not their own image
      if (image.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          type: 'like',
          user: image.user,
          sender: req.user._id,
          image: image._id
        });
      }
    } else {
      // Unlike image
      image.likes.splice(userLikedIndex, 1);
    }

    await image.save();
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's images
exports.getUserImages = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const images = await Image.find({ user: userId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

