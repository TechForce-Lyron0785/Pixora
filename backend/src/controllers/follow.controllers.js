const Follow = require('../models/follow.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingFollow = await Follow.findOne({
      follower: req.user._id,
      following: userId
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    const follow = new Follow({
      follower: req.user._id,
      following: userId
    });

    await follow.save();

    // Create notification for the followed user
    await Notification.create({
      type: 'follow',
      user: userId,
      sender: req.user._id
    });

    res.status(201).json({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const follow = await Follow.findOneAndDelete({
      follower: req.user._id,
      following: userId
    });

    if (!follow) {
      return res.status(404).json({ message: 'Follow relationship not found' });
    }

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get followers of a user
exports.getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    const followers = await Follow.find({ following: userId })
      .populate('follower', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get users that a user is following
exports.getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    const following = await Follow.find({ follower: userId })
      .populate('following', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user is following another user
exports.checkFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const follow = await Follow.findOne({
      follower: req.user._id,
      following: userId
    });

    res.json({ isFollowing: !!follow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
