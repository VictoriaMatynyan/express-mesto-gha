const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  let payload;
  try {
    // достаём авторизационный заголовок
    const { authorization } = req.headers;
    // убеждаемся, что он есть или начинается с Bearer
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Неверные авторизационные данные');
    }
    // извлекаем токен
    const token = authorization.replace('Bearer ', '');
    // верифицируем токен
    payload = jwt.verify(token, 'secret-key');
    // расширяем объект пользователя - записываем в него payload
  } catch (error) {
    // если что-то не так, возвращаем 401 ошибку
    next(new UnauthorizedError('Неверные авторизационные данные'));
  }
  req.user = payload;
  next();
};

// module.exports.auth = (req, res, next) => {
//   // достаём авторизационный заголовок
//   const { authorization } = req.headers;
//   // убеждаемся, что он есть или начинается с Bearer
//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     throw new UnauthorizedError('Неверные авторизационные данные');
//   }
//   // извлекаем токен
//   const getToken = authorization.replace('Bearer ', '');
//   let payload;
//   try {
//     // верифицируем токен
//     payload = jwt.verify(getToken, 'secret-key');
//     // расширяем объект пользователя - записываем в него payload
//   } catch (error) {
//     // если что-то не так, возвращаем 401 ошибку
//     next(new UnauthorizedError('Неверные авторизационные данные'));
//   }
//   req.user = payload;
//   next();
// };
