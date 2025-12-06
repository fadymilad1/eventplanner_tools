const userModel = require('../models/user.model');

/**
 * User Controller
 * Handles user-related operations
 */

/**
 * Search users by email
 * GET /api/users/search
 */
const searchUsers = async (req, res) => {
  try {
    const { email, limit } = req.query;

    if (!email || email.trim().length < 2) {
      return res.status(400).json({
        message: 'Email search term must be at least 2 characters long'
      });
    }

    const users = await userModel.searchByEmail(email.trim(), parseInt(limit) || 10);

    res.status(200).json({
      message: 'Users retrieved successfully',
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      message: 'Server error during user search'
    });
  }
};

module.exports = {
  searchUsers
};

