const express = require('express');
const router = express.Router();
const {
  cancelRegistration,
  markAttendance,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

router.patch('/:id/cancel', protect, cancelRegistration);
router.patch('/:id/attendance', protect, markAttendance);

module.exports = router;