const express = require('express');
const router = express.Router();
const { organizerDashboard, adminDashboard, attendeeDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/organizer', protect, authorize('organizer'), organizerDashboard);
router.get('/admin', protect, authorize('admin'), adminDashboard);
router.get('/attendee', protect, authorize('attendee'), attendeeDashboard);

module.exports = router;