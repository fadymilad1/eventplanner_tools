const pool = require('../config/db');

/**
 * Event Model
 * Handles all database operations related to events
 */

/**
 * Create a new event
 * @param {Object} eventData - Event data (title, description, event_date, event_time, location, organizer_id)
 * @returns {Promise<Object>} Created event object
 */
async function createEvent(eventData) {
  try {
    const { title, description, event_date, event_time, location, organizer_id } = eventData;
    
    // Log the data being inserted for debugging
    console.log('Creating event with data:', {
      title,
      description: description || null,
      event_date,
      event_time,
      location,
      organizer_id
    });
    
    const result = await pool.query(
      `INSERT INTO events (title, description, event_date, event_time, location, organizer_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description || null, event_date, event_time, location, organizer_id]
    );
    return result.rows[0];
  } catch (error) {
    // Enhanced error logging
    console.error('=== Event Model createEvent Error ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error detail:', error.detail);
    console.error('Error constraint:', error.constraint);
    console.error('Event data:', eventData);
    throw error;
  }
}

/**
 * Find event by ID
 * @param {number} eventId - Event ID
 * @returns {Promise<Object|null>} Event object or null
 */
async function findById(eventId) {
  try {
    const result = await pool.query(
      `SELECT e.*, u.email as organizer_email
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1`,
      [eventId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Find all events organized by a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of event objects
 */
async function findByOrganizer(userId) {
  try {
    const result = await pool.query(
      `SELECT e.*, u.email as organizer_email, 'organizer' as user_role
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.organizer_id = $1
       ORDER BY e.event_date DESC, e.event_time DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('=== findByOrganizer Error ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error detail:', error.detail);
    console.error('UserId:', userId);
    throw error;
  }
}

/**
 * Find all events a user is invited to
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of event objects
 */
async function findInvitedEvents(userId) {
  try {
    const result = await pool.query(
      `SELECT e.*, u.email as organizer_email, ei.role as invitation_role, 
              ei.status as invitation_status, 'attendee' as user_role
       FROM events e
       JOIN event_invitations ei ON e.id = ei.event_id
       JOIN users u ON e.organizer_id = u.id
       WHERE ei.invitee_id = $1
       ORDER BY e.event_date DESC, e.event_time DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('=== findInvitedEvents Error ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error detail:', error.detail);
    console.error('UserId:', userId);
    throw error;
  }
}

/**
 * Delete an event
 * @param {number} eventId - Event ID
 * @param {number} organizerId - Organizer ID (for authorization)
 * @returns {Promise<boolean>} True if deleted, false otherwise
 */
async function deleteEvent(eventId, organizerId) {
  try {
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 AND organizer_id = $2 RETURNING id',
      [eventId, organizerId]
    );
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
}

/**
 * Search events with filters
 * @param {Object} filters - Search filters (keyword, startDate, endDate, userId, role)
 * @returns {Promise<Array>} Array of event objects
 */
async function searchEvents(filters) {
  try {
    const { keyword, startDate, endDate, userId, role } = filters;
    const params = [];
    let paramCount = 0;
    let userIdParamIndex = null;

    // Build the base query
    let query = `SELECT DISTINCT e.*, u.email as organizer_email`;

    // Add user_role if userId is provided
    if (userId) {
      paramCount++;
      userIdParamIndex = paramCount;
      query += `,
        CASE 
          WHEN e.organizer_id = $${paramCount} THEN 'organizer'
          WHEN EXISTS (
            SELECT 1 FROM event_invitations ei
            WHERE ei.event_id = e.id AND ei.invitee_id = $${paramCount}
          ) THEN 'attendee'
          ELSE NULL
        END as user_role
      `;
      params.push(userId);
    }

    query += `
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      WHERE 1=1
    `;

    // Keyword search (title or description)
    if (keyword) {
      paramCount++;
      query += ` AND (e.title ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`;
      params.push(`%${keyword}%`);
    }

    // Date range filter
    if (startDate) {
      paramCount++;
      query += ` AND e.event_date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND e.event_date <= $${paramCount}`;
      params.push(endDate);
    }

    // User and role filter
    if (userId && role && userIdParamIndex) {
      if (role === 'organizer') {
        query += ` AND e.organizer_id = $${userIdParamIndex}`;
      } else if (role === 'attendee') {
        query += ` AND EXISTS (
          SELECT 1 FROM event_invitations ei
          WHERE ei.event_id = e.id AND ei.invitee_id = $${userIdParamIndex}
        )`;
      }
    }

    query += ` ORDER BY e.event_date DESC, e.event_time DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Update an event
 * @param {number} eventId - Event ID
 * @param {number} organizerId - Organizer ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object|null>} Updated event object or null
 */
async function updateEvent(eventId, organizerId, eventData) {
  try {
    const { title, description, event_date, event_time, location } = eventData;
    const fields = [];
    const values = [];
    let paramCount = 0;

    if (title !== undefined) {
      paramCount++;
      fields.push(`title = $${paramCount}`);
      values.push(title);
    }
    if (description !== undefined) {
      paramCount++;
      fields.push(`description = $${paramCount}`);
      values.push(description);
    }
    if (event_date !== undefined) {
      paramCount++;
      fields.push(`event_date = $${paramCount}`);
      values.push(event_date);
    }
    if (event_time !== undefined) {
      paramCount++;
      fields.push(`event_time = $${paramCount}`);
      values.push(event_time);
    }
    if (location !== undefined) {
      paramCount++;
      fields.push(`location = $${paramCount}`);
      values.push(location);
    }

    if (fields.length === 0) {
      return await findById(eventId);
    }

    paramCount++;
    values.push(eventId);
    paramCount++;
    values.push(organizerId);

    const result = await pool.query(
      `UPDATE events SET ${fields.join(', ')} WHERE id = $${paramCount - 1} AND organizer_id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createEvent,
  findById,
  findByOrganizer,
  findInvitedEvents,
  deleteEvent,
  searchEvents,
  updateEvent
};

