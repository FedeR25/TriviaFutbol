const env = require('./config/env');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Seguridad
app.use(helmet());
app.disable('x-powered-by');

// Parsers
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV });
});

// Manejo global de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(env.PORT, () => {
  logger.info(`🚀 Servidor corriendo en puerto ${env.PORT}`);
});

module.exports = app;