const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
// MONGO_URL - адрес подключения БД
// 127.0.0.1 - вместо localhost, т.к. node -v = 18
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
// MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb'

// подключаемся к серверу mongoDB
mongoose.connect(MONGO_URL);

const app = express();
app.use(express.json()); // вместо body parser

// временное решение для хранения _id автора и обогащения мидлвэра getUserById
app.use((req, res, next) => {
  req.user = {
    _id: '6511dcd38a271760b206f378'
  };
  next();
})

// роут для пользователей
app.use('/', userRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

// проверка:
// app.get('/users', (req, res) => {
//   res.status(200).send({message: 'Hello World!'});
// });