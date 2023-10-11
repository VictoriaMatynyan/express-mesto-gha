const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    // достаём авторизационный заголовок
    const { authorization } = req.headers;

    // автотесты не пропускают куки, поэтому отправляем токен в теле запроса
    if ((authorization && authorization.startsWith('Bearer '))) {
    // извлечем токен из заголовка (можно было бы из кук, но автотесты GH не разрешают)
      const token = authorization.replace('Bearer ', '');
      // верифицируем токен
      // явно указываем условие NODE_ENV === 'production', чтобы выбрать правильный секретный ключ
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
      // расширяем объект пользователя - записываем в него payload
      req.user = payload;
      next();
    } else {
      next(new UnauthorizedError('Неверные авторизационные данные'));
    }
  } catch (error) {
    // если что-то не так, возвращаем 401 ошибку
    next(new UnauthorizedError('Неверные авторизационные данные'));
  }
};
