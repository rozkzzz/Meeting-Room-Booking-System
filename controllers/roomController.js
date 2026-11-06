const pool = require('../data/db');

async function getRooms(req, res) {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, capacity FROM room ');
        // 1. SELECT ห้องประชุมจาก MySQL
        return res.status()
        // 2. ส่ง HTTP 200 พร้อม Array ของห้อง
    } catch (error) {
        // 3. ส่ง HTTP 500 เมื่อ Database เกิด Error
    }
}

module.exports = { getRooms };