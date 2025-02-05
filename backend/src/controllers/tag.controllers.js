const Tag = require('../models/tag.model');
const Image = require('../models/image.model');

// Create a tag
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if tag already exists
    const existingTag = await Tag.findOne({ name: name.toLowerCase() });
    if (existingTag) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    const tag = new Tag({
      name: name.toLowerCase()
    });

    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tag by ID
exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.tagId);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tag
exports.updateTag = async (req, res) => {
  try {
    const { name } = req.body;
    
    const tag = await Tag.findById(req.params.tagId);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Check if new name already exists
    if (name && name !== tag.name) {
      const existingTag = await Tag.findOne({ name: name.toLowerCase() });
      if (existingTag) {
        return res.status(400).json({ message: 'Tag name already exists' });
      }
      tag.name = name.toLowerCase();
    }

    await tag.save();
    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete tag
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.tagId);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Remove tag from all images that use it
    await Image.updateMany(
      { tags: tag._id },
      { $pull: { tags: tag._id } }
    );

    await tag.remove();
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search tags
exports.searchTags = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const tags = await Tag.find({
      name: { $regex: searchQuery, $options: 'i' }
    }).limit(10);

    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get images by tag
exports.getImagesByTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.tagId);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    const images = await Image.find({ tags: tag._id })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
