const Album = require('../models/album.model');

// Create new album
exports.createAlbum = async (req, res) => {
  try {
    const { name, description } = req.body;

    const album = new Album({
      name,
      description,
      user: req.user._id
    });

    await album.save();

    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all albums for a user
exports.getUserAlbums = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    const albums = await Album.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single album
exports.getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update album
exports.updateAlbum = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const album = await Album.findById(req.params.albumId);
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Check if user owns the album
    if (album.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this album' });
    }

    album.name = name || album.name;
    album.description = description || album.description;

    await album.save();

    res.json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete album
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Check if user owns the album
    if (album.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this album' });
    }

    await album.remove();

    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add photo to album
exports.addPhotoToAlbum = async (req, res) => {
  try {
    const { photoId } = req.body;
    const album = await Album.findById(req.params.albumId);
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Check if user owns the album
    if (album.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this album' });
    }

    if (!album.photos.includes(photoId)) {
      album.photos.push(photoId);
      await album.save();
    }

    res.json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove photo from album
exports.removePhotoFromAlbum = async (req, res) => {
  try {
    const { photoId } = req.body;
    const album = await Album.findById(req.params.albumId);
    
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Check if user owns the album
    if (album.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this album' });
    }

    album.photos = album.photos.filter(id => id.toString() !== photoId);
    await album.save();

    res.json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
