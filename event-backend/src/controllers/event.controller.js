const eventModel = require('../models/event.model');
const invitationModel = require('../models/invitation.model');
const attendanceModel = require('../models/attendance.model');
const userModel = require('../models/user.model');

/**
 * Event Controller
 * Handles all event-related operations
 */

/**
 * Create a new event
 * POST /api/events
 */
const createEvent = async (req, res) => {
  try {
    const { title, description, event_date, event_time, location } = req.body;
    
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Authentication required. Please login first.'
      });
    }
    
    // Validate required fields (additional check)
    const missingFields = [];
    if (!title || !title.trim()) missingFields.push('title');
    if (!event_date || !event_date.trim()) missingFields.push('event_date');
    if (!event_time || !event_time.trim()) missingFields.push('event_time');
    if (!location || !location.trim()) missingFields.push('location');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields,
        received: { 
          title: title || null, 
          event_date: event_date || null, 
          event_time: event_time || null, 
          location: location || null 
        }
      });
    }
    
    const organizer_id = req.user.id;

    const event = await eventModel.createEvent({
      title: title.trim(),
      description: description ? description.trim() : null,
      event_date,
      event_time,
      location: location.trim(),
      organizer_id
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    // Enhanced error logging
    console.error('=== Create Event Error ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    console.error('User:', req.user);
    
    // Provide more specific error messages
    if (error.code === '23503') {
      // Foreign key violation (organizer_id doesn't exist)
      return res.status(400).json({
        message: 'Invalid organizer. User not found.',
        error: error.message
      });
    } else if (error.code === '23502') {
      // Not null violation
      return res.status(400).json({
        message: 'Required field is missing.',
        error: error.message
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
    }
    
    // Generic error with details in development
    res.status(500).json({
      message: 'Server error during event creation',
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
 * Get all events organized by the current user
 * GET /api/events/organized
 */
const getOrganizedEvents = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Authentication required. Please login first.'
      });
    }
    
    const userId = req.user.id;
    const events = await eventModel.findByOrganizer(userId);

    res.status(200).json({
      message: 'Events retrieved successfully',
      events,
      count: events.length
    });
  } catch (error) {
    // Enhanced error logging
    console.error('=== Get Organized Events Error ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('User:', req.user);
    
    // Provide more specific error messages
    if (error.code === '42P01') {
      return res.status(500).json({
        message: 'Database table does not exist. Please run setup.sql to create the database tables.',
        error: error.message
      });
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(500).json({
        message: 'Database connection failed. Please check your database configuration.',
        error: error.message
      });
    } else if (error.code === '28P01') {
      return res.status(500).json({
        message: 'Database authentication failed. Please check your database credentials.',
        error: error.message
      });
    } else if (error.code === '3D000') {
      return res.status(500).json({
        message: 'Database does not exist. Please create the database first.',
        error: error.message
      });
    }
    
    res.status(500).json({
      message: 'Server error while retrieving events',
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
 * Get all events the user is invited to
 * GET /api/events/invited
 */
const getInvitedEvents = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Authentication required. Please login first.'
      });
    }
    
    const userId = req.user.id;
    const events = await eventModel.findInvitedEvents(userId);

    res.status(200).json({
      message: 'Invited events retrieved successfully',
      events,
      count: events.length
    });
  } catch (error) {
    // Enhanced error logging
    console.error('=== Get Invited Events Error ===');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('User:', req.user);
    
    // Provide more specific error messages
    if (error.code === '42P01') {
      return res.status(500).json({
        message: 'Database table does not exist. Please run setup.sql to create the database tables.',
        error: error.message
      });
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(500).json({
        message: 'Database connection failed. Please check your database configuration.',
        error: error.message
      });
    } else if (error.code === '28P01') {
      return res.status(500).json({
        message: 'Database authentication failed. Please check your database credentials.',
        error: error.message
      });
    } else if (error.code === '3D000') {
      return res.status(500).json({
        message: 'Database does not exist. Please create the database first.',
        error: error.message
      });
    }
    
    res.status(500).json({
      message: 'Server error while retrieving invited events',
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
 * Get a single event by ID
 * GET /api/events/:id
 */
const getEventById = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user?.id;
    const event = await eventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    // Determine user's role for this event
    let userRole = null;
    if (userId) {
      if (event.organizer_id === userId) {
        userRole = 'organizer';
      } else {
        // Check if user is invited
        const invitation = await invitationModel.findByEventAndInvitee(eventId, userId);
        if (invitation) {
          userRole = 'attendee';
        }
      }
    }

    // Get invitations and attendance
    const invitations = await invitationModel.findByEvent(eventId);
    const attendance = await attendanceModel.findByEvent(eventId);
    const attendanceStats = await attendanceModel.getAttendanceStats(eventId);

    res.status(200).json({
      message: 'Event retrieved successfully',
      event: {
        ...event,
        user_role: userRole,
        invitations,
        attendance,
        attendanceStats
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      message: 'Server error while retrieving event'
    });
  }
};

/**
 * Update an event
 * PUT /api/events/:id
 */
const updateEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const organizerId = req.user.id;

    // Check if event exists and user is organizer
    const existingEvent = await eventModel.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    if (existingEvent.organizer_id !== organizerId) {
      return res.status(403).json({
        message: 'You are not authorized to update this event'
      });
    }

    const event = await eventModel.updateEvent(eventId, organizerId, req.body);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found or you are not authorized to update it'
      });
    }

    res.status(200).json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      message: 'Server error during event update'
    });
  }
};

/**
 * Delete an event
 * DELETE /api/events/:id
 */
const deleteEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const organizerId = req.user.id;

    const deleted = await eventModel.deleteEvent(eventId, organizerId);

    if (!deleted) {
      return res.status(404).json({
        message: 'Event not found or you are not authorized to delete it'
      });
    }

    res.status(200).json({
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      message: 'Server error during event deletion'
    });
  }
};

/**
 * Search events with filters
 * GET /api/events/search
 */
const searchEvents = async (req, res) => {
  try {
    const { keyword, startDate, endDate, role } = req.query;
    const userId = req.user?.id;

    const filters = {
      keyword,
      startDate,
      endDate,
      userId: userId || null,
      role
    };

    const events = await eventModel.searchEvents(filters);

    res.status(200).json({
      message: 'Events retrieved successfully',
      events,
      count: events.length,
      filters
    });
  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({
      message: 'Server error during event search'
    });
  }
};

module.exports = {
  createEvent,
  getOrganizedEvents,
  getInvitedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  searchEvents
};

