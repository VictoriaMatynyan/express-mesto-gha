const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Введите минимум 2 символа'],
    maxlength: [30, 'Максимум 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Введите минимум 2 символа'],
    maxlength: [30, 'Максимум 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (link) => isURL(link),
      message: 'Здесь должен быть URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: {
      value: true,
      message: 'Это поле обязательно для заполнения',
    },
    validate: {
      validator: (email) => isEmail(email),
      message: (props) => `${props.value} - некорректный адрес почты`,
    },
    unique: true,
  },
  password: {
    type: String,
    required: {
      value: true,
      message: 'Это поле обязательно для заполнения',
    },
    minlength: [8, 'Минимальная длина пароля - 8 символов'],
    select: false, // запрещаем возврат хэша пароля из API
  },
});

// сделаем код проверки почты и пароля частью схемы User: добавим метод findUserByCredentials
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function findOneFunc(email, password) {
  return this.findOne({ email }).select('+password') // this - это модель User
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

// regEx для url было:
// /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}
// \b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(v)
