const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateUserInfo, updateAvatar, getCurrentUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
// здесь важен порядок: роут /me должен быть перед /:userId, иначе возникает ошибка CastError:
// Express принимает роут /me за роут /:userid, и принимает "me" за id
userRouter.get('/me', getCurrentUserInfo);

userRouter.get(
  '/:userId',
  celebrate({
  // валидируем параметры запроса
    params: Joi.object().keys({
      userId: Joi.string().alphanum().required(),
    }),
  }),
  getUserById,
);

userRouter.patch(
  '/me',
  celebrate({
    // валидируем тело запроса
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfo,
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    // валидируем тело запроса
    body: Joi.object().keys({
      avatar: Joi.string().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/),
    }),
  }),
  updateAvatar,
);

module.exports = userRouter;
