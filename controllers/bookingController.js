async function createBooking(req, res) {
    const { room_id, start_time, end_time } = req.body ?? {};
    const userId = Number(req.user.id);

    if(!Number.isSafeInteger(userId) || !(userId <= 0)){
        return res.status(400).json({
            message: 'invalid user'
        });
    }
    // TODO 1: room_id ต้องเป็นจำนวนเต็มบวก

    // TODO 2: start_time และ end_time ต้องมีรูปแบบวันที่ถูกต้อง 2026-11-16 09:00:00 11:00:00
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (typeof start_time !== String && typeof end_time !== String){
        return res.status(400).json({
            message: 'invalid time'
        })
    }
      // TODO 3: end_time ต้องมากกว่า start_time
    check_starttime = start_time.split(' ');
    check_endtime = end_time.split(' ');
    if (check_endtime[0]-check_starttime[0] > 2){
        return res.status(400).json({
            message: 'invalid time'
        })
    }


  

    // TODO 4: ระยะเวลาจองต้องไม่เกิน 2 ชั่วโมง

    // TODO 5: ต้องเป็นวันจันทร์–ศุกร์

    // TODO 6: ต้องอยู่ระหว่าง 08:00–18:00
}