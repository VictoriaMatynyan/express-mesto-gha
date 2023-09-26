const User = require('../models/user');
// const ERROR_CODE = '400'; //404, 500

module.exports.createUser = (req, res) => {
  const { name, about, avatar} = req.body;
  User.create({ name, about, avatar })
  .then((user) => {
    return res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя', ...error });
    }
    return  res.status(500).send({ message: 'Ошибка на стороне сервера', error });
  });
};

module.exports.getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    return res.status(200).send(users)
  })
  .catch((error) => {
    return res.status(500).send({ message: 'Ошибка на стороне сервера', error });
  });
}

//возвращаем всех пользователей по _id
module.exports.getUserById = (req, res) => {
  User.findById(req.user._id)
  .then((user) => {
    if(!user) {
      throw new Error('NotFound')
    }
    return res.status(200).send(user)
  })
  .catch((error) => {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден' })
  }
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан не валидный id' })
  }
    return res.status(500).send({ message: 'Ошибка на стороне сервера', error })
  });
}

// обновляем данные пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true
  })
  .then((user) => {
    if(!user) {
      throw new Error('NotFound')
    }
    return res.status(200).send(user);
  })
  .catch((error) => {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' })
    }
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' })
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера', error })
  })
}

// обновляем аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true
  })
  .then((user) => {
    if(!user) {
      throw new Error('NotFound')
    }
    return res.status(200).send(user);
  })
  .catch((error) => {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' })
    }
    if (error.message === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' })
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера', error })
  })
}

// этот код возвращает 404 ошибку, даже при верном id
// module.exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       throw new Error('NotFound');
//     }
//     console.log(req.user._id);
//     console.log(req.params.id);
//     return res.status(200).send(user);
//   } catch (error) {
//     if (error.message === 'NotFound') {
//       return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
//     }
//     return res.status(500).send({ message: 'Ошибка на стороне сервера', error });
//   }
// }