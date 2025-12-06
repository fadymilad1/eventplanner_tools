const pool = require('../config/db');

/**
 * User Model
 * Handles all database operations related to users
 */

/**
 * Create a new user
 * @param {string} email - User email
 * @param {string} hashedPassword - Bcrypt hashed password
 * @returns {Promise<Object>} Created user object
 */
async function createUser(email, hashedPassword) {
  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    );
    return result.rows[0];
  } catch (error) {
    // Log the error for debugging
    console.error('Database error in createUser:', error.code, error.message);
    // Re-throw to let the controller handle it
    throw error;
  }
}

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null
 */
async function findByEmail(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    // Log the error for debugging
    console.error('Database error in findByEmail:', error.code, error.message);
    // Re-throw to let the controller handle it
    throw error;
  }
}

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} User object or null
 */
async function findById(id) {
  try {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Search users by email
 * @param {string} email - Email to search for (partial match)
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of user objects
 */
async function searchByEmail(email, limit = 10) {
  try {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE email ILIKE $1 LIMIT $2',
      [`%${email}%`, limit]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  searchByEmail
};
