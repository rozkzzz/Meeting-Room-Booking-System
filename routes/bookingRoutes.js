const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { requireActive } = require('../middleware/requireActive');
const { createBooking,getMyBookings,cancelBooking } = require('../controllers/bookingController');

router.post(
    '/',
    authenticate,
    requireActive,
    createBooking
);

router.get(
    '/my',
    authenticate,
    requireActive,
    getMyBookings
);

router.patch(
    '/:id/cancel',
    authenticate,
    requireActive,
    cancelBooking
);

module.exports = router;