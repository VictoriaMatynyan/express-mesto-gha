const { ValidationError, CastError } = require('mongoose').Error;
const User = require('../models/user');
const Statuses = require('../utils/statusCodes');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(Statuses.CREATED).send({
      // добавляем вывод id созданного пользователя согласно заданию в тестах
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((error) => {
      if (error instanceof ValidationError) {
        // отправляем только message, без error, согласно чек-листу
        return res.status(Statuses.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(Statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(Statuses.OK_REQUEST).send(users))
    .catch(() => res.status(Statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
};

// возвращаем всех пользователей по id
module.exports.getUserById = (req, res) => {
  // здесь req.params.userId вместо req.user._id, чтобы в запрос не попадал захардкоженный id
  User.findById(req.params.userId)
  // orFail заменяет if-проверку в блоке then и не возвращает null, если объект не найден
    .orFail(new Error('NotFound'))
    .then((user) => res.status(Statuses.OK_REQUEST).send(user))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Statuses.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      if (error instanceof CastError) {
        return res.status(Statuses.BAD_REQUEST).send({ message: 'Передан не валидный id' });
      }
      return res.status(Statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

// обновляем данные пользователя, 1) создаём одну общую логику для обновления данных пользователя:
const updateUser = (req, res, updateData) => {
  User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotFound'))
    .then((user) => res.status(Statuses.OK_REQUEST).send(user))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Statuses.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      if (error instanceof ValidationError) {
        return res.status(Statuses.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении данных профиля' });
      }
      return res.status(Statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

// 2) создаём 2 маленькие функции-декораторы, которые выполняют роль контроллеров
// обновляем поля Имя и О себе
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  // вызываем функцию с общей логикой и передаём нужные для обновления аргументы
  updateUser(req, res, { name, about });
};

// обновляем поле Аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar });
};
