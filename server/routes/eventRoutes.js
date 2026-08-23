const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  approveEvent,
  publishEvent,
  getMyEvents,
  getAllEventsForAdmin,
} = require("../controllers/eventController");
const {
  registerForEvent,
  getEventRegistrations,
} = require("../controllers/registrationController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
// Public routes
router.get("/", getEvents);
router.get("/my/events", protect, authorize("organizer"), getMyEvents);
router.get("/admin/all", protect, authorize("admin"), getAllEventsForAdmin);
router.get("/:id", getEventById);
// Organizer routes
router.post("/", protect, authorize("organizer"), createEvent);
router.patch("/:id", protect, authorize("organizer"), updateEvent);
router.get("/:id/registrations", protect, getEventRegistrations);

// Admin routes
router.patch("/:id/approve", protect, authorize("admin"), approveEvent);
router.patch("/:id/publish", protect, authorize("admin"), publishEvent);

// Attendee routes
router.post("/:id/register", protect, authorize("attendee"), registerForEvent);

module.exports = router;
