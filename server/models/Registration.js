const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    attendee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingCode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    attendanceStatus: {
      type: String,
      enum: ['present', 'absent', 'not_marked'],
      default: 'not_marked',
    },
  },
  { timestamps: true }
);

registrationSchema.index(
  { event: 1, attendee: 1 },
  { unique: true, partialFilterExpression: { status: 'confirmed' } }
);

module.exports = mongoose.model('Registration', registrationSchema);