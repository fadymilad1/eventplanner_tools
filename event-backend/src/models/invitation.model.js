const pool = require('../config/db');

/**
 * Invitation Model
 * Handles all database operations related to event invitations
 */

/**
 * Create a new invitation
 * @param {Object} invitationData - Invitation data (event_id, inviter_id, invitee_id, role)
 * @returns {Promise<Object>} Created invitation object
 */
async function createInvitation(invitationData) {
  try {
    const { event_id, inviter_id, invitee_id, role } = invitationData;
    const result = await pool.query(
      `INSERT INTO event_invitations (event_id, inviter_id, invitee_id, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (event_id, invitee_id) DO UPDATE
       SET role = EXCLUDED.role, status = 'pending', updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [event_id, inviter_id, invitee_id, role || 'attendee']
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Find invitation by event and invitee
 * @param {number} eventId - Event ID
 * @param {number} inviteeId - Invitee ID
 * @returns {Promise<Object|null>} Invitation object or null
 */
async function findByEventAndInvitee(eventId, inviteeId) {
  try {
    const result = await pool.query(
      `SELECT ei.*, u.email as invitee_email
       FROM event_invitations ei
       JOIN users u ON ei.invitee_id = u.id
       WHERE ei.event_id = $1 AND ei.invitee_id = $2`,
      [eventId, inviteeId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Find all invitations for an event
 * @param {number} eventId - Event ID
 * @returns {Promise<Array>} Array of invitation objects
 */
async function findByEvent(eventId) {
  try {
    const result = await pool.query(
      `SELECT ei.*, u.email as invitee_email
       FROM event_invitations ei
       JOIN users u ON ei.invitee_id = u.id
       WHERE ei.event_id = $1
       ORDER BY ei.created_at DESC`,
      [eventId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Find all invitations for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of invitation objects
 */
async function findByInvitee(userId) {
  try {
    const result = await pool.query(
      `SELECT ei.*, e.title as event_title, e.event_date, e.event_time, e.location,
              u.email as inviter_email
       FROM event_invitations ei
       JOIN events e ON ei.event_id = e.id
       JOIN users u ON ei.inviter_id = u.id
       WHERE ei.invitee_id = $1
       ORDER BY ei.created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Update invitation status
 * @param {number} eventId - Event ID
 * @param {number} inviteeId - Invitee ID
 * @param {string} status - New status (accepted, declined)
 * @returns {Promise<Object|null>} Updated invitation object or null
 */
async function updateInvitationStatus(eventId, inviteeId, status) {
  try {
    const result = await pool.query(
      `UPDATE event_invitations
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE event_id = $2 AND invitee_id = $3
       RETURNING *`,
      [status, eventId, inviteeId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete an invitation
 * @param {number} eventId - Event ID
 * @param {number} inviteeId - Invitee ID
 * @param {number} organizerId - Organizer ID (for authorization)
 * @returns {Promise<boolean>} True if deleted, false otherwise
 */
async function deleteInvitation(eventId, inviteeId, organizerId) {
  try {
    const result = await pool.query(
      `DELETE FROM event_invitations
       WHERE event_id = $1 AND invitee_id = $2
       AND EXISTS (SELECT 1 FROM events WHERE id = $1 AND organizer_id = $3)
       RETURNING id`,
      [eventId, inviteeId, organizerId]
    );
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createInvitation,
  findByEventAndInvitee,
  findByEvent,
  findByInvitee,
  updateInvitationStatus,
  deleteInvitation
};

