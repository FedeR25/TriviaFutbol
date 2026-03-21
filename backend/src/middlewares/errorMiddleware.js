const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Error interno del servidor';

  // CONTROL DE BASE DE DATOS: Si Postgres dice "Duplicate Key" (23505)
  if (err.code === '23505') {
    status = 409;
    message = 'El registro ya existe (duplicado)';
  }

  // Logueamos el error para nosotros (en el servidor)
  logger.error({
    message: err.message,
    code: err.code,
    status,
    path: req.path,
    // Solo mostramos el stack trace en desarrollo
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Respondemos al cliente de forma limpia
  res.status(status).json({
    error: message
  });
};

module.exports = errorMiddleware;