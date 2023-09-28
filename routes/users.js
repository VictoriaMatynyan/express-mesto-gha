const userRouter = require('express').Router();
const {
  getUsers, createUser, getUserById, updateUserInfo, updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserInfo);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
