const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, bookingController.getBookings);
router.post('/', protect, bookingController.addBooking);
router.put('/:id', protect, authorize('Admin'), bookingController.updateBookingStatus);
router.get('/stats', protect, authorize('Admin'), bookingController.getStats);

module.exports = router;
