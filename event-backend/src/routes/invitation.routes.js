const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitation.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * Invitation Routes
 * All routes require authentication
 */

// Get all invitations for current user
router.get('/',
  authenticateToken,
  invitationController.getUserInvitations
);

// Update invitation status (accept/decline)
router.put('/:eventId',
  authenticateToken,
  invitationController.updateInvitationStatus
);

module.exports = router;

