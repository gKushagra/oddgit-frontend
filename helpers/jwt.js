require('dotenv').config();
const jwt = require('jsonwebtoken');

function generateJWT(user) {
    return jwt.sign({ user: user }, process.env.JWT_SECRET);
}

function decodeJWT(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    generateJWT,
    decodeJWT,
}