const statusCodes = require('../utils/statusCodes');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.SERVER_ERROR;
  }
}

module.exports = InternalServerError;
