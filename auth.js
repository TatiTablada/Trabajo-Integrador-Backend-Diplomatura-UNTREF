const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY);
};

module.exports = { generateToken, verifyToken };
