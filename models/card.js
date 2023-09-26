const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(v),
      message: 'Здесь должен быть URL',
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // связываем пользователя и карточку
    ref: 'user',
    required: true
  },
  likes: [{ // описываем схему для одного элемента и заключаем её в квадратные скобки
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [] // по умолчанию - пустой массив
  }], // [] - потому что это список(= массив) лайкнувших пост пользователей
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('card', cardSchema);