const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
  .populate(['owner', 'likes'])
  .then(card => res.send({data: card}));
};