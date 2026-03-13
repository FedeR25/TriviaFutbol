const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  logger.error({
    message,
    status,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(status).json({
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : message,
    }
  });
};

module.exports = errorHandler;