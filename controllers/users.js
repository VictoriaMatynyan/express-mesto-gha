const { ValidationError, CastError } = require('mongoose').Error;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const generateToken = require('../utils/jwt');

// имппорт ошибок и их кодов
const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/badRequest');
const MongoDuplicateConflict = require('../errors/mongoDuplicate');
const Statuses = require('../utils/statusCodes');

const SAULT_ROUNDS = 10;

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, SAULT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(Statuses.CREATED).send({
      // добавляем вывод id созданного пользователя согласно заданию в тестах
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    })) // пароля нет, потому что он нам в ответе не нужен
    .catch((error) => {
      if (error.code === Statuses.MONGO_DUPLICATE) {
        next(new MongoDuplicateConflict('Пользователь с таким email уже существует'));
      } else if (error instanceof ValidationError) {
        // отправляем только message, без error, согласно чек-листу
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken({ _id: user._id });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
        secure: true,
      });
      return res.send({ token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(Statuses.OK_REQUEST).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  // здесь req.params.userId вместо req.user._id, чтобы в запрос не попадал захардкоженный id
  User.findById(req.params.userId)
  // orFail заменяет if-проверку в блоке then и не возвращает null, если объект не найден
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.status(Statuses.OK_REQUEST).send(user))
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequestError('Передан невалидный id'));
      }
      next(error);
    });
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  // находим пользователя по его _id
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.status(Statuses.OK_REQUEST).send(user))
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequestError('Пользователь не найден'));
      }
      next(error);
    });
};

// обновляем данные пользователя, 1) создаём одну общую логику для обновления данных пользователя:
const updateUser = (req, res, updateData, next) => {
  User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.status(Statuses.OK_REQUEST).send(user))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении данных профиля'));
      }
      next(error);
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
