async function createBooking(req, res) {
    const { room_id, start_time, end_time } = req.body ?? {};
    const userId = Number(req.user.id);

    if(!Number.isSafeInteger(userId) || (userId <= 0)){
        return res.status(400).json({
            message: 'invalid user'
        });
    }
    // TODO 1: room_id ต้องเป็นจำนวนเต็มบวก
    if (!Number.isSafeInteger(room_id) || room_id <= 0) {
    return res.status(400).json({
        message: 'Invalid room ID'
    });
    }
    // TODO 2: start_time และ end_time ต้องมีรูปแบบวันที่ถูกต้อง 2026-11-16 09:00:00 11:00:00
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
      // TODO 3: end_time ต้องมากกว่า start_time
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
    // TODO 6: ต้องอยู่ระหว่าง 08:00–18:00
    return res.status(200).json({
    message: 'Preliminary validation passed'
});
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

module.exports = { createBooking };