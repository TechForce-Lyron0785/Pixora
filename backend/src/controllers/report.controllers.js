import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Report } from "../models/report.model.js";
import { Image } from "../models/image.model.js";

// Create a report
const createReport = asyncHandler(async (req, res) => {
  const { imageId, reason } = req.body;

  const image = await Image.findById(imageId);
  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  // Check if user already reported this image
  const existingReport = await Report.findOne({
    user: req.user._id,
    image: imageId
  });

  if (existingReport) {
    throw new ApiError(400, "You have already reported this image");
  }

  const report = await Report.create({
    user: req.user._id,
    image: imageId,
    reason
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Report created successfully", report));
});

// Get all reports (admin only)
const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate('user', 'username')
    .populate('image')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Reports fetched successfully", reports));
});

// Get reports for a specific image
const getImageReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ image: req.params.imageId })
    .populate('user', 'username')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Image reports fetched successfully", reports));
});

// Delete a report (admin only)
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.reportId);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  await report.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Report deleted successfully"));
});

// Update report status (admin only)
const updateReportStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const report = await Report.findById(req.params.reportId);
  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  report.status = status;
  await report.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Report status updated successfully", report));
});

export {
  createReport,
  getAllReports,
  getImageReports,
  deleteReport,
  updateReportStatus
};
