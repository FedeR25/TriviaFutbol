const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { error: { message: 'Demasiados intentos. Esperá 15 minutos.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

const gameLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,
  message: { error: { message: 'Demasiadas requests. Esperá un momento.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

const rankingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30,
  message: { error: { message: 'Demasiadas requests. Esperá un momento.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, gameLimiter, rankingLimiter };