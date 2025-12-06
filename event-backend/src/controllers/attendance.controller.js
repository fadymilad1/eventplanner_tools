const attendanceModel = require('../models/attendance.model');
const eventModel = require('../models/event.model');
const invitationModel = require('../models/invitation.model');

/**
 * Attendance Controller
 * Handles all attendance-related operations
 */

/**
 * Set attendance status for an event
 * POST /api/events/:eventId/attendance
 */
const setAttendance = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const { status } = req.body;
    const userId = req.user.id;

    // Check if event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    // Check if user is invited (unless they are the organizer)
    if (event.organizer_id !== userId) {
      const invitation = await invitationModel.findByEventAndInvitee(eventId, userId);
      if (!invitation) {
        return res.status(403).json({
          message: 'You are not invited to this event'
        });
      }
    }

    // Create or update attendance
    const attendance = await attendanceModel.upsertAttendance({
      event_id: eventId,
      user_id: userId,
      status
    });

    res.status(200).json({
      message: 'Attendance status updated successfully',
      attendance
    });
  } catch (error) {
    console.error('Set attendance error:', error);
    res.status(500).json({
      message: 'Server error during attendance update'
    });
  }
};

/**
 * Get attendance for an event
 * GET /api/events/:eventId/attendance
 */
const getEventAttendance = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user.id;

    // Check if event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    // Check if user is the organizer
    if (event.organizer_id !== userId) {
      return res.status(403).json({
        message: 'Only the event organizer can view attendance'
      });
    }

    const attendance = await attendanceModel.findByEvent(eventId);
    const attendanceStats = await attendanceModel.getAttendanceStats(eventId);

    res.status(200).json({
      message: 'Attendance retrieved successfully',
      attendance,
      attendanceStats,
      count: attendance.length
    });
  } catch (error) {
    console.error('Get event attendance error:', error);
    res.status(500).json({
      message: 'Server error while retrieving attendance'
    });
  }
};

/**
 * Get user's attendance for an event
 * GET /api/events/:eventId/attendance/me
 */
const getMyAttendance = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user.id;

    // Check if event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    const attendance = await attendanceModel.findByEventAndUser(eventId, userId);

    if (!attendance) {
      return res.status(200).json({
        message: 'No attendance record found',
        attendance: null
      });
    }

    res.status(200).json({
      message: 'Attendance retrieved successfully',
      attendance
    });
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({
      message: 'Server error while retrieving attendance'
    });
  }
};

/**
 * Get all events user is attending
 * GET /api/attendance
 */
const getMyAttendingEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const attendance = await attendanceModel.findByUser(userId, status);

    res.status(200).json({
      message: 'Attendance retrieved successfully',
      attendance,
      count: attendance.length
    });
  } catch (error) {
    console.error('Get my attending events error:', error);
    res.status(500).json({
      message: 'Server error while retrieving attendance'
    });
  }
};

module.exports = {
  setAttendance,
  getEventAttendance,
  getMyAttendance,
  getMyAttendingEvents
};

