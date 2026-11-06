const express = require('express');

const router = express.Router();

const { register } = require('../controllers/authController');
const { login } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireActive } = require('../middleware/requireActive');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, (req, res) => {
    return res.status(200).json({
        userId: req.user.id
    });
});
router.get('/booking-access', authenticate, requireActive, (req, res) => {
    return res.status(200).json({
        message: 'You are allowed to book a room',
        userId: req.user.id
    });
});

module.exports = router;