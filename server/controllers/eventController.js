const Event = require("../models/Event");

// @desc   Organizer creates a new event
// @route  POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      city,
      startAt,
      endAt,
      capacity,
      registrationDeadline,
      cancellationDeadline,
    } = req.body;

    if (
      !title ||
      !description ||
      !venue ||
      !city ||
      !startAt ||
      !endAt ||
      !capacity
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const event = await Event.create({
      title,
      description,
      category,
      venue,
      city,
      startAt,
      endAt,
      capacity,
      registrationDeadline,
      cancellationDeadline,
      organizer: req.user._id,
      status: "pending",
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all published events (public) with filters
// @route  GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const { search, category, city, date, page = 1, limit = 10 } = req.query;

    const query = { status: "published" };

    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (city) query.city = city;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.startAt = { $gte: start, $lt: end };
    }

    const events = await Event.find(query)
      .populate("organizer", "name email")
      .populate("category", "name")
      .sort({ startAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Event.countDocuments(query);

    res.json({
      events,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get single event by ID
// @route  GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("category", "name");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Organizer updates their own event
// @route  PATCH /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this event" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Admin approves an event
// @route  PATCH /api/events/:id/approve
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = "approved";
    await event.save();

    res.json({ message: "Event approved", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Publish an approved event (make visible to attendees)
// @route  PATCH /api/events/:id/publish
exports.publishEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "approved") {
      return res
        .status(400)
        .json({ message: "Event must be approved before publishing" });
    }

    event.status = "published";
    await event.save();

    res.json({ message: "Event published", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// @desc   Organizer gets their own events (all statuses)
// @route  GET /api/events/my/events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// @desc   Admin gets all events (all statuses, all organizers)
// @route  GET /api/events/admin/all
exports.getAllEventsForAdmin = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
