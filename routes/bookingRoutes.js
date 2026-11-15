const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { requireActive } = require('../middleware/requireActive');
const { createBooking } = require('../controllers/bookingController');

router.post(
    '/',
    authenticate,
    requireActive,
    createBooking
);

module.exports = router;