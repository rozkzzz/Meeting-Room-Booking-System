const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/authMiddleware');
const { requireActive } = require('../middleware/requireActive');
const { getRooms,createRoom,updateRoom } = require('../controllers/roomController');
const { requireAdmin } = require('../middleware/requireAdmin');
router.get(
    '/',
    authenticate,
    requireActive,
    getRooms
);

router.post(
    '/',
    authenticate,
    requireActive,
    requireAdmin,
    createRoom
);

router.patch(
    '/:id',
    authenticate,
    requireActive,
    requireAdmin,
    updateRoom
);

module.exports = router;