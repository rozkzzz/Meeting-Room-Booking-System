const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/authMiddleware');
const { requireActive } = require('../middleware/requireActive');
const { requireAdmin } = require('../middleware/requireAdmin');
const { approveUser } = require('../controllers/adminController');

router.patch(
    '/users/:id/approve',
    authenticate,
    requireActive,
    requireAdmin,
    approveUser
);

module.exports = router;