// создаём токен с jsonwebtoken библиотекой;
const jwt = require('jsonwebtoken');

const generateToken = (payload) => jwt.sign(payload, 'secret-key', { expiresIn: '7d' });

module.exports = generateToken;
