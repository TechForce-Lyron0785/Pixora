// models/notification.model.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define notification types
const notificationTypes = [
  'like',       // When someone likes a user's image
  'comment',    // When someone comments on a user's image
  'follow',     // When someone follows a user
  'repost',     // When someone reposts a user's image
  'message',    // When a user receives a message
  'report',     // When a user's image is reported
  'tag',        // When a user is tagged in an image
  'saved-search', // When a saved search returns new results
];

// Notification schema definition
const notificationSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // The user receiving the notification
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The user who triggered the notification
    },
    type: {
      type: String,
      enum: notificationTypes,
      required: true, // The type of notification (like, comment, follow, etc.)
    },
    content: {
      type: String, // The content/description of the notification
      required: true,
    },
    read: {
      type: Boolean,
      default: false, // A flag indicating if the notification has been read
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image', // Reference to the image related to the notification (if any)
    },
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp for when the notification was created
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to mark notifications as read
notificationSchema.statics.markAsRead = async function (notificationId) {
  const notification = await this.findByIdAndUpdate(notificationId, { read: true }, { new: true });
  if (!notification) {
    throw new Error('Notification not found');
  }
  return notification;
};

// Method to fetch unread notifications for a user
notificationSchema.statics.getUnreadNotifications = async function (userId) {
  return this.find({ user: userId, read: false }).sort({ createdAt: -1 });
};

// Method to create a notification
notificationSchema.statics.createNotification = async function (userId, senderId, type, content, imageId = null) {
  const notification = new this({
    user: userId,
    sender: senderId,
    type,
    content,
    image: imageId,
  });

  return notification.save();
};

// Create the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

export {Notification};
