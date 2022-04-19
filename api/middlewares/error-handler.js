const logger = require('../utils/logger');

const errorLogger = (error, req, res, next) => {
  logger.error('\x1b[31m', error);
  next(error);
};

const errorResponder = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  return res.status(error.status).json({
    error: {
      status: error.status,
      message: error.message,
    },
  });
};

module.exports = {
  errorLogger,
  errorResponder,
};
