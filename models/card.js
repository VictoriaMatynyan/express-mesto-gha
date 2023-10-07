const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: {
      value: true,
      message: 'Это поле обязательно для заполнения',
    },
    minlength: [2, 'Введите минимум 2 символа'],
    maxlength: [30, 'Максимум 30 символов'],
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: 'Здесь должен быть URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // связываем пользователя и карточку
    ref: 'user',
    required: {
      value: true,
      message: 'Это поле обязательно для заполнения',
    },
  },
  likes: [{ // описываем схему для одного элемента и заключаем её в квадратные скобки
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [], // по умолчанию - пустой массив
  }], // [] - потому что это список(= массив) лайкнувших пост пользователей
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
