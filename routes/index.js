// для улучшения структуры и упрощения масштабирования приложения создаём корневой роутер
const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');

router.use('/', authRouter);

// защищаем роуты авторизацией
// (не забыть передать токен в заголовке Authorization в Postman!)
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

module.exports = router;
