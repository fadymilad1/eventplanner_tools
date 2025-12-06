const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * Attendance Routes
 * All routes require authentication
 */

// Get all events user is attending
router.get('/',
  authenticateToken,
  attendanceController.getMyAttendingEvents
);

module.exports = router;

