const express = require('express');

const router = express.Router();

const { register } = require('../controllers/authController');
const { login } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireActive } = require('../middleware/requireActive');
const pool = require('../data/db');
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT id, username, role, status
             FROM users
             WHERE id = ?`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            user: rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.get('/booking-access', authenticate, requireActive, (req, res) => {
    return res.status(200).json({
        message: 'You are allowed to book a room',
        userId: req.user.id
    });
});

module.exports = router;