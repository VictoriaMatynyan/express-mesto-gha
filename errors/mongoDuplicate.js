const statusCodes = require('../utils/statusCodes');

class MongoDuplicateConflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.MONGO_DUPLICATE;
  }
}

module.exports = MongoDuplicateConflict;
