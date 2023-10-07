const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');

// имппорт ошибок и их кодов
const BadRequestError = require('../errors/badRequest');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbiddenError');
const Statuses = require('../utils/statusCodes');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(Statuses.CREATED).send(card))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId).orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Разрешено удалять только свои карточки');
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then((deletedCard) => res.status(Statuses.OK_REQUEST).send(deletedCard))
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequestError('Передан некорректный _id карточки'));
      }
      next(error);
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
