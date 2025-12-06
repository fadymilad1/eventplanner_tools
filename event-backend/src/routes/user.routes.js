const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * User Routes
 * All routes require authentication
 */

/**
 * @route   GET /api/users/search
 * @desc    Search users by email
 * @access  Private
 */
router.get('/search',
  authenticateToken,
  userController.searchUsers
);

module.exports = router;

