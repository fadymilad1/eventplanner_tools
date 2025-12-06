const pool = require('../config/db');

/**
 * Attendance Model
 * Handles all database operations related to event attendance
 */

/**
 * Create or update attendance status
 * @param {Object} attendanceData - Attendance data (event_id, user_id, status)
 * @returns {Promise<Object>} Created or updated attendance object
 */
async function upsertAttendance(attendanceData) {
  try {
    const { event_id, user_id, status } = attendanceData;
    const result = await pool.query(
      `INSERT INTO event_attendance (event_id, user_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (event_id, user_id) DO UPDATE
       SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [event_id, user_id, status]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Find attendance by event and user
 * @param {number} eventId - Event ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} Attendance object or null
 */
async function findByEventAndUser(eventId, userId) {
  try {
    const result = await pool.query(
      `SELECT ea.*, u.email as user_email
       FROM event_attendance ea
       JOIN users u ON ea.user_id = u.id
       WHERE ea.event_id = $1 AND ea.user_id = $2`,
      [eventId, userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Find all attendance for an event
 * @param {number} eventId - Event ID
 * @returns {Promise<Array>} Array of attendance objects
 */
async function findByEvent(eventId) {
  try {
    const result = await pool.query(
      `SELECT ea.*, u.email as user_email
       FROM event_attendance ea
       JOIN users u ON ea.user_id = u.id
       WHERE ea.event_id = $1
       ORDER BY ea.updated_at DESC`,
      [eventId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Find all events a user is attending
 * @param {number} userId - User ID
 * @param {string} status - Filter by status (going, maybe, not_going)
 * @returns {Promise<Array>} Array of attendance objects
 */
async function findByUser(userId, status = null) {
  try {
    let query = `
      SELECT ea.*, e.title as event_title, e.event_date, e.event_time, e.location,
             u.email as user_email
      FROM event_attendance ea
      JOIN events e ON ea.event_id = e.id
      JOIN users u ON ea.user_id = u.id
      WHERE ea.user_id = $1
    `;
    const params = [userId];

    if (status) {
      query += ` AND ea.status = $2`;
      params.push(status);
    }

    query += ` ORDER BY e.event_date DESC, e.event_time DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Get attendance statistics for an event
 * @param {number} eventId - Event ID
 * @returns {Promise<Object>} Attendance statistics
 */
async function getAttendanceStats(eventId) {
  try {
    const result = await pool.query(
      `SELECT 
        status,
        COUNT(*) as count
       FROM event_attendance
       WHERE event_id = $1
       GROUP BY status`,
      [eventId]
    );

    const stats = {
      going: 0,
      maybe: 0,
      not_going: 0,
      pending: 0,
      total: 0
    };

    result.rows.forEach(row => {
      stats[row.status] = parseInt(row.count);
      stats.total += parseInt(row.count);
    });

    return stats;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  upsertAttendance,
  findByEventAndUser,
  findByEvent,
  findByUser,
  getAttendanceStats
};

