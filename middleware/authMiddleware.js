const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader !== 'string') {
        return res.status(401).json({
            message: 'Missing or invalid token'
        });
    }

    const parts = authHeader.split(' ');

    if (
        parts.length !== 2 ||
        parts[0] !== 'Bearer' ||
        !parts[1]
    ) {
        return res.status(401).json({
            message: 'Missing or invalid token'
        });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ['HS256'] }
        );

        const userId = Number(decoded.sub);

        if (!Number.isSafeInteger(userId) || userId <= 0) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }

        req.user = { id: userId };

        return next();

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}

module.exports = { authenticate };