const userRouter = require('express').Router();

const { usersIdValidation, userInfoValidation, userAvatarValidation } = require('../middlewares/celebrateValidation');
const {
  getUsers, getUser, updateUserInfo, updateAvatar, getCurrentUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
// здесь важен порядок: роут /me должен быть перед /:userId, иначе возникает ошибка CastError:
// Express принимает роут /me за роут /:userid, и принимает "me" за id
userRouter.get('/me', getCurrentUserInfo);
userRouter.get('/:userId', usersIdValidation, getUser);
userRouter.patch('/me', userInfoValidation, updateUserInfo);
userRouter.patch('/me/avatar', userAvatarValidation, updateAvatar);

module.exports = userRouter;
