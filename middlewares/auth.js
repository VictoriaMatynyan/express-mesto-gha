const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    // достаём авторизационный заголовок
    const { authorization } = req.headers;

    // достаём cookies
    const { cookies } = req;

    if (!(authorization && authorization.startsWith('Bearer ')) && !(cookies && cookies.jwt)) {
      throw new UnauthorizedError('В req.cookies ничего нет'); // Неверные авторизационные данные
    }

    // извлечем токен или из заголовка, или из куки
    const token = authorization ? authorization.replace('Bearer ', '') : cookies.jwt;

    // верифицируем токен
    // явно указываем условие NODE_ENV === 'production', чтобы выбрать правильный секретный ключ
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
    // расширяем объект пользователя - записываем в него payload
  } catch (error) {
    // если что-то не так, возвращаем 401 ошибку
    next(new UnauthorizedError('Что-то не так с токеном')); // Неверные авторизационные данные
  }
  req.user = payload;
  next();
};

// достаём токен из объекта req.cookies
// const token = req.cookies.jwt; - не пропускают автотесты
