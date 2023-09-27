const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: {
      value: true,
      message: 'Это поле обязательно для заполнения',
    },
    minlength: [2, 'Введите минимум 2 символа'],
    maxlength: [30, 'Максимум 30 символов'],
  },
  about: {
    type: String,
    required: {
      value: true,
      message: 'Это поле обязательно для заполнения',
    },
    minlength: [2, 'Введите минимум 2 символа'],
    maxlength: [30, 'Максимум 30 символов'],
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(v),
      message: 'Здесь должен быть URL',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
