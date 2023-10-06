const authRouter = require('express').Router();
const { createUser, login } = require('../controllers/users');

// роуты для логина и регистрации
authRouter.post('/signin', login);
authRouter.post('/signup', createUser);

module.exports = authRouter;
