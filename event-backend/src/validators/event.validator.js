const { body, query, validationResult } = require('express-validator');

/**
 * Event Validation Rules
 */

const validateEventCreation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('event_date')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Event date must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        throw new Error('Event date cannot be in the past');
      }
      return true;
    }),
  body('event_time')
    .notEmpty().withMessage('Event time is required')
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Event time must be in HH:MM format (24-hour)'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ min: 3, max: 255 }).withMessage('Location must be between 3 and 255 characters')
];

const validateEventUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('event_date')
    .optional()
    .isISO8601().withMessage('Event date must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      if (value) {
        const eventDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (eventDate < today) {
          throw new Error('Event date cannot be in the past');
        }
      }
      return true;
    }),
  body('event_time')
    .optional()
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Event time must be in HH:MM format (24-hour)'),
  body('location')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Location must be between 3 and 255 characters')
];

const validateEventSearch = [
  query('keyword')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Keyword must be less than 255 characters'),
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid date (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (value && req.query.startDate) {
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(value);
        if (endDate < startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    }),
  query('role')
    .optional()
    .isIn(['organizer', 'attendee']).withMessage('Role must be either "organizer" or "attendee"')
];

const validateInvitation = [
  body('invitee_id')
    .notEmpty().withMessage('Invitee ID is required')
    .isInt({ min: 1 }).withMessage('Invitee ID must be a positive integer'),
  body('role')
    .optional()
    .isIn(['organizer', 'attendee']).withMessage('Role must be either "organizer" or "attendee"')
];

const validateAttendance = [
  body('status')
    .notEmpty().withMessage('Attendance status is required')
    .isIn(['going', 'maybe', 'not_going']).withMessage('Status must be one of: going, maybe, not_going')
];

/**
 * Validation Result Handler
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateEventCreation,
  validateEventUpdate,
  validateEventSearch,
  validateInvitation,
  validateAttendance,
  handleValidationErrors
};

