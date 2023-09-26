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
    return  res.status(400).send({ message: 'Ошибка на стороне сервера', error });
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
  console.log(req.user);
  console.log(req.body);
  console.log(req.url);
}

//возвращаем всех пользователей по _id
module.exports.getUserById = (req, res) => {
  User.findById(req.user._id)
  .then((user) => {
    return res.send(user)
  })
  .catch((error) => {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь по id не найден' })
  }
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан не валидный id' })
  }
    return res.status(500).send({ message: 'Ошибка на стороне сервера', error })
  });
  console.log(req.user);
}