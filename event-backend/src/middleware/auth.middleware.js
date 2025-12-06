const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request object
 */

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid token. User not found.'
      });
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('=== Auth Middleware Error ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token. Please login again.',
        error: error.message
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired. Please login again.',
        error: error.message
      });
    }
    if (!process.env.JWT_SECRET) {
      console.error('⚠️ JWT_SECRET is not set in environment variables');
      return res.status(500).json({
        message: 'Server configuration error: JWT_SECRET is not set',
        error: 'JWT_SECRET missing'
      });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({
      message: 'Server error during authentication',
      error: error.message || 'Unknown error'
    });
  }
};

module.exports = {
  authenticateToken
};

