const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const invitationController = require('../controllers/invitation.controller');
const attendanceController = require('../controllers/attendance.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  validateEventCreation,
  validateEventUpdate,
  validateEventSearch,
  validateInvitation,
  validateAttendance,
  handleValidationErrors
} = require('../validators/event.validator');

/**
 * Event Routes
 * All routes require authentication
 */

// Search events (must be before /:id route)
router.get('/search',
  authenticateToken,
  validateEventSearch,
  handleValidationErrors,
  eventController.searchEvents
);

// Get organized events
router.get('/organized',
  authenticateToken,
  eventController.getOrganizedEvents
);

// Get invited events
router.get('/invited',
  authenticateToken,
  eventController.getInvitedEvents
);

// Create event
router.post('/',
  authenticateToken,
  validateEventCreation,
  handleValidationErrors,
  eventController.createEvent
);

// Get event by ID
router.get('/:id',
  authenticateToken,
  eventController.getEventById
);

// Update event
router.put('/:id',
  authenticateToken,
  validateEventUpdate,
  handleValidationErrors,
  eventController.updateEvent
);

// Delete event
router.delete('/:id',
  authenticateToken,
  eventController.deleteEvent
);

// Invitation routes
router.post('/:eventId/invitations',
  authenticateToken,
  validateInvitation,
  handleValidationErrors,
  invitationController.inviteUser
);

router.get('/:eventId/invitations',
  authenticateToken,
  invitationController.getEventInvitations
);

router.delete('/:eventId/invitations/:inviteeId',
  authenticateToken,
  invitationController.deleteInvitation
);

// Attendance routes
router.post('/:eventId/attendance',
  authenticateToken,
  validateAttendance,
  handleValidationErrors,
  attendanceController.setAttendance
);

router.get('/:eventId/attendance',
  authenticateToken,
  attendanceController.getEventAttendance
);

router.get('/:eventId/attendance/me',
  authenticateToken,
  attendanceController.getMyAttendance
);

module.exports = router;

