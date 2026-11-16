const pool = require('../data/db');

async function createBooking(req, res) {
    const { room_id, start_time, end_time } = req.body ?? {};
    const userId = Number(req.user.id);

    if(!Number.isSafeInteger(userId) || (userId <= 0)){
        return res.status(400).json({
            message: 'invalid user'
        });
    }
    if (!Number.isSafeInteger(room_id) || room_id <= 0) {
    return res.status(400).json({
        message: 'Invalid room ID'
    });
    }
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (typeof start_time !== 'string' || typeof end_time !== 'string'){
        return res.status(400).json({
            message: 'invalid time'
        })
    }
    if (
    !dateTimeRegex.test(start_time) ||
    !dateTimeRegex.test(end_time)
) {
    return res.status(400).json({
        message: 'Invalid datetime format'
    });
}
    const start = parseDateTime(start_time);
    const end = parseDateTime(end_time);
    
    if(start === null|| end === null){
        return res.status(400).json({
            message: 'Invalid time'
        })
    }
    if(start.datePart != end.datePart){
        return res.status(400).json({
            message: 'Invalid time'
        })
    }
    let duration = end.timestamp - start.timestamp;
    if(duration <= 0 || duration > 7200000){
        return res.status(400).json({
            message: 'Invalid time'
        })
    }
    if(start.dayOfWeek === 0 || start.dayOfWeek === 6 || end.dayOfWeek === 0 || end.dayOfWeek === 6 ){
        return res.status(400).json({
            message: 'Invalid date'
        })
    }
    const openingSeconds = 8 * 3600;
    const closingSeconds = 18 * 3600;

    if (
    start.secondsOfDay < openingSeconds ||
    start.secondsOfDay >= closingSeconds ||
    end.secondsOfDay > closingSeconds
    ) {
    return res.status(400).json({
        message: 'Outside working hours'
    });
    }
    let connection;

    try {
        connection = await pool.getConnection();

    await connection.beginTransaction();

    const [rooms] = await connection.execute(
        'SELECT id FROM rooms WHERE id = ? FOR UPDATE',
        [room_id]
    );

    if (rooms.length === 0) {
        await connection.rollback();

        return res.status(404).json({
            message: 'Room not found'
        });
    }

    const [Booking] =  await connection.execute(
        'SELECT id FROM bookings WHERE room_id = ? AND status = ? AND start_time < ? AND end_time > ? LIMIT 1;',[room_id,'confirmed',end_time,start_time]);
    if (Booking.length > 0) {
    await connection.rollback();

    return res.status(409).json({
        message: 'Room already booked for this time'
    });
    }
    const [result] = await connection.execute(
    `INSERT INTO bookings
     (user_id, room_id, start_time, end_time)
     VALUES (?, ?, ?, ?)`,
    [userId, room_id, start_time, end_time]);

    await connection.commit();

    return res.status(201).json({
    id: result.insertId,
    user_id: userId,
    room_id,
    start_time,
    end_time,
    status: 'confirmed'
    });

    } catch (error) {
    if (connection) {
        await connection.rollback();
    }

    console.error(error);

    return res.status(500).json({
        message: 'Internal server error'
    });

    } finally {
    if (connection) {
        connection.release();
    }
    }
}

function parseDateTime(value) {
    const [datePart, timePart] = value.split(' ');

    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);

    if (hour > 23 || minute > 59 || second > 59) {
        return null;
    }

    const date = new Date(
        Date.UTC(year, month - 1, day, hour, minute, second)
    );

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() + 1 !== month ||
        date.getUTCDate() !== day
    ) {
        return null;
    }

    return {
        datePart,
        timestamp: date.getTime(),
        dayOfWeek: date.getUTCDay(),
        secondsOfDay: hour * 3600 + minute * 60 + second
    };
}

async function getMyBookings(req, res) {
    const userId = Number(req.user.id);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
        return res.status(400).json({
            message: 'Invalid user'
        });
    }

    try {
        const [bookings] = await pool.execute(
            `SELECT id, room_id, start_time, end_time,
                    status, cancelled_at
             FROM bookings
             WHERE user_id = ?
             ORDER BY start_time DESC`,
            [userId]
        );

        return res.status(200).json(bookings);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

async function cancelBooking(req, res) {
    const bookingId = Number(req.params.id);
    const userId = Number(req.user.id);

    if (!Number.isSafeInteger(bookingId) || bookingId <= 0) {
        return res.status(400).json({
            message: 'Invalid booking ID'
        });
    }

    try {
        const [bookings] = await pool.execute(
            `SELECT id, status FROM bookings WHERE id = ? AND user_id = ?;`,[bookingId,userId]);
        if (bookings.length === 0){
            return res.status(404).json({
                message: 'Booking not found'
            });
        }
        if (bookings[0].status === 'cancelled'){
            return res.status(409).json({
                message: 'cancelled'
            });
        }

        const [update] = await pool.execute(`UPDATE bookings SET status = 'cancelled',cancelled_at = NOW() WHERE id = ? AND user_id = ? AND status = ?`,[bookingId,userId,'confirmed'])
        if(update.affectedRows===1){
            return res.status(200).json({
                message: "Booking cancelled successfully",
                id: bookingId,
                status: 'cancelled'
            })
        }
        return res.status(409).json({
        message: 'Booking is no longer confirmed'
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }

}


module.exports = { createBooking,getMyBookings,cancelBooking };