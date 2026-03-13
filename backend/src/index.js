const env = require('./config/env');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');

// Rutas
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const rankingRoutes = require('./routes/ranking');
const adminRoutes = require('./routes/admin');

const app = express();

// Seguridad
app.use(helmet());
app.disable('x-powered-by');

// Parsers
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET));

// Logger de requests
app.use((req, res, next) => {
  logger.info({
    message: 'request',
    method: req.method,
    path: req.path,
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/admin', adminRoutes);

// Manejo global de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(env.PORT, () => {
  logger.info(`🚀 Servidor corriendo en puerto ${env.PORT}`);
});

module.exports = app;