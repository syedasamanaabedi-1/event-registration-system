const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'published', 'rejected'],
      default: 'pending',
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
    cancellationDeadline: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for search/filter performance
eventSchema.index({ city: 1, category: 1, startAt: 1 });

module.exports = mongoose.model('Event', eventSchema);