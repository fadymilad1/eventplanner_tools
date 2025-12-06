const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

/**
 * Auth Controller
 * Handles authentication logic - register and login
 */

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Check if JWT_SECRET is configured (needed for login, but good to check early)
    if (!process.env.JWT_SECRET) {
      console.error('⚠️ JWT_SECRET is not set in environment variables');
    }

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await userModel.createUser(email, hashedPassword);

    // Return success response (excluding password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    // Enhanced error logging
    console.error('=== Registration Error ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Provide more specific error messages
    if (error.code === '23505') {
      // Unique violation (duplicate email)
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    } else if (error.code === '42P01') {
      // Table doesn't exist
      return res.status(500).json({
        message: 'Database table does not exist. Please run setup.sql to create the database tables.',
        error: error.message
      });
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      // Database connection error
      return res.status(500).json({
        message: 'Database connection failed. Please check your database configuration.',
        error: error.message
      });
    } else if (error.code === '28P01') {
      // Authentication failed
      return res.status(500).json({
        message: 'Database authentication failed. Please check your database credentials.',
        error: error.message
      });
    } else if (error.code === '3D000') {
      // Database doesn't exist
      return res.status(500).json({
        message: 'Database does not exist. Please create the database first.',
        error: error.message
      });
    } else if (error.message && error.message.includes('JWT_SECRET')) {
      // Missing JWT_SECRET (though not used in register, but good to catch)
      return res.status(500).json({
        message: 'Server configuration error: JWT_SECRET is not set in .env file',
        error: error.message
      });
    }
    
    // Generic error with details in development
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message || 'Unknown error occurred',
      code: error.code || 'UNKNOWN',
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        name: error.name
      } : undefined
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response with token
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Provide more specific error messages
    if (error.code === '42P01') {
      // Table doesn't exist
      return res.status(500).json({
        message: 'Database table does not exist. Please run setup.sql to create the database tables.'
      });
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      // Database connection error
      return res.status(500).json({
        message: 'Database connection failed. Please check your database configuration.'
      });
    } else if (error.code === '28P01') {
      // Authentication failed
      return res.status(500).json({
        message: 'Database authentication failed. Please check your database credentials.'
      });
    } else if (error.code === '3D000') {
      // Database doesn't exist
      return res.status(500).json({
        message: 'Database does not exist. Please create the database first.'
      });
    }
    
    // Generic error with details in development
    res.status(500).json({
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login
};
