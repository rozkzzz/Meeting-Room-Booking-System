const pool = require('../data/db');

async function requireActive(req, res, next) {
    try {
        const [rows] = await pool.execute(
            'SELECT id, username, role, status FROM users WHERE id = ?',
            [req.user.id]
        );
        if(rows.length === 0){
            return res.status(401).json({
                message: 'user not found'
            })
        }
        
        if(rows[0].status !== 'active'){
            return res.status(403).json({
                message: 'waiting admin allow'
            })
        }else{
            req.user.role = rows[0].role;
            req.user.status = rows[0].status;
            return next();
        }
        
        return next()

    } catch (error) {
        console.error('Authorization failed:', error);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = { requireActive };