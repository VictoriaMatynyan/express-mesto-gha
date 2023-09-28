const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');
// используем переменную окружений
const Statuses = require('../utils/statusCodes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(() => res.status(Statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(Statuses.CREATED).send(card))
    .catch((error) => {
      if (error instanceof ValidationError) {
        return res.status(Statuses.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(Statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId).orFail(new Error('NotFound'))
    .then((card) => res.status(Statuses.OK_REQUEST).send(card))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Statuses.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (error instanceof CastError) {
        return res.status(Statuses.BAD_REQUEST).send({ message: 'Передан некорректный _id карточки' });
      }
      return res.status(Statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    // добавляем пользователя в массив, только если его там нет - $addToSet
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(Statuses.OK_REQUEST).send(card))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Statuses.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (error.name === 'CastError') {
        return res.status(Statuses.BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(Statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports.removeCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // удаляем пользователя из массива
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(Statuses.OK_REQUEST).send(card))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Statuses.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (error.name === 'CastError') {
        return res.status(Statuses.BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(Statuses.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    });
};
