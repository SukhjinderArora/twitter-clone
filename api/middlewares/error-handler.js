const logger = require('../utils/logger');

const errorLogger = (error, req, res, next) => {
  logger.error('\x1b[31m', error);
  next(error);
};

const errorResponder = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  return res.status(error.status || 500).json({
    error: {
      status: error.status || 500,
      message: error.status ? error.message : 'Internal Server Error',
    },
  });
};

module.exports = {
  errorLogger,
  errorResponder,
};
