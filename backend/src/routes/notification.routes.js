const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notification.controllers');

// Get all notifications for logged in user
router.get('/', auth, notificationController.getNotifications);

// Mark notification as read
router.patch('/:notificationId/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/read-all', auth, notificationController.markAllAsRead);

// Delete a notification
router.delete('/:notificationId', auth, notificationController.deleteNotification);

// Delete all notifications
router.delete('/', auth, notificationController.deleteAllNotifications);

// Get unread notification count
router.get('/unread/count', auth, notificationController.getUnreadCount);

module.exports = router;
