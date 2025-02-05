const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('albums');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      bio: req.body.bio,
      socialLinks: req.body.socialLinks
    };

    // If username is being updated
    if (req.body.username) {
      const existingUser = await User.findOne({ 
        username: req.body.username,
        _id: { $ne: req.user._id }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      updates.username = req.body.username;
    }

    // If password is being updated
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'username profilePicture')
      .populate('image', 'url title');

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.notificationId,
        user: req.user._id
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's images, comments, likes, etc.
    await Image.deleteMany({ user: req.user._id });
    await Comment.deleteMany({ user: req.user._id });
    await Follow.deleteMany({ 
      $or: [
        { follower: req.user._id },
        { following: req.user._id }
      ]
    });
    await Notification.deleteMany({ 
      $or: [
        { user: req.user._id },
        { sender: req.user._id }
      ]
    });

    // Finally delete the user
    await user.remove();

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save search
exports.saveSearch = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const user = await User.findById(req.user._id);
    
    await user.saveSearch(searchTerm);
    res.json(user.savedSearches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove saved search
exports.removeSavedSearch = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const user = await User.findById(req.user._id);
    
    await user.removeSavedSearch(searchTerm);
    res.json(user.savedSearches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's saved searches
exports.getSavedSearches = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.savedSearches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
