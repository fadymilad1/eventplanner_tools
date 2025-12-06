const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * Auth Routes
 * Handles all authentication endpoints
 */

/**
 * @route   GET /api/auth
 * @desc    Get available authentication endpoints
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Authentication endpoints',
    endpoints: {
      register: {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user',
        body: {
          email: 'string (required)',
          password: 'string (required)'
        }
      },
      login: {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Login user and return JWT token',
        body: {
          email: 'string (required)',
          password: 'string (required)'
        }
      }
    }
  });
});

/**
 * @route   GET /api/auth/register
 * @desc    Get registration endpoint information
 * @access  Public
 */
router.get('/register', (req, res) => {
  res.json({
    message: 'Registration endpoint information',
    method: 'POST',
    path: '/api/auth/register',
    description: 'Register a new user',
    requiredBody: {
      email: 'string (required) - User email address',
      password: 'string (required) - User password'
    },
    example: {
      url: 'http://localhost:5000/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        email: 'user@example.com',
        password: 'password123'
      }
    },
    note: 'This endpoint requires a POST request. Use a tool like Postman, curl, or your frontend application to send POST requests.'
  });
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   GET /api/auth/login
 * @desc    Get login endpoint information
 * @access  Public
 */
router.get('/login', (req, res) => {
  res.json({
    message: 'Login endpoint information',
    method: 'POST',
    path: '/api/auth/login',
    description: 'Login user and return JWT token',
    requiredBody: {
      email: 'string (required) - User email address',
      password: 'string (required) - User password'
    },
    example: {
      url: 'http://localhost:5000/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        email: 'user@example.com',
        password: 'password123'
      }
    },
    note: 'This endpoint requires a POST request. Use a tool like Postman, curl, or your frontend application to send POST requests.'
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', authController.login);

module.exports = router;
