const invitationModel = require('../models/invitation.model');
const eventModel = require('../models/event.model');
const userModel = require('../models/user.model');

/**
 * Invitation Controller
 * Handles all invitation-related operations
 */

/**
 * Invite a user to an event
 * POST /api/events/:eventId/invitations
 */
const inviteUser = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const { invitee_id, role } = req.body;
    const inviter_id = req.user.id;

    // Check if event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    // Check if user is the organizer
    if (event.organizer_id !== inviter_id) {
      return res.status(403).json({
        message: 'Only the event organizer can invite users'
      });
    }

    // Check if invitee exists
    const invitee = await userModel.findById(invitee_id);
    if (!invitee) {
      return res.status(404).json({
        message: 'Invitee not found'
      });
    }

    // Prevent self-invitation
    if (invitee_id === inviter_id) {
      return res.status(400).json({
        message: 'You cannot invite yourself to an event'
      });
    }

    // Create invitation
    const invitation = await invitationModel.createInvitation({
      event_id: eventId,
      inviter_id,
      invitee_id,
      role: role || 'attendee'
    });

    res.status(201).json({
      message: 'User invited successfully',
      invitation
    });
  } catch (error) {
    console.error('Invite user error:', error);
    if (error.code === '23505') {
      return res.status(400).json({
        message: 'User is already invited to this event'
      });
    }
    res.status(500).json({
      message: 'Server error during invitation'
    });
  }
};

/**
 * Get all invitations for an event
 * GET /api/events/:eventId/invitations
 */
const getEventInvitations = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user.id;

    // Check if event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    // Check if user is the organizer
    if (event.organizer_id !== userId) {
      return res.status(403).json({
        message: 'Only the event organizer can view invitations'
      });
    }

    const invitations = await invitationModel.findByEvent(eventId);

    res.status(200).json({
      message: 'Invitations retrieved successfully',
      invitations,
      count: invitations.length
    });
  } catch (error) {
    console.error('Get event invitations error:', error);
    res.status(500).json({
      message: 'Server error while retrieving invitations'
    });
  }
};

/**
 * Get all invitations for the current user
 * GET /api/invitations
 */
const getUserInvitations = async (req, res) => {
  try {
    const userId = req.user.id;
    const invitations = await invitationModel.findByInvitee(userId);

    res.status(200).json({
      message: 'Invitations retrieved successfully',
      invitations,
      count: invitations.length
    });
  } catch (error) {
    console.error('Get user invitations error:', error);
    res.status(500).json({
      message: 'Server error while retrieving invitations'
    });
  }
};

/**
 * Update invitation status (accept/decline)
 * PUT /api/invitations/:eventId
 */
const updateInvitationStatus = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({
        message: 'Status must be either "accepted" or "declined"'
      });
    }

    // Check if invitation exists
    const invitation = await invitationModel.findByEventAndInvitee(eventId, userId);
    if (!invitation) {
      return res.status(404).json({
        message: 'Invitation not found'
      });
    }

    // Update invitation status
    const updatedInvitation = await invitationModel.updateInvitationStatus(
      eventId,
      userId,
      status
    );

    res.status(200).json({
      message: `Invitation ${status} successfully`,
      invitation: updatedInvitation
    });
  } catch (error) {
    console.error('Update invitation status error:', error);
    res.status(500).json({
      message: 'Server error during invitation status update'
    });
  }
};

/**
 * Delete an invitation
 * DELETE /api/events/:eventId/invitations/:inviteeId
 */
const deleteInvitation = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const inviteeId = parseInt(req.params.inviteeId);
    const organizerId = req.user.id;

    const deleted = await invitationModel.deleteInvitation(
      eventId,
      inviteeId,
      organizerId
    );

    if (!deleted) {
      return res.status(404).json({
        message: 'You are not authorized to delete it'
      });
    }

    res.status(200).json({
      message: 'Invitation deleted successfully'
    });
  } catch (error) {
    console.error('Delete invitation error:', error);
    res.status(500).json({
      message: 'Server error during invitation deletion'
    });
  }
};

module.exports = {
  inviteUser,
  getEventInvitations,
  getUserInvitations,
  updateInvitationStatus,
  deleteInvitation
};

