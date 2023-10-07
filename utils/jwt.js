// создаём токен с jsonwebtoken библиотекой;
const jwt = require('jsonwebtoken');

const {
  JWT_SECRET = 'kHXPgoWXxD/l8GwEH7zc/e6aq3lbqPgV/PG2IA==ADsh4FpPLeKBK8J5fR6gHK9l',
  NODE_ENV = 'development',
} = process.env;

const generateToken = (payload) => jwt.sign(payload, NODE_ENV ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });

module.exports = generateToken;
