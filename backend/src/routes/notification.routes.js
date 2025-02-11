import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import * as notificationController from '../controllers/notification.controllers.js';

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

export default router;
