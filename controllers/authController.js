const bcrypt = require('bcrypt');
const pool = require('../data/db');

async function register(req, res) {
    const { username } = req.body;
    const { password } = req.body;
    

    if(typeof username !== 'string' || typeof password !== 'string'){

        res.status(400).json({
        message: 'invalid username or password',
        });
        return;
    }
    let user = username.trim();
    if (user === '' || password.trim() === '') {
        return res.status(400).json({
            message: 'invalid username or password'
        });
    }


    try{
            const passwordHash = await bcrypt.hash(password, 12);
        const [result] = await pool.execute(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [user, passwordHash]
    );

    res.status(201).json({
        id: result.insertId,
        username: user,
        role: 'user',
        status: 'pending'
    });
    }catch(error){
        if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    console.error('Registration failed:', error);

    return res.status(500).json({
        message: 'Internal server error'
    });
    }; 
}

async function login(req, res) {
    const { username, password } = req.body;

    const [rows] = await pool.execute(
        'SELECT id, username, password_hash, role, status FROM users WHERE username = ?',
        [username]
    );

    if(rows.length === 0){
        return res.status(401).json({
            message: 'Invalid username or password'
        });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(
        password,
        user.password_hash
    );
    
    if (isMatch){
        return res.status(200).json({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "role": user.role,
                "status": user.status}
        })
    }else{
        return res.status(401).json({
            message: 'Invalid username or password'
        });
    }
}

module.exports = { register,login };