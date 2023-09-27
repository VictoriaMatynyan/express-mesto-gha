const Card = require('../models/card');
const Errors = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((error) => res.status(Errors.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера', error }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(Errors.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки', ...error });
      }
      return res.status(Errors.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера', error });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        throw new Error('NotFound');
      }
      return res.status(200).send(card);
    })
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Errors.BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(Errors.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера', error });
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
    .then((card) => {
      if (!card) {
        throw new Error('NotFound');
      }
      return res.status(200).send(card);
    })
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Errors.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (error.name === 'CastError') {
        return res.status(Errors.BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(Errors.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера', error });
    });
};

module.exports.removeCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // удаляем пользователя из массива
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error('NotFound');
      }
      return res.status(200).send(card);
    })
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(Errors.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (error.name === 'CastError') {
        return res.status(Errors.BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(Errors.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера', error });
    });
};
