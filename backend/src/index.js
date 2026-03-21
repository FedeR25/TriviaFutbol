require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const errorMiddleware = require('./middlewares/errorMiddleware');
const logger = require('./utils/logger');

const app = express();

// 1. Middlewares iniciales
app.use(cors());
app.use(express.json());

// 2. Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// 3. Middleware de Error (SIEMPRE después de las rutas)
app.use(errorMiddleware);

// 4. Exportar y Escuchar
const PORT = process.env.PORT || 3000;

// Solo arranca el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Servidor corriendo en puerto ${PORT}`);
  });
}

module.exports = app;