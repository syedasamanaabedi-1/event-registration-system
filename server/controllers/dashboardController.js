const Event = require("../models/Event");
const Registration = require("../models/Registration");

// @desc   Organizer dashboard stats
// @route  GET /api/dashboard/organizer
exports.organizerDashboard = async (req, res) => {
  try {
    const organizerId = req.user._id;

    const totalEvents = await Event.countDocuments({ organizer: organizerId });

    const upcomingEvents = await Event.countDocuments({
      organizer: organizerId,
      startAt: { $gte: new Date() },
    });

    const pastEvents = await Event.countDocuments({
      organizer: organizerId,
      startAt: { $lt: new Date() },
    });

    const myEvents = await Event.find({ organizer: organizerId }).select("_id");
    const eventIds = myEvents.map((e) => e._id);

    const totalRegistrations = await Registration.countDocuments({
      event: { $in: eventIds },
      status: "confirmed",
    });

    // Grouped result: registrations per event
    const registrationsPerEvent = await Registration.aggregate([
      { $match: { event: { $in: eventIds }, status: "confirmed" } },
      { $group: { _id: "$event", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventInfo",
        },
      },
      { $unwind: "$eventInfo" },
      { $project: { eventTitle: "$eventInfo.title", count: 1 } },
    ]);

    // Attendance percentage (present / total confirmed)
    const attendanceStats = await Registration.aggregate([
      { $match: { event: { $in: eventIds }, status: "confirmed" } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ["$attendanceStatus", "present"] }, 1, 0] },
          },
        },
      },
    ]);

    const attendancePercentage =
      attendanceStats.length > 0 && attendanceStats[0].total > 0
        ? (
            (attendanceStats[0].present / attendanceStats[0].total) *
            100
          ).toFixed(1)
        : 0;

    res.json({
      totalEvents,
      upcomingEvents,
      pastEvents,
      totalRegistrations,
      attendancePercentage,
      registrationsPerEvent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin dashboard stats
// @route  GET /api/dashboard/admin
exports.adminDashboard = async (req, res) => {
  try {
    const pendingApprovals = await Event.countDocuments({ status: "pending" });
    const totalEvents = await Event.countDocuments();
    const totalUsers = await Registration.distinct("attendee").then(
      (arr) => arr.length,
    );
    const totalRegistrations = await Registration.countDocuments({
      status: "confirmed",
    });

    // Grouped result: events by status
    const eventsByStatus = await Event.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      pendingApprovals,
      totalEvents,
      totalUsers,
      totalRegistrations,
      eventsByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Attendee dashboard stats
// @route  GET /api/dashboard/attendee
exports.attendeeDashboard = async (req, res) => {
  try {
    const attendeeId = req.user._id;

    const myRegistrations = await Registration.find({
      attendee: attendeeId,
    }).populate("event", "title startAt city status");

    const upcoming = myRegistrations.filter(
      (r) =>
        r.status === "confirmed" && new Date(r.event.startAt) >= new Date(),
    );

    const past = myRegistrations.filter(
      (r) => new Date(r.event.startAt) < new Date(),
    );

    const totalAttended = myRegistrations.filter(
      (r) => r.attendanceStatus === "present",
    ).length;

    const totalCancelled = myRegistrations.filter(
      (r) => r.status === "cancelled",
    ).length;

    res.json({
      totalRegistrations: myRegistrations.length,
      upcomingCount: upcoming.length,
      pastCount: past.length,
      totalAttended,
      totalCancelled,
      recentActivity: myRegistrations.slice(-5).reverse(),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
