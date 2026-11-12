const pool = require('../data/db');

async function getRooms(req, res) {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, capacity FROM rooms ORDER BY id;');
        return res.status(200).json(rows);
    } catch (error) {
            console.error('Failed to get rooms:', error);

        return res.status(500).json({
        message: 'Internal server error'
        });
    }
}

async function createRoom(req, res) {
    try{
    const {name, capacity} = req.body ?? {};
    if (typeof name !== 'string' || name.trim() === '' || !Number.isSafeInteger(capacity) || capacity <= 0
) {
    return res.status(400).json({
        message: 'Invalid room name or capacity'
    });
}   
    const roomName = name.trim();
    const [result] = await pool.execute(
         'INSERT INTO rooms (name, capacity) VALUES (?, ?)',[roomName,capacity]);
    
    return res.status(201).json({
        id : result.insertId,
        name : roomName,
        capacity : capacity
    })
}catch(error){
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            message: 'Room name already exists'
        });
    }

    console.error('Failed to create room:', error);

    return res.status(500).json({
        message: 'Internal server error'
    });
}
}

async function updateRoom(req, res) {
    const roomId = Number(req.params.id);
    const { name, capacity } = req.body ?? {};



        if (!Number.isSafeInteger(roomId) || roomId <= 0) {
        return res.status(400).json({
            message: 'Invalid room ID'
        });
    }

    if (name === undefined && capacity === undefined) {
        return res.status(400).json({
            message: 'Name or capacity is required'
        });
    }

    if (
        (name !== undefined &&
            (typeof name !== 'string' || name.trim() === '')) ||
        (capacity !== undefined &&
            (!Number.isSafeInteger(capacity) || capacity <= 0))
    ) {
        return res.status(400).json({
            message: 'Invalid room name or capacity'
        });
    }

    try{
    const [rows] = await pool.execute('SELECT id, name, capacity FROM rooms WHERE id = ?',[roomId]);
    if (rows.length === 0){
        return res.status(404).json({
            message: 'room not found'
        })
    }
    const oldRoom = rows[0];

    const newName = name === undefined
    ? oldRoom.name
    : name.trim();

    const newCapacity = capacity === undefined
    ? oldRoom.capacity
    : capacity;
    
    const [result] = await pool.execute('UPDATE rooms SET name = ?, capacity = ? WHERE id = ?;',[newName, newCapacity, roomId]);

    if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Room not found'
            });
    }

    return res.status(200).json({
        room : roomId,
        name : newName,
        capacity : newCapacity,
    })}catch(error){
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Room name already exists'
            });
        }

        console.error('Failed to update room:', error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }

}

module.exports = { getRooms,createRoom,updateRoom };