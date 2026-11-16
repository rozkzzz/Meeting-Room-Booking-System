const pool = require('../data/db');

async function approveUser(req, res) {
    const userId = Number(req.params.id);

    if(!Number.isSafeInteger(userId) || userId <= 0){
        return res.status(400).json({
            message: 'invalid user'
        });
    }

    try {
        const [rows] = await pool.execute(
            'SELECT id, username, role, status FROM users WHERE id = ?',
            [userId]
        );
        if(rows.length === 0){
            return res.status(404).json({
                message: 'user not found'
            })
        }

        if(rows[0].status !=='pending'){
            return res.status(409).json({
                message: 'User is not pending approval'
            })
        }

         let [result] = await pool.execute('UPDATE users SET status = ? WHERE id = ? AND status = ?',['active',userId,'pending']);
        if (result.affectedRows === 0) {
         return res.status(409).json({
        message: 'User could not be approved'
    });
    }

    return res.status(200).json({
    message: 'User approved successfully',
    userId: userId,
    status: 'active'
});

    } catch (error) {
        console.error('Approval failed:', error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

async function getAllBookings(req, res) {
    try {
        const [rows] = await pool.execute('SELECT b.id, b.user_id, u.username, b.room_id, r.name AS room_name, b.start_time, b.end_time, b.status, b.cancelled_at FROM bookings AS b JOIN users AS u ON b.user_id = u.id JOIN rooms AS r ON b.room_id = r.id ORDER BY b.start_time DESC;');
        return res.status(200).jsom(rows)
        // TODO 1: SELECT Booking ทั้งหมด

        // TODO 2: JOIN ตาราง users และ rooms

        // TODO 3: ส่ง Array ด้วย HTTP 200

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = { approveUser,getAllBookings };

