const Report = require('../models/report.model');
const Image = require('../models/image.model');

// Create a report
exports.createReport = async (req, res) => {
  try {
    const { imageId, reason } = req.body;

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if user already reported this image
    const existingReport = await Report.findOne({
      user: req.user._id,
      image: imageId
    });

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this image' });
    }

    const report = new Report({
      user: req.user._id,
      image: imageId,
      reason
    });

    await report.save();

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reports (admin only)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('user', 'username')
      .populate('image')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reports for a specific image
exports.getImageReports = async (req, res) => {
  try {
    const reports = await Report.find({ image: req.params.imageId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a report (admin only)
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.remove();
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update report status (admin only)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
