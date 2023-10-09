const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

const {
  JWT_SECRET = 'kHXPgoWXxD/l8GwEH7zc/e6aq3lbqPgV/PG2IA==ADsh4FpPLeKBK8J5fR6gHK9l',
  NODE_ENV = 'production',
} = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    // достаём авторизационный заголовок
    // const { authorization } = req.headers;

    // достаём токен из объекта req.cookies
    const token = req.cookies.jwt;
    if (!token) {
      throw new UnauthorizedError('В req.cookies ничего нет'); // Неверные авторизационные данные
    }
    const validToken = token.replace('Bearer ', '');
    // верифицируем токен
    payload = jwt.verify(validToken, NODE_ENV ? JWT_SECRET : 'secret-key');
    // расширяем объект пользователя - записываем в него payload
  } catch (error) {
    // если что-то не так, возвращаем 401 ошибку
    next(new UnauthorizedError('Что-то не так с токеном')); // Неверные авторизационные данные
  }
  req.user = payload;
  next();
};
