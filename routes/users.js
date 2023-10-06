const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateUserInfo, updateAvatar, getCurrentUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
// здесь важен порядок: роут /me должен быть перед /:userId, иначе возникает ошибка CastError:
// Express принимает роут /me за роут /:userid, и принимает "me" за id
userRouter.get('/me', getCurrentUserInfo);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', updateUserInfo);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
