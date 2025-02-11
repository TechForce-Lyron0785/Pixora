import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import * as reportController from '../controllers/report.controllers.js';

// Create a new report
router.post('/', auth, reportController.createReport);

// Get all reports (admin only)
router.get('/', auth, reportController.getAllReports);

// Get reports submitted by logged in user
router.get('/me', auth, reportController.getUserReports);

// Get single report by ID
router.get('/:reportId', auth, reportController.getReport);

// Update report status (admin only)
router.patch('/:reportId/status', auth, reportController.updateReportStatus);

// Delete a report
router.delete('/:reportId', auth, reportController.deleteReport);

// Get reports statistics (admin only)
router.get('/stats/overview', auth, reportController.getReportStats);

export default router;
