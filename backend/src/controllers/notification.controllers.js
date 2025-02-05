import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.model.js";

// Get user's notifications
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .populate('sender', 'username profilePicture')
    .populate('image', 'imageUrl')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Notifications fetched successfully", notifications));
});

// Mark notification as read
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.notificationId);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  // Check if notification belongs to user
  if (notification.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to modify this notification");
  }

  notification.read = true;
  await notification.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Notification marked as read", notification));
});

// Mark all notifications as read
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "All notifications marked as read"));
});

// Delete notification
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.notificationId);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  // Check if notification belongs to user
  if (notification.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this notification");
  }

  await notification.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Notification deleted successfully"));
});

// Get unread notifications count
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user._id,
    read: false
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Unread count fetched successfully", { count }));
});

export {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
};
