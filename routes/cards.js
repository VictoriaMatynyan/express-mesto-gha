const cardRouter = require('express').Router();
const { creatingCardValidation, cardsIdValidation } = require('../middlewares/celebrateValidation');
const {
  getCards, createCard, deleteCard, likeCard, removeCardLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', creatingCardValidation, createCard);
cardRouter.delete('/:cardId', cardsIdValidation, deleteCard);
cardRouter.put('/:cardId/likes', cardsIdValidation, likeCard);
cardRouter.delete('/:cardId/likes', cardsIdValidation, removeCardLike);

module.exports = cardRouter;
