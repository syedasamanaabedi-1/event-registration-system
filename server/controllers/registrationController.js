const Registration = require('../models/Registration');
const Event = require('../models/Event');
const crypto = require('crypto');

// @desc   Attendee registers for an event
// @route  POST /api/events/:id/register
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'published') {
      return res.status(400).json({ message: 'Event is not open for registration' });
    }

    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Count confirmed registrations
    const confirmedCount = await Registration.countDocuments({
      event: event._id,
      status: 'confirmed',
    });

    if (confirmedCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is full, no seats available' });
    }

    const bookingCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const registration = await Registration.create({
      event: event._id,
      attendee: req.user._id,
      bookingCode,
      status: 'confirmed',
    });

    res.status(201).json(registration);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Attendee cancels their registration
// @route  PATCH /api/registrations/:id/cancel
exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('event');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.attendee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this registration' });
    }

    if (new Date() > new Date(registration.event.cancellationDeadline)) {
      return res.status(400).json({ message: 'Cancellation deadline has passed' });
    }

    registration.status = 'cancelled';
    await registration.save();

    res.json({ message: 'Registration cancelled', registration });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Organizer/Admin views registrations for an event
// @route  GET /api/events/:id/registrations
exports.getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (
      req.user.role !== 'admin' &&
      event.organizer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view these registrations' });
    }

    const registrations = await Registration.find({ event: event._id })
      .populate('attendee', 'name email');

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Organizer marks attendance
// @route  PATCH /api/registrations/:id/attendance
exports.markAttendance = async (req, res) => {
  try {
    const { attendanceStatus } = req.body;
    const registration = await Registration.findById(req.params.id).populate('event');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const event = registration.event;

    if (
      req.user.role !== 'admin' &&
      event.organizer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to mark attendance' });
    }

    if (new Date() < new Date(event.startAt)) {
      return res.status(400).json({ message: 'Cannot mark attendance before event starts' });
    }

    registration.attendanceStatus = attendanceStatus;
    await registration.save();

    res.json({ message: 'Attendance updated', registration });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};