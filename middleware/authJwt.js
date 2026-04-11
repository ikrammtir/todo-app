const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Authentication Failed' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).send({ message: "Token is not valid Please Login again!" });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;