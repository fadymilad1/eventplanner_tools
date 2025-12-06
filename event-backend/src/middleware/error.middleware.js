/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // PostgreSQL errors
  if (err.code === '23505') { // Unique violation
    statusCode = 400;
    message = 'Duplicate entry. This record already exists.';
  } else if (err.code === '23503') { // Foreign key violation
    statusCode = 400;
    message = 'Invalid reference. Related record does not exist.';
  } else if (err.code === '23502') { // Not null violation
    statusCode = 400;
    message = 'Required field is missing.';
  } else if (err.code === '42P01') { // Undefined table
    statusCode = 500;
    message = 'Database table does not exist.';
  }

  // Validation errors from express-validator
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    const errors = err.array();
    message = errors.map(e => e.msg).join(', ');
  }

  res.status(statusCode).json({
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.path} not found`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};

