const User = require('../models/user');
const Errors = require('../utils/errors');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({
      // добавляем вывод id созданного пользователя согласно задания в тестах
      id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        // отправляем только message, без error, согласно чек-листу
        return res.status(Errors.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(Errors.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(Errors.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
};

// возвращаем всех пользователей по _id
module.exports.getUserById = (req, res) => {
  // здесь req.params.userId вместо req.user._id, чтобы в запрос не попадал захардкоженный id
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new Error('NotFound');
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Errors.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      if (error.name === 'CastError') {
        return res.status(Errors.BAD_REQUEST).send({ message: 'Передан не валидный id' });
      }
      return res.status(Errors.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

// обновляем данные пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new Error('NotFound');
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Errors.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      if (error.name === 'ValidationError') {
        return res.status(Errors.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(Errors.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

// обновляем аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => {
      if (!user) {
        throw new Error('NotFound');
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Errors.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      if (error.message === 'ValidationError') {
        return res.status(Errors.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(Errors.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};
