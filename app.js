const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const Statuses = require('./utils/statusCodes');
// 127.0.0.1 - вместо localhost, т.к. node -v = 18
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(express.json()); // вместо body parser

// временное решение для хранения _id автора и обогащения мидлвэра getUserById
app.use((req, res, next) => {
  req.user = {
    _id: '6511dcd38a271760b206f378',
  };
  next();
});

// подключаем корневой роут для пользователей и карточек
app.use(router);
app.use('*', (req, res) => res.status(Statuses.NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' }));

async function init() {
  await mongoose.connect(MONGO_URL);
  await app.listen(PORT);
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
}

init();
